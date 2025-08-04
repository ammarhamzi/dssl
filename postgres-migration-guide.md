# MySQL to PostgreSQL Migration Guide

This document provides a complete guide for migrating from MySQL to PostgreSQL in the jBoilerplate application.

## What Has Changed

### 1. Package Dependencies
- **Removed**: `mysql2` package
- **Kept**: `pg` package (PostgreSQL driver)

### 2. Default Configuration
All configuration files have been updated to use PostgreSQL as the default database:

- `.env.example` - Updated with PostgreSQL defaults
- `knexfile.js` - Changed default client to 'pg'
- `src/lib/db/index.ts` - Updated database configuration
- `src/services/config/index.ts` - PostgreSQL defaults in config service

### 3. Docker Configuration
- `docker-compose.yml` - Updated to use PostgreSQL 16 image
- `docker-compose.app-only.yml` - Updated environment variables for PostgreSQL

### 4. Database Connection Details
- **Default Port**: Changed from 3306 (MySQL) to 5432 (PostgreSQL)
- **Default User**: Changed from 'root' to 'postgres'
- **SSL Configuration**: Updated for PostgreSQL compatibility

## Migration Steps

### Step 1: Install Dependencies
```bash
# Remove MySQL dependency and install PostgreSQL
pnpm remove mysql2
pnpm install pg @types/pg
```

### Step 2: Update Environment Variables
Update your `.env` file with PostgreSQL configuration:

```env
# Database Configuration
VITE_DB_CLIENT=pg
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_USER=postgres
VITE_DB_PASSWORD=your-password
VITE_DB_NAME=jboilerplate
VITE_DB_SSL=false

# Docker Configuration
DB_IMAGE=postgres:16
DB_PORT_FORWARD=5432
DB_PORT=5432
DB_CLIENT=pg
```

### Step 3: Set Up PostgreSQL Database

#### Option A: Using Docker
```bash
# Start PostgreSQL with Docker Compose
docker-compose --profile with-db up -d

# Or just the database service
docker run --name postgres-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your-password \
  -e POSTGRES_DB=jboilerplate \
  -p 5432:5432 \
  -d postgres:16
```

#### Option B: Local Installation
1. Install PostgreSQL on your system
2. Create a database and user:
```sql
CREATE DATABASE jboilerplate;
CREATE USER jboilerplate WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE jboilerplate TO jboilerplate;
```

### Step 4: Run Migrations
```bash
# Run database migrations
pnpm run migrate:latest

# Optional: Run seeds
pnpm run seed:run
```

### Step 5: Verify Connection
Start your application and verify the database connection works:
```bash
pnpm run dev
```

## Data Migration (If Coming from Existing MySQL Database)

If you have existing data in MySQL that you need to migrate:

### Option 1: Using pg_loader or similar tools
```bash
# Export from MySQL
mysqldump -u root -p jboilerplate > mysql_dump.sql

# Convert and import to PostgreSQL (manual process required)
# You'll need to adjust SQL syntax differences
```

### Option 2: Application-level migration
1. Keep both databases running temporarily
2. Write a migration script to read from MySQL and write to PostgreSQL
3. Handle data type conversions as needed

## Key Differences Between MySQL and PostgreSQL

### 1. Data Types
- **MySQL**: `VARCHAR(255)` → **PostgreSQL**: `VARCHAR(255)` (same)
- **MySQL**: `TEXT` → **PostgreSQL**: `TEXT` (same)
- **MySQL**: `JSON` → **PostgreSQL**: `JSONB` (more efficient)
- **MySQL**: `DATETIME` → **PostgreSQL**: `TIMESTAMP`

### 2. UUID Generation
- **MySQL**: `UUID()` function
- **PostgreSQL**: `uuid-ossp` extension with `uuid_generate_v4()`

### 3. SQL Syntax
- **Case Sensitivity**: PostgreSQL is case-sensitive for identifiers
- **Quotes**: PostgreSQL uses double quotes for identifiers, single quotes for strings
- **Limit/Offset**: Both support similar syntax

## Configuration Options

### SSL Configuration
For production environments, enable SSL:
```env
VITE_DB_SSL=true
```

### Connection Pooling
The application is configured with connection pooling:
- **Min connections**: 2
- **Max connections**: 10

### Performance Tuning
Consider these PostgreSQL settings for better performance:
```sql
-- In postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

## Troubleshooting

### Common Issues

1. **Connection refused**
   - Ensure PostgreSQL is running
   - Check port and host configuration
   - Verify firewall settings

2. **Authentication failed**
   - Check username and password
   - Verify user permissions
   - Check pg_hba.conf for authentication methods

3. **Database doesn't exist**
   - Create the database first
   - Run migrations after database creation

4. **Migration errors**
   - Check for syntax differences between MySQL and PostgreSQL
   - Ensure uuid-ossp extension is installed

### Checking PostgreSQL Status
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Connect to PostgreSQL
psql -U postgres -d jboilerplate

# List databases
\l

# List tables
\dt
```

## Benefits of PostgreSQL

1. **No Licensing Issues**: Completely open source
2. **Better JSON Support**: Native JSONB type with indexing
3. **Advanced Features**: Window functions, CTEs, full-text search
4. **Better Concurrency**: MVCC for better performance
5. **Extensibility**: Rich ecosystem of extensions
6. **Standards Compliance**: Better SQL standard compliance

## Rollback Plan

If you need to rollback to MySQL:

1. Restore the original configuration files
2. Reinstall mysql2: `pnpm install mysql2`
3. Update environment variables back to MySQL settings
4. Restore your MySQL database backup

## Next Steps

1. Test all application functionality
2. Update any custom SQL queries for PostgreSQL syntax
3. Consider using PostgreSQL-specific features like JSONB
4. Set up proper backup strategies for PostgreSQL
5. Monitor performance and optimize as needed