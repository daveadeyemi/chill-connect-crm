import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Thermometer, AlertTriangle, CheckCircle } from "lucide-react"

const alerts = [
  {
    id: "TEMP-001",
    location: "Freezer Unit A",
    temperature: "-18°C",
    status: "normal",
    lastUpdate: "2 mins ago"
  },
  {
    id: "TEMP-002",
    location: "Freezer Unit B", 
    temperature: "-12°C",
    status: "warning",
    lastUpdate: "5 mins ago"
  },
  {
    id: "TEMP-003",
    location: "Storage Room 1",
    temperature: "-20°C", 
    status: "normal",
    lastUpdate: "1 min ago"
  },
  {
    id: "TEMP-004",
    location: "Delivery Truck #3",
    temperature: "-8°C",
    status: "critical",
    lastUpdate: "Just now"
  }
]

const statusConfig = {
  normal: {
    color: "bg-success text-success-foreground",
    icon: CheckCircle
  },
  warning: {
    color: "bg-warning text-warning-foreground", 
    icon: AlertTriangle
  },
  critical: {
    color: "bg-destructive text-destructive-foreground",
    icon: AlertTriangle
  }
}

export function TemperatureAlerts() {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Thermometer className="w-5 h-5" />
          Temperature Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const StatusIcon = statusConfig[alert.status as keyof typeof statusConfig].icon
            return (
              <div 
                key={alert.id}
                className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <StatusIcon className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{alert.location}</p>
                    <p className="text-xs text-muted-foreground">{alert.lastUpdate}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold text-foreground">{alert.temperature}</p>
                  <Badge className={statusConfig[alert.status as keyof typeof statusConfig].color}>
                    {alert.status}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
        <Button variant="outline" className="w-full mt-4">
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  )
}