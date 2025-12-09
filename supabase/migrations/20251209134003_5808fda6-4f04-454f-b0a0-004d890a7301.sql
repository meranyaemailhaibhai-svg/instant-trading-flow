-- Allow first admin registration (when no admins exist)
CREATE OR REPLACE FUNCTION public.is_first_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.admin_users LIMIT 1
  )
$$;

-- Update admin_users insert policy to allow first admin or existing admins
DROP POLICY IF EXISTS "First admin can register" ON public.admin_users;
CREATE POLICY "Admins can insert admin users" 
ON public.admin_users 
FOR INSERT 
TO authenticated
WITH CHECK (
  public.is_first_admin() OR public.is_admin(auth.uid())
);

-- Allow service role to insert (for edge functions)
ALTER TABLE public.clients FORCE ROW LEVEL SECURITY;
ALTER TABLE public.payments FORCE ROW LEVEL SECURITY;

-- Create policy for anon to insert clients (from edge functions via service role)
CREATE POLICY "Service role can insert clients"
ON public.clients
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Service role can update clients"  
ON public.clients
FOR UPDATE
TO anon
USING (true);

CREATE POLICY "Service role can insert payments"
ON public.payments
FOR INSERT
TO anon
WITH CHECK (true);