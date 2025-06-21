@echo off
REM Imposta la cartella radice
set ROOT=C:\Users\Loris\Progetti\Voting Platform

REM Crea le cartelle principali
mkdir "%ROOT%\frontend-ledwall\src\components"
mkdir "%ROOT%\frontend-ledwall\src\services"
mkdir "%ROOT%\frontend-ledwall\public"
mkdir "%ROOT%\frontend-pwa\src\components"
mkdir "%ROOT%\frontend-pwa\src\services"
mkdir "%ROOT%\frontend-pwa\public"
mkdir "%ROOT%\backend\src\controllers"
mkdir "%ROOT%\backend\src\middlewares"
mkdir "%ROOT%\backend\src\models"
mkdir "%ROOT%\backend\src\routes"
mkdir "%ROOT%\backend\src\services"
mkdir "%ROOT%\backend\src\utils"
mkdir "%ROOT%\backend\src\config"
mkdir "%ROOT%\backend\tests"

REM Crea i file nel frontend-ledwall
type nul > "%ROOT%\frontend-ledwall\src\components\BarChart.jsx"
type nul > "%ROOT%\frontend-ledwall\src\components\Timer.jsx"
type nul > "%ROOT%\frontend-ledwall\src\components\QRCodeDisplay.jsx"
type nul > "%ROOT%\frontend-ledwall\src\services\socket.js"
type nul > "%ROOT%\frontend-ledwall\src\App.jsx"
type nul > "%ROOT%\frontend-ledwall\src\index.js"
type nul > "%ROOT%\frontend-ledwall\package.json"
type nul > "%ROOT%\frontend-ledwall\tailwind.config.js"

REM Crea i file nel frontend-pwa
type nul > "%ROOT%\frontend-pwa\src\components\PlayerList.jsx"
type nul > "%ROOT%\frontend-pwa\src\components\VoteConfirmation.jsx"
type nul > "%ROOT%\frontend-pwa\src\components\Timer.jsx"
type nul > "%ROOT%\frontend-pwa\src\services\api.js"
type nul > "%ROOT%\frontend-pwa\src\services\socket.js"
type nul > "%ROOT%\frontend-pwa\src\services\deviceFingerprint.js"
type nul > "%ROOT%\frontend-pwa\src\App.jsx"
type nul > "%ROOT%\frontend-pwa\src\index.js"
type nul > "%ROOT%\frontend-pwa\public\manifest.json"
type nul > "%ROOT%\frontend-pwa\package.json"
type nul > "%ROOT%\frontend-pwa\tailwind.config.js"

REM Crea i file nel backend
type nul > "%ROOT%\backend\src\controllers\auth.controller.js"
type nul > "%ROOT%\backend\src\controllers\session.controller.js"
type nul > "%ROOT%\backend\src\controllers\vote.controller.js"
type nul > "%ROOT%\backend\src\middlewares\auth.middleware.js"
type nul > "%ROOT%\backend\src\middlewares\rateLimit.middleware.js"
type nul > "%ROOT%\backend\src\models\session.model.js"
type nul > "%ROOT%\backend\src\models\vote.model.js"
type nul > "%ROOT%\backend\src\models\user.model.js"
type nul > "%ROOT%\backend\src\routes\auth.routes.js"
type nul > "%ROOT%\backend\src\routes\session.routes.js"
type nul > "%ROOT%\backend\src\routes\vote.routes.js"
type nul > "%ROOT%\backend\src\services\socket.service.js"
type nul > "%ROOT%\backend\src\services\qrcode.service.js"
type nul > "%ROOT%\backend\src\services\firebase.service.js"
type nul > "%ROOT%\backend\src\utils\validation.js"
type nul > "%ROOT%\backend\src\config\database.js"
type nul > "%ROOT%\backend\src\app.js"
type nul > "%ROOT%\backend\server.js"
type nul > "%ROOT%\backend\.env.example"
type nul > "%ROOT%\backend\package.json"

REM Crea i file di root
type nul > "%ROOT%\docker-compose.yml"
type nul > "%ROOT%\.gitignore"
type nul > "%ROOT%\README.md"
type nul > "%ROOT%\lerna.json"

echo Struttura creata con successo!
pause
