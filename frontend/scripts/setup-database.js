#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up API Token Database...\n');

const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250821170000_add_user_api_tokens.sql');

if (!fs.existsSync(migrationPath)) {
  console.error('❌ Migration file not found!');
  process.exit(1);
}

const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

console.log('📋 Copy the following SQL and run it in your Supabase SQL Editor:\n');
console.log('=' .repeat(80));
console.log(migrationSQL);
console.log('=' .repeat(80));
console.log('\n✅ After running this SQL, your API token functionality will be ready!');
console.log('\n🔗 Supabase Dashboard: https://supabase.com/dashboard/project/miokhailhdjutkcygxgg');