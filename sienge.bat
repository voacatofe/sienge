@echo off
REM Script principal para gerenciar o projeto Sienge
REM Use start-prod.bat ou start-dev.bat para ambientes específicos

if "%1"=="prod" (
    echo Iniciando ambiente de PRODUÇÃO...
    bash scripts/start-prod.sh %2 %3
) else if "%1"=="dev" (
    echo Iniciando ambiente de DESENVOLVIMENTO...
    bash scripts/start-dev.sh %2 %3
) else (
    echo.
    echo 🚀 Sienge - Gerenciador Unificado
    echo =================================
    echo.
    echo 📋 Comandos Disponíveis:
    echo.
    echo 🏭 Produção:
    echo   prod start              - Iniciar ambiente de produção
    echo   prod stop               - Parar ambiente de produção
    echo   prod logs               - Visualizar logs de produção
    echo   prod backup             - Backup do banco de produção
    echo.
    echo 🛠️  Desenvolvimento:
    echo   dev start               - Iniciar ambiente de desenvolvimento
    echo   dev stop                - Parar ambiente de desenvolvimento
    echo   dev logs                - Visualizar logs de desenvolvimento
    echo   dev backup              - Backup do banco de desenvolvimento
    echo.
    echo 💡 Exemplos de uso:
    echo   sienge.bat prod start           # Iniciar produção
    echo   sienge.bat dev start            # Iniciar desenvolvimento
    echo   sienge.bat prod backup          # Backup produção
    echo.
    echo ⚠️  ATENÇÃO: Use scripts específicos para melhor controle:
    echo   start-prod.bat                  # Script direto para produção
    echo   start-dev.bat                   # Script direto para desenvolvimento
    echo.
)
