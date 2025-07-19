@echo off
cd /d "%~dp0"
echo Starting server...
nodemon app.js
pause