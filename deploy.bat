@echo off
echo.
echo ===== Bryon Bowers Music Website Deployment =====
echo.

echo Step 1: Installing dependencies...
npm install --network-timeout 600000
if errorlevel 1 (
    echo Failed to install with npm, trying yarn...
    yarn install --network-timeout 600000
    if errorlevel 1 (
        echo Installation failed. Please check network connection.
        pause
        exit /b 1
    )
)

echo.
echo Step 2: Building the project...
npm run build
if errorlevel 1 (
    echo Build failed. Please check for errors.
    pause
    exit /b 1
)

echo.
echo Step 3: Deploying to Firebase Hosting...
firebase deploy --only hosting
if errorlevel 1 (
    echo Deployment failed. Please check Firebase configuration.
    pause
    exit /b 1
)

echo.
echo ===== Deployment Complete! =====
echo Your website is now live at: https://bryonbowersorg.web.app
echo Firebase Console: https://console.firebase.google.com/project/bryonbowersorg
echo.
pause