import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Download, Send, FileText, Calculator } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import jsPDF from 'jspdf'

interface InvoiceItem {
  id: string
  product: string
  quantity: number
  price: number
  total: number
}

interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  notes: string
}

const frozenProducts = [
  { name: "Frozen Fish (1kg)", price: 2500 },
  { name: "Frozen Chicken (1kg)", price: 3200 },
  { name: "Frozen Prawns (500g)", price: 4500 },
  { name: "Ice Cream (1L)", price: 1800 },
  { name: "Frozen Vegetables (500g)", price: 1200 },
  { name: "Frozen Beef (1kg)", price: 4800 },
  { name: "Frozen Turkey (1kg)", price: 3800 },
  { name: "Frozen Mutton (1kg)", price: 5200 }
]

export default function Invoices() {
  const { toast } = useToast()
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: ''
  })

  const [newItem, setNewItem] = useState({
    product: '',
    quantity: 1,
    price: 0
  })

  const addItem = () => {
    if (!newItem.product || newItem.quantity <= 0 || newItem.price <= 0) {
      toast({
        title: "Invalid Item",
        description: "Please fill all item details correctly",
        variant: "destructive"
      })
      return
    }

    const item: InvoiceItem = {
      id: Date.now().toString(),
      product: newItem.product,
      quantity: newItem.quantity,
      price: newItem.price,
      total: newItem.quantity * newItem.price
    }

    const updatedItems = [...invoice.items, item]
    const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.075 // 7.5% VAT
    const total = subtotal + tax

    setInvoice({
      ...invoice,
      items: updatedItems,
      subtotal,
      tax,
      total
    })

    setNewItem({ product: '', quantity: 1, price: 0 })
  }

  const removeItem = (id: string) => {
    const updatedItems = invoice.items.filter(item => item.id !== id)
    const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.075
    const total = subtotal + tax

    setInvoice({
      ...invoice,
      items: updatedItems,
      subtotal,
      tax,
      total
    })
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.text('INVOICE', 20, 30)
    doc.setFontSize(12)
    doc.text('Frozen Foods Store', 20, 40)
    doc.text('123 Lagos Island, Lagos State, Nigeria', 20, 50)
    doc.text('Phone: +234 (801) 123-4567', 20, 60)
    
    // Invoice details
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 120, 40)
    doc.text(`Date: ${invoice.date}`, 120, 50)
    doc.text(`Due Date: ${invoice.dueDate}`, 120, 60)
    
    // Customer details
    doc.text('Bill To:', 20, 80)
    doc.text(invoice.customerName, 20, 90)
    doc.text(invoice.customerPhone, 20, 100)
    doc.text(invoice.customerAddress, 20, 110)
    
    // Items table header
    let yPos = 130
    doc.text('Product', 20, yPos)
    doc.text('Qty', 100, yPos)
    doc.text('Price', 120, yPos)
    doc.text('Total', 160, yPos)
    
    // Items
    yPos += 10
    invoice.items.forEach(item => {
      doc.text(item.product, 20, yPos)
      doc.text(item.quantity.toString(), 100, yPos)
      doc.text(`₦${item.price.toLocaleString()}`, 120, yPos)
      doc.text(`₦${item.total.toLocaleString()}`, 160, yPos)
      yPos += 10
    })
    
    // Totals
    yPos += 10
    doc.text(`Subtotal: ₦${invoice.subtotal.toLocaleString()}`, 120, yPos)
    doc.text(`VAT (7.5%): ₦${invoice.tax.toLocaleString()}`, 120, yPos + 10)
    doc.text(`Total: ₦${invoice.total.toLocaleString()}`, 120, yPos + 20)
    
    if (invoice.notes) {
      doc.text('Notes:', 20, yPos + 40)
      doc.text(invoice.notes, 20, yPos + 50)
    }
    
    doc.save(`invoice-${invoice.invoiceNumber}.pdf`)
    
    toast({
      title: "PDF Generated",
      description: "Invoice PDF has been downloaded"
    })
  }

  const sendViaWhatsApp = () => {
    if (!invoice.customerPhone) {
      toast({
        title: "Missing Phone Number",
        description: "Please add customer phone number to send via WhatsApp",
        variant: "destructive"
      })
      return
    }

    const message = `Hello ${invoice.customerName}! 

Here's your invoice from Frozen Foods Store:

Invoice #: ${invoice.invoiceNumber}
Date: ${invoice.date}
Total Amount: ₦${invoice.total.toLocaleString()}

Items:
${invoice.items.map(item => `• ${item.product} x${item.quantity} - ₦${item.total.toLocaleString()}`).join('\n')}

Subtotal: ₦${invoice.subtotal.toLocaleString()}
VAT (7.5%): ₦${invoice.tax.toLocaleString()}
*Total: ₦${invoice.total.toLocaleString()}*

Thank you for your business! 🧊`

    const encodedMessage = encodeURIComponent(message)
    const phoneNumber = invoice.customerPhone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
    
    toast({
      title: "WhatsApp Opened",
      description: "Invoice sent via WhatsApp"
    })
  }

  const selectProduct = (productName: string) => {
    const product = frozenProducts.find(p => p.name === productName)
    if (product) {
      setNewItem({
        ...newItem,
        product: productName,
        price: product.price
      })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoice Generator</h1>
          <p className="text-muted-foreground">Create professional invoices and send via WhatsApp</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generatePDF} className="bg-gradient-primary hover:bg-primary">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={sendViaWhatsApp} variant="outline">
            <Send className="w-4 h-4 mr-2" />
            Send WhatsApp
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Form */}
        <div className="space-y-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Invoice Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input 
                    id="invoiceNumber"
                    value={invoice.invoiceNumber}
                    onChange={(e) => setInvoice({...invoice, invoiceNumber: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date"
                    type="date"
                    value={invoice.date}
                    onChange={(e) => setInvoice({...invoice, date: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate"
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => setInvoice({...invoice, dueDate: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input 
                  id="customerName"
                  value={invoice.customerName}
                  onChange={(e) => setInvoice({...invoice, customerName: e.target.value})}
                  placeholder="Enter customer name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input 
                    id="customerEmail"
                    type="email"
                    value={invoice.customerEmail}
                    onChange={(e) => setInvoice({...invoice, customerEmail: e.target.value})}
                    placeholder="customer@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input 
                    id="customerPhone"
                    value={invoice.customerPhone}
                    onChange={(e) => setInvoice({...invoice, customerPhone: e.target.value})}
                    placeholder="+234 801 123 4567"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="customerAddress">Address</Label>
                <Textarea 
                  id="customerAddress"
                  value={invoice.customerAddress}
                  onChange={(e) => setInvoice({...invoice, customerAddress: e.target.value})}
                  placeholder="Customer address"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Add Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="product">Product</Label>
                <Select value={newItem.product} onValueChange={selectProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {frozenProducts.map((product) => (
                      <SelectItem key={product.name} value={product.name}>
                        {product.name} - ₦{product.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity"
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₦)</Label>
                  <Input 
                    id="price"
                    type="number"
                    min="0"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <Button onClick={addItem} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={invoice.notes}
                onChange={(e) => setInvoice({...invoice, notes: e.target.value})}
                placeholder="Additional notes or payment terms..."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Invoice Preview */}
        <div className="space-y-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Invoice Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground">INVOICE</h2>
                <p className="text-muted-foreground">Frozen Foods Store</p>
                <p className="text-sm text-muted-foreground">123 Lagos Island, Lagos State, Nigeria</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Invoice #:</p>
                  <p>{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="font-semibold">Date:</p>
                  <p>{invoice.date}</p>
                </div>
              </div>
              
              {invoice.customerName && (
                <>
                  <Separator />
                  <div>
                    <p className="font-semibold text-foreground">Bill To:</p>
                    <p className="text-foreground">{invoice.customerName}</p>
                    {invoice.customerPhone && <p className="text-muted-foreground">{invoice.customerPhone}</p>}
                    {invoice.customerAddress && <p className="text-muted-foreground">{invoice.customerAddress}</p>}
                  </div>
                </>
              )}
              
              {invoice.items.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Items:</h3>
                    {invoice.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <p className="text-foreground">{item.product}</p>
                          <p className="text-muted-foreground">{item.quantity} x ₦{item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">₦{item.total.toLocaleString()}</p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₦{invoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (7.5%):</span>
                      <span>₦{invoice.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>₦{invoice.total.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}
              
              {invoice.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="font-semibold text-foreground">Notes:</p>
                    <p className="text-muted-foreground text-sm">{invoice.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}