import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Thermometer, AlertTriangle, CheckCircle, Settings, MapPin, Clock, TrendingDown, TrendingUp } from "lucide-react"

const temperatureZones = [
  {
    id: "ZONE-001",
    name: "Main Freezer A",
    location: "Warehouse Section 1",
    currentTemp: -18.5,
    targetTemp: -18,
    status: "normal",
    lastUpdate: "2 min ago",
    alerts: 0,
    trend: "stable"
  },
  {
    id: "ZONE-002", 
    name: "Ice Cream Storage",
    location: "Warehouse Section 2",
    currentTemp: -22.1,
    targetTemp: -20,
    status: "warning",
    lastUpdate: "1 min ago",
    alerts: 2,
    trend: "decreasing"
  },
  {
    id: "ZONE-003",
    name: "Fresh Fish Freezer",
    location: "Warehouse Section 3", 
    currentTemp: -15.8,
    targetTemp: -18,
    status: "critical",
    lastUpdate: "30 sec ago",
    alerts: 5,
    trend: "increasing"
  },
  {
    id: "ZONE-004",
    name: "Delivery Truck 1",
    location: "Vehicle Fleet",
    currentTemp: -17.2,
    targetTemp: -18,
    status: "normal",
    lastUpdate: "3 min ago", 
    alerts: 0,
    trend: "stable"
  }
]

const recentAlerts = [
  {
    id: "ALT-001",
    zone: "Fresh Fish Freezer",
    type: "Temperature High",
    severity: "critical",
    temperature: -15.8,
    threshold: -18,
    timestamp: "2024-01-16 14:30",
    acknowledged: false,
    message: "Temperature risen above safe threshold"
  },
  {
    id: "ALT-002",
    zone: "Ice Cream Storage", 
    type: "Temperature Low",
    severity: "warning",
    temperature: -22.1,
    threshold: -20,
    timestamp: "2024-01-16 14:15",
    acknowledged: false,
    message: "Temperature dropped below optimal range"
  },
  {
    id: "ALT-003",
    zone: "Main Freezer A",
    type: "Sensor Malfunction",
    severity: "info",
    temperature: -18.5,
    threshold: -18,
    timestamp: "2024-01-16 13:45",
    acknowledged: true,
    message: "Temperature sensor recalibrated successfully"
  }
]

export default function TemperatureAlerts() {
  const [selectedZone, setSelectedZone] = useState("all")
  const [alertsEnabled, setAlertsEnabled] = useState(true)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-success text-success-foreground'
      case 'warning': return 'bg-yellow-500 text-white'
      case 'critical': return 'bg-destructive text-destructive-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground'
      case 'warning': return 'bg-yellow-500 text-white'
      case 'info': return 'bg-blue-500 text-white'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-red-500" />
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-blue-500" />
      default: return <div className="w-4 h-4 rounded-full bg-green-500" />
    }
  }

  const filteredZones = selectedZone === "all" ? temperatureZones : 
    temperatureZones.filter(zone => zone.status === selectedZone)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Temperature Monitoring</h1>
          <p className="text-muted-foreground">Monitor and manage temperature alerts for all storage zones</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Alerts</span>
            <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
          </div>
          <Button className="bg-gradient-primary hover:bg-primary">
            <Settings className="w-4 h-4 mr-2" />
            Configure Alerts
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Zones</p>
                <p className="text-2xl font-bold text-foreground">{temperatureZones.length}</p>
              </div>
              <Thermometer className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-destructive">
                  {recentAlerts.filter(alert => !alert.acknowledged).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Normal Zones</p>
                <p className="text-2xl font-bold text-success">
                  {temperatureZones.filter(zone => zone.status === 'normal').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Temperature</p>
                <p className="text-2xl font-bold text-foreground">
                  {(temperatureZones.reduce((sum, zone) => sum + zone.currentTemp, 0) / temperatureZones.length).toFixed(1)}°C
                </p>
              </div>
              <Thermometer className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Temperature Zones */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Temperature Zones</CardTitle>
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredZones.map((zone) => (
              <div 
                key={zone.id}
                className="p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-foreground">{zone.name}</h3>
                    <Badge className={getStatusColor(zone.status)}>
                      {zone.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(zone.trend)}
                    <span className="text-2xl font-bold text-foreground">
                      {zone.currentTemp}°C
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{zone.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Target: {zone.targetTemp}°C</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{zone.lastUpdate}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Alerts: {zone.alerts}</span>
                    <span className="text-muted-foreground capitalize">Trend: {zone.trend}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm">View History</Button>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 bg-background rounded-lg border border-border transition-all duration-200 ${
                  !alert.acknowledged ? 'border-l-4 border-l-destructive' : 'opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <h4 className="font-semibold text-foreground">{alert.type}</h4>
                    <span className="text-sm text-muted-foreground">in {alert.zone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{alert.timestamp}</span>
                    {!alert.acknowledged && (
                      <Button variant="outline" size="sm">
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <p className="text-muted-foreground">{alert.message}</p>
                  <div className="flex items-center gap-4">
                    <span>Current: <strong>{alert.temperature}°C</strong></span>
                    <span>Threshold: <strong>{alert.threshold}°C</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}