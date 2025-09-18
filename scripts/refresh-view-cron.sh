#!/bin/bash

# ================================================
# Script de refresh automático da view materializada
# Configurar no cron para executar às 6h diariamente
# ================================================

# Configurações de conexão
export PGPASSWORD=kPnrGuFeJeuVprXzhhO2oLVE14f509KV
DB_HOST=147.93.15.121
DB_PORT=5434
DB_USER=sienge_app
DB_NAME=sienge_data

# Log file
LOG_FILE="/var/log/sienge/refresh_view_$(date +%Y%m%d).log"

echo "============================================" >> $LOG_FILE
echo "Iniciando refresh da view materializada - $(date)" >> $LOG_FILE
echo "============================================" >> $LOG_FILE

# Executar refresh
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME --set=sslmode=disable \
     -c "REFRESH MATERIALIZED VIEW CONCURRENTLY rpt_sienge_master_wide;" >> $LOG_FILE 2>&1

# Verificar resultado
if [ $? -eq 0 ]; then
    echo "✅ Refresh executado com sucesso - $(date)" >> $LOG_FILE

    # Verificar estatísticas
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME --set=sslmode=disable \
         -c "SELECT 'Total de registros: ' || COUNT(*) || ' em ' || NOW() FROM rpt_sienge_master_wide;" >> $LOG_FILE 2>&1
else
    echo "❌ Erro no refresh - $(date)" >> $LOG_FILE
fi

echo "============================================" >> $LOG_FILE

# Crontab entry (adicionar com: crontab -e):
# 0 6 * * * /path/to/refresh-view-cron.sh