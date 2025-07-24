import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Truck } from "lucide-react"
import { StatCard } from "@/components/dashboard/StatCard"
import { RecentOrders } from "@/components/dashboard/RecentOrders"
import { TemperatureAlerts } from "@/components/dashboard/TemperatureAlerts"

const stats = [
  {
    title: "Total Customers",
    value: "2,847",
    description: "Active retail partners",
    icon: Users,
    trend: { value: 12, isPositive: true }
  },
  {
    title: "Products in Stock", 
    value: "1,456",
    description: "Items available",
    icon: Package,
    trend: { value: 8, isPositive: true }
  },
  {
    title: "Orders Today",
    value: "89",
    description: "Processing & delivered", 
    icon: ShoppingCart,
    trend: { value: 23, isPositive: true }
  },
  {
    title: "Revenue (Month)",
    value: "$124,750",
    description: "Total sales this month",
    icon: DollarSign, 
    trend: { value: 15, isPositive: true }
  },
  {
    title: "Avg Order Value",
    value: "$1,420", 
    description: "Per order average",
    icon: TrendingUp,
    trend: { value: 5, isPositive: true }
  },
  {
    title: "Active Suppliers",
    value: "24",
    description: "Verified partners",
    icon: Truck,
    trend: { value: 2, isPositive: true }
  }
]

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your frozen food business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={stat.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
          <RecentOrders />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '700ms' }}>
          <TemperatureAlerts />
        </div>
      </div>
    </div>
  )
}