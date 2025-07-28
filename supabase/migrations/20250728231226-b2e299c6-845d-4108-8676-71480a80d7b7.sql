-- Create customers table with enhanced fields for CRM
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'vip')),
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  loyalty_points DECIMAL(10,2) DEFAULT 0,
  loyalty_credit_balance DECIMAL(10,2) DEFAULT 0,
  last_order TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id),
  order_number TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create receipts table
CREATE TABLE public.receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id),
  customer_id UUID REFERENCES public.customers(id),
  receipt_number TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  receipt_url TEXT,
  whatsapp_sent BOOLEAN DEFAULT false,
  whatsapp_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create whatsapp_messages table for logging
CREATE TABLE public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id),
  receipt_id UUID REFERENCES public.receipts(id),
  message_template_id UUID,
  message_content TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivery_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create message templates table
CREATE TABLE public.message_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('receipt', 'order_confirmation', 'payment_received', 'delivery_confirmation')),
  content TEXT NOT NULL,
  variables TEXT[], -- Array of variables like {customer_name}, {order_id}, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loyalty_transactions table
CREATE TABLE public.loyalty_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id),
  order_id UUID REFERENCES public.orders(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'expired')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crm_sync_logs table for tracking exports/syncs
CREATE TABLE public.crm_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('webhook', 'google_sheets', 'airtable', 'email')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('customer', 'order', 'receipt', 'whatsapp_message')),
  entity_id UUID NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  sync_data JSONB,
  error_message TEXT,
  synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create temperature_zones table (fixing temperature alerts)
CREATE TABLE public.temperature_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  current_temp DECIMAL(5,2),
  target_temp DECIMAL(5,2),
  min_threshold DECIMAL(5,2),
  max_threshold DECIMAL(5,2),
  status TEXT DEFAULT 'normal' CHECK (status IN ('normal', 'warning', 'critical')),
  is_active BOOLEAN DEFAULT true,
  last_reading_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create temperature_alerts table
CREATE TABLE public.temperature_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id UUID REFERENCES public.temperature_zones(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('high_temp', 'low_temp', 'sensor_offline')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  temperature DECIMAL(5,2),
  message TEXT,
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temperature_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temperature_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing public access for now - adjust based on auth requirements)
CREATE POLICY "Allow all operations on customers" ON public.customers FOR ALL USING (true);
CREATE POLICY "Allow all operations on orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow all operations on receipts" ON public.receipts FOR ALL USING (true);
CREATE POLICY "Allow all operations on whatsapp_messages" ON public.whatsapp_messages FOR ALL USING (true);
CREATE POLICY "Allow all operations on message_templates" ON public.message_templates FOR ALL USING (true);
CREATE POLICY "Allow all operations on loyalty_transactions" ON public.loyalty_transactions FOR ALL USING (true);
CREATE POLICY "Allow all operations on crm_sync_logs" ON public.crm_sync_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations on temperature_zones" ON public.temperature_zones FOR ALL USING (true);
CREATE POLICY "Allow all operations on temperature_alerts" ON public.temperature_alerts FOR ALL USING (true);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_message_templates_updated_at BEFORE UPDATE ON public.message_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_temperature_zones_updated_at BEFORE UPDATE ON public.temperature_zones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default message templates
INSERT INTO public.message_templates (name, template_type, content, variables) VALUES 
('Receipt Template', 'receipt', 'Hi {customer_name}! Thank you for your purchase. Your receipt #{receipt_number} for ₦{amount} is ready. View: {receipt_url}', ARRAY['customer_name', 'receipt_number', 'amount', 'receipt_url']),
('Order Confirmation', 'order_confirmation', 'Hello {customer_name}! Your order #{order_number} has been confirmed. Total: ₦{amount}. We''ll notify you when it''s ready for pickup/delivery.', ARRAY['customer_name', 'order_number', 'amount']),
('Payment Received', 'payment_received', 'Payment confirmed! Hi {customer_name}, we''ve received your payment of ₦{amount} for order #{order_number}. Thank you!', ARRAY['customer_name', 'amount', 'order_number']),
('Delivery Confirmation', 'delivery_confirmation', 'Delivered! Hi {customer_name}, your order #{order_number} has been successfully delivered. Thank you for choosing us!', ARRAY['customer_name', 'order_number']);

-- Insert sample temperature zones
INSERT INTO public.temperature_zones (name, location, current_temp, target_temp, min_threshold, max_threshold) VALUES 
('Cold Storage A', 'Warehouse Section 1', 2.5, 2.0, 0.0, 4.0),
('Cold Storage B', 'Warehouse Section 2', 3.1, 2.0, 0.0, 4.0),
('Freezer Unit 1', 'Main Freezer', -18.5, -18.0, -22.0, -15.0),
('Display Fridge', 'Retail Area', 4.2, 4.0, 2.0, 6.0);

-- Create function to check loyalty eligibility and award credits
CREATE OR REPLACE FUNCTION public.check_loyalty_reward(order_amount DECIMAL, customer_uuid UUID)
RETURNS VOID AS $$
DECLARE
  reward_amount DECIMAL := 1000.00;
  eligibility_threshold DECIMAL := 100000.00;
BEGIN
  -- Check if order qualifies for loyalty reward
  IF order_amount >= eligibility_threshold THEN
    -- Add loyalty credit that expires in 3 days
    INSERT INTO public.loyalty_transactions (customer_id, transaction_type, amount, description, expires_at)
    VALUES (customer_uuid, 'earned', reward_amount, 'Loyalty reward for purchase ≥ ₦100,000', now() + INTERVAL '3 days');
    
    -- Update customer's loyalty credit balance
    UPDATE public.customers 
    SET loyalty_credit_balance = loyalty_credit_balance + reward_amount,
        loyalty_points = loyalty_points + (order_amount / 100)
    WHERE id = customer_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically award loyalty rewards on order completion
CREATE OR REPLACE FUNCTION public.handle_order_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if order status changed to completed and payment is paid
  IF NEW.status = 'completed' AND NEW.payment_status = 'paid' AND 
     (OLD.status != 'completed' OR OLD.payment_status != 'paid') THEN
    
    -- Update customer totals
    UPDATE public.customers 
    SET total_orders = total_orders + 1,
        total_spent = total_spent + NEW.amount,
        last_order = NEW.updated_at
    WHERE id = NEW.customer_id;
    
    -- Check for loyalty rewards
    PERFORM public.check_loyalty_reward(NEW.amount, NEW.customer_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_completion_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_order_completion();