
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

## Gradual Migration Strategy

1. Update one component or hook at a time
2. Create PostgreSQL versions of hooks (e.g., `use-outlet-data-postgres.ts`)
3. Test thoroughly after each migration
4. Once all components are migrated, remove the Supabase client

## Database Schema

Ensure your PostgreSQL database has the same schema as the Supabase database.
You might need to run migrations to create the necessary tables and indexes.
