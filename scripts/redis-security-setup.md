# Redis Security Setup Guide

## ⚠️ Security Issue Found
Your Redis Cloud instance currently allows dangerous commands like FLUSHDB and FLUSHALL.

## Recommended Actions:

### 1. Contact Redis Cloud Support
Request to disable these dangerous commands:
- FLUSHDB
- FLUSHALL  
- CONFIG (write operations)
- KEYS (use SCAN instead)

### 2. Create Application-Specific User (Redis ACL)
Instead of using the default user, create a limited user:

```redis
ACL SETUSER portfolio_app on >your_password_here ~* &* -flushdb -flushall -config +get +set +incr +del +exists +expire +ttl +ping +info +scan
```

This user can:
- ✅ Read/write data (get, set, incr, del)
- ✅ Manage TTL (expire, ttl)
- ✅ Check connection (ping, info)
- ❌ Cannot flush databases
- ❌ Cannot change config

### 3. Update Your Connection String
Change from:
```
redis://default:password@host:port
```

To:
```
redis://portfolio_app:new_password@host:port
```

### 4. For Redis Cloud Dashboard:
1. Go to your database settings
2. Look for "Security" or "ACL" section
3. Create new user with limited permissions
4. Update your app to use new credentials

### 5. Testing Commands Are Restricted:
```bash
# Test that dangerous commands are blocked
redis-cli -u $REDIS_URL eval "return redis.call('FLUSHDB')" 0
# Should return: ERR User does not have permissions
```

## Additional Security Best Practices:

1. **Enable TLS/SSL** (use `rediss://` instead of `redis://`)
2. **Set up IP allowlisting** in Redis Cloud
3. **Enable audit logging** if available
4. **Regular backups** before any deployments
5. **Monitor for suspicious activity**

## Environment Variables to Add:
```bash
# GitHub Secrets
REDIS_URL=redis://portfolio_app:secure_password@host:port
REDIS_READ_ONLY_URL=redis://readonly_user:password@host:port  # For analytics
```