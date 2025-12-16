@echo off
setlocal

echo Starting API server on http://localhost:5175 ...
start "API" cmd /k "npm run dev:api"

echo Starting Web (Vite) server ...
start "WEB" cmd /k "npm run dev"

echo.
echo Both servers started.
echo API: http://localhost:5175
echo Web: check the WEB terminal output for the Vite URL (usually http://localhost:5173)
echo.
endlocal
