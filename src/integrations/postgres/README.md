
# PostgreSQL Migration Guide

This directory contains the code to migrate from Supabase to direct PostgreSQL connections.

## Setup Instructions

1. Create a `.env` file in the root of the project with your PostgreSQL connection string:
   ```
   VITE_POSTGRES_URL=postgresql://username:password@localhost:5432/your_database
   ```

2. Update the imports in your components and hooks:
   ```typescript
   // Before
   import { supabase } from "@/integrations/supabase/client";
   
   // After
   import { postgres } from "@/integrations/postgres/client";
   ```

3. Replace `supabase` with `postgres` in your queries:
   ```typescript
   // Before
   const { data, error } = await supabase.from('table').select('*');
   
   // After
   const { data, error } = await postgres.from('table').select('*');
   ```

4. Alternatively, use the migration helper to easily switch between data sources:
   ```typescript
   import { db } from "@/integrations/postgres/migration-helper";
   
   // This will use either Postgres or Supabase based on the configuration
   const { data, error } = await db.from('table').select('*');
   ```

## Gradual Migration Strategy

1. Update one component or hook at a time
2. Test thoroughly after each migration
3. Update the `ACTIVE_DATA_SOURCE` in `migration-helper.ts` when ready to switch all components

## Database Schema

Ensure your PostgreSQL database has the same schema as the Supabase database.
You may need to run migrations to create the necessary tables and indexes.

## Connection Troubleshooting

If you encounter connection issues:

1. Check that your PostgreSQL server is running
2. Verify your connection string in the `.env` file
3. Ensure your database user has the necessary permissions
4. Check for SSL requirements in your connection string
