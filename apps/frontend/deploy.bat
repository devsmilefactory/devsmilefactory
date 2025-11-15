@echo off
REM Smile Factory - Apache Deployment Script (Windows)
REM This script builds and prepares the application for Apache deployment

setlocal enabledelayedexpansion

echo.
echo ================================
echo Smile Factory - Build ^& Deploy
echo ================================
echo.

REM Step 1: Clean previous build
echo Step 1: Cleaning previous build...
if exist dist (
    rmdir /s /q dist
    echo [OK] Build directory cleaned
) else (
    echo [OK] No previous build found
)
echo.

REM Step 2: Install dependencies
echo Step 2: Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Step 3: Build the application
echo Step 3: Building application...
call npm run build
if errorlevel 1 (
    echo [ERROR] Build failed
    exit /b 1
)
echo [OK] Application built successfully
echo.

REM Step 4: Verify build output
echo Step 4: Verifying build output...
if exist dist\index.html (
    echo [OK] index.html found
) else (
    echo [ERROR] index.html not found
    exit /b 1
)

if exist dist\assets (
    echo [OK] assets directory found
) else (
    echo [ERROR] assets directory not found
    exit /b 1
)
echo.

REM Step 5: Verify .htaccess
echo Step 5: Verifying .htaccess...
if exist .htaccess (
    echo [OK] .htaccess found
) else (
    echo [ERROR] .htaccess not found
    exit /b 1
)
echo.

REM Step 6: Display build summary
echo Step 6: Build Summary
echo ================================
echo Build Directory: dist\
echo.
echo Files in dist\:
for /f %%A in ('dir /b /s dist | find /c /v ""') do echo %%A files
echo.
echo Main files:
dir dist\index.html
echo.
dir dist\assets | findstr /v "^$"
echo.

REM Step 7: Deployment instructions
echo.
echo ================================
echo [OK] Build Complete!
echo ================================
echo.
echo Next steps for Apache deployment:
echo.
echo 1. Upload files to Apache:
echo    - Copy all files from dist\ to your Apache document root
echo    - Example: C:\Apache24\htdocs\
echo.
echo 2. Copy .htaccess to document root:
echo    - Copy .htaccess to your Apache document root
echo.
echo 3. Enable mod_rewrite in Apache:
echo    - Edit httpd.conf
echo    - Uncomment: LoadModule rewrite_module modules/mod_rewrite.so
echo    - Restart Apache
echo.
echo 4. Configure VirtualHost:
echo    - Set AllowOverride All in your VirtualHost
echo    - Restart Apache
echo.
echo 5. Test the deployment:
echo    - Open: http://localhost or your domain
echo    - Navigate to: http://localhost/feed
echo    - Refresh page (F5) - should work without 404
echo.
echo For detailed instructions, see: APACHE_DEPLOYMENT_GUIDE.md
echo.
pause

