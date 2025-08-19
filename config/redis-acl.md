# Redis ACL Configuration for Portfolio Site

## Minimal ACL Permission Set (From Redis Copilot)

Create a new user with these specific permissions:

```redis
ACL SETUSER portfolio_app on >your_secure_password_here ~* &* +ping +get +set +incr +del +exists +expire +ttl +scan -flushdb -flushall -config -keys
```

## How to Apply in Redis Cloud:

1. **Login to Redis Cloud Dashboard**
   - Go to your database settings
   - Navigate to "Security" → "Access Control"

2. **Create New User**
   - Username: `portfolio_app`
   - Password: Generate a strong 32+ character password
   - Permissions: Use the ACL rule above

3. **Update Connection String**
   ```bash
   # Old (using default user - INSECURE)
   REDIS_URL=redis://default:<password>@<host>:<port>
   
   # New (using restricted user - SECURE)
   REDIS_URL=redis://portfolio_app:<password>@<host>:<port>
   ```

## Keyspace Permissions Breakdown:

- **View Counting**: `+incr +get` on keys like `project:*:views`
- **Data Caching**: `+set +get +del +expire` on keys like `portfolio:*`
- **Health Checks**: `+ping` for connectivity verification

## Benefits:
✅ Cannot accidentally flush databases
✅ Cannot modify Redis configuration
✅ Limited to only necessary operations
✅ Follows principle of least privilege