
import { supabase as supabaseClient } from "@/integrations/supabase/client";
import { postgres } from "@/integrations/postgres/client";

/**
 * Configuration for which data source to use
 * Set this to 'postgres' to use your local database
 * or 'supabase' to use Supabase cloud database
 */
type DataSource = 'postgres' | 'supabase';
const ACTIVE_DATA_SOURCE: DataSource = 'postgres';

/**
 * This function returns the appropriate client based on configuration
 * Use this when you want to easily switch between data sources
 */
export function getClient() {
  return ACTIVE_DATA_SOURCE === 'postgres' ? postgres : supabaseClient;
}

// Export a preconfigured client based on the active data source
export const db = getClient();

/**
 * Usage example:
 * 
 * import { db } from "@/integrations/postgres/migration-helper";
 * 
 * async function getData() {
 *   const { data, error } = await db.from('table').select('*');
 *   // ...
 * }
 */
