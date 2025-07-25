import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Phone, Mail, MapPin } from "lucide-react"

const customers = [
  {
    id: "CUST-001",
    name: "Fresh Market Downtown",
    email: "orders@freshmarket.com",
    phone: "+234 (801) 123-4567",
    address: "123 Victoria Island, Lagos",
    status: "active",
    totalOrders: 145,
    totalSpent: "₦125,430",
    lastOrder: "2024-01-15"
  },
  {
    id: "CUST-002", 
    name: "Quick Stop Grocery",
    email: "purchasing@quickstop.com",
    phone: "+234 (802) 234-5678",
    address: "456 Garki District, Abuja", 
    status: "active",
    totalOrders: 89,
    totalSpent: "₦78,920",
    lastOrder: "2024-01-14"
  },
  {
    id: "CUST-003",
    name: "Corner Store Plus",
    email: "manager@cornerstore.com", 
    phone: "+234 (803) 345-6789",
    address: "789 Ring Road, Ibadan",
    status: "inactive",
    totalOrders: 23,
    totalSpent: "₦15,680",
    lastOrder: "2023-12-20"
  }
]

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage your retail partners and customer relationships</p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customer Directory</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search customers..." 
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
            {filteredCustomers.map((customer) => (
              <div 
                key={customer.id}
                className="p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{customer.name}</h3>
                      <Badge className={customer.status === 'active' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
                        {customer.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {customer.address}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <p className="font-semibold text-foreground">{customer.totalSpent}</p>
                    <p className="text-sm text-muted-foreground">{customer.totalOrders} orders</p>
                    <p className="text-xs text-muted-foreground">Last: {customer.lastOrder}</p>
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