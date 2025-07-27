import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { 
  Thermometer, 
  AlertTriangle, 
  CheckCircle, 
  Settings, 
  MapPin, 
  Clock, 
  TrendingDown, 
  TrendingUp, 
  Bell,
  BellOff,
  History,
  Download,
  Smartphone,
  Mail,
  Zap,
  Activity,
  RefreshCw
} from "lucide-react"

const initialTemperatureZones = [
  {
    id: "ZONE-001",
    name: "Main Freezer A",
    location: "Warehouse Section 1",
    currentTemp: -18.5,
    targetTemp: -18,
    status: "normal",
    lastUpdate: "2 min ago",
    alerts: 0,
    trend: "stable",
    minThreshold: -20,
    maxThreshold: -16,
    sensorId: "SENS-001",
    isOnline: true
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
    trend: "decreasing",
    minThreshold: -25,
    maxThreshold: -18,
    sensorId: "SENS-002",
    isOnline: true
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
    trend: "increasing",
    minThreshold: -20,
    maxThreshold: -16,
    sensorId: "SENS-003",
    isOnline: true
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
    trend: "stable",
    minThreshold: -20,
    maxThreshold: -15,
    sensorId: "SENS-004",
    isOnline: false
  },
  {
    id: "ZONE-005",
    name: "Cold Room B",
    location: "Warehouse Section 4",
    currentTemp: -2.1,
    targetTemp: -2,
    status: "normal",
    lastUpdate: "1 min ago",
    alerts: 0,
    trend: "stable",
    minThreshold: -5,
    maxThreshold: 1,
    sensorId: "SENS-005",
    isOnline: true
  }
]

const initialRecentAlerts = [
  {
    id: "ALT-001",
    zone: "Fresh Fish Freezer",
    type: "Temperature High",
    severity: "critical",
    temperature: -15.8,
    threshold: -18,
    timestamp: "2024-01-16 14:30",
    acknowledged: false,
    message: "Temperature risen above safe threshold",
    zoneId: "ZONE-003",
    autoResolved: false
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
    message: "Temperature dropped below optimal range",
    zoneId: "ZONE-002",
    autoResolved: false
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
    message: "Temperature sensor recalibrated successfully",
    zoneId: "ZONE-001",
    autoResolved: true
  },
  {
    id: "ALT-004",
    zone: "Delivery Truck 1",
    type: "Sensor Offline",
    severity: "warning",
    temperature: -17.2,
    threshold: -18,
    timestamp: "2024-01-16 13:20",
    acknowledged: false,
    message: "Temperature sensor lost connection",
    zoneId: "ZONE-004",
    autoResolved: false
  }
]

