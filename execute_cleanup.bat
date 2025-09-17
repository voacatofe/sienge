@echo off
echo Executando limpeza das tabelas nao utilizadas...
echo.

set PGPASSWORD=sienge_pwd

"C:\Program Files\PostgreSQL\17\bin\psql.exe" -h 147.93.15.121 -p 5434 -d sienge_data -U sienge_app -f cleanup_unused_tables.sql

echo.
echo Script executado. Verifique o output acima para confirmar sucesso.
pause