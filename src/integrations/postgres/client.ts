
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../supabase/types';

// Get the PostgreSQL connection string from environment variables
const POSTGRES_URL = import.meta.env.VITE_POSTGRES_URL || "postgresql://username:password@localhost:5432/your_database";

/**
 * This client mimics the Supabase client interface but connects to your local PostgreSQL database
 * This allows for a more seamless migration without changing all query code at once
 */
export const postgres = createClient<Database>(
  POSTGRES_URL,
  // The second parameter is required by the Supabase client
  // We use a dummy value here since it's not used for direct PostgreSQL connections
  "dummy-key"
);

// Export an alias as 'supabase' to make migration easier
export const supabase = postgres;

/**
 * Usage Instructions:
 * 
 * 1. Create a .env file with: VITE_POSTGRES_URL=postgresql://username:password@localhost:5432/your_database
 * 2. Import the postgres client:
 *    import { postgres } from "@/integrations/postgres/client";
 * 3. Use it the same way as the Supabase client:
 *    const { data, error } = await postgres.from('table').select('*');
 */
