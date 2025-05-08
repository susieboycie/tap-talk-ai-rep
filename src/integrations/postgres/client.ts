
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../supabase/types';

// You can either hardcode the connection string here (not recommended for production)
// or use environment variables
const POSTGRES_URL = import.meta.env.VITE_POSTGRES_URL || "postgresql://username:password@localhost:5432/your_database";

// This client mimics the Supabase client interface but connects to your local PostgreSQL
// This allows for easier migration without changing all query code at once
export const postgres = createClient<Database>(
  POSTGRES_URL,
  // The second parameter is still needed by the Supabase client
  // You may want to use a dummy value here since it's not used for direct PostgreSQL connections
  "dummy-key"
);

// Export an alias as 'supabase' to make migration easier
export const supabase = postgres;

// Instructions for connection:
// 1. Make sure to set VITE_POSTGRES_URL in your .env file
// 2. Replace the connection in components gradually, starting with:
//    import { postgres } from "@/integrations/postgres/client";
