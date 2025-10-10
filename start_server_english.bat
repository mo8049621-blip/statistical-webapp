@echo off
REM Simple English version server starter

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
echo Error: Node.js is not installed.
echo Please install Node.js first.
pause
exit /b 1
)

REM Start the development server
echo Starting development server...
echo Please wait a few seconds...
npm run dev

REM Keep window open
pause