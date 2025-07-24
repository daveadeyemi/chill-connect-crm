import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Package, Thermometer, Calendar } from "lucide-react"

const products = [
  {
    id: "PROD-001",
    name: "Premium Ice Cream Assortment",
    category: "Ice Cream",
    sku: "ICE-AST-001",
    stock: 245,
    minStock: 50,
    price: "$12.99",
    storageTemp: "-18°C",
    expiryDate: "2024-06-15",
    supplier: "Dairy Dreams Inc"
  },
  {
    id: "PROD-002", 
    name: "Organic Frozen Vegetables Mix",
    category: "Vegetables",
    sku: "VEG-ORG-002",
    stock: 156,
    minStock: 30,
    price: "$8.49",
    storageTemp: "-18°C", 
    expiryDate: "2024-08-20",
    supplier: "Green Fields Co"
  },
  {
    id: "PROD-003",
    name: "Frozen Pizza Margherita",
    category: "Ready Meals",
    sku: "PIZ-MAR-003", 
    stock: 89,
    minStock: 25,
    price: "$6.99",
    storageTemp: "-18°C",
    expiryDate: "2024-05-10",
    supplier: "Italian Delights"
  },
  {
    id: "PROD-004",
    name: "Wild Caught Fish Fillets",
    category: "Seafood",
    sku: "FSH-WLD-004",
    stock: 23,
    minStock: 40,
    price: "$15.99", 
    storageTemp: "-20°C",
    expiryDate: "2024-04-25",
    supplier: "Ocean Fresh Ltd"
  }
]

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock) return { label: "Low Stock", color: "bg-destructive text-destructive-foreground" }
    if (stock <= minStock * 2) return { label: "Medium", color: "bg-warning text-warning-foreground" }
    return { label: "In Stock", color: "bg-success text-success-foreground" }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your frozen food inventory and stock levels</p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Product Inventory</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search products..." 
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
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock, product.minStock)
              return (
                <div 
                  key={product.id}
                  className="p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        <Badge variant="outline">{product.category}</Badge>
                        <Badge className={stockStatus.color}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          SKU: {product.sku}
                        </div>
                        <div className="flex items-center gap-1">
                          <Thermometer className="w-4 h-4" />
                          {product.storageTemp}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Exp: {product.expiryDate}
                        </div>
                        <div>
                          Supplier: {product.supplier}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <p className="font-semibold text-foreground">{product.price}</p>
                      <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                      <p className="text-xs text-muted-foreground">Min: {product.minStock}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}