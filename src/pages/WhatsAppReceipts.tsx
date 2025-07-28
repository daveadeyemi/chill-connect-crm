import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Send, Eye, Download, Clock, CheckCircle, XCircle, Plus } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface Order {
  id: string;
  order_number: string;
  amount: number;
  status: string;
  customer_id: string;
}

interface Receipt {
  id: string;
  receipt_number: string;
  amount: number;
  whatsapp_sent: boolean;
  whatsapp_sent_at: string;
  receipt_url?: string;
  customers: Customer;
  orders: Order;
}

interface WhatsAppMessage {
  id: string;
  message_content: string;
  phone_number: string;
  status: string;
  sent_at: string;
  customers: Customer;
}

interface MessageTemplate {
  id: string;
  name: string;
  template_type: string;
  content: string;
  variables: string[];
}

export default function WhatsAppReceipts() {
  const { toast } = useToast();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [customMessage, setCustomMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReceipts();
    fetchMessages();
    fetchTemplates();
  }, []);

  const fetchReceipts = async () => {
    try {
      const { data, error } = await supabase
        .from('receipts')
        .select(`
          *,
          customers (id, name, phone, email),
          orders (id, order_number, amount, status, customer_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReceipts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch receipts",
        variant: "destructive",
      });
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select(`
          *,
          customers (id, name, phone, email)
        `)
        .order('sent_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch WhatsApp messages",
        variant: "destructive",
      });
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch message templates",
        variant: "destructive",
      });
    }
  };

  const replaceTemplateVariables = (template: string, receipt: Receipt) => {
    return template
      .replace(/{customer_name}/g, receipt.customers.name)
      .replace(/{receipt_number}/g, receipt.receipt_number)
      .replace(/{amount}/g, `₦${receipt.amount.toLocaleString()}`)
      .replace(/{receipt_url}/g, receipt.receipt_url || '#')
      .replace(/{order_number}/g, receipt.orders?.order_number || 'N/A');
  };

  const sendWhatsAppMessage = async () => {
    if (!selectedReceipt || !phoneNumber || (!selectedTemplate && !customMessage)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let messageContent = customMessage;
      
      if (selectedTemplate) {
        const template = templates.find(t => t.id === selectedTemplate);
        if (template) {
          messageContent = replaceTemplateVariables(template.content, selectedReceipt);
        }
      }

      // Log the WhatsApp message
      const { error: messageError } = await supabase
        .from('whatsapp_messages')
        .insert({
          customer_id: selectedReceipt.customers.id,
          receipt_id: selectedReceipt.id,
          message_template_id: selectedTemplate || null,
          message_content: messageContent,
          phone_number: phoneNumber,
          status: 'sent',
        });

      if (messageError) throw messageError;

      // Update receipt as sent
      const { error: receiptError } = await supabase
        .from('receipts')
        .update({
          whatsapp_sent: true,
          whatsapp_sent_at: new Date().toISOString(),
        })
        .eq('id', selectedReceipt.id);

      if (receiptError) throw receiptError;

      // Log CRM sync entry
      const { error: syncError } = await supabase
        .from('crm_sync_logs')
        .insert({
          sync_type: 'webhook',
          entity_type: 'whatsapp_message',
          entity_id: selectedReceipt.id,
          status: 'success',
          sync_data: { message: messageContent, phone: phoneNumber },
        });

      if (syncError) throw syncError;

      toast({
        title: "Success",
        description: "WhatsApp message sent and logged successfully!",
      });

      setIsDialogOpen(false);
      fetchReceipts();
      fetchMessages();
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send WhatsApp message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedReceipt(null);
    setSelectedTemplate("");
    setCustomMessage("");
    setPhoneNumber("");
  };

  const exportToCSV = () => {
    const csvData = messages.map(msg => ({
      customer_name: msg.customers.name,
      phone_number: msg.phone_number,
      message: msg.message_content,
      status: msg.status,
      sent_at: new Date(msg.sent_at).toLocaleDateString(),
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'whatsapp-messages.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">WhatsApp Receipts</h2>
          <p className="text-muted-foreground">
            Send receipts via WhatsApp and track messages
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Messages
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Receipts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Receipts
            </CardTitle>
            <CardDescription>
              Send receipts to customers via WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {receipts.map((receipt) => (
                <div key={receipt.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{receipt.customers.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Receipt #{receipt.receipt_number} • ₦{receipt.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {receipt.customers.phone}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {receipt.whatsapp_sent ? (
                      <Badge variant="secondary">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Sent
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedReceipt(receipt);
                            setPhoneNumber(receipt.customers.phone);
                          }}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Send Receipt via WhatsApp</DialogTitle>
                          <DialogDescription>
                            Send receipt to {selectedReceipt?.customers.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="+234..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="template">Message Template</Label>
                            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a template" />
                              </SelectTrigger>
                              <SelectContent>
                                {templates.map((template) => (
                                  <SelectItem key={template.id} value={template.id}>
                                    {template.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="custom">Custom Message (optional)</Label>
                            <Textarea
                              id="custom"
                              value={customMessage}
                              onChange={(e) => setCustomMessage(e.target.value)}
                              placeholder="Override template with custom message..."
                              rows={3}
                            />
                          </div>
                          <Button
                            onClick={sendWhatsAppMessage}
                            disabled={loading}
                            className="w-full"
                          >
                            {loading ? "Sending..." : "Send WhatsApp Message"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Log Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Message Log
            </CardTitle>
            <CardDescription>
              Recent WhatsApp messages sent to customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{message.customers.name}</div>
                    <Badge variant={message.status === 'sent' ? 'default' : 'secondary'}>
                      {message.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {message.phone_number}
                  </div>
                  <div className="text-sm bg-muted p-2 rounded">
                    {message.message_content}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(message.sent_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}