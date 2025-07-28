-- Fix function search path security issues
ALTER FUNCTION public.update_updated_at_column() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.check_loyalty_reward(DECIMAL, UUID) SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.handle_order_completion() SECURITY DEFINER SET search_path = public;