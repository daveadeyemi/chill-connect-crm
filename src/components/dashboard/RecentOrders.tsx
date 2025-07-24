import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

const orders = [
  {
    id: "ORD-001",
    customer: "Fresh Market Downtown",
    amount: "$2,450.00",
    status: "delivered",
    date: "2024-01-15",
    items: "Frozen Vegetables, Ice Cream"
  },
  {
    id: "ORD-002", 
    customer: "Quick Stop Grocery",
    amount: "$1,280.00",
    status: "pending",
    date: "2024-01-15",
    items: "Frozen Pizza, Frozen Fruits"
  },
  {
    id: "ORD-003",
    customer: "Corner Store Plus",
    amount: "$890.00", 
    status: "processing",
    date: "2024-01-14",
    items: "Ice Cream, Frozen Meals"
  },
  {
    id: "ORD-004",
    customer: "Metro Food Hub",
    amount: "$3,200.00",
    status: "delivered",
    date: "2024-01-14", 
    items: "Bulk Frozen Vegetables"
  }
]

const statusColors = {
  delivered: "bg-success text-success-foreground",
  pending: "bg-warning text-warning-foreground", 
  processing: "bg-primary text-primary-foreground"
}

export function RecentOrders() {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-all duration-200"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{order.id}</span>
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{order.customer}</p>
                <p className="text-xs text-muted-foreground">{order.items}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-semibold text-foreground">{order.amount}</p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}