export default function TemperatureAlerts() {
  const [selectedZone, setSelectedZone] = useState("all")
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [temperatureZones, setTemperatureZones] = useState(initialTemperatureZones)
  const [recentAlerts, setRecentAlerts] = useState(initialRecentAlerts)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<any>(null)
  const [alertSettings, setAlertSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    criticalThreshold: 2, // degrees above/below target
    warningThreshold: 1,
    checkInterval: 60 // seconds
  })
  const { toast } = useToast()

  // Real-time simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperatureZones(prev => prev.map(zone => ({
        ...zone,
        currentTemp: zone.currentTemp + (Math.random() - 0.5) * 0.2,
        lastUpdate: "Just now",
        trend: Math.random() > 0.7 ? (Math.random() > 0.5 ? "increasing" : "decreasing") : zone.trend
      })))
    }, alertSettings.checkInterval * 1000)

    return () => clearInterval(interval)
  }, [alertSettings.checkInterval])

  const refreshData = useCallback(async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({
      title: "Data refreshed",
      description: "Temperature data updated successfully"
    })
  }, [toast])

  const acknowledgeAlert = useCallback((alertId: string) => {
    setRecentAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true }
        : alert
    ))
    toast({
      title: "Alert acknowledged",
      description: "Alert has been marked as acknowledged"
    })
  }, [toast])

  const exportAlerts = useCallback(() => {
    const csvContent = [
      ["ID", "Zone", "Type", "Severity", "Temperature", "Threshold", "Timestamp", "Status"],
      ...recentAlerts.map(alert => [
        alert.id,
        alert.zone,
        alert.type,
        alert.severity,
        `${alert.temperature}°C`,
        `${alert.threshold}°C`,
        alert.timestamp,
        alert.acknowledged ? "Acknowledged" : "Active"
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `temperature-alerts-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Export complete",
      description: "Alert data exported to CSV file"
    })
  }, [recentAlerts, toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-success text-success-foreground'
      case 'warning': return 'bg-warning text-warning-foreground'
      case 'critical': return 'bg-destructive text-destructive-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground'
      case 'warning': return 'bg-warning text-warning-foreground'
      case 'info': return 'bg-blue-500 text-white'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-destructive" />
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-blue-500" />
      default: return <Activity className="w-4 h-4 text-success" />
    }
  }

  const getZoneStatusSummary = () => {
    const critical = temperatureZones.filter(zone => zone.status === 'critical').length
    const warning = temperatureZones.filter(zone => zone.status === 'warning').length
    const normal = temperatureZones.filter(zone => zone.status === 'normal').length
    const offline = temperatureZones.filter(zone => !zone.isOnline).length
    
    return { critical, warning, normal, offline }
  }

  const filteredZones = selectedZone === "all" ? temperatureZones : 
    temperatureZones.filter(zone => zone.status === selectedZone)
  
  const statusSummary = getZoneStatusSummary()
  const activeAlerts = recentAlerts.filter(alert => !alert.acknowledged)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Temperature Monitoring</h1>
          <p className="text-muted-foreground">Monitor and manage temperature alerts for all storage zones</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline" onClick={exportAlerts} className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Alerts</span>
            <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:bg-primary gap-2">
                <Settings className="w-4 h-4" />
                Configure Alerts
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Alert Settings</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="notifications" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
                </TabsList>
                
                <TabsContent value="notifications" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <Label>Email Notifications</Label>
                      </div>
                      <Switch 
                        checked={alertSettings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setAlertSettings(prev => ({ ...prev, emailNotifications: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-muted-foreground" />
                        <Label>SMS Notifications</Label>
                      </div>
                      <Switch 
                        checked={alertSettings.smsNotifications}
                        onCheckedChange={(checked) => 
                          setAlertSettings(prev => ({ ...prev, smsNotifications: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                        <Label>WhatsApp Notifications</Label>
                      </div>
                      <Switch 
                        checked={alertSettings.whatsappNotifications}
                        onCheckedChange={(checked) => 
                          setAlertSettings(prev => ({ ...prev, whatsappNotifications: checked }))
                        }
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="thresholds" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Critical Threshold (°C)</Label>
                      <Input 
                        type="number" 
                        value={alertSettings.criticalThreshold}
                        onChange={(e) => 
                          setAlertSettings(prev => ({ ...prev, criticalThreshold: Number(e.target.value) }))
                        }
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Warning Threshold (°C)</Label>
                      <Input 
                        type="number" 
                        value={alertSettings.warningThreshold}
                        onChange={(e) => 
                          setAlertSettings(prev => ({ ...prev, warningThreshold: Number(e.target.value) }))
                        }
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Check Interval (seconds)</Label>
                      <Input 
                        type="number" 
                        value={alertSettings.checkInterval}
                        onChange={(e) => 
                          setAlertSettings(prev => ({ ...prev, checkInterval: Number(e.target.value) }))
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
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
                <p className="text-xs text-muted-foreground mt-1">
                  {statusSummary.offline} offline
                </p>
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
                  {activeAlerts.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {statusSummary.critical} critical zones
                </p>
              </div>
              {activeAlerts.length > 0 ? (
                <Bell className="w-8 h-8 text-destructive animate-pulse" />
              ) : (
                <BellOff className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Normal Zones</p>
                <p className="text-2xl font-bold text-success">
                  {statusSummary.normal}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {statusSummary.warning} warning zones
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
                <p className="text-xs text-muted-foreground mt-1">
                  Range: {Math.min(...temperatureZones.map(z => z.currentTemp)).toFixed(1)}° to {Math.max(...temperatureZones.map(z => z.currentTemp)).toFixed(1)}°
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
                className={`p-4 bg-background rounded-lg border transition-all duration-200 hover:shadow-md ${
                  zone.status === 'critical' ? 'border-destructive shadow-destructive/20' :
                  zone.status === 'warning' ? 'border-warning shadow-warning/20' :
                  'border-border'
                } ${!zone.isOnline ? 'opacity-75' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{zone.name}</h3>
                      {!zone.isOnline && (
                        <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" title="Sensor offline" />
                      )}
                    </div>
                    <Badge className={getStatusColor(zone.status)}>
                      {zone.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(zone.trend)}
                      <span className={`text-2xl font-bold ${
                        zone.status === 'critical' ? 'text-destructive' :
                        zone.status === 'warning' ? 'text-warning' :
                        'text-foreground'
                      }`}>
                        {zone.currentTemp.toFixed(1)}°C
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Sensor: {zone.sensorId}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{zone.location}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Target:</span>
                      <span className="ml-1 font-medium">{zone.targetTemp}°C</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Range:</span>
                      <span className="ml-1 font-medium">{zone.minThreshold}° to {zone.maxThreshold}°</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground text-xs">{zone.lastUpdate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-muted-foreground">
                        Alerts: <span className={zone.alerts > 0 ? "text-destructive font-medium" : ""}>{zone.alerts}</span>
                      </span>
                      <span className="text-muted-foreground capitalize">
                        Trend: {zone.trend}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <History className="w-3 h-3" />
                      History
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Settings className="w-3 h-3" />
                      Configure
                    </Button>
                  </div>
                  {zone.status !== 'normal' && (
                    <Badge variant="outline" className="text-xs">
                      Action Required
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts Banner */}
      {activeAlerts.length > 0 && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-medium">
            {activeAlerts.length} active alert{activeAlerts.length > 1 ? 's' : ''} require{activeAlerts.length === 1 ? 's' : ''} immediate attention!
            <Button variant="link" className="p-0 h-auto ml-2 text-destructive">
              View Details →
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Alerts */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Recent Alerts
              {activeAlerts.length > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">
                  {activeAlerts.length} Active
                </Badge>
              )}
            </CardTitle>
            <Select value="all" onValueChange={() => {}}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter alerts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 bg-background rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                  !alert.acknowledged 
                    ? `border-l-4 ${
                        alert.severity === 'critical' ? 'border-l-destructive shadow-destructive/10' :
                        alert.severity === 'warning' ? 'border-l-warning shadow-warning/10' :
                        'border-l-blue-500 shadow-blue-500/10'
                      }` 
                    : 'opacity-75 border-border'
                }`}
                onClick={() => setSelectedAlert(alert)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <h4 className="font-semibold text-foreground">{alert.type}</h4>
                    <span className="text-sm text-muted-foreground">in {alert.zone}</span>
                    {alert.autoResolved && (
                      <Badge variant="outline" className="text-xs">Auto-resolved</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{alert.timestamp}</span>
                    {!alert.acknowledged && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          acknowledgeAlert(alert.id)
                        }}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <p className="text-muted-foreground flex-1">{alert.message}</p>
                  <div className="flex items-center gap-4 ml-4">
                    <span className={alert.temperature > alert.threshold ? "text-destructive" : "text-foreground"}>
                      Current: <strong>{alert.temperature}°C</strong>
                    </span>
                    <span className="text-muted-foreground">
                      Threshold: <strong>{alert.threshold}°C</strong>
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      Math.abs(alert.temperature - alert.threshold) > alertSettings.criticalThreshold
                        ? "bg-destructive/20 text-destructive"
                        : "bg-warning/20 text-warning"
                    }`}>
                      {Math.abs(alert.temperature - alert.threshold).toFixed(1)}° diff
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {recentAlerts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-success" />
                <p>No recent alerts</p>
                <p className="text-sm">All temperature zones are operating normally</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}