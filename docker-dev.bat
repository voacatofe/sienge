@echo off
REM Script para gerenciar Docker Compose em ambiente de desenvolvimento
REM Sempre usa o arquivo docker-compose-dev.yml

setlocal enabledelayedexpansion

set "COMPOSE_FILE=docker-compose-dev.yml"

REM Verifica se o arquivo docker-compose-dev.yml existe
if not exist "%COMPOSE_FILE%" (
    echo ❌ Arquivo %COMPOSE_FILE% não encontrado!
    exit /b 1
)

REM Define o comando padrão
set "COMMAND=up"
set "SERVICE="
set "BUILD_FLAG="
set "DETACH_FLAG=-d"
set "VOLUMES_FLAG="

REM Processa argumentos
:parse_args
if "%~1"=="" goto :execute
if /i "%~1"=="up" set "COMMAND=up" & shift & goto :parse_args
if /i "%~1"=="down" set "COMMAND=down" & shift & goto :parse_args
if /i "%~1"=="build" set "COMMAND=build" & shift & goto :parse_args
if /i "%~1"=="restart" set "COMMAND=restart" & shift & goto :parse_args
if /i "%~1"=="logs" set "COMMAND=logs" & shift & goto :parse_args
if /i "%~1"=="ps" set "COMMAND=ps" & shift & goto :parse_args
if /i "%~1"=="exec" set "COMMAND=exec" & shift & goto :parse_args
if /i "%~1"=="db" set "COMMAND=db" & shift & goto :parse_args
if /i "%~1"=="adminer" set "COMMAND=db" & shift & goto :parse_args
if /i "%~1"=="--build" set "BUILD_FLAG=--build" & shift & goto :parse_args
if /i "%~1"=="--detach" set "DETACH_FLAG=-d" & shift & goto :parse_args
if /i "%~1"=="--volumes" set "VOLUMES_FLAG=-v" & shift & goto :parse_args
if /i "%~1"=="--help" goto :show_help
if /i "%~1"=="-h" goto :show_help
if /i "%~1"=="-?" goto :show_help

REM Se não é um comando conhecido, assume que é o nome do serviço
if "%SERVICE%"=="" (
    set "SERVICE=%~1"
) else (
    set "SERVICE=%SERVICE% %~1"
)
shift
goto :parse_args

:show_help
echo 🐳 Docker Compose Development Helper
echo.
echo Uso: docker-dev.bat [COMANDO] [SERVIÇO] [OPÇÕES]
echo.
echo Comandos disponíveis:
echo   up        - Inicia os serviços (padrão)
echo   down      - Para e remove os serviços
echo   build     - Constrói as imagens
echo   restart   - Reinicia os serviços
echo   logs      - Mostra os logs
echo   ps        - Lista os containers
echo   exec      - Executa comando no container
echo   db        - Abre Adminer (interface web do banco)
echo   adminer   - Alias para db
echo.
echo Opções:
echo   --build   - Força rebuild das imagens
echo   --detach  - Executa em background
echo   --volumes - Remove volumes ao fazer down
echo.
echo Exemplos:
echo   docker-dev.bat                    # Inicia tudo
echo   docker-dev.bat up --build         # Inicia com rebuild
echo   docker-dev.bat down --volumes     # Para e remove volumes
echo   docker-dev.bat logs app           # Logs da aplicação
echo   docker-dev.bat exec app sh        # Shell na aplicação
echo   docker-dev.bat db                 # Abre Adminer
exit /b 0

:execute
echo ⚡ Executando docker-compose com arquivo: %COMPOSE_FILE%

REM Constrói o comando baseado no comando selecionado
set "COMPOSE_CMD=docker-compose -f %COMPOSE_FILE%"

if "%COMMAND%"=="up" (
    echo 🚀 Iniciando ambiente de desenvolvimento...
    if not "%BUILD_FLAG%"=="" echo 🔨 Rebuild habilitado
    %COMPOSE_CMD% up %BUILD_FLAG% %DETACH_FLAG% %SERVICE%
    if !errorlevel! equ 0 (
        echo.
        echo 🎉 Ambiente de desenvolvimento iniciado!
        echo 📋 Serviços disponíveis:
        echo   🌐 Aplicação: http://localhost:3000
        echo   🗄️  Adminer: http://localhost:8080
        echo   📊 Banco: localhost:5433
        echo.
        echo 📝 Comandos úteis:
        echo   docker-dev.bat logs app    # Ver logs da aplicação
        echo   docker-dev.bat exec app sh # Shell na aplicação
        echo   docker-dev.bat db          # Abrir Adminer
        echo   docker-dev.bat down        # Parar tudo
    )
) else if "%COMMAND%"=="down" (
    echo 🛑 Parando ambiente de desenvolvimento...
    if not "%VOLUMES_FLAG%"=="" echo 🗑️  Removendo volumes...
    %COMPOSE_CMD% down %VOLUMES_FLAG%
) else if "%COMMAND%"=="build" (
    echo 🔨 Construindo imagens...
    %COMPOSE_CMD% build %SERVICE%
) else if "%COMMAND%"=="restart" (
    echo 🔄 Reiniciando serviços...
    %COMPOSE_CMD% restart %SERVICE%
) else if "%COMMAND%"=="logs" (
    echo 📋 Mostrando logs...
    %COMPOSE_CMD% logs -f %SERVICE%
) else if "%COMMAND%"=="ps" (
    echo 📊 Status dos containers...
    %COMPOSE_CMD% ps
) else if "%COMMAND%"=="exec" (
    if "%SERVICE%"=="" (
        echo ❌ Especifique o serviço para exec. Ex: docker-dev.bat exec app sh
        exit /b 1
    )
    echo 🔧 Executando comando no serviço: %SERVICE%
    %COMPOSE_CMD% exec %SERVICE% sh
) else if "%COMMAND%"=="db" (
    echo 🌐 Abrindo Adminer...
    echo 📋 Credenciais do banco:
    echo   Servidor: db
    echo   Usuário: sienge_dev
    echo   Senha: dev_password
    echo   Banco: sienge_dev
    echo.
    echo 🔗 Acesse: http://localhost:8080
    start http://localhost:8080
    exit /b 0
) else (
    echo ❌ Comando não reconhecido: %COMMAND%
    goto :show_help
)

if !errorlevel! equ 0 (
    echo ✅ Comando executado com sucesso!
) else (
    echo ❌ Erro na execução do comando!
)

endlocal
