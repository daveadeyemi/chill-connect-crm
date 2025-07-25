import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, Phone, Mail, MapPin, Package, Truck, Star, Clock } from "lucide-react"

const suppliers = [
  {
    id: "SUP-001",
    name: "Arctic Fresh Supply Co.",
    email: "orders@arcticfresh.ng",
    phone: "+234 (901) 234-5678",
    address: "15 Industrial Estate, Lagos",
    status: "active",
    rating: 4.8,
    categories: ["Fish", "Seafood", "Ice"],
    totalOrders: 145,
    totalValue: "₦2,450,000",
    lastDelivery: "2024-01-15",
    nextDelivery: "2024-01-18"
  },
  {
    id: "SUP-002",
    name: "Frozen Delights Ltd",
    email: "supply@frozendelights.ng", 
    phone: "+234 (902) 345-6789",
    address: "8 Cold Storage Road, Abuja",
    status: "active",
    rating: 4.6,
    categories: ["Ice Cream", "Frozen Desserts"],
    totalOrders: 89,
    totalValue: "₦1,890,000",
    lastDelivery: "2024-01-14",
    nextDelivery: "2024-01-17"
  },
  {
    id: "SUP-003",
    name: "Premium Poultry Foods",
    email: "info@premiumpoultry.ng",
    phone: "+234 (903) 456-7890", 
    address: "22 Farm Road, Ibadan",
    status: "pending",
    rating: 4.2,
    categories: ["Chicken", "Turkey", "Duck"],
    totalOrders: 67,
    totalValue: "₦1,230,000",
    lastDelivery: "2024-01-10",
    nextDelivery: "2024-01-20"
  },
  {
    id: "SUP-004",
    name: "Ocean Harvest Nigeria",
    email: "sales@oceanharvest.ng",
    phone: "+234 (904) 567-8901",
    address: "5 Marina Complex, Port Harcourt", 
    status: "inactive",
    rating: 3.9,
    categories: ["Fish", "Prawns", "Crab"],
    totalOrders: 23,
    totalValue: "₦680,000",
    lastDelivery: "2023-12-20",
    nextDelivery: "-"
  }
]

const purchaseOrders = [
  {
    id: "PO-001",
    supplier: "Arctic Fresh Supply Co.",
    status: "delivered",
    orderDate: "2024-01-12",
    deliveryDate: "2024-01-15",
    items: 50,
    value: "₦125,000",
    products: ["Frozen Fish - 20kg", "Ice Blocks - 30 units"]
  },
  {
    id: "PO-002", 
    supplier: "Frozen Delights Ltd",
    status: "in-transit",
    orderDate: "2024-01-14",
    deliveryDate: "2024-01-17",
    items: 25,
    value: "₦89,500",
    products: ["Vanilla Ice Cream - 15L", "Chocolate Ice Cream - 10L"]
  },
  {
    id: "PO-003",
    supplier: "Premium Poultry Foods", 
    status: "pending",
    orderDate: "2024-01-16",
    deliveryDate: "2024-01-20",
    items: 40,
    value: "₦156,000",
    products: ["Frozen Chicken - 30kg", "Turkey Parts - 10kg"]
  }
]

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground'
      case 'pending': return 'bg-yellow-500 text-white'
      case 'inactive': return 'bg-muted text-muted-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getPOStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success text-success-foreground'
      case 'in-transit': return 'bg-blue-500 text-white'
      case 'pending': return 'bg-yellow-500 text-white'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suppliers</h1>
          <p className="text-muted-foreground">Manage supplier relationships and purchase orders</p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <Tabs defaultValue="suppliers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="space-y-6">
          {/* Supplier Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Suppliers</p>
                    <p className="text-2xl font-bold text-foreground">{suppliers.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Suppliers</p>
                    <p className="text-2xl font-bold text-foreground">
                      {suppliers.filter(s => s.status === 'active').length}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                    <p className="text-2xl font-bold text-foreground">
                      {purchaseOrders.filter(po => po.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold text-foreground">
                      ₦{suppliers.reduce((sum, supplier) => sum + parseInt(supplier.totalValue.replace(/[₦,]/g, '')), 0).toLocaleString()}
                    </p>
                  </div>
                  <Truck className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Supplier Directory</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                      placeholder="Search suppliers..." 
                      className="pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSuppliers.map((supplier) => (
                  <div 
                    key={supplier.id}
                    className="p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{supplier.name}</h3>
                        <Badge className={getStatusColor(supplier.status)}>
                          {supplier.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{supplier.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{supplier.totalValue}</p>
                        <p className="text-sm text-muted-foreground">{supplier.totalOrders} orders</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{supplier.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{supplier.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{supplier.address}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next Delivery: </span>
                        <span className="font-medium text-foreground">{supplier.nextDelivery}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-muted-foreground">Categories:</span>
                      {supplier.categories.map((category, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Create PO</Button>
                      <Button variant="outline" size="sm">Contact</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchase-orders" className="space-y-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Purchase Orders</CardTitle>
                <Button className="bg-gradient-primary hover:bg-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  New Purchase Order
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseOrders.map((po) => (
                  <div 
                    key={po.id}
                    className="p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{po.id}</h3>
                        <Badge className={getPOStatusColor(po.status)}>
                          {po.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground text-lg">{po.value}</p>
                        <p className="text-sm text-muted-foreground">{po.items} items</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">Supplier</p>
                        <p className="font-medium text-foreground">{po.supplier}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Order Date</p>
                        <p className="font-medium text-foreground">{po.orderDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Delivery Date</p>
                        <p className="font-medium text-foreground">{po.deliveryDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Products</p>
                        <p className="font-medium text-foreground">
                          {po.products.slice(0, 1).join(", ")}
                          {po.products.length > 1 && ` +${po.products.length - 1} more`}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Track Delivery</Button>
                      <Button variant="outline" size="sm">Contact Supplier</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}