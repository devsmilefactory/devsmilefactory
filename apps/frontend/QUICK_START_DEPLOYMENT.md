# Quick Start - Apache Deployment

**Status:** ✅ READY
**Time to Deploy:** ~15 minutes

---

## 🚀 Quick Start (5 Steps)

### Step 1: Build the Application

**On Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**On Windows:**
```bash
deploy.bat
```

**What it does:**
- Cleans previous build
- Installs dependencies
- Builds the application
- Verifies output

---

### Step 2: Upload to Apache

**Using SCP (Linux/Mac):**
```bash
scp -r dist/* user@your-server.com:/var/www/html/
scp .htaccess user@your-server.com:/var/www/html/
```

**Using FTP (Windows):**
1. Open FTP client
2. Connect to your server
3. Upload all files from `dist/` to document root
4. Upload `.htaccess` to document root

---

### Step 3: Enable mod_rewrite

**SSH into your server:**
```bash
ssh user@your-server.com
```

**Enable mod_rewrite:**
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

---

### Step 4: Verify Apache Configuration

**Check configuration:**
```bash
sudo apache2ctl configtest
```

**Should output:** `Syntax OK`

---

### Step 5: Test the Deployment

**Test 1: Basic Access**
```
Open: https://your-domain.com
Expected: Landing page loads
```

**Test 2: Page Refresh**
```
1. Navigate to: https://your-domain.com/feed
2. Press F5 (refresh)
3. Expected: Page loads (not 404)
```

**Test 3: Direct URL**
```
1. Open new tab
2. Type: https://your-domain.com/profiles
3. Expected: Page loads correctly
```

---

## ✅ Verification Checklist

- [ ] Build completed without errors
- [ ] Files uploaded to Apache
- [ ] `.htaccess` in document root
- [ ] `mod_rewrite` enabled
- [ ] Apache restarted
- [ ] Landing page loads
- [ ] Page refresh works on `/feed`
- [ ] Direct URL access works on `/profiles`
- [ ] No 404 errors in console

---

## 🐛 Quick Troubleshooting

### 404 on Page Refresh?

```bash
# Check mod_rewrite is enabled
apache2ctl -M | grep rewrite

# Check .htaccess permissions
ls -la /var/www/html/.htaccess

# Check Apache error log
tail -f /var/log/apache2/error.log
```

### CSS/JS Not Loading?

1. Check browser console (F12)
2. Look for 404 errors
3. Verify files in `dist/assets/`
4. Check file permissions

### Still Having Issues?

See: `APACHE_DEPLOYMENT_GUIDE.md` for detailed troubleshooting

---

## 📁 File Structure

After deployment, your Apache document root should look like:

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

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `.htaccess` | Routes all requests to index.html |
| `dist/index.html` | Main entry point |
| `dist/assets/` | JavaScript, CSS, images |
| `deploy.sh` | Build script (Linux/Mac) |
| `deploy.bat` | Build script (Windows) |

---

## 📊 What Gets Built

```
npm run build
    ↓
Creates dist/ folder with:
    ├── index.html (main entry)
    ├── assets/
    │   ├── JavaScript bundles
    │   ├── CSS files
    │   └── Images
    └── Static files
```

---

## 🔄 How Routing Works

```
User visits: https://domain.com/feed
    ↓
Apache checks: Does /feed exist? NO
    ↓
Apache rewrites to: /index.html
    ↓
Browser loads: index.html
    ↓
React Router reads URL: /feed
    ↓
React renders: Feed component
    ↓
Page refresh works! ✅
```

---

## 📞 Need Help?

1. **Build Issues:** Check `npm run build` output
2. **Upload Issues:** Verify FTP/SCP connection
3. **Routing Issues:** Check `.htaccess` and `mod_rewrite`
4. **Asset Issues:** Check browser console (F12)
5. **Server Issues:** Check Apache error logs

---

## 📚 Full Documentation

- **Detailed Guide:** `APACHE_DEPLOYMENT_GUIDE.md`
- **Full Checklist:** `DEPLOYMENT_CHECKLIST.md`
- **Build Config:** `vite.config.ts`

---

## ⏱️ Typical Timeline

| Step | Time |
|------|------|
| Build | 2-3 min |
| Upload | 2-5 min |
| Configure | 2-3 min |
| Test | 2-3 min |
| **Total** | **~10-15 min** |

---

## 🎉 Success!

Once all tests pass, your application is live on Apache with:
- ✅ Working routes on page refresh
- ✅ Proper caching headers
- ✅ Gzip compression
- ✅ Security headers
- ✅ Optimized performance

---

**Status:** ✅ READY FOR DEPLOYMENT
**Last Updated:** October 17, 2025

