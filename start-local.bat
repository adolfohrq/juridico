@echo off
echo ========================================
echo   SIGAJ - Sistema Integrado de Gestao
echo   Iniciando servidores locais...
echo ========================================
echo.

REM Matar processos antigos nas portas (se existirem)
echo Limpando portas antigas...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3005') do taskkill /F /PID %%a >nul 2>&1
timeout /t 1 /nobreak >nul

REM Abrir backend em nova janela
echo [1/2] Iniciando BACKEND (porta 3000)...
start "SIGAJ - Backend (http://localhost:3000)" cmd /k "cd backend && npm run dev"
echo Aguardando backend iniciar...
timeout /t 5 /nobreak >nul

REM Abrir frontend em nova janela
echo [2/2] Iniciando FRONTEND (porta 3005)...
start "SIGAJ - Frontend (http://localhost:3005)" cmd /k "npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   Servidores iniciados!
echo ========================================
echo.
echo   Backend:  http://localhost:3000/api/health
echo   Frontend: http://localhost:3005
echo.
echo   Credenciais de teste:
echo   Email:    diretor@sigaj.com
echo   Senha:    senha123
echo.
echo ========================================
echo.
echo Pressione qualquer tecla para abrir o navegador...
pause >nul

REM Abrir navegador
start http://localhost:3005

echo.
echo Para parar os servidores, feche as janelas do terminal.
echo.
