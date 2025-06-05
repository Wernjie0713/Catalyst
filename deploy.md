# Catalyst Deployment Checklist

## Pre-Deployment Steps

### 1. Environment Configuration
- [ ] Update `.env` file with production settings:
  - [ ] `APP_ENV=production`
  - [ ] `APP_DEBUG=false`
  - [ ] `APP_URL=https://your-actual-domain.com`
  - [ ] `LOG_LEVEL=error`
  - [ ] Update database credentials
  - [ ] `MAIL_PORT=587` and `MAIL_ENCRYPTION=tls` for Mailjet production
  - [ ] `MAIL_VERIFY_PEER=true`

### 2. Database Setup
- [ ] Create production database: `catalyst_production`
- [ ] Update database credentials in `.env`
- [ ] Test database connection

### 3. Build Assets
```bash
npm install
npm run build
```

## Deployment Commands

### 1. Upload Files
Upload your project files to the server (excluding `.env`, `node_modules`, `vendor`)

### 2. Server Setup Commands
```bash
# Install dependencies
composer install --optimize-autoloader --no-dev

# Generate application key (if needed)
php artisan key:generate

# Run migrations
php artisan migrate --force

# Seed initial data (only if needed)
php artisan db:seed --force

# Cache configuration for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Link storage
php artisan storage:link

# Set proper permissions
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

### 3. Queue Worker Setup (Important for Email Notifications)
Since notifications use queues, you need to set up a queue worker:

#### Option A: Supervisor (Recommended)
Create `/etc/supervisor/conf.d/catalyst-worker.conf`:
```ini
[program:catalyst-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/your/project/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
directory=/path/to/your/project
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/path/to/your/project/storage/logs/worker.log
stopwaitsecs=3600
```

Then run:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start catalyst-worker:*
```

#### Option B: Cron Job (Alternative)
Add to crontab:
```
* * * * * cd /path/to/your/project && php artisan schedule:run >> /dev/null 2>&1
*/5 * * * * cd /path/to/your/project && php artisan queue:work --stop-when-empty
```

### 4. Web Server Configuration

#### Nginx Example
```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name your-domain.com;
    root /path/to/your/project/public;

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## Post-Deployment Verification

### 1. Test Email Functionality
```bash
# Run email test command
php artisan test:friend-email

# Check queue is working
php artisan queue:work --once
```

### 2. Test Application Features
- [ ] User registration/login
- [ ] Friend request sending
- [ ] Friend request acceptance
- [ ] Email notifications received
- [ ] All major features working

### 3. Monitor Logs
```bash
# Check Laravel logs
tail -f storage/logs/laravel.log

# Check queue worker logs
tail -f storage/logs/worker.log
```

## Security Checklist
- [ ] SSL Certificate installed and working
- [ ] `.env` file has proper permissions (600)
- [ ] Remove any test/debug routes
- [ ] Rate limiting configured
- [ ] CSRF protection enabled
- [ ] SQL injection protection (Eloquent ORM)

## Performance Optimization
- [ ] Config cached (`php artisan config:cache`)
- [ ] Routes cached (`php artisan route:cache`)
- [ ] Views cached (`php artisan view:cache`)
- [ ] OPcache enabled
- [ ] Database indexes optimized

## Backup Setup
- [ ] Database backup schedule
- [ ] File backup schedule
- [ ] .env file backup (secure location)

## Environment Variables to Update
Make sure to update these in your production `.env`:

```env
APP_URL=https://your-actual-domain.com
DB_DATABASE=catalyst_production
DB_USERNAME=your_production_db_user
DB_PASSWORD=your_production_db_password
```

## Testing Commands After Deployment

```bash
# Test database connection
php artisan tinker --execute="DB::connection()->getPdo();"

# Test email configuration
php artisan test:friend-email

# Check migrations status
php artisan migrate:status

# Monitor queue
php artisan queue:monitor
``` 