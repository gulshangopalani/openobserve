@echo off
setlocal

REM ----------------------------
REM CONFIGURATION SECTION
set OPENOBSERVE_DIR=C:\path\to\your\openobserve
set USER=root@example.com
set PASS=Complexpass#123
set URL=http://localhost:5080/api/default/default/_json
REM ----------------------------

echo 🚀 Starting Docker Desktop...
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

REM Wait for Docker to be ready
:WAIT_DOCKER
echo ⏳ Waiting for Docker to start...
docker info >nul 2>&1
if errorlevel 1 (
    timeout /t 5 >nul
    goto WAIT_DOCKER
)
echo ✅ Docker is running!

REM Navigate to your OpenObserve project folder
cd /d "%OPENOBSERVE_DIR%"

echo 📦 Launching OpenObserve via Docker Compose...
docker-compose up -d

echo ⏳ Waiting 20 seconds for OpenObserve to fully initialize...
timeout /t 20

REM Download and ingest sample data
echo ⬇️ Downloading sample data...
curl -L https://zinc-public-data.s3.us-west-2.amazonaws.com/zinc-enl/sample-k8s-logs/k8slog_json.json.zip -o k8slog_json.json.zip

echo 📦 Unzipping sample log file...
powershell -Command "Expand-Archive -Force 'k8slog_json.json.zip' ."

echo 📤 Ingesting data into OpenObserve...
curl %URL% -i -u "%USER%:%PASS%" -H "Content-Type: application/json" -d "@k8slog_json.json"

echo ✅ All set! OpenObserve is ready at: http://localhost:5080
pause