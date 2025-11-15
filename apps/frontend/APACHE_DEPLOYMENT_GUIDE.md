# Apache Deployment Guide - Smile Factory

**Status:** ✅ READY FOR DEPLOYMENT
**Date:** October 17, 2025

---

## 🎯 Overview

This guide explains how to build and deploy the Smile Factory application on Apache with proper routing configuration for single-page application (SPA) functionality.

---

## 📋 Prerequisites

- Apache 2.4+ with `mod_rewrite` enabled
- Node.js 16+ and npm
- SSH/FTP access to your Apache server

---

## 🔧 Build Process

### Step 1: Build the Application

```bash
npm run build
```

This creates a `dist` folder with all compiled files:
- `index.html` - Main entry point
- `assets/` - JavaScript, CSS, and other assets
- Static files from `public/` folder

### Step 2: Verify Build Output

```bash
ls -la dist/
```

You should see:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── favicon.ico
```

---

## 📤 Deployment Steps

### Step 1: Upload Files to Apache

Upload the contents of the `dist` folder to your Apache document root:

```bash
# Using SCP
scp -r dist/* user@your-server.com:/var/www/html/

# Or using FTP
# Upload all files from dist/ to your web root
```

### Step 2: Verify .htaccess File

Ensure `.htaccess` file is in the root directory of your Apache installation:

```bash
# Check if .htaccess exists
ls -la /var/www/html/.htaccess

# If not, copy it
cp .htaccess /var/www/html/
```

### Step 3: Enable mod_rewrite

Ensure Apache's `mod_rewrite` module is enabled:

```bash
# Enable mod_rewrite
sudo a2enmod rewrite

# Restart Apache
sudo systemctl restart apache2
```

### Step 4: Configure Apache VirtualHost

Edit your Apache VirtualHost configuration:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    
    DocumentRoot /var/www/html
    
    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Enable gzip compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
    </IfModule>
    
    # Set proper headers
    <IfModule mod_headers.c>
        Header set X-UA-Compatible "IE=edge"
        Header set X-Content-Type-Options "nosniff"
    </IfModule>
    
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

### Step 5: Enable the VirtualHost

```bash
# Enable the site
sudo a2ensite your-domain.com

# Test Apache configuration
sudo apache2ctl configtest

# Restart Apache
sudo systemctl restart apache2
```

---

## 🔄 How Routing Works

### .htaccess Configuration

The `.htaccess` file handles all routing:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Rewrite all requests to index.html
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

**How it works:**
1. User requests `/feed` or `/profiles`
2. Apache checks if the file/directory exists
3. If not, it rewrites the request to `index.html`
4. React Router handles the routing in the browser
5. Page refresh works because the request is always served `index.html`

### Example Flow

```
User navigates to: /profile/profile-2
    ↓
Apache checks: Does /profile/profile-2 exist? NO
    ↓
Apache rewrites to: /index.html
    ↓
Browser loads: index.html with React app
    ↓
React Router reads URL: /profile/profile-2
    ↓
React renders: SingleProfileView component
    ↓
Page refresh works! ✅
```

---

## ✅ Testing Deployment

### Test 1: Basic Navigation

1. Open your domain: `https://your-domain.com`
2. Navigate to different pages
3. Verify pages load correctly

### Test 2: Page Refresh

1. Navigate to: `https://your-domain.com/feed`
2. Press F5 or Ctrl+R to refresh
3. Page should load correctly (not 404)

### Test 3: Direct URL Access

1. Open new tab
2. Type: `https://your-domain.com/profiles`
3. Page should load correctly

### Test 4: Browser Back/Forward

1. Navigate through multiple pages
2. Use browser back/forward buttons
3. All navigation should work

---

## 🐛 Troubleshooting

### Issue: 404 Error on Page Refresh

**Solution:**
1. Verify `.htaccess` is in document root
2. Check `mod_rewrite` is enabled: `apache2ctl -M | grep rewrite`
3. Verify `AllowOverride All` in VirtualHost
4. Check Apache error logs: `tail -f /var/apache2/error.log`

### Issue: CSS/JS Not Loading

**Solution:**
1. Check file paths in `dist/index.html`
2. Verify assets are in `dist/assets/`
3. Check browser console for 404 errors
4. Verify correct base path in Vite config

### Issue: Images Not Loading

**Solution:**
1. Verify image paths are relative
2. Check `public/` folder is copied to `dist/`
3. Verify image files exist in `dist/`

### Issue: CORS Errors

**Solution:**
Add to `.htaccess`:
```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>
```

---

## 📊 Performance Optimization

### Enable Gzip Compression

Already configured in `.htaccess`:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

### Set Cache Headers

Already configured in `.htaccess`:
- Static assets: 1 year cache
- HTML: No cache (always fresh)

### Monitor Performance

```bash
# Check Apache status
sudo systemctl status apache2

# View access logs
tail -f /var/log/apache2/access.log

# View error logs
tail -f /var/log/apache2/error.log
```

---

## 🔐 Security Considerations

### Protect Sensitive Files

Add to `.htaccess`:
```apache
<FilesMatch "^\.">
    Deny from all
</FilesMatch>
```

### Set Security Headers

Already configured in `.htaccess`:
```apache
Header set X-UA-Compatible "IE=edge"
Header set X-Content-Type-Options "nosniff"
```

### Enable HTTPS

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-apache

# Get SSL certificate
sudo certbot --apache -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## 📁 File Structure

```
/var/www/html/
├── .htaccess              ← Routing configuration
├── index.html             ← Main entry point
├── favicon.ico
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── [other static files]
```

---

## 🚀 Deployment Checklist

- [ ] Run `npm run build`
- [ ] Verify `dist/` folder created
- [ ] Copy `.htaccess` to document root
- [ ] Upload `dist/` contents to Apache
- [ ] Enable `mod_rewrite`
- [ ] Configure VirtualHost
- [ ] Test page refresh on `/feed`
- [ ] Test page refresh on `/profiles`
- [ ] Test page refresh on `/profile/profile-2`
- [ ] Verify CSS/JS loading
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Enable HTTPS
- [ ] Monitor error logs

---

## 📞 Support

If you encounter issues:

1. Check Apache error logs: `/var/log/apache2/error.log`
2. Verify `.htaccess` syntax
3. Ensure `mod_rewrite` is enabled
4. Check file permissions: `chmod 644 .htaccess`
5. Verify document root path

---

## 🎓 Additional Resources

- [Apache mod_rewrite Documentation](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)
- [React Router Deployment](https://reactrouter.com/en/main/guides/deployment)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Status:** ✅ READY FOR DEPLOYMENT
**Last Updated:** October 17, 2025

