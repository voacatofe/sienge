@echo off
REM Script para conectar ao PostgreSQL de produção
REM Uso: connect_prod.bat [comando SQL opcional]

set PSQL_PATH="C:\Program Files\PostgreSQL\17\bin\psql.exe"
set DB_HOST=147.93.15.121
set DB_PORT=5434
set DB_NAME=sienge_data
set DB_USER=sienge_app

if "%~1"=="" (
    echo Conectando ao banco de produção...
    %PSQL_PATH% -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME%
) else (
    echo Executando comando SQL...
    %PSQL_PATH% -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "%~1"
)