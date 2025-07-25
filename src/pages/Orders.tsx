import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Package, Truck, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

const orders = [
  {
    id: "ORD-001",
    customerName: "Fresh Market Downtown",
    customerPhone: "+234 (801) 123-4567",
    status: "delivered",
    total: "₦45,230",
    items: 12,
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-16",
    products: ["Frozen Fish", "Ice Cream", "Frozen Vegetables"],
    priority: "high"
  },
  {
    id: "ORD-002", 
    customerName: "Quick Stop Grocery",
    customerPhone: "+234 (802) 234-5678",
    status: "in-transit",
    total: "₦78,920",
    items: 25,
    orderDate: "2024-01-14",
    deliveryDate: "2024-01-16",
    products: ["Frozen Chicken", "Frozen Prawns", "Ice Cream"],
    priority: "medium"
  },
  {
    id: "ORD-003",
    customerName: "Corner Store Plus",
    customerPhone: "+234 (803) 345-6789",
    status: "processing",
    total: "₦23,680",
    items: 8,
    orderDate: "2024-01-16",
    deliveryDate: "2024-01-17",
    products: ["Frozen Fish", "Frozen Vegetables"],
    priority: "low"
  },
  {
    id: "ORD-004",
    customerName: "Super Fresh Mart",
    customerPhone: "+234 (804) 456-7890",
    status: "pending",
    total: "₦156,340",
    items: 45,
    orderDate: "2024-01-16",
    deliveryDate: "2024-01-18",
    products: ["Frozen Chicken", "Ice Cream", "Frozen Fish", "Frozen Vegetables"],
    priority: "high"
  }
]

const statusConfig = {
  pending: { color: "bg-yellow-500", icon: Clock, label: "Pending" },
  processing: { color: "bg-blue-500", icon: Package, label: "Processing" },
  "in-transit": { color: "bg-purple-500", icon: Truck, label: "In Transit" },
  delivered: { color: "bg-green-500", icon: CheckCircle, label: "Delivered" },
  cancelled: { color: "bg-red-500", icon: XCircle, label: "Cancelled" }
}

const priorityConfig = {
  low: { color: "bg-gray-500", label: "Low" },
  medium: { color: "bg-yellow-500", label: "Medium" },
  high: { color: "bg-red-500", label: "High" }
}

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: keyof typeof statusConfig) => {
    const StatusIcon = statusConfig[status].icon
    return <StatusIcon className="w-4 h-4" />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Track and manage customer orders and deliveries</p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">{orders.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold text-foreground">
                  {orders.filter(o => o.status === 'in-transit').length}
                </p>
              </div>
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-foreground">
                  {orders.filter(o => o.priority === 'high').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-foreground">
                  ₦{orders.reduce((sum, order) => sum + parseInt(order.total.replace(/[₦,]/g, '')), 0).toLocaleString()}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order Management</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search orders..." 
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div 
                key={order.id}
                className="p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-foreground">{order.id}</h3>
                    <Badge className={`${statusConfig[order.status as keyof typeof statusConfig].color} text-white`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status as keyof typeof statusConfig)}
                        {statusConfig[order.status as keyof typeof statusConfig].label}
                      </span>
                    </Badge>
                    <Badge className={`${priorityConfig[order.priority as keyof typeof priorityConfig].color} text-white`}>
                      {priorityConfig[order.priority as keyof typeof priorityConfig].label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground text-lg">{order.total}</p>
                    <p className="text-sm text-muted-foreground">{order.items} items</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p className="font-medium text-foreground">{order.customerName}</p>
                    <p className="text-muted-foreground">{order.customerPhone}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Order Date</p>
                    <p className="font-medium text-foreground">{order.orderDate}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Delivery Date</p>
                    <p className="font-medium text-foreground">{order.deliveryDate}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Products</p>
                    <p className="font-medium text-foreground">
                      {order.products.slice(0, 2).join(", ")}
                      {order.products.length > 2 && ` +${order.products.length - 2} more`}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">Track Order</Button>
                  <Button variant="outline" size="sm">Contact Customer</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}