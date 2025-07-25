import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Package, DollarSign, ShoppingCart, Download, Calendar } from "lucide-react"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const salesData = [
  { month: 'Jan', revenue: 124000, orders: 145, customers: 89 },
  { month: 'Feb', revenue: 156000, orders: 189, customers: 112 },
  { month: 'Mar', revenue: 142000, orders: 167, customers: 98 },
  { month: 'Apr', revenue: 178000, orders: 203, customers: 134 },
  { month: 'May', revenue: 195000, orders: 234, customers: 156 },
  { month: 'Jun', revenue: 187000, orders: 221, customers: 149 }
]

const productPerformance = [
  { name: 'Frozen Fish', sales: 450000, units: 2500, growth: 12.5 },
  { name: 'Ice Cream', sales: 380000, units: 1900, growth: 8.3 },
  { name: 'Frozen Chicken', sales: 290000, units: 1400, growth: -2.1 },
  { name: 'Frozen Vegetables', sales: 180000, units: 1100, growth: 15.7 },
  { name: 'Frozen Prawns', sales: 260000, units: 800, growth: 6.4 }
]

const categoryData = [
  { name: 'Fish & Seafood', value: 40, color: '#3b82f6' },
  { name: 'Ice Cream', value: 25, color: '#10b981' },
  { name: 'Poultry', value: 20, color: '#f59e0b' },
  { name: 'Vegetables', value: 10, color: '#ef4444' },
  { name: 'Others', value: 5, color: '#8b5cf6' }
]

const customerMetrics = [
  { segment: 'Premium Retailers', count: 23, revenue: 680000, avgOrder: 29565 },
  { segment: 'Standard Retailers', count: 45, revenue: 520000, avgOrder: 11556 },
  { segment: 'Small Stores', count: 67, revenue: 290000, avgOrder: 4328 },
  { segment: 'New Customers', count: 12, revenue: 85000, avgOrder: 7083 }
]

export default function Analytics() {
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0)
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0)
  const totalCustomers = Math.max(...salesData.map(item => item.customers))
  const avgOrderValue = Math.round(totalRevenue / totalOrders)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground">Business insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-primary hover:bg-primary">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">₦{totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">+12.5%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">{totalOrders.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">+8.3%</span>
                </div>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold text-foreground">{totalCustomers}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">+15.2%</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold text-foreground">₦{avgOrderValue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-destructive">-2.1%</span>
                </div>
              </div>
              <Package className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₦${(value/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders & Customers */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Orders & Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#10b981" name="Orders" />
                <Bar dataKey="customers" fill="#f59e0b" name="Customers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Performance */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>Top Product Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productPerformance.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div>
                    <h4 className="font-semibold text-foreground">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.units} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">₦{product.sales.toLocaleString()}</p>
                    <div className="flex items-center gap-1">
                      {product.growth > 0 ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      )}
                      <span className={`text-sm ${product.growth > 0 ? 'text-success' : 'text-destructive'}`}>
                        {product.growth > 0 ? '+' : ''}{product.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Segments */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Customer Segments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {customerMetrics.map((segment, index) => (
              <div key={index} className="p-4 bg-background rounded-lg border border-border">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{segment.segment}</h4>
                    <Badge variant="outline">{segment.count}</Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium">₦{segment.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Order:</span>
                      <span className="font-medium">₦{segment.avgOrder.toLocaleString()}</span>
                    </div>
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