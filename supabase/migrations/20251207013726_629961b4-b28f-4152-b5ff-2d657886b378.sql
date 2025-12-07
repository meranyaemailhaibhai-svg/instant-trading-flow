-- Create enum for client states
CREATE TYPE public.client_state AS ENUM (
  'awaiting_platform_selection',
  'awaiting_client_name', 
  'awaiting_payment',
  'payment_received',
  'admin_processing',
  'completed',
  'expired'
);

-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed');

-- Create enum for admin roles
CREATE TYPE public.admin_role AS ENUM ('admin', 'agent');

-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp_number TEXT NOT NULL,
  client_name TEXT,
  selected_platform TEXT,
  payment_amount DECIMAL(10,2),
  transaction_id TEXT,
  payment_status payment_status DEFAULT 'pending',
  wallet_amount DECIMAL(10,2) DEFAULT 0,
  admin_assigned BOOLEAN DEFAULT false,
  state client_state DEFAULT 'awaiting_platform_selection',
  trading_id TEXT,
  trading_password TEXT,
  login_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  upi_transaction_id TEXT,
  payer_name TEXT,
  payment_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  webhook_raw_data JSONB,
  status payment_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role admin_role DEFAULT 'agent',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_id UNIQUE (user_id)
);

-- Create contact_submissions table for the contact form
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = _user_id
  )
$$;

-- RLS Policies for clients table (admins only)
CREATE POLICY "Admins can view all clients" 
ON public.clients 
FOR SELECT 
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert clients" 
ON public.clients 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update clients" 
ON public.clients 
FOR UPDATE 
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete clients" 
ON public.clients 
FOR DELETE 
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for payments table (admins only)
CREATE POLICY "Admins can view all payments" 
ON public.payments 
FOR SELECT 
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert payments" 
ON public.payments 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update payments" 
ON public.payments 
FOR UPDATE 
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for admin_users table
CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
TO authenticated
USING (public.is_admin(auth.uid()));

-- RLS Policies for contact_submissions (public insert, admin read)
CREATE POLICY "Anyone can submit contact form" 
ON public.contact_submissions 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
TO authenticated
USING (public.is_admin(auth.uid()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on clients
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_clients_whatsapp ON public.clients(whatsapp_number);
CREATE INDEX idx_clients_state ON public.clients(state);
CREATE INDEX idx_clients_payment_status ON public.clients(payment_status);
CREATE INDEX idx_payments_client_id ON public.payments(client_id);