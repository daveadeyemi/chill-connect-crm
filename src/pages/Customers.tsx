import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, Plus, Phone, Mail, MapPin, Gift, Star, Eye, MessageSquare } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  total_orders: number;
  total_spent: number;
  loyalty_points: number;
  loyalty_credit_balance: number;
  last_order: string;
  created_at: string;
}

interface LoyaltyTransaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string;
  expires_at: string;
  created_at: string;
}

interface WhatsAppMessage {
  id: string;
  message_content: string;
  phone_number: string;
  status: string;
  sent_at: string;
}

export default function Customers() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loyaltyTransactions, setLoyaltyTransactions] = useState<LoyaltyTransaction[]>([]);
  const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "active"
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    }
  };

  const fetchCustomerDetails = async (customerId: string) => {
    try {
      // Fetch loyalty transactions
      const { data: loyaltyData, error: loyaltyError } = await supabase
        .from('loyalty_transactions')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (loyaltyError) throw loyaltyError;
      setLoyaltyTransactions(loyaltyData || []);

      // Fetch WhatsApp messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('customer_id', customerId)
        .order('sent_at', { ascending: false });

      if (messagesError) throw messagesError;
      setWhatsappMessages(messagesData || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch customer details",
        variant: "destructive",
      });
    }
  };

  const addCustomer = async () => {
    try {
      const { error } = await supabase
        .from('customers')
        .insert([newCustomer]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer added successfully!",
      });

      setIsAddDialogOpen(false);
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        address: "",
        status: "active"
      });
      fetchCustomers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      });
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "vip":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "inactive":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  const openCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    fetchCustomerDetails(customer.id);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage your retail partners and customer relationships</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Add a new customer to your CRM system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  placeholder="Customer name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  placeholder="customer@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  placeholder="+234..."
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  placeholder="Customer address"
                />
              </div>
              <Button onClick={addCustomer} className="w-full">
                Add Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-foreground">{customer.name}</h3>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status.toUpperCase()}
                      </Badge>
                      {customer.loyalty_credit_balance > 0 && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Gift className="h-3 w-3 mr-1" />
                          ₦{customer.loyalty_credit_balance.toLocaleString()} credit
                        </Badge>
                      )}
                      {customer.loyalty_points > 0 && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          <Star className="h-3 w-3 mr-1" />
                          {customer.loyalty_points} pts
                        </Badge>
                      )}
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
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right space-y-1">
                      <p className="font-semibold text-foreground">₦{customer.total_spent.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{customer.total_orders} orders</p>
                      <p className="text-xs text-muted-foreground">
                        Last: {customer.last_order ? new Date(customer.last_order).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openCustomerDetails(customer)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details - {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              Complete customer profile with loyalty rewards and message history
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Email:</strong> {selectedCustomer.email}</div>
                  <div><strong>Phone:</strong> {selectedCustomer.phone}</div>
                  <div><strong>Address:</strong> {selectedCustomer.address}</div>
                  <div><strong>Status:</strong> <Badge className={getStatusColor(selectedCustomer.status)}>{selectedCustomer.status}</Badge></div>
                  <div><strong>Total Orders:</strong> {selectedCustomer.total_orders}</div>
                  <div><strong>Total Spent:</strong> ₦{selectedCustomer.total_spent.toLocaleString()}</div>
                  <div><strong>Loyalty Points:</strong> {selectedCustomer.loyalty_points}</div>
                  <div><strong>Loyalty Credit:</strong> ₦{selectedCustomer.loyalty_credit_balance.toLocaleString()}</div>
                </CardContent>
              </Card>

              {/* Loyalty Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Loyalty Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {loyaltyTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <div className="text-sm font-medium">{transaction.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </div>
                          {transaction.expires_at && (
                            <div className="text-xs text-red-600">
                              Expires: {new Date(transaction.expires_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <Badge variant={transaction.transaction_type === 'earned' ? 'default' : 'secondary'}>
                          {transaction.transaction_type === 'earned' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp Messages */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    WhatsApp Message History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {whatsappMessages.map((message) => (
                      <div key={message.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-medium">{message.phone_number}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant={message.status === 'sent' ? 'default' : 'secondary'}>
                              {message.status}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {new Date(message.sent_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm bg-muted p-2 rounded">
                          {message.message_content}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}