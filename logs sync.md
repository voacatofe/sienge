db      | 2025-09-15 11:04:52.695 | The files belonging to this database system will be owned by user "postgres".
db      | 2025-09-15 11:04:52.695 | This user must also own the server process.
db      | 2025-09-15 11:04:52.695 | 
db      | 2025-09-15 11:04:52.695 | The database cluster will be initialized with locale "en_US.utf8".
db      | 2025-09-15 11:04:52.695 | The default database encoding has accordingly been set to "UTF8".
db      | 2025-09-15 11:04:52.695 | The default text search configuration will be set to "english".
db      | 2025-09-15 11:04:52.695 | 
db      | 2025-09-15 11:04:52.695 | Data page checksums are disabled.
db      | 2025-09-15 11:04:52.695 | 
db      | 2025-09-15 11:04:52.695 | fixing permissions on existing directory /var/lib/postgresql/data ... ok
db      | 2025-09-15 11:04:52.699 | creating subdirectories ... ok
db      | 2025-09-15 11:04:52.699 | selecting dynamic shared memory implementation ... posix
db      | 2025-09-15 11:04:52.718 | selecting default max_connections ... 100
db      | 2025-09-15 11:04:52.771 | selecting default shared_buffers ... 128MB
db      | 2025-09-15 11:04:52.900 | selecting default time zone ... UTC
db      | 2025-09-15 11:04:52.902 | creating configuration files ... ok
db      | 2025-09-15 11:04:53.172 | running bootstrap script ... ok
db      | 2025-09-15 11:04:54.468 | sh: locale: not found
db      | 2025-09-15 11:04:54.468 | 2025-09-15 14:04:54.468 UTC [35] WARNING:  no usable system locales were found
db      | 2025-09-15 11:04:56.858 | performing post-bootstrap initialization ... ok
db      | 2025-09-15 11:04:57.087 | syncing data to disk ... ok
db      | 2025-09-15 11:04:57.087 | 
db      | 2025-09-15 11:04:57.087 | 
db      | 2025-09-15 11:04:57.087 | Success. You can now start the database server using:
db      | 2025-09-15 11:04:57.087 | 
db      | 2025-09-15 11:04:57.087 |     pg_ctl -D /var/lib/postgresql/data -l logfile start
db      | 2025-09-15 11:04:57.087 | 
db      | 2025-09-15 11:04:57.087 | initdb: warning: enabling "trust" authentication for local connections
db      | 2025-09-15 11:04:57.087 | initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.
db      | 2025-09-15 11:04:57.139 | waiting for server to start....2025-09-15 14:04:57 GMT [41]: [1-1] user=,db=,app=,client= LOG:  redirecting log output to logging collector process
db      | 2025-09-15 11:04:57.139 | 2025-09-15 14:04:57 GMT [41]: [2-1] user=,db=,app=,client= HINT:  Future log output will appear in directory "pg_log".
db      | 2025-09-15 11:04:57.209 |  done
db      | 2025-09-15 11:04:57.209 | server started
db      | 2025-09-15 11:04:57.273 | CREATE DATABASE
db      | 2025-09-15 11:04:57.274 | 
db      | 2025-09-15 11:04:57.274 | 
db      | 2025-09-15 11:04:57.274 | /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*
db      | 2025-09-15 11:04:57.274 | 
db      | 2025-09-15 11:04:57.476 | waiting for server to shut down.... done
db      | 2025-09-15 11:04:57.476 | server stopped
db      | 2025-09-15 11:04:57.477 | 
db      | 2025-09-15 11:04:57.477 | PostgreSQL init process complete; ready for start up.
db      | 2025-09-15 11:04:57.477 | 
db      | 2025-09-15 11:04:57.501 | 2025-09-15 14:04:57 GMT [1]: [1-1] user=,db=,app=,client= LOG:  redirecting log output to logging collector process
db      | 2025-09-15 11:04:57.501 | 2025-09-15 14:04:57 GMT [1]: [2-1] user=,db=,app=,client= HINT:  Future log output will appear in directory "pg_log".
adminer | 2025-09-15 11:05:05.623 | [Mon Sep 15 14:05:05 2025] PHP 8.4.12 Development Server (http://[::]:8080) started
app     | 2025-09-15 11:05:05.706 | 🚀 Iniciando aplicação Sienge Data Sync...
app     | 2025-09-15 11:05:05.710 | [2025-09-15 14:05:05] 🎯 Iniciando processo de inicialização...
app     | 2025-09-15 11:05:05.711 | [2025-09-15 14:05:05] 📋 Informações do ambiente:
app     | 2025-09-15 11:05:05.712 | [2025-09-15 14:05:05]    NODE_ENV: development
app     | 2025-09-15 11:05:05.713 | [2025-09-15 14:05:05]    DATABASE_URL: postgresql://sienge_...
app     | 2025-09-15 11:05:05.714 | [2025-09-15 14:05:05]    PORT: 3000
app     | 2025-09-15 11:05:05.715 | [2025-09-15 14:05:05] ⏳ Aguardando banco de dados estar disponível...
app     | 2025-09-15 11:05:05.742 | [2025-09-15 14:05:05] ✅ Banco de dados está disponível!
app     | 2025-09-15 11:05:05.743 | [2025-09-15 14:05:05] 🔍 Verificando conexão com o banco de dados...
app     | 2025-09-15 11:05:05.755 | [2025-09-15 14:05:05] ✅ Conexão com banco de dados verificada!
app     | 2025-09-15 11:05:05.756 | [2025-09-15 14:05:05] 🔄 Aplicando schema do Prisma ao banco de dados...
app     | 2025-09-15 11:05:05.757 | [2025-09-15 14:05:05] 🔄 Executando prisma db push...
app     | 2025-09-15 11:05:08.270 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:05:08.344 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:05:08.381 | 
app     | 2025-09-15 11:05:08.382 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:05:08.382 | 
app     | 2025-09-15 11:05:08.382 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:05:08.456 | npm notice
app     | 2025-09-15 11:05:08.456 | npm notice New major version of npm available! 10.8.2 -> 11.6.0
app     | 2025-09-15 11:05:08.456 | npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.0
app     | 2025-09-15 11:05:08.456 | npm notice To update run: npm install -g npm@11.6.0
app     | 2025-09-15 11:05:08.456 | npm notice
app     | 2025-09-15 11:05:08.464 | [2025-09-15 14:05:08] ⚠️ Erro ao aplicar schema, tentando com force-reset...
app     | 2025-09-15 11:05:10.845 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:05:10.849 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:05:10.965 | 
app     | 2025-09-15 11:05:10.966 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:05:10.966 | 
app     | 2025-09-15 11:05:10.966 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:05:10.989 | [2025-09-15 14:05:10] ❌ Erro crítico ao aplicar schema do banco de dados
app     | 2025-09-15 11:05:11.043 | [2025-09-15 14:05:10] ❌ Falha na inicialização: Erro ao executar migrações
app     | 2025-09-15 11:05:11.693 | 🚀 Iniciando aplicação Sienge Data Sync...
app     | 2025-09-15 11:05:11.694 | [2025-09-15 14:05:11] 🎯 Iniciando processo de inicialização...
app     | 2025-09-15 11:05:11.695 | [2025-09-15 14:05:11] 📋 Informações do ambiente:
app     | 2025-09-15 11:05:11.696 | [2025-09-15 14:05:11]    NODE_ENV: development
app     | 2025-09-15 11:05:11.697 | [2025-09-15 14:05:11]    DATABASE_URL: postgresql://sienge_...
app     | 2025-09-15 11:05:11.698 | [2025-09-15 14:05:11]    PORT: 3000
app     | 2025-09-15 11:05:11.699 | [2025-09-15 14:05:11] ⏳ Aguardando banco de dados estar disponível...
app     | 2025-09-15 11:05:11.708 | [2025-09-15 14:05:11] ✅ Banco de dados está disponível!
app     | 2025-09-15 11:05:11.709 | [2025-09-15 14:05:11] 🔍 Verificando conexão com o banco de dados...
app     | 2025-09-15 11:05:11.717 | [2025-09-15 14:05:11] ✅ Conexão com banco de dados verificada!
app     | 2025-09-15 11:05:11.718 | [2025-09-15 14:05:11] 🔄 Aplicando schema do Prisma ao banco de dados...
app     | 2025-09-15 11:05:11.719 | [2025-09-15 14:05:11] 🔄 Executando prisma db push...
app     | 2025-09-15 11:05:13.973 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:05:14.045 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:05:14.151 | 
app     | 2025-09-15 11:05:14.152 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:05:14.152 | 
app     | 2025-09-15 11:05:14.152 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:05:14.173 | [2025-09-15 14:05:14] ⚠️ Erro ao aplicar schema, tentando com force-reset...
app     | 2025-09-15 11:05:16.471 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:05:16.476 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:05:16.573 | 
app     | 2025-09-15 11:05:16.643 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:05:16.644 | 
app     | 2025-09-15 11:05:16.644 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:05:16.665 | [2025-09-15 14:05:16] ❌ Erro crítico ao aplicar schema do banco de dados
app     | 2025-09-15 11:05:16.666 | [2025-09-15 14:05:16] ❌ Falha na inicialização: Erro ao executar migrações
app     | 2025-09-15 11:05:17.352 | 🚀 Iniciando aplicação Sienge Data Sync...
app     | 2025-09-15 11:05:17.353 | [2025-09-15 14:05:17] 🎯 Iniciando processo de inicialização...
app     | 2025-09-15 11:05:17.353 | [2025-09-15 14:05:17] 📋 Informações do ambiente:
app     | 2025-09-15 11:05:17.354 | [2025-09-15 14:05:17]    NODE_ENV: development
app     | 2025-09-15 11:05:17.355 | [2025-09-15 14:05:17]    DATABASE_URL: postgresql://sienge_...
app     | 2025-09-15 11:05:17.356 | [2025-09-15 14:05:17]    PORT: 3000
app     | 2025-09-15 11:05:17.357 | [2025-09-15 14:05:17] ⏳ Aguardando banco de dados estar disponível...
app     | 2025-09-15 11:05:17.369 | [2025-09-15 14:05:17] ✅ Banco de dados está disponível!
app     | 2025-09-15 11:05:17.370 | [2025-09-15 14:05:17] 🔍 Verificando conexão com o banco de dados...
app     | 2025-09-15 11:05:17.379 | [2025-09-15 14:05:17] ✅ Conexão com banco de dados verificada!
app     | 2025-09-15 11:05:17.380 | [2025-09-15 14:05:17] 🔄 Aplicando schema do Prisma ao banco de dados...
app     | 2025-09-15 11:05:17.380 | [2025-09-15 14:05:17] 🔄 Executando prisma db push...
app     | 2025-09-15 11:05:19.676 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:05:19.683 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:05:19.848 | 
app     | 2025-09-15 11:05:19.848 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:05:19.848 | 
app     | 2025-09-15 11:05:19.848 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:05:19.870 | [2025-09-15 14:05:19] ⚠️ Erro ao aplicar schema, tentando com force-reset...
adminer | 2025-09-15 11:05:20.629 | [Mon Sep 15 14:05:20 2025] [::1]:37154 Accepted
adminer | 2025-09-15 11:05:20.667 | [Mon Sep 15 14:05:20 2025] [::1]:37154 [200]: GET /
adminer | 2025-09-15 11:05:20.667 | [Mon Sep 15 14:05:20 2025] [::1]:37154 Closing
app     | 2025-09-15 11:05:22.144 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:05:22.148 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:05:22.253 | 
app     | 2025-09-15 11:05:22.254 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:05:22.254 | 
app     | 2025-09-15 11:05:22.254 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:05:22.276 | [2025-09-15 14:05:22] ❌ Erro crítico ao aplicar schema do banco de dados
app     | 2025-09-15 11:05:22.277 | [2025-09-15 14:05:22] ❌ Falha na inicialização: Erro ao executar migrações
app     | 2025-09-15 11:05:22.996 | 🚀 Iniciando aplicação Sienge Data Sync...
app     | 2025-09-15 11:05:22.997 | [2025-09-15 14:05:22] 🎯 Iniciando processo de inicialização...
app     | 2025-09-15 11:05:22.998 | [2025-09-15 14:05:22] 📋 Informações do ambiente:
app     | 2025-09-15 11:05:22.999 | [2025-09-15 14:05:22]    NODE_ENV: development
app     | 2025-09-15 11:05:23.000 | [2025-09-15 14:05:23]    DATABASE_URL: postgresql://sienge_...
app     | 2025-09-15 11:05:23.001 | [2025-09-15 14:05:23]    PORT: 3000
app     | 2025-09-15 11:05:23.002 | [2025-09-15 14:05:23] ⏳ Aguardando banco de dados estar disponível...
app     | 2025-09-15 11:05:23.015 | [2025-09-15 14:05:23] ✅ Banco de dados está disponível!
app     | 2025-09-15 11:05:23.016 | [2025-09-15 14:05:23] 🔍 Verificando conexão com o banco de dados...
app     | 2025-09-15 11:05:23.026 | [2025-09-15 14:05:23] ✅ Conexão com banco de dados verificada!
app     | 2025-09-15 11:05:23.027 | [2025-09-15 14:05:23] 🔄 Aplicando schema do Prisma ao banco de dados...
app     | 2025-09-15 11:05:23.028 | [2025-09-15 14:05:23] 🔄 Executando prisma db push...
app     | 2025-09-15 11:05:25.362 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:05:25.366 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:05:25.462 | 
app     | 2025-09-15 11:05:25.462 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:05:25.462 | 
app     | 2025-09-15 11:05:25.462 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:05:25.544 | [2025-09-15 14:05:25] ⚠️ Erro ao aplicar schema, tentando com force-reset...
app     | 2025-09-15 11:05:30.437 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:05:30.442 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:05:30.544 | 
app     | 2025-09-15 11:05:30.544 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:05:30.544 | 
app     | 2025-09-15 11:05:30.544 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:05:30.629 | [2025-09-15 14:05:30] ❌ Erro crítico ao aplicar schema do banco de dados
app     | 2025-09-15 11:05:30.630 | [2025-09-15 14:05:30] ❌ Falha na inicialização: Erro ao executar migrações
app     | 2025-09-15 11:05:31.631 | 🚀 Iniciando aplicação Sienge Data Sync...
app     | 2025-09-15 11:05:31.632 | [2025-09-15 14:05:31] 🎯 Iniciando processo de inicialização...
app     | 2025-09-15 11:05:31.633 | [2025-09-15 14:05:31] 📋 Informações do ambiente:
app     | 2025-09-15 11:05:31.634 | [2025-09-15 14:05:31]    NODE_ENV: development
app     | 2025-09-15 11:05:31.635 | [2025-09-15 14:05:31]    DATABASE_URL: postgresql://sienge_...
app     | 2025-09-15 11:05:31.636 | [2025-09-15 14:05:31]    PORT: 3000
app     | 2025-09-15 11:05:31.637 | [2025-09-15 14:05:31] ⏳ Aguardando banco de dados estar disponível...
app     | 2025-09-15 11:05:31.649 | [2025-09-15 14:05:31] ✅ Banco de dados está disponível!
app     | 2025-09-15 11:05:31.650 | [2025-09-15 14:05:31] 🔍 Verificando conexão com o banco de dados...
app     | 2025-09-15 11:05:31.659 | [2025-09-15 14:05:31] ✅ Conexão com banco de dados verificada!
app     | 2025-09-15 11:05:31.660 | [2025-09-15 14:05:31] 🔄 Aplicando schema do Prisma ao banco de dados...
app     | 2025-09-15 11:05:31.660 | [2025-09-15 14:05:31] 🔄 Executando prisma db push...
app     | 2025-09-15 11:05:33.920 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:05:33.924 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:05:34.030 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:05:34.030 | 
app     | 2025-09-15 11:05:34.030 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:05:34.030 | 
app     | 2025-09-15 11:05:34.051 | [2025-09-15 14:05:34] ⚠️ Erro ao aplicar schema, tentando com force-reset...
app     | 2025-09-15 11:05:36.344 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:05:36.348 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:05:36.442 | 
app     | 2025-09-15 11:05:36.443 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:05:36.443 | 
app     | 2025-09-15 11:05:36.443 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:05:36.530 | [2025-09-15 14:05:36] ❌ Erro crítico ao aplicar schema do banco de dados
app     | 2025-09-15 11:05:36.530 | [2025-09-15 14:05:36] ❌ Falha na inicialização: Erro ao executar migrações
app     | 2025-09-15 11:05:38.349 | 🚀 Iniciando aplicação Sienge Data Sync...
app     | 2025-09-15 11:05:38.351 | [2025-09-15 14:05:38] 🎯 Iniciando processo de inicialização...
app     | 2025-09-15 11:05:38.352 | [2025-09-15 14:05:38] 📋 Informações do ambiente:
app     | 2025-09-15 11:05:38.353 | [2025-09-15 14:05:38]    NODE_ENV: development
app     | 2025-09-15 11:05:38.353 | [2025-09-15 14:05:38]    DATABASE_URL: postgresql://sienge_...
app     | 2025-09-15 11:05:38.354 | [2025-09-15 14:05:38]    PORT: 3000
app     | 2025-09-15 11:05:38.355 | [2025-09-15 14:05:38] ⏳ Aguardando banco de dados estar disponível...
app     | 2025-09-15 11:05:38.367 | [2025-09-15 14:05:38] ✅ Banco de dados está disponível!
app     | 2025-09-15 11:05:38.368 | [2025-09-15 14:05:38] 🔍 Verificando conexão com o banco de dados...
app     | 2025-09-15 11:05:38.377 | [2025-09-15 14:05:38] ✅ Conexão com banco de dados verificada!
app     | 2025-09-15 11:05:38.378 | [2025-09-15 14:05:38] 🔄 Aplicando schema do Prisma ao banco de dados...
app     | 2025-09-15 11:05:38.379 | [2025-09-15 14:05:38] 🔄 Executando prisma db push...
adminer | 2025-09-15 11:05:38.384 | [Mon Sep 15 14:05:38 2025] [::1]:34284 Accepted
adminer | 2025-09-15 11:05:38.386 | [Mon Sep 15 14:05:38 2025] [::1]:34284 [200]: GET /
adminer | 2025-09-15 11:05:38.386 | [Mon Sep 15 14:05:38 2025] [::1]:34284 Closing
app     | 2025-09-15 11:05:40.627 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:05:40.631 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:05:40.737 | 
app     | 2025-09-15 11:05:40.738 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:05:40.738 | 
app     | 2025-09-15 11:05:40.738 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:05:40.822 | [2025-09-15 14:05:40] ⚠️ Erro ao aplicar schema, tentando com force-reset...
app     | 2025-09-15 11:05:43.049 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:05:43.121 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:05:43.154 | 
app     | 2025-09-15 11:05:43.155 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:05:43.155 | 
app     | 2025-09-15 11:05:43.155 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:05:43.241 | [2025-09-15 14:05:43] ❌ Erro crítico ao aplicar schema do banco de dados
app     | 2025-09-15 11:05:43.241 | [2025-09-15 14:05:43] ❌ Falha na inicialização: Erro ao executar migrações
app     | 2025-09-15 11:05:46.647 | 🚀 Iniciando aplicação Sienge Data Sync...
app     | 2025-09-15 11:05:46.648 | [2025-09-15 14:05:46] 🎯 Iniciando processo de inicialização...
app     | 2025-09-15 11:05:46.648 | [2025-09-15 14:05:46] 📋 Informações do ambiente:
app     | 2025-09-15 11:05:46.649 | [2025-09-15 14:05:46]    NODE_ENV: development
app     | 2025-09-15 11:05:46.650 | [2025-09-15 14:05:46]    DATABASE_URL: postgresql://sienge_...
app     | 2025-09-15 11:05:46.651 | [2025-09-15 14:05:46]    PORT: 3000
app     | 2025-09-15 11:05:46.652 | [2025-09-15 14:05:46] ⏳ Aguardando banco de dados estar disponível...
app     | 2025-09-15 11:05:46.664 | [2025-09-15 14:05:46] ✅ Banco de dados está disponível!
app     | 2025-09-15 11:05:46.665 | [2025-09-15 14:05:46] 🔍 Verificando conexão com o banco de dados...
app     | 2025-09-15 11:05:46.675 | [2025-09-15 14:05:46] ✅ Conexão com banco de dados verificada!
app     | 2025-09-15 11:05:46.676 | [2025-09-15 14:05:46] 🔄 Aplicando schema do Prisma ao banco de dados...
app     | 2025-09-15 11:05:46.677 | [2025-09-15 14:05:46] 🔄 Executando prisma db push...
app     | 2025-09-15 11:05:48.943 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:05:48.947 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:05:49.042 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:05:49.042 | 
app     | 2025-09-15 11:05:49.042 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:05:49.042 | 
app     | 2025-09-15 11:05:49.134 | [2025-09-15 14:05:49] ⚠️ Erro ao aplicar schema, tentando com force-reset...
app     | 2025-09-15 11:05:51.446 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:05:51.450 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:05:51.552 | 
app     | 2025-09-15 11:05:51.553 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:05:51.553 | 
app     | 2025-09-15 11:05:51.553 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:05:51.643 | [2025-09-15 14:05:51] ❌ Erro crítico ao aplicar schema do banco de dados
app     | 2025-09-15 11:05:51.644 | [2025-09-15 14:05:51] ❌ Falha na inicialização: Erro ao executar migrações
adminer | 2025-09-15 11:05:53.431 | [Mon Sep 15 14:05:53 2025] [::1]:57490 Accepted
adminer | 2025-09-15 11:05:53.432 | [Mon Sep 15 14:05:53 2025] [::1]:57490 [200]: GET /
adminer | 2025-09-15 11:05:53.432 | [Mon Sep 15 14:05:53 2025] [::1]:57490 Closing
app     | 2025-09-15 11:05:58.250 | 🚀 Iniciando aplicação Sienge Data Sync...
app     | 2025-09-15 11:05:58.251 | [2025-09-15 14:05:58] 🎯 Iniciando processo de inicialização...
app     | 2025-09-15 11:05:58.252 | [2025-09-15 14:05:58] 📋 Informações do ambiente:
app     | 2025-09-15 11:05:58.253 | [2025-09-15 14:05:58]    NODE_ENV: development
app     | 2025-09-15 11:05:58.254 | [2025-09-15 14:05:58]    DATABASE_URL: postgresql://sienge_...
app     | 2025-09-15 11:05:58.255 | [2025-09-15 14:05:58]    PORT: 3000
app     | 2025-09-15 11:05:58.256 | [2025-09-15 14:05:58] ⏳ Aguardando banco de dados estar disponível...
app     | 2025-09-15 11:05:58.267 | [2025-09-15 14:05:58] ✅ Banco de dados está disponível!
app     | 2025-09-15 11:05:58.268 | [2025-09-15 14:05:58] 🔍 Verificando conexão com o banco de dados...
app     | 2025-09-15 11:05:58.277 | [2025-09-15 14:05:58] ✅ Conexão com banco de dados verificada!
app     | 2025-09-15 11:05:58.277 | [2025-09-15 14:05:58] 🔄 Aplicando schema do Prisma ao banco de dados...
app     | 2025-09-15 11:05:58.278 | [2025-09-15 14:05:58] 🔄 Executando prisma db push...
app     | 2025-09-15 11:06:03.050 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:06:03.054 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:06:03.159 | 
app     | 2025-09-15 11:06:03.160 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:06:03.160 | 
app     | 2025-09-15 11:06:03.160 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:06:03.181 | [2025-09-15 14:06:03] ⚠️ Erro ao aplicar schema, tentando com force-reset...
app     | 2025-09-15 11:06:05.557 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:06:05.562 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:06:05.666 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:06:05.666 | 
app     | 2025-09-15 11:06:05.666 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:06:05.666 | 
app     | 2025-09-15 11:06:05.750 | [2025-09-15 14:06:05] ❌ Erro crítico ao aplicar schema do banco de dados
app     | 2025-09-15 11:06:05.751 | [2025-09-15 14:06:05] ❌ Falha na inicialização: Erro ao executar migrações
adminer | 2025-09-15 11:06:10.999 | [Mon Sep 15 14:06:10 2025] [::1]:49592 Accepted
adminer | 2025-09-15 11:06:11.000 | [Mon Sep 15 14:06:11 2025] [::1]:49592 [200]: GET /
adminer | 2025-09-15 11:06:11.000 | [Mon Sep 15 14:06:11 2025] [::1]:49592 Closing
app     | 2025-09-15 11:06:18.785 | 🚀 Iniciando aplicação Sienge Data Sync...
app     | 2025-09-15 11:06:18.786 | [2025-09-15 14:06:18] 🎯 Iniciando processo de inicialização...
app     | 2025-09-15 11:06:18.787 | [2025-09-15 14:06:18] 📋 Informações do ambiente:
app     | 2025-09-15 11:06:18.788 | [2025-09-15 14:06:18]    NODE_ENV: development
app     | 2025-09-15 11:06:18.789 | [2025-09-15 14:06:18]    DATABASE_URL: postgresql://sienge_...
app     | 2025-09-15 11:06:18.790 | [2025-09-15 14:06:18]    PORT: 3000
app     | 2025-09-15 11:06:18.791 | [2025-09-15 14:06:18] ⏳ Aguardando banco de dados estar disponível...
app     | 2025-09-15 11:06:18.800 | [2025-09-15 14:06:18] ✅ Banco de dados está disponível!
app     | 2025-09-15 11:06:18.801 | [2025-09-15 14:06:18] 🔍 Verificando conexão com o banco de dados...
app     | 2025-09-15 11:06:18.810 | [2025-09-15 14:06:18] ✅ Conexão com banco de dados verificada!
app     | 2025-09-15 11:06:18.810 | [2025-09-15 14:06:18] 🔄 Aplicando schema do Prisma ao banco de dados...
app     | 2025-09-15 11:06:18.811 | [2025-09-15 14:06:18] 🔄 Executando prisma db push...
app     | 2025-09-15 11:06:20.970 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:06:20.974 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:06:21.070 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:06:21.070 | 
app     | 2025-09-15 11:06:21.070 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:06:21.070 | 
app     | 2025-09-15 11:06:21.162 | [2025-09-15 14:06:21] ⚠️ Erro ao aplicar schema, tentando com force-reset...
app     | 2025-09-15 11:06:23.368 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:06:23.372 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:06:23.477 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:06:23.477 | 
app     | 2025-09-15 11:06:23.477 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:06:23.477 | 
app     | 2025-09-15 11:06:23.569 | [2025-09-15 14:06:23] ❌ Erro crítico ao aplicar schema do banco de dados
app     | 2025-09-15 11:06:23.570 | [2025-09-15 14:06:23] ❌ Falha na inicialização: Erro ao executar migrações
adminer | 2025-09-15 11:06:26.042 | [Mon Sep 15 14:06:26 2025] [::1]:57264 Accepted
adminer | 2025-09-15 11:06:26.043 | [Mon Sep 15 14:06:26 2025] [::1]:57264 [200]: GET /
adminer | 2025-09-15 11:06:26.043 | [Mon Sep 15 14:06:26 2025] [::1]:57264 Closing
adminer | 2025-09-15 11:06:43.730 | [Mon Sep 15 14:06:43 2025] [::1]:36194 Accepted
adminer | 2025-09-15 11:06:43.731 | [Mon Sep 15 14:06:43 2025] [::1]:36194 [200]: GET /
adminer | 2025-09-15 11:06:43.731 | [Mon Sep 15 14:06:43 2025] [::1]:36194 Closing
app     | 2025-09-15 11:06:52.058 | 🚀 Iniciando aplicação Sienge Data Sync...
app     | 2025-09-15 11:06:52.060 | [2025-09-15 14:06:52] 🎯 Iniciando processo de inicialização...
app     | 2025-09-15 11:06:52.060 | [2025-09-15 14:06:52] 📋 Informações do ambiente:
app     | 2025-09-15 11:06:52.061 | [2025-09-15 14:06:52]    NODE_ENV: development
app     | 2025-09-15 11:06:52.062 | [2025-09-15 14:06:52]    DATABASE_URL: postgresql://sienge_...
app     | 2025-09-15 11:06:52.063 | [2025-09-15 14:06:52]    PORT: 3000
app     | 2025-09-15 11:06:52.064 | [2025-09-15 14:06:52] ⏳ Aguardando banco de dados estar disponível...
app     | 2025-09-15 11:06:52.076 | [2025-09-15 14:06:52] ✅ Banco de dados está disponível!
app     | 2025-09-15 11:06:52.076 | [2025-09-15 14:06:52] 🔍 Verificando conexão com o banco de dados...
app     | 2025-09-15 11:06:52.086 | [2025-09-15 14:06:52] ✅ Conexão com banco de dados verificada!
app     | 2025-09-15 11:06:52.087 | [2025-09-15 14:06:52] 🔄 Aplicando schema do Prisma ao banco de dados...
app     | 2025-09-15 11:06:52.088 | [2025-09-15 14:06:52] 🔄 Executando prisma db push...
app     | 2025-09-15 11:06:54.400 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:06:54.405 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:06:54.514 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:06:54.514 | 
app     | 2025-09-15 11:06:54.514 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:06:54.514 | 
app     | 2025-09-15 11:06:54.598 | [2025-09-15 14:06:54] ⚠️ Erro ao aplicar schema, tentando com force-reset...
app     | 2025-09-15 11:06:56.826 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:06:56.900 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:06:57.003 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:06:57.003 | 
app     | 2025-09-15 11:06:57.003 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:06:57.003 | 
app     | 2025-09-15 11:06:57.026 | [2025-09-15 14:06:57] ❌ Erro crítico ao aplicar schema do banco de dados
app     | 2025-09-15 11:06:57.027 | [2025-09-15 14:06:57] ❌ Falha na inicialização: Erro ao executar migrações
adminer | 2025-09-15 11:06:58.769 | [Mon Sep 15 14:06:58 2025] [::1]:34616 Accepted
adminer | 2025-09-15 11:06:58.770 | [Mon Sep 15 14:06:58 2025] [::1]:34616 [200]: GET /
adminer | 2025-09-15 11:06:58.770 | [Mon Sep 15 14:06:58 2025] [::1]:34616 Closing
adminer | 2025-09-15 11:07:16.425 | [Mon Sep 15 14:07:16 2025] [::1]:57484 Accepted
adminer | 2025-09-15 11:07:16.426 | [Mon Sep 15 14:07:16 2025] [::1]:57484 [200]: GET /
adminer | 2025-09-15 11:07:16.426 | [Mon Sep 15 14:07:16 2025] [::1]:57484 Closing
adminer | 2025-09-15 11:07:31.472 | [Mon Sep 15 14:07:31 2025] [::1]:51622 Accepted
adminer | 2025-09-15 11:07:31.473 | [Mon Sep 15 14:07:31 2025] [::1]:51622 [200]: GET /
adminer | 2025-09-15 11:07:31.473 | [Mon Sep 15 14:07:31 2025] [::1]:51622 Closing
adminer | 2025-09-15 11:07:49.138 | [Mon Sep 15 14:07:49 2025] [::1]:34656 Accepted
adminer | 2025-09-15 11:07:49.139 | [Mon Sep 15 14:07:49 2025] [::1]:34656 [200]: GET /
adminer | 2025-09-15 11:07:49.139 | [Mon Sep 15 14:07:49 2025] [::1]:34656 Closing
app     | 2025-09-15 11:07:53.694 | 🚀 Iniciando aplicação Sienge Data Sync...
app     | 2025-09-15 11:07:53.696 | [2025-09-15 14:07:53] 🎯 Iniciando processo de inicialização...
app     | 2025-09-15 11:07:53.696 | [2025-09-15 14:07:53] 📋 Informações do ambiente:
app     | 2025-09-15 11:07:53.697 | [2025-09-15 14:07:53]    NODE_ENV: development
app     | 2025-09-15 11:07:53.698 | [2025-09-15 14:07:53]    DATABASE_URL: postgresql://sienge_...
app     | 2025-09-15 11:07:53.700 | [2025-09-15 14:07:53]    PORT: 3000
app     | 2025-09-15 11:07:53.701 | [2025-09-15 14:07:53] ⏳ Aguardando banco de dados estar disponível...
app     | 2025-09-15 11:07:53.713 | [2025-09-15 14:07:53] ✅ Banco de dados está disponível!
app     | 2025-09-15 11:07:53.714 | [2025-09-15 14:07:53] 🔍 Verificando conexão com o banco de dados...
app     | 2025-09-15 11:07:53.725 | [2025-09-15 14:07:53] ✅ Conexão com banco de dados verificada!
app     | 2025-09-15 11:07:53.726 | [2025-09-15 14:07:53] 🔄 Aplicando schema do Prisma ao banco de dados...
app     | 2025-09-15 11:07:53.727 | [2025-09-15 14:07:53] 🔄 Executando prisma db push...
app     | 2025-09-15 11:07:56.348 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:07:56.352 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:07:56.459 | 
app     | 2025-09-15 11:07:56.460 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:07:56.460 | 
app     | 2025-09-15 11:07:56.460 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:07:56.547 | [2025-09-15 14:07:56] ⚠️ Erro ao aplicar schema, tentando com force-reset...
app     | 2025-09-15 11:07:59.075 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:07:59.144 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "localhost:5432"
app     | 2025-09-15 11:07:59.261 | 
app     | 2025-09-15 11:07:59.262 | Error: P1001: Can't reach database server at `localhost:5432`
app     | 2025-09-15 11:07:59.262 | 
app     | 2025-09-15 11:07:59.262 | Please make sure your database server is running at `localhost:5432`.
app     | 2025-09-15 11:07:59.346 | [2025-09-15 14:07:59] ❌ Erro crítico ao aplicar schema do banco de dados
app     | 2025-09-15 11:07:59.347 | [2025-09-15 14:07:59] ❌ Falha na inicialização: Erro ao executar migrações
app     | 2025-09-15 11:08:00.028 | Error response from daemon: can not get logs from container which is dead or marked for removal
app     | 2025-09-15 11:08:00.720 | 🚀 Iniciando aplicação Sienge Data Sync...
app     | 2025-09-15 11:08:00.721 | [2025-09-15 14:08:00] 🎯 Iniciando processo de inicialização...
app     | 2025-09-15 11:08:00.722 | [2025-09-15 14:08:00] 📋 Informações do ambiente:
app     | 2025-09-15 11:08:00.723 | [2025-09-15 14:08:00]    NODE_ENV: development
app     | 2025-09-15 11:08:00.724 | [2025-09-15 14:08:00]    DATABASE_URL: postgresql://sienge_...
app     | 2025-09-15 11:08:00.725 | [2025-09-15 14:08:00]    PORT: 3000
app     | 2025-09-15 11:08:00.726 | [2025-09-15 14:08:00] ⏳ Aguardando banco de dados estar disponível...
app     | 2025-09-15 11:08:00.737 | [2025-09-15 14:08:00] ✅ Banco de dados está disponível!
app     | 2025-09-15 11:08:00.738 | [2025-09-15 14:08:00] 🔍 Verificando conexão com o banco de dados...
app     | 2025-09-15 11:08:00.747 | [2025-09-15 14:08:00] ✅ Conexão com banco de dados verificada!
app     | 2025-09-15 11:08:00.748 | [2025-09-15 14:08:00] 🔄 Aplicando schema do Prisma ao banco de dados...
app     | 2025-09-15 11:08:00.749 | [2025-09-15 14:08:00] 🔄 Executando prisma db push...
app     | 2025-09-15 11:08:00.720 | 🚀 Iniciando aplicação Sienge Data Sync...
app     | 2025-09-15 11:08:00.721 | [2025-09-15 14:08:00] 🎯 Iniciando processo de inicialização...
app     | 2025-09-15 11:08:00.722 | [2025-09-15 14:08:00] 📋 Informações do ambiente:
app     | 2025-09-15 11:08:00.723 | [2025-09-15 14:08:00]    NODE_ENV: development
app     | 2025-09-15 11:08:00.724 | [2025-09-15 14:08:00]    DATABASE_URL: postgresql://sienge_...
app     | 2025-09-15 11:08:00.725 | [2025-09-15 14:08:00]    PORT: 3000
app     | 2025-09-15 11:08:00.726 | [2025-09-15 14:08:00] ⏳ Aguardando banco de dados estar disponível...
app     | 2025-09-15 11:08:00.737 | [2025-09-15 14:08:00] ✅ Banco de dados está disponível!
app     | 2025-09-15 11:08:00.738 | [2025-09-15 14:08:00] 🔍 Verificando conexão com o banco de dados...
app     | 2025-09-15 11:08:00.747 | [2025-09-15 14:08:00] ✅ Conexão com banco de dados verificada!
app     | 2025-09-15 11:08:00.748 | [2025-09-15 14:08:00] 🔄 Aplicando schema do Prisma ao banco de dados...
app     | 2025-09-15 11:08:00.749 | [2025-09-15 14:08:00] 🔄 Executando prisma db push...
app     | 2025-09-15 11:08:03.343 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:08:03.343 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:08:03.347 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "db:5432"
app     | 2025-09-15 11:08:03.347 | Datasource "db": PostgreSQL database "sienge_dev", schema "public" at "db:5432"
app     | 2025-09-15 11:08:03.810 | 
app     | 2025-09-15 11:08:03.810 | 🚀  Your database is now in sync with your Prisma schema. Done in 353ms
app     | 2025-09-15 11:08:03.810 | 
app     | 2025-09-15 11:08:03.810 | 
app     | 2025-09-15 11:08:03.810 | 🚀  Your database is now in sync with your Prisma schema. Done in 353ms
app     | 2025-09-15 11:08:03.810 | 
app     | 2025-09-15 11:08:03.811 | Running generate... (Use --skip-generate to skip the generators)
app     | 2025-09-15 11:08:03.811 | Running generate... (Use --skip-generate to skip the generators)
app     | 2025-09-15 11:08:04.153 | Running generate... - Prisma Client
app     | 2025-09-15 11:08:04.153 | Running generate... - Prisma Client
adminer | 2025-09-15 11:08:04.183 | [Mon Sep 15 14:08:04 2025] [::1]:48528 Accepted
adminer | 2025-09-15 11:08:04.184 | [Mon Sep 15 14:08:04 2025] [::1]:48528 [200]: GET /
adminer | 2025-09-15 11:08:04.184 | [Mon Sep 15 14:08:04 2025] [::1]:48528 Closing
app     | 2025-09-15 11:08:04.687 | ✔ Generated Prisma Client (v6.16.1) to ./node_modules/@prisma/client in 531ms
app     | 2025-09-15 11:08:04.688 | 
app     | 2025-09-15 11:08:04.687 | ✔ Generated Prisma Client (v6.16.1) to ./node_modules/@prisma/client in 531ms
app     | 2025-09-15 11:08:04.688 | 
app     | 2025-09-15 11:08:04.710 | npm notice
app     | 2025-09-15 11:08:04.710 | npm notice New major version of npm available! 10.8.2 -> 11.6.0
app     | 2025-09-15 11:08:04.710 | npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.0
app     | 2025-09-15 11:08:04.710 | npm notice To update run: npm install -g npm@11.6.0
app     | 2025-09-15 11:08:04.710 | npm notice
app     | 2025-09-15 11:08:04.710 | npm notice
app     | 2025-09-15 11:08:04.710 | npm notice New major version of npm available! 10.8.2 -> 11.6.0
app     | 2025-09-15 11:08:04.710 | npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.0
app     | 2025-09-15 11:08:04.710 | npm notice To update run: npm install -g npm@11.6.0
app     | 2025-09-15 11:08:04.710 | npm notice
app     | 2025-09-15 11:08:04.719 | [2025-09-15 14:08:04] ✅ Schema do banco de dados aplicado com sucesso!
app     | 2025-09-15 11:08:04.719 | [2025-09-15 14:08:04] ✅ Schema do banco de dados aplicado com sucesso!
app     | 2025-09-15 11:08:04.720 | [2025-09-15 14:08:04] 🔄 Gerando cliente Prisma...
app     | 2025-09-15 11:08:04.720 | [2025-09-15 14:08:04] 🔄 Gerando cliente Prisma...
app     | 2025-09-15 11:08:07.043 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:08:07.043 | Prisma schema loaded from prisma/schema.prisma
app     | 2025-09-15 11:08:08.160 | 
app     | 2025-09-15 11:08:08.160 | ✔ Generated Prisma Client (v6.16.1) to ./node_modules/@prisma/client in 696ms
app     | 2025-09-15 11:08:08.160 | 
app     | 2025-09-15 11:08:08.160 | Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
app     | 2025-09-15 11:08:08.160 | 
app     | 2025-09-15 11:08:08.160 | Tip: Need your database queries to be 1000x faster? Accelerate offers you that and more: https://pris.ly/tip-2-accelerate
app     | 2025-09-15 11:08:08.160 | 
app     | 2025-09-15 11:08:08.160 | 
app     | 2025-09-15 11:08:08.160 | ✔ Generated Prisma Client (v6.16.1) to ./node_modules/@prisma/client in 696ms
app     | 2025-09-15 11:08:08.160 | 
app     | 2025-09-15 11:08:08.160 | Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
app     | 2025-09-15 11:08:08.160 | 
app     | 2025-09-15 11:08:08.160 | Tip: Need your database queries to be 1000x faster? Accelerate offers you that and more: https://pris.ly/tip-2-accelerate
app     | 2025-09-15 11:08:08.160 | 
app     | 2025-09-15 11:08:08.191 | [2025-09-15 14:08:08] ✅ Cliente Prisma gerado com sucesso!
app     | 2025-09-15 11:08:08.191 | [2025-09-15 14:08:08] ✅ Cliente Prisma gerado com sucesso!
app     | 2025-09-15 11:08:08.192 | [2025-09-15 14:08:08] ✅ Inicialização concluída com sucesso!
app     | 2025-09-15 11:08:08.192 | [2025-09-15 14:08:08] ✅ Inicialização concluída com sucesso!
app     | 2025-09-15 11:08:08.193 | [2025-09-15 14:08:08] 🚀 Iniciando aplicação Next.js...
app     | 2025-09-15 11:08:08.193 | [2025-09-15 14:08:08] 🚀 Iniciando aplicação Next.js...
app     | 2025-09-15 11:08:08.194 | [2025-09-15 14:08:08] 📦 Build de produção detectado, iniciando em modo produção...
app     | 2025-09-15 11:08:08.194 | [2025-09-15 14:08:08] 📦 Build de produção detectado, iniciando em modo produção...
app     | 2025-09-15 11:08:08.371 | 
app     | 2025-09-15 11:08:08.371 | > sienge-data-sync@1.0.0 start
app     | 2025-09-15 11:08:08.371 | > next start
app     | 2025-09-15 11:08:08.371 | 
app     | 2025-09-15 11:08:08.371 | 
app     | 2025-09-15 11:08:08.371 | > sienge-data-sync@1.0.0 start
app     | 2025-09-15 11:08:08.371 | > next start
app     | 2025-09-15 11:08:08.371 | 
app     | 2025-09-15 11:08:08.456 |  ⚠ You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against. Read more: https://nextjs.org/docs/messages/non-standard-node-env
app     | 2025-09-15 11:08:08.456 |  ⚠ You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against. Read more: https://nextjs.org/docs/messages/non-standard-node-env
app     | 2025-09-15 11:08:08.656 |   ▲ Next.js 14.2.32
app     | 2025-09-15 11:08:08.656 |   - Local:        http://localhost:3000
app     | 2025-09-15 11:08:08.656 | 
app     | 2025-09-15 11:08:08.657 |  ✓ Starting...
app     | 2025-09-15 11:08:08.656 |   ▲ Next.js 14.2.32
app     | 2025-09-15 11:08:08.656 |   - Local:        http://localhost:3000
app     | 2025-09-15 11:08:08.656 | 
app     | 2025-09-15 11:08:08.657 |  ✓ Starting...
app     | 2025-09-15 11:08:08.982 |  ✓ Ready in 540ms
app     | 2025-09-15 11:08:08.982 |  ✓ Ready in 540ms
adminer | 2025-09-15 11:08:21.780 | [Mon Sep 15 14:08:21 2025] [::1]:39424 Accepted
adminer | 2025-09-15 11:08:21.782 | [Mon Sep 15 14:08:21 2025] [::1]:39424 [200]: GET /
adminer | 2025-09-15 11:08:21.782 | [Mon Sep 15 14:08:21 2025] [::1]:39424 Closing
app     | 2025-09-15 11:08:23.903 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:23.903 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:23.905 | [Sienge Proxy] Chamando endpoint: /customers com params: { limit: 1 }
app     | 2025-09-15 11:08:23.905 | [Sienge Proxy] Chamando endpoint: /customers com params: { limit: 1 }
app     | 2025-09-15 11:08:24.655 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:24.655 | [Sienge Proxy] Chamando endpoint: /companies com params: { limit: 1 }
app     | 2025-09-15 11:08:24.655 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:24.655 | [Sienge Proxy] Chamando endpoint: /companies com params: { limit: 1 }
app     | 2025-09-15 11:08:25.325 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:25.325 | [Sienge Proxy] Chamando endpoint: /enterprises com params: { limit: 1 }
app     | 2025-09-15 11:08:25.325 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:25.325 | [Sienge Proxy] Chamando endpoint: /enterprises com params: { limit: 1 }
app     | 2025-09-15 11:08:25.994 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:25.994 | [Sienge Proxy] Chamando endpoint: /units com params: { limit: 1 }
app     | 2025-09-15 11:08:25.994 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:25.994 | [Sienge Proxy] Chamando endpoint: /units com params: { limit: 1 }
app     | 2025-09-15 11:08:26.442 | [LOGGER] Flushing 8 log entries
app     | 2025-09-15 11:08:26.442 | [LOGGER] Flushing 8 log entries
app     | 2025-09-15 11:08:26.449 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:26.450 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:26.450 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:26.450 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:26.450 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:26.450 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:26.450 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:26.450 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:26.450 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:26.450 |   config: {
app     | 2025-09-15 11:08:26.450 |     transitional: {
app     | 2025-09-15 11:08:26.450 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:26.450 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:26.450 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:26.450 |     },
app     | 2025-09-15 11:08:26.450 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:26.450 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:26.450 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:26.450 |     timeout: 30000,
app     | 2025-09-15 11:08:26.450 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:26.450 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:26.450 |     maxContentLength: -1,
app     | 2025-09-15 11:08:26.450 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:26.450 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:26.450 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:26.450 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:26.450 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:26.450 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:26.450 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:26.450 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:26.450 |     },
app     | 2025-09-15 11:08:26.450 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:26.450 |     auth: {
app     | 2025-09-15 11:08:26.450 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:26.450 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:26.450 |     },
app     | 2025-09-15 11:08:26.450 |     method: 'get',
app     | 2025-09-15 11:08:26.450 |     url: '/units',
app     | 2025-09-15 11:08:26.450 |     params: { limit: 1 },
app     | 2025-09-15 11:08:26.450 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:26.450 |     metadata: { startTime: 1757945305998 },
app     | 2025-09-15 11:08:26.450 |     'axios-retry': {
app     | 2025-09-15 11:08:26.450 |       retries: 3,
app     | 2025-09-15 11:08:26.450 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:26.450 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:26.450 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:26.450 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:26.450 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:26.450 |       validateResponse: null,
app     | 2025-09-15 11:08:26.450 |       retryCount: 0,
app     | 2025-09-15 11:08:26.450 |       lastRequestTime: 1757945305998
app     | 2025-09-15 11:08:26.450 |     },
app     | 2025-09-15 11:08:26.450 |     data: undefined
app     | 2025-09-15 11:08:26.450 |   },
app     | 2025-09-15 11:08:26.450 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:26.449 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:26.450 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:26.450 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:26.450 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:26.450 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:26.450 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:26.450 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:26.450 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:26.450 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:26.450 |   config: {
app     | 2025-09-15 11:08:26.450 |     transitional: {
app     | 2025-09-15 11:08:26.450 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:26.450 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:26.450 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:26.450 |     },
app     | 2025-09-15 11:08:26.450 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:26.450 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:26.450 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:26.450 |     timeout: 30000,
app     | 2025-09-15 11:08:26.450 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:26.450 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:26.450 |     maxContentLength: -1,
app     | 2025-09-15 11:08:26.450 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:26.450 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:26.450 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:26.450 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:26.450 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:26.450 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:26.450 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:26.450 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:26.450 |     },
app     | 2025-09-15 11:08:26.450 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:26.450 |     auth: {
app     | 2025-09-15 11:08:26.450 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:26.450 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:26.450 |     },
app     | 2025-09-15 11:08:26.450 |     method: 'get',
app     | 2025-09-15 11:08:26.450 |     url: '/units',
app     | 2025-09-15 11:08:26.450 |     params: { limit: 1 },
app     | 2025-09-15 11:08:26.450 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:26.450 |     metadata: { startTime: 1757945305998 },
app     | 2025-09-15 11:08:26.450 |     'axios-retry': {
app     | 2025-09-15 11:08:26.450 |       retries: 3,
app     | 2025-09-15 11:08:26.450 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:26.450 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:26.450 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:26.450 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:26.450 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:26.450 |       validateResponse: null,
app     | 2025-09-15 11:08:26.450 |       retryCount: 0,
app     | 2025-09-15 11:08:26.450 |       lastRequestTime: 1757945305998
app     | 2025-09-15 11:08:26.450 |     },
app     | 2025-09-15 11:08:26.450 |     data: undefined
app     | 2025-09-15 11:08:26.450 |   },
app     | 2025-09-15 11:08:26.450 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:26.450 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:26.450 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:26.450 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:26.450 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:26.450 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:26.450 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:26.450 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:26.450 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:26.450 |     },
app     | 2025-09-15 11:08:26.450 |     _eventsCount: 7,
app     | 2025-09-15 11:08:26.450 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:26.450 |     outputData: [],
app     | 2025-09-15 11:08:26.450 |     outputSize: 0,
app     | 2025-09-15 11:08:26.450 |     writable: true,
app     | 2025-09-15 11:08:26.450 |     destroyed: true,
app     | 2025-09-15 11:08:26.450 |     _last: true,
app     | 2025-09-15 11:08:26.450 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:26.450 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:26.450 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:26.450 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:26.450 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:26.450 |     sendDate: false,
app     | 2025-09-15 11:08:26.450 |     _removedConnection: false,
app     | 2025-09-15 11:08:26.450 |     _removedContLen: false,
app     | 2025-09-15 11:08:26.450 |     _removedTE: false,
app     | 2025-09-15 11:08:26.450 |     strictContentLength: false,
app     | 2025-09-15 11:08:26.450 |     _contentLength: 0,
app     | 2025-09-15 11:08:26.450 |     _hasBody: true,
app     | 2025-09-15 11:08:26.450 |     _trailer: '',
app     | 2025-09-15 11:08:26.450 |     finished: true,
app     | 2025-09-15 11:08:26.450 |     _headerSent: true,
app     | 2025-09-15 11:08:26.450 |     _closed: true,
app     | 2025-09-15 11:08:26.450 |     socket: TLSSocket {
app     | 2025-09-15 11:08:26.450 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:26.450 |       _secureEstablished: true,
app     | 2025-09-15 11:08:26.450 |       _securePending: false,
app     | 2025-09-15 11:08:26.450 |       _newSessionPending: false,
app     | 2025-09-15 11:08:26.450 |       _controlReleased: true,
app     | 2025-09-15 11:08:26.450 |       secureConnecting: false,
app     | 2025-09-15 11:08:26.450 |       _SNICallback: null,
app     | 2025-09-15 11:08:26.450 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:26.450 |       alpnProtocol: false,
app     | 2025-09-15 11:08:26.450 |       authorized: true,
app     | 2025-09-15 11:08:26.450 |       authorizationError: null,
app     | 2025-09-15 11:08:26.450 |       encrypted: true,
app     | 2025-09-15 11:08:26.450 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:26.450 |       _eventsCount: 9,
app     | 2025-09-15 11:08:26.450 |       connecting: false,
app     | 2025-09-15 11:08:26.450 |       _hadError: false,
app     | 2025-09-15 11:08:26.450 |       _parent: null,
app     | 2025-09-15 11:08:26.451 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:26.451 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:26.451 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:26.451 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:26.451 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:26.451 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:26.451 |       _sockname: null,
app     | 2025-09-15 11:08:26.451 |       _pendingData: null,
app     | 2025-09-15 11:08:26.451 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:26.451 |       server: undefined,
app     | 2025-09-15 11:08:26.451 |       _server: null,
app     | 2025-09-15 11:08:26.451 |       ssl: null,
app     | 2025-09-15 11:08:26.451 |       _requestCert: true,
app     | 2025-09-15 11:08:26.451 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:26.451 |       parser: null,
app     | 2025-09-15 11:08:26.451 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:26.451 |       timeout: 30000,
app     | 2025-09-15 11:08:26.451 |       write: [Function: writeAfterFIN],
app     | 2025-09-15 11:08:26.452 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:26.452 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:26.452 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:26.452 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:26.452 |       [Symbol(async_id_symbol)]: 8544,
app     | 2025-09-15 11:08:26.452 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:26.452 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:26.452 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:26.452 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:26.452 |         _idlePrev: null,
app     | 2025-09-15 11:08:26.452 |         _idleNext: null,
app     | 2025-09-15 11:08:26.453 |         _idleStart: 15502,
app     | 2025-09-15 11:08:26.453 |         _onTimeout: null,
app     | 2025-09-15 11:08:26.453 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:26.453 |         _repeat: null,
app     | 2025-09-15 11:08:26.453 |         _destroyed: true,
app     | 2025-09-15 11:08:26.453 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:26.453 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:26.453 |         [Symbol(asyncId)]: 8555,
app     | 2025-09-15 11:08:26.453 |         [Symbol(triggerId)]: 8547,
app     | 2025-09-15 11:08:26.453 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:26.453 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:26.453 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:26.453 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:26.453 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:26.453 |       },
app     | 2025-09-15 11:08:26.453 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:26.453 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:26.453 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:26.453 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:26.450 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:26.450 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:26.450 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:26.450 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:26.450 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:26.450 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:26.450 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:26.450 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:26.450 |     },
app     | 2025-09-15 11:08:26.450 |     _eventsCount: 7,
app     | 2025-09-15 11:08:26.450 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:26.450 |     outputData: [],
app     | 2025-09-15 11:08:26.450 |     outputSize: 0,
app     | 2025-09-15 11:08:26.450 |     writable: true,
app     | 2025-09-15 11:08:26.450 |     destroyed: true,
app     | 2025-09-15 11:08:26.450 |     _last: true,
app     | 2025-09-15 11:08:26.450 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:26.450 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:26.450 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:26.450 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:26.450 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:26.450 |     sendDate: false,
app     | 2025-09-15 11:08:26.450 |     _removedConnection: false,
app     | 2025-09-15 11:08:26.450 |     _removedContLen: false,
app     | 2025-09-15 11:08:26.450 |     _removedTE: false,
app     | 2025-09-15 11:08:26.450 |     strictContentLength: false,
app     | 2025-09-15 11:08:26.450 |     _contentLength: 0,
app     | 2025-09-15 11:08:26.450 |     _hasBody: true,
app     | 2025-09-15 11:08:26.450 |     _trailer: '',
app     | 2025-09-15 11:08:26.450 |     finished: true,
app     | 2025-09-15 11:08:26.450 |     _headerSent: true,
app     | 2025-09-15 11:08:26.450 |     _closed: true,
app     | 2025-09-15 11:08:26.450 |     socket: TLSSocket {
app     | 2025-09-15 11:08:26.450 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:26.450 |       _secureEstablished: true,
app     | 2025-09-15 11:08:26.450 |       _securePending: false,
app     | 2025-09-15 11:08:26.450 |       _newSessionPending: false,
app     | 2025-09-15 11:08:26.450 |       _controlReleased: true,
app     | 2025-09-15 11:08:26.450 |       secureConnecting: false,
app     | 2025-09-15 11:08:26.450 |       _SNICallback: null,
app     | 2025-09-15 11:08:26.450 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:26.450 |       alpnProtocol: false,
app     | 2025-09-15 11:08:26.450 |       authorized: true,
app     | 2025-09-15 11:08:26.450 |       authorizationError: null,
app     | 2025-09-15 11:08:26.450 |       encrypted: true,
app     | 2025-09-15 11:08:26.450 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:26.450 |       _eventsCount: 9,
app     | 2025-09-15 11:08:26.450 |       connecting: false,
app     | 2025-09-15 11:08:26.450 |       _hadError: false,
app     | 2025-09-15 11:08:26.450 |       _parent: null,
app     | 2025-09-15 11:08:26.451 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:26.451 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:26.451 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:26.451 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:26.451 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:26.451 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:26.451 |       _sockname: null,
app     | 2025-09-15 11:08:26.451 |       _pendingData: null,
app     | 2025-09-15 11:08:26.451 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:26.451 |       server: undefined,
app     | 2025-09-15 11:08:26.451 |       _server: null,
app     | 2025-09-15 11:08:26.451 |       ssl: null,
app     | 2025-09-15 11:08:26.451 |       _requestCert: true,
app     | 2025-09-15 11:08:26.451 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:26.451 |       parser: null,
app     | 2025-09-15 11:08:26.451 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:26.451 |       timeout: 30000,
app     | 2025-09-15 11:08:26.451 |       write: [Function: writeAfterFIN],
app     | 2025-09-15 11:08:26.452 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:26.452 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:26.452 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:26.452 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:26.452 |       [Symbol(async_id_symbol)]: 8544,
app     | 2025-09-15 11:08:26.452 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:26.452 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:26.452 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:26.452 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:26.452 |         _idlePrev: null,
app     | 2025-09-15 11:08:26.452 |         _idleNext: null,
app     | 2025-09-15 11:08:26.453 |         _idleStart: 15502,
app     | 2025-09-15 11:08:26.453 |         _onTimeout: null,
app     | 2025-09-15 11:08:26.453 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:26.453 |         _repeat: null,
app     | 2025-09-15 11:08:26.453 |         _destroyed: true,
app     | 2025-09-15 11:08:26.453 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:26.453 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:26.453 |         [Symbol(asyncId)]: 8555,
app     | 2025-09-15 11:08:26.453 |         [Symbol(triggerId)]: 8547,
app     | 2025-09-15 11:08:26.453 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:26.453 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:26.453 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:26.453 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:26.453 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:26.453 |       },
app     | 2025-09-15 11:08:26.453 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:26.453 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:26.453 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:26.453 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:26.453 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:26.453 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:26.453 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:26.453 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:26.453 |       [Symbol(kBytesWritten)]: 333,
app     | 2025-09-15 11:08:26.453 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:26.453 |     },
app     | 2025-09-15 11:08:26.453 |     _header: 'GET /abf/public/api/v1/units?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:26.453 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:26.453 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:26.453 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:26.453 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:26.453 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:26.453 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:26.453 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:26.453 |       '\r\n',
app     | 2025-09-15 11:08:26.453 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:26.453 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:26.453 |     agent: Agent {
app     | 2025-09-15 11:08:26.453 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:26.453 |       _eventsCount: 2,
app     | 2025-09-15 11:08:26.453 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:26.453 |       defaultPort: 443,
app     | 2025-09-15 11:08:26.453 |       protocol: 'https:',
app     | 2025-09-15 11:08:26.453 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:26.453 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:26.453 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:26.453 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:26.453 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:26.453 |       keepAlive: false,
app     | 2025-09-15 11:08:26.453 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:26.453 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:26.453 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:26.453 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:26.453 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:26.453 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:26.453 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:26.453 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:26.453 |     },
app     | 2025-09-15 11:08:26.453 |     socketPath: undefined,
app     | 2025-09-15 11:08:26.453 |     method: 'GET',
app     | 2025-09-15 11:08:26.453 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:26.454 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:26.454 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:26.454 |     path: '/abf/public/api/v1/units?limit=1',
app     | 2025-09-15 11:08:26.454 |     _ended: true,
app     | 2025-09-15 11:08:26.454 |     res: IncomingMessage {
app     | 2025-09-15 11:08:26.454 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:26.454 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:26.454 |       _eventsCount: 4,
app     | 2025-09-15 11:08:26.454 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:26.454 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:26.454 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:26.454 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:26.454 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:26.454 |       complete: true,
app     | 2025-09-15 11:08:26.454 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:26.454 |       rawTrailers: [],
app     | 2025-09-15 11:08:26.454 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:26.454 |       aborted: false,
app     | 2025-09-15 11:08:26.454 |       upgrade: false,
app     | 2025-09-15 11:08:26.454 |       url: '',
app     | 2025-09-15 11:08:26.454 |       method: null,
app     | 2025-09-15 11:08:26.454 |       statusCode: 403,
app     | 2025-09-15 11:08:26.454 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:26.454 |       client: [TLSSocket],
app     | 2025-09-15 11:08:26.454 |       _consuming: false,
app     | 2025-09-15 11:08:26.454 |       _dumped: false,
app     | 2025-09-15 11:08:26.454 |       req: [Circular *1],
app     | 2025-09-15 11:08:26.454 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/units?limit=1',
app     | 2025-09-15 11:08:26.454 |       redirects: [],
app     | 2025-09-15 11:08:26.454 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:26.454 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:26.454 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:26.454 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:26.454 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:26.454 |     },
app     | 2025-09-15 11:08:26.454 |     aborted: false,
app     | 2025-09-15 11:08:26.454 |     timeoutCb: null,
app     | 2025-09-15 11:08:26.454 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:26.454 |     parser: null,
app     | 2025-09-15 11:08:26.454 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:26.454 |     reusedSocket: false,
app     | 2025-09-15 11:08:26.455 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:26.455 |     protocol: 'https:',
app     | 2025-09-15 11:08:26.455 |     _redirectable: Writable {
app     | 2025-09-15 11:08:26.455 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:26.455 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:26.455 |       _eventsCount: 3,
app     | 2025-09-15 11:08:26.455 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:26.455 |       _options: [Object],
app     | 2025-09-15 11:08:26.455 |       _ended: true,
app     | 2025-09-15 11:08:26.455 |       _ending: true,
app     | 2025-09-15 11:08:26.455 |       _redirectCount: 0,
app     | 2025-09-15 11:08:26.455 |       _redirects: [],
app     | 2025-09-15 11:08:26.455 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:26.455 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:26.455 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:26.455 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:26.455 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/units?limit=1',
app     | 2025-09-15 11:08:26.455 |       _timeout: null,
app     | 2025-09-15 11:08:26.455 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:26.455 |     },
app     | 2025-09-15 11:08:26.455 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:26.455 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:26.455 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:26.455 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:26.455 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:26.455 |       accept: [Array],
app     | 2025-09-15 11:08:26.455 |       'content-type': [Array],
app     | 2025-09-15 11:08:26.455 |       'user-agent': [Array],
app     | 2025-09-15 11:08:26.455 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:26.455 |       host: [Array],
app     | 2025-09-15 11:08:26.455 |       authorization: [Array]
app     | 2025-09-15 11:08:26.455 |     },
app     | 2025-09-15 11:08:26.455 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:26.455 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:26.455 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:26.455 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:26.455 |   },
app     | 2025-09-15 11:08:26.455 |   response: {
app     | 2025-09-15 11:08:26.455 |     status: 403,
app     | 2025-09-15 11:08:26.455 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:26.455 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:26.455 |       server: 'nginx',
app     | 2025-09-15 11:08:26.455 |       date: 'Mon, 15 Sep 2025 14:08:27 GMT',
app     | 2025-09-15 11:08:26.455 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:26.455 |       'content-length': '34',
app     | 2025-09-15 11:08:26.455 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:26.455 |       'x-ratelimit-remaining-minute': '195',
app     | 2025-09-15 11:08:26.455 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:26.455 |       'ratelimit-remaining': '195',
app     | 2025-09-15 11:08:26.455 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:26.455 |       'ratelimit-reset': '33',
app     | 2025-09-15 11:08:26.455 |       'x-kong-response-latency': '3',
app     | 2025-09-15 11:08:26.455 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:26.455 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:26.456 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:26.456 |       connection: 'close'
app     | 2025-09-15 11:08:26.456 |     },
app     | 2025-09-15 11:08:26.456 |     config: {
app     | 2025-09-15 11:08:26.456 |       transitional: [Object],
app     | 2025-09-15 11:08:26.456 |       adapter: [Array],
app     | 2025-09-15 11:08:26.456 |       transformRequest: [Array],
app     | 2025-09-15 11:08:26.456 |       transformResponse: [Array],
app     | 2025-09-15 11:08:26.456 |       timeout: 30000,
app     | 2025-09-15 11:08:26.456 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:26.456 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:26.456 |       maxContentLength: -1,
app     | 2025-09-15 11:08:26.456 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:26.456 |       env: [Object],
app     | 2025-09-15 11:08:26.456 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:26.456 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:26.456 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:26.456 |       auth: [Object],
app     | 2025-09-15 11:08:26.456 |       method: 'get',
app     | 2025-09-15 11:08:26.456 |       url: '/units',
app     | 2025-09-15 11:08:26.456 |       params: [Object],
app     | 2025-09-15 11:08:26.456 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:26.456 |       metadata: [Object],
app     | 2025-09-15 11:08:26.456 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:26.457 |       data: undefined
app     | 2025-09-15 11:08:26.457 |     },
app     | 2025-09-15 11:08:26.457 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:26.457 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:26.457 |       _eventsCount: 7,
app     | 2025-09-15 11:08:26.457 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:26.457 |       outputData: [],
app     | 2025-09-15 11:08:26.457 |       outputSize: 0,
app     | 2025-09-15 11:08:26.457 |       writable: true,
app     | 2025-09-15 11:08:26.457 |       destroyed: true,
app     | 2025-09-15 11:08:26.457 |       _last: true,
app     | 2025-09-15 11:08:26.457 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:26.457 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:26.457 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:26.457 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:26.457 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:26.457 |       sendDate: false,
app     | 2025-09-15 11:08:26.458 |       _removedConnection: false,
app     | 2025-09-15 11:08:26.458 |       _removedContLen: false,
app     | 2025-09-15 11:08:26.458 |       _removedTE: false,
app     | 2025-09-15 11:08:26.458 |       strictContentLength: false,
app     | 2025-09-15 11:08:26.458 |       _contentLength: 0,
app     | 2025-09-15 11:08:26.458 |       _hasBody: true,
app     | 2025-09-15 11:08:26.458 |       _trailer: '',
app     | 2025-09-15 11:08:26.458 |       finished: true,
app     | 2025-09-15 11:08:26.458 |       _headerSent: true,
app     | 2025-09-15 11:08:26.458 |       _closed: true,
app     | 2025-09-15 11:08:26.458 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:26.458 |       _header: 'GET /abf/public/api/v1/units?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:26.458 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:26.458 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:26.458 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:26.458 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:26.458 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:26.458 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:26.458 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:26.458 |         '\r\n',
app     | 2025-09-15 11:08:26.458 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:26.458 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:26.458 |       agent: [Agent],
app     | 2025-09-15 11:08:26.458 |       socketPath: undefined,
app     | 2025-09-15 11:08:26.458 |       method: 'GET',
app     | 2025-09-15 11:08:26.458 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:26.458 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:26.458 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:26.458 |       path: '/abf/public/api/v1/units?limit=1',
app     | 2025-09-15 11:08:26.458 |       _ended: true,
app     | 2025-09-15 11:08:26.458 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:26.458 |       aborted: false,
app     | 2025-09-15 11:08:26.458 |       timeoutCb: null,
app     | 2025-09-15 11:08:26.458 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:26.458 |       parser: null,
app     | 2025-09-15 11:08:26.458 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:26.458 |       reusedSocket: false,
app     | 2025-09-15 11:08:26.458 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:26.458 |       protocol: 'https:',
app     | 2025-09-15 11:08:26.458 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:26.458 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:26.458 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:26.458 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:26.458 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:26.458 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:26.458 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:26.458 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:26.458 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:26.458 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:26.458 |     },
app     | 2025-09-15 11:08:26.458 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:26.458 |   },
app     | 2025-09-15 11:08:26.458 |   status: 403
app     | 2025-09-15 11:08:26.458 | }
app     | 2025-09-15 11:08:26.453 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:26.453 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:26.453 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:26.453 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:26.453 |       [Symbol(kBytesWritten)]: 333,
app     | 2025-09-15 11:08:26.453 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:26.453 |     },
app     | 2025-09-15 11:08:26.453 |     _header: 'GET /abf/public/api/v1/units?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:26.453 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:26.453 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:26.453 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:26.453 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:26.453 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:26.453 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:26.453 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:26.453 |       '\r\n',
app     | 2025-09-15 11:08:26.453 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:26.453 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:26.453 |     agent: Agent {
app     | 2025-09-15 11:08:26.453 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:26.453 |       _eventsCount: 2,
app     | 2025-09-15 11:08:26.453 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:26.453 |       defaultPort: 443,
app     | 2025-09-15 11:08:26.453 |       protocol: 'https:',
app     | 2025-09-15 11:08:26.453 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:26.453 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:26.453 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:26.453 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:26.453 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:26.453 |       keepAlive: false,
app     | 2025-09-15 11:08:26.453 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:26.453 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:26.453 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:26.453 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:26.453 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:26.453 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:26.453 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:26.453 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:26.453 |     },
app     | 2025-09-15 11:08:26.453 |     socketPath: undefined,
app     | 2025-09-15 11:08:26.453 |     method: 'GET',
app     | 2025-09-15 11:08:26.453 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:26.454 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:26.454 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:26.454 |     path: '/abf/public/api/v1/units?limit=1',
app     | 2025-09-15 11:08:26.454 |     _ended: true,
app     | 2025-09-15 11:08:26.454 |     res: IncomingMessage {
app     | 2025-09-15 11:08:26.454 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:26.454 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:26.454 |       _eventsCount: 4,
app     | 2025-09-15 11:08:26.454 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:26.454 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:26.454 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:26.454 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:26.454 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:26.454 |       complete: true,
app     | 2025-09-15 11:08:26.454 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:26.454 |       rawTrailers: [],
app     | 2025-09-15 11:08:26.454 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:26.454 |       aborted: false,
app     | 2025-09-15 11:08:26.454 |       upgrade: false,
app     | 2025-09-15 11:08:26.454 |       url: '',
app     | 2025-09-15 11:08:26.454 |       method: null,
app     | 2025-09-15 11:08:26.454 |       statusCode: 403,
app     | 2025-09-15 11:08:26.454 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:26.454 |       client: [TLSSocket],
app     | 2025-09-15 11:08:26.454 |       _consuming: false,
app     | 2025-09-15 11:08:26.454 |       _dumped: false,
app     | 2025-09-15 11:08:26.454 |       req: [Circular *1],
app     | 2025-09-15 11:08:26.454 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/units?limit=1',
app     | 2025-09-15 11:08:26.454 |       redirects: [],
app     | 2025-09-15 11:08:26.454 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:26.454 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:26.454 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:26.454 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:26.454 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:26.454 |     },
app     | 2025-09-15 11:08:26.454 |     aborted: false,
app     | 2025-09-15 11:08:26.454 |     timeoutCb: null,
app     | 2025-09-15 11:08:26.454 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:26.454 |     parser: null,
app     | 2025-09-15 11:08:26.454 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:26.454 |     reusedSocket: false,
app     | 2025-09-15 11:08:26.455 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:26.455 |     protocol: 'https:',
app     | 2025-09-15 11:08:26.455 |     _redirectable: Writable {
app     | 2025-09-15 11:08:26.455 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:26.455 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:26.455 |       _eventsCount: 3,
app     | 2025-09-15 11:08:26.455 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:26.455 |       _options: [Object],
app     | 2025-09-15 11:08:26.455 |       _ended: true,
app     | 2025-09-15 11:08:26.455 |       _ending: true,
app     | 2025-09-15 11:08:26.455 |       _redirectCount: 0,
app     | 2025-09-15 11:08:26.455 |       _redirects: [],
app     | 2025-09-15 11:08:26.455 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:26.455 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:26.455 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:26.455 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:26.455 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/units?limit=1',
app     | 2025-09-15 11:08:26.455 |       _timeout: null,
app     | 2025-09-15 11:08:26.455 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:26.455 |     },
app     | 2025-09-15 11:08:26.455 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:26.455 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:26.455 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:26.455 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:26.455 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:26.455 |       accept: [Array],
app     | 2025-09-15 11:08:26.455 |       'content-type': [Array],
app     | 2025-09-15 11:08:26.455 |       'user-agent': [Array],
app     | 2025-09-15 11:08:26.455 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:26.455 |       host: [Array],
app     | 2025-09-15 11:08:26.455 |       authorization: [Array]
app     | 2025-09-15 11:08:26.455 |     },
app     | 2025-09-15 11:08:26.455 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:26.455 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:26.455 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:26.455 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:26.455 |   },
app     | 2025-09-15 11:08:26.455 |   response: {
app     | 2025-09-15 11:08:26.455 |     status: 403,
app     | 2025-09-15 11:08:26.455 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:26.455 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:26.455 |       server: 'nginx',
app     | 2025-09-15 11:08:26.455 |       date: 'Mon, 15 Sep 2025 14:08:27 GMT',
app     | 2025-09-15 11:08:26.455 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:26.455 |       'content-length': '34',
app     | 2025-09-15 11:08:26.455 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:26.455 |       'x-ratelimit-remaining-minute': '195',
app     | 2025-09-15 11:08:26.455 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:26.455 |       'ratelimit-remaining': '195',
app     | 2025-09-15 11:08:26.455 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:26.455 |       'ratelimit-reset': '33',
app     | 2025-09-15 11:08:26.455 |       'x-kong-response-latency': '3',
app     | 2025-09-15 11:08:26.455 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:26.455 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:26.456 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:26.456 |       connection: 'close'
app     | 2025-09-15 11:08:26.456 |     },
app     | 2025-09-15 11:08:26.456 |     config: {
app     | 2025-09-15 11:08:26.456 |       transitional: [Object],
app     | 2025-09-15 11:08:26.456 |       adapter: [Array],
app     | 2025-09-15 11:08:26.456 |       transformRequest: [Array],
app     | 2025-09-15 11:08:26.456 |       transformResponse: [Array],
app     | 2025-09-15 11:08:26.456 |       timeout: 30000,
app     | 2025-09-15 11:08:26.456 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:26.456 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:26.456 |       maxContentLength: -1,
app     | 2025-09-15 11:08:26.456 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:26.456 |       env: [Object],
app     | 2025-09-15 11:08:26.456 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:26.456 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:26.456 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:26.456 |       auth: [Object],
app     | 2025-09-15 11:08:26.456 |       method: 'get',
app     | 2025-09-15 11:08:26.456 |       url: '/units',
app     | 2025-09-15 11:08:26.456 |       params: [Object],
app     | 2025-09-15 11:08:26.456 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:26.456 |       metadata: [Object],
app     | 2025-09-15 11:08:26.456 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:26.457 |       data: undefined
app     | 2025-09-15 11:08:26.457 |     },
app     | 2025-09-15 11:08:26.457 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:26.457 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:26.457 |       _eventsCount: 7,
app     | 2025-09-15 11:08:26.457 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:26.457 |       outputData: [],
app     | 2025-09-15 11:08:26.457 |       outputSize: 0,
app     | 2025-09-15 11:08:26.457 |       writable: true,
app     | 2025-09-15 11:08:26.457 |       destroyed: true,
app     | 2025-09-15 11:08:26.457 |       _last: true,
app     | 2025-09-15 11:08:26.457 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:26.457 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:26.457 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:26.457 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:26.457 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:26.457 |       sendDate: false,
app     | 2025-09-15 11:08:26.458 |       _removedConnection: false,
app     | 2025-09-15 11:08:26.458 |       _removedContLen: false,
app     | 2025-09-15 11:08:26.458 |       _removedTE: false,
app     | 2025-09-15 11:08:26.458 |       strictContentLength: false,
app     | 2025-09-15 11:08:26.458 |       _contentLength: 0,
app     | 2025-09-15 11:08:26.458 |       _hasBody: true,
app     | 2025-09-15 11:08:26.458 |       _trailer: '',
app     | 2025-09-15 11:08:26.458 |       finished: true,
app     | 2025-09-15 11:08:26.458 |       _headerSent: true,
app     | 2025-09-15 11:08:26.458 |       _closed: true,
app     | 2025-09-15 11:08:26.458 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:26.458 |       _header: 'GET /abf/public/api/v1/units?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:26.458 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:26.458 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:26.458 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:26.458 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:26.458 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:26.458 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:26.458 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:26.458 |         '\r\n',
app     | 2025-09-15 11:08:26.458 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:26.458 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:26.458 |       agent: [Agent],
app     | 2025-09-15 11:08:26.458 |       socketPath: undefined,
app     | 2025-09-15 11:08:26.458 |       method: 'GET',
app     | 2025-09-15 11:08:26.458 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:26.458 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:26.458 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:26.458 |       path: '/abf/public/api/v1/units?limit=1',
app     | 2025-09-15 11:08:26.458 |       _ended: true,
app     | 2025-09-15 11:08:26.458 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:26.458 |       aborted: false,
app     | 2025-09-15 11:08:26.458 |       timeoutCb: null,
app     | 2025-09-15 11:08:26.458 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:26.458 |       parser: null,
app     | 2025-09-15 11:08:26.458 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:26.458 |       reusedSocket: false,
app     | 2025-09-15 11:08:26.458 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:26.458 |       protocol: 'https:',
app     | 2025-09-15 11:08:26.458 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:26.458 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:26.458 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:26.458 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:26.458 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:26.458 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:26.458 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:26.458 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:26.458 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:26.458 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:26.458 |     },
app     | 2025-09-15 11:08:26.458 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:26.458 |   },
app     | 2025-09-15 11:08:26.458 |   status: 403
app     | 2025-09-15 11:08:26.458 | }
app     | 2025-09-15 11:08:26.649 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:26.649 | [Sienge Proxy] Chamando endpoint: /units/characteristics com params: { limit: 1 }
app     | 2025-09-15 11:08:26.649 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:26.649 | [Sienge Proxy] Chamando endpoint: /units/characteristics com params: { limit: 1 }
app     | 2025-09-15 11:08:27.458 | [LOGGER] Flushing 2 log entries
app     | 2025-09-15 11:08:27.458 | [LOGGER] Flushing 2 log entries
app     | 2025-09-15 11:08:27.462 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:27.462 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:27.462 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:27.462 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:27.462 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:27.462 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:27.462 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:27.462 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:27.462 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:27.462 |   config: {
app     | 2025-09-15 11:08:27.462 |     transitional: {
app     | 2025-09-15 11:08:27.462 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:27.462 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:27.462 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:27.462 |     },
app     | 2025-09-15 11:08:27.462 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:27.462 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:27.462 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:27.462 |     timeout: 30000,
app     | 2025-09-15 11:08:27.462 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:27.462 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:27.462 |     maxContentLength: -1,
app     | 2025-09-15 11:08:27.462 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:27.462 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:27.462 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:27.462 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:27.462 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:27.462 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:27.462 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:27.462 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:27.462 |     },
app     | 2025-09-15 11:08:27.462 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:27.462 |     auth: {
app     | 2025-09-15 11:08:27.462 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:27.462 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:27.462 |     },
app     | 2025-09-15 11:08:27.462 |     method: 'get',
app     | 2025-09-15 11:08:27.462 |     url: '/units/characteristics',
app     | 2025-09-15 11:08:27.462 |     params: { limit: 1 },
app     | 2025-09-15 11:08:27.462 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:27.462 |     metadata: { startTime: 1757945306653 },
app     | 2025-09-15 11:08:27.462 |     'axios-retry': {
app     | 2025-09-15 11:08:27.462 |       retries: 3,
app     | 2025-09-15 11:08:27.462 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:27.462 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:27.462 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:27.462 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:27.462 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:27.463 |       validateResponse: null,
app     | 2025-09-15 11:08:27.463 |       retryCount: 0,
app     | 2025-09-15 11:08:27.463 |       lastRequestTime: 1757945306653
app     | 2025-09-15 11:08:27.463 |     },
app     | 2025-09-15 11:08:27.463 |     data: undefined
app     | 2025-09-15 11:08:27.463 |   },
app     | 2025-09-15 11:08:27.463 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:27.463 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:27.463 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:27.463 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:27.463 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:27.463 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:27.463 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:27.463 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:27.463 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:27.463 |     },
app     | 2025-09-15 11:08:27.463 |     _eventsCount: 7,
app     | 2025-09-15 11:08:27.463 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:27.463 |     outputData: [],
app     | 2025-09-15 11:08:27.463 |     outputSize: 0,
app     | 2025-09-15 11:08:27.463 |     writable: true,
app     | 2025-09-15 11:08:27.463 |     destroyed: true,
app     | 2025-09-15 11:08:27.463 |     _last: true,
app     | 2025-09-15 11:08:27.463 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:27.463 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:27.463 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:27.463 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:27.463 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:27.463 |     sendDate: false,
app     | 2025-09-15 11:08:27.463 |     _removedConnection: false,
app     | 2025-09-15 11:08:27.463 |     _removedContLen: false,
app     | 2025-09-15 11:08:27.463 |     _removedTE: false,
app     | 2025-09-15 11:08:27.463 |     strictContentLength: false,
app     | 2025-09-15 11:08:27.463 |     _contentLength: 0,
app     | 2025-09-15 11:08:27.463 |     _hasBody: true,
app     | 2025-09-15 11:08:27.463 |     _trailer: '',
app     | 2025-09-15 11:08:27.463 |     finished: true,
app     | 2025-09-15 11:08:27.463 |     _headerSent: true,
app     | 2025-09-15 11:08:27.463 |     _closed: true,
app     | 2025-09-15 11:08:27.463 |     socket: TLSSocket {
app     | 2025-09-15 11:08:27.463 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:27.463 |       _secureEstablished: true,
app     | 2025-09-15 11:08:27.463 |       _securePending: false,
app     | 2025-09-15 11:08:27.463 |       _newSessionPending: false,
app     | 2025-09-15 11:08:27.463 |       _controlReleased: true,
app     | 2025-09-15 11:08:27.463 |       secureConnecting: false,
app     | 2025-09-15 11:08:27.463 |       _SNICallback: null,
app     | 2025-09-15 11:08:27.463 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:27.463 |       alpnProtocol: false,
app     | 2025-09-15 11:08:27.463 |       authorized: true,
app     | 2025-09-15 11:08:27.463 |       authorizationError: null,
app     | 2025-09-15 11:08:27.463 |       encrypted: true,
app     | 2025-09-15 11:08:27.463 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:27.463 |       _eventsCount: 9,
app     | 2025-09-15 11:08:27.463 |       connecting: false,
app     | 2025-09-15 11:08:27.463 |       _hadError: false,
app     | 2025-09-15 11:08:27.463 |       _parent: null,
app     | 2025-09-15 11:08:27.463 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:27.463 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:27.463 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:27.463 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:27.463 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:27.463 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:27.463 |       _sockname: null,
app     | 2025-09-15 11:08:27.462 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:27.462 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:27.462 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:27.462 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:27.462 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:27.462 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:27.462 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:27.462 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:27.462 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:27.462 |   config: {
app     | 2025-09-15 11:08:27.462 |     transitional: {
app     | 2025-09-15 11:08:27.462 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:27.462 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:27.462 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:27.462 |     },
app     | 2025-09-15 11:08:27.462 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:27.462 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:27.462 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:27.462 |     timeout: 30000,
app     | 2025-09-15 11:08:27.462 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:27.462 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:27.462 |     maxContentLength: -1,
app     | 2025-09-15 11:08:27.462 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:27.462 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:27.462 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:27.462 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:27.462 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:27.462 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:27.462 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:27.462 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:27.462 |     },
app     | 2025-09-15 11:08:27.462 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:27.462 |     auth: {
app     | 2025-09-15 11:08:27.462 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:27.462 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:27.462 |     },
app     | 2025-09-15 11:08:27.462 |     method: 'get',
app     | 2025-09-15 11:08:27.462 |     url: '/units/characteristics',
app     | 2025-09-15 11:08:27.462 |     params: { limit: 1 },
app     | 2025-09-15 11:08:27.462 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:27.462 |     metadata: { startTime: 1757945306653 },
app     | 2025-09-15 11:08:27.462 |     'axios-retry': {
app     | 2025-09-15 11:08:27.462 |       retries: 3,
app     | 2025-09-15 11:08:27.462 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:27.462 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:27.462 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:27.462 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:27.462 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:27.463 |       validateResponse: null,
app     | 2025-09-15 11:08:27.463 |       retryCount: 0,
app     | 2025-09-15 11:08:27.463 |       lastRequestTime: 1757945306653
app     | 2025-09-15 11:08:27.463 |     },
app     | 2025-09-15 11:08:27.463 |     data: undefined
app     | 2025-09-15 11:08:27.463 |   },
app     | 2025-09-15 11:08:27.463 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:27.463 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:27.463 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:27.463 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:27.463 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:27.463 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:27.463 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:27.463 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:27.463 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:27.463 |     },
app     | 2025-09-15 11:08:27.463 |     _eventsCount: 7,
app     | 2025-09-15 11:08:27.463 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:27.463 |     outputData: [],
app     | 2025-09-15 11:08:27.463 |     outputSize: 0,
app     | 2025-09-15 11:08:27.463 |     writable: true,
app     | 2025-09-15 11:08:27.463 |     destroyed: true,
app     | 2025-09-15 11:08:27.463 |     _last: true,
app     | 2025-09-15 11:08:27.463 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:27.463 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:27.463 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:27.463 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:27.463 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:27.463 |     sendDate: false,
app     | 2025-09-15 11:08:27.463 |     _removedConnection: false,
app     | 2025-09-15 11:08:27.463 |     _removedContLen: false,
app     | 2025-09-15 11:08:27.463 |     _removedTE: false,
app     | 2025-09-15 11:08:27.463 |     strictContentLength: false,
app     | 2025-09-15 11:08:27.463 |     _contentLength: 0,
app     | 2025-09-15 11:08:27.463 |     _hasBody: true,
app     | 2025-09-15 11:08:27.463 |     _trailer: '',
app     | 2025-09-15 11:08:27.463 |     finished: true,
app     | 2025-09-15 11:08:27.463 |     _headerSent: true,
app     | 2025-09-15 11:08:27.463 |     _closed: true,
app     | 2025-09-15 11:08:27.463 |     socket: TLSSocket {
app     | 2025-09-15 11:08:27.463 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:27.463 |       _secureEstablished: true,
app     | 2025-09-15 11:08:27.463 |       _securePending: false,
app     | 2025-09-15 11:08:27.463 |       _newSessionPending: false,
app     | 2025-09-15 11:08:27.463 |       _controlReleased: true,
app     | 2025-09-15 11:08:27.463 |       secureConnecting: false,
app     | 2025-09-15 11:08:27.463 |       _SNICallback: null,
app     | 2025-09-15 11:08:27.463 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:27.463 |       alpnProtocol: false,
app     | 2025-09-15 11:08:27.463 |       authorized: true,
app     | 2025-09-15 11:08:27.463 |       authorizationError: null,
app     | 2025-09-15 11:08:27.463 |       encrypted: true,
app     | 2025-09-15 11:08:27.463 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:27.463 |       _eventsCount: 9,
app     | 2025-09-15 11:08:27.463 |       connecting: false,
app     | 2025-09-15 11:08:27.463 |       _hadError: false,
app     | 2025-09-15 11:08:27.463 |       _parent: null,
app     | 2025-09-15 11:08:27.463 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:27.463 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:27.463 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:27.463 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:27.463 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:27.463 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:27.463 |       _sockname: null,
app     | 2025-09-15 11:08:27.463 |       _pendingData: null,
app     | 2025-09-15 11:08:27.463 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:27.464 |       server: undefined,
app     | 2025-09-15 11:08:27.464 |       _server: null,
app     | 2025-09-15 11:08:27.464 |       ssl: null,
app     | 2025-09-15 11:08:27.464 |       _requestCert: true,
app     | 2025-09-15 11:08:27.464 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:27.464 |       parser: null,
app     | 2025-09-15 11:08:27.464 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:27.464 |       timeout: 30000,
app     | 2025-09-15 11:08:27.464 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:27.464 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:27.464 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:27.464 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:27.464 |       [Symbol(async_id_symbol)]: 8983,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:27.464 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:27.464 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:27.464 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:27.464 |         _idlePrev: null,
app     | 2025-09-15 11:08:27.464 |         _idleNext: null,
app     | 2025-09-15 11:08:27.464 |         _idleStart: 16515,
app     | 2025-09-15 11:08:27.464 |         _onTimeout: null,
app     | 2025-09-15 11:08:27.464 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:27.464 |         _repeat: null,
app     | 2025-09-15 11:08:27.464 |         _destroyed: true,
app     | 2025-09-15 11:08:27.464 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:27.464 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:27.464 |         [Symbol(asyncId)]: 8994,
app     | 2025-09-15 11:08:27.464 |         [Symbol(triggerId)]: 8986,
app     | 2025-09-15 11:08:27.464 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:27.464 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:27.464 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:27.464 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:27.464 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:27.464 |       },
app     | 2025-09-15 11:08:27.464 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kBytesWritten)]: 349,
app     | 2025-09-15 11:08:27.464 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:27.464 |     },
app     | 2025-09-15 11:08:27.464 |     _header: 'GET /abf/public/api/v1/units/characteristics?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:27.464 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:27.464 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:27.464 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:27.464 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:27.464 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:27.464 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:27.464 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:27.464 |       '\r\n',
app     | 2025-09-15 11:08:27.464 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:27.464 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:27.464 |     agent: Agent {
app     | 2025-09-15 11:08:27.464 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:27.464 |       _eventsCount: 2,
app     | 2025-09-15 11:08:27.464 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:27.464 |       defaultPort: 443,
app     | 2025-09-15 11:08:27.464 |       protocol: 'https:',
app     | 2025-09-15 11:08:27.464 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:27.464 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:27.464 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:27.464 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:27.464 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:27.464 |       keepAlive: false,
app     | 2025-09-15 11:08:27.464 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:27.464 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:27.464 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:27.464 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:27.464 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:27.464 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:27.464 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:27.465 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:27.465 |     },
app     | 2025-09-15 11:08:27.465 |     socketPath: undefined,
app     | 2025-09-15 11:08:27.465 |     method: 'GET',
app     | 2025-09-15 11:08:27.465 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:27.465 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:27.465 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:27.465 |     path: '/abf/public/api/v1/units/characteristics?limit=1',
app     | 2025-09-15 11:08:27.465 |     _ended: true,
app     | 2025-09-15 11:08:27.465 |     res: IncomingMessage {
app     | 2025-09-15 11:08:27.465 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:27.465 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:27.465 |       _eventsCount: 4,
app     | 2025-09-15 11:08:27.465 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:27.465 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:27.465 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:27.465 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:27.465 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:27.465 |       complete: true,
app     | 2025-09-15 11:08:27.465 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:27.465 |       rawTrailers: [],
app     | 2025-09-15 11:08:27.465 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:27.465 |       aborted: false,
app     | 2025-09-15 11:08:27.465 |       upgrade: false,
app     | 2025-09-15 11:08:27.465 |       url: '',
app     | 2025-09-15 11:08:27.465 |       method: null,
app     | 2025-09-15 11:08:27.465 |       statusCode: 403,
app     | 2025-09-15 11:08:27.465 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:27.465 |       client: [TLSSocket],
app     | 2025-09-15 11:08:27.465 |       _consuming: false,
app     | 2025-09-15 11:08:27.465 |       _dumped: false,
app     | 2025-09-15 11:08:27.465 |       req: [Circular *1],
app     | 2025-09-15 11:08:27.465 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/units/characteristics?limit=1',
app     | 2025-09-15 11:08:27.465 |       redirects: [],
app     | 2025-09-15 11:08:27.465 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:27.465 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:27.465 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:27.465 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:27.465 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:27.465 |     },
app     | 2025-09-15 11:08:27.465 |     aborted: false,
app     | 2025-09-15 11:08:27.465 |     timeoutCb: null,
app     | 2025-09-15 11:08:27.465 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:27.465 |     parser: null,
app     | 2025-09-15 11:08:27.465 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:27.465 |     reusedSocket: false,
app     | 2025-09-15 11:08:27.465 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:27.465 |     protocol: 'https:',
app     | 2025-09-15 11:08:27.465 |     _redirectable: Writable {
app     | 2025-09-15 11:08:27.465 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:27.465 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:27.465 |       _eventsCount: 3,
app     | 2025-09-15 11:08:27.465 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:27.465 |       _options: [Object],
app     | 2025-09-15 11:08:27.465 |       _ended: true,
app     | 2025-09-15 11:08:27.465 |       _ending: true,
app     | 2025-09-15 11:08:27.465 |       _redirectCount: 0,
app     | 2025-09-15 11:08:27.465 |       _redirects: [],
app     | 2025-09-15 11:08:27.465 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:27.465 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:27.465 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:27.465 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:27.465 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/units/characteristics?limit=1',
app     | 2025-09-15 11:08:27.465 |       _timeout: null,
app     | 2025-09-15 11:08:27.465 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:27.465 |     },
app     | 2025-09-15 11:08:27.465 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:27.465 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:27.465 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:27.465 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:27.465 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:27.465 |       accept: [Array],
app     | 2025-09-15 11:08:27.465 |       'content-type': [Array],
app     | 2025-09-15 11:08:27.465 |       'user-agent': [Array],
app     | 2025-09-15 11:08:27.465 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:27.465 |       host: [Array],
app     | 2025-09-15 11:08:27.465 |       authorization: [Array]
app     | 2025-09-15 11:08:27.465 |     },
app     | 2025-09-15 11:08:27.465 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:27.465 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:27.465 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:27.465 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:27.465 |   },
app     | 2025-09-15 11:08:27.465 |   response: {
app     | 2025-09-15 11:08:27.465 |     status: 403,
app     | 2025-09-15 11:08:27.465 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:27.465 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:27.465 |       server: 'nginx',
app     | 2025-09-15 11:08:27.465 |       date: 'Mon, 15 Sep 2025 14:08:28 GMT',
app     | 2025-09-15 11:08:27.465 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:27.465 |       'content-length': '34',
app     | 2025-09-15 11:08:27.465 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:27.465 |       'x-ratelimit-remaining-minute': '194',
app     | 2025-09-15 11:08:27.465 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:27.465 |       'ratelimit-remaining': '194',
app     | 2025-09-15 11:08:27.465 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:27.466 |       'ratelimit-reset': '32',
app     | 2025-09-15 11:08:27.466 |       'x-kong-response-latency': '5',
app     | 2025-09-15 11:08:27.466 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:27.466 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:27.466 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:27.466 |       connection: 'close'
app     | 2025-09-15 11:08:27.466 |     },
app     | 2025-09-15 11:08:27.466 |     config: {
app     | 2025-09-15 11:08:27.466 |       transitional: [Object],
app     | 2025-09-15 11:08:27.466 |       adapter: [Array],
app     | 2025-09-15 11:08:27.466 |       transformRequest: [Array],
app     | 2025-09-15 11:08:27.466 |       transformResponse: [Array],
app     | 2025-09-15 11:08:27.466 |       timeout: 30000,
app     | 2025-09-15 11:08:27.466 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:27.466 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:27.466 |       maxContentLength: -1,
app     | 2025-09-15 11:08:27.466 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:27.466 |       env: [Object],
app     | 2025-09-15 11:08:27.466 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:27.466 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:27.466 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:27.466 |       auth: [Object],
app     | 2025-09-15 11:08:27.466 |       method: 'get',
app     | 2025-09-15 11:08:27.466 |       url: '/units/characteristics',
app     | 2025-09-15 11:08:27.466 |       params: [Object],
app     | 2025-09-15 11:08:27.466 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:27.466 |       metadata: [Object],
app     | 2025-09-15 11:08:27.466 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:27.466 |       data: undefined
app     | 2025-09-15 11:08:27.466 |     },
app     | 2025-09-15 11:08:27.466 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:27.466 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:27.466 |       _eventsCount: 7,
app     | 2025-09-15 11:08:27.466 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:27.466 |       outputData: [],
app     | 2025-09-15 11:08:27.466 |       outputSize: 0,
app     | 2025-09-15 11:08:27.466 |       writable: true,
app     | 2025-09-15 11:08:27.466 |       destroyed: true,
app     | 2025-09-15 11:08:27.466 |       _last: true,
app     | 2025-09-15 11:08:27.466 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:27.466 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:27.466 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:27.466 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:27.466 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:27.466 |       sendDate: false,
app     | 2025-09-15 11:08:27.466 |       _removedConnection: false,
app     | 2025-09-15 11:08:27.466 |       _removedContLen: false,
app     | 2025-09-15 11:08:27.466 |       _removedTE: false,
app     | 2025-09-15 11:08:27.466 |       strictContentLength: false,
app     | 2025-09-15 11:08:27.466 |       _contentLength: 0,
app     | 2025-09-15 11:08:27.466 |       _hasBody: true,
app     | 2025-09-15 11:08:27.466 |       _trailer: '',
app     | 2025-09-15 11:08:27.466 |       finished: true,
app     | 2025-09-15 11:08:27.466 |       _headerSent: true,
app     | 2025-09-15 11:08:27.466 |       _closed: true,
app     | 2025-09-15 11:08:27.466 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:27.466 |       _header: 'GET /abf/public/api/v1/units/characteristics?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:27.466 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:27.467 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:27.467 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:27.467 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:27.467 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:27.467 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:27.467 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:27.467 |         '\r\n',
app     | 2025-09-15 11:08:27.467 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:27.467 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:27.467 |       agent: [Agent],
app     | 2025-09-15 11:08:27.467 |       socketPath: undefined,
app     | 2025-09-15 11:08:27.467 |       method: 'GET',
app     | 2025-09-15 11:08:27.467 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:27.467 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:27.467 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:27.467 |       path: '/abf/public/api/v1/units/characteristics?limit=1',
app     | 2025-09-15 11:08:27.467 |       _ended: true,
app     | 2025-09-15 11:08:27.467 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:27.467 |       aborted: false,
app     | 2025-09-15 11:08:27.467 |       timeoutCb: null,
app     | 2025-09-15 11:08:27.467 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:27.467 |       parser: null,
app     | 2025-09-15 11:08:27.467 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:27.467 |       reusedSocket: false,
app     | 2025-09-15 11:08:27.467 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:27.467 |       protocol: 'https:',
app     | 2025-09-15 11:08:27.467 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:27.467 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:27.467 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:27.467 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:27.467 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:27.467 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:27.467 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:27.467 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:27.467 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:27.467 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:27.467 |     },
app     | 2025-09-15 11:08:27.467 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:27.467 |   },
app     | 2025-09-15 11:08:27.467 |   status: 403
app     | 2025-09-15 11:08:27.467 | }
app     | 2025-09-15 11:08:27.463 |       _pendingData: null,
app     | 2025-09-15 11:08:27.463 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:27.464 |       server: undefined,
app     | 2025-09-15 11:08:27.464 |       _server: null,
app     | 2025-09-15 11:08:27.464 |       ssl: null,
app     | 2025-09-15 11:08:27.464 |       _requestCert: true,
app     | 2025-09-15 11:08:27.464 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:27.464 |       parser: null,
app     | 2025-09-15 11:08:27.464 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:27.464 |       timeout: 30000,
app     | 2025-09-15 11:08:27.464 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:27.464 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:27.464 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:27.464 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:27.464 |       [Symbol(async_id_symbol)]: 8983,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:27.464 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:27.464 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:27.464 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:27.464 |         _idlePrev: null,
app     | 2025-09-15 11:08:27.464 |         _idleNext: null,
app     | 2025-09-15 11:08:27.464 |         _idleStart: 16515,
app     | 2025-09-15 11:08:27.464 |         _onTimeout: null,
app     | 2025-09-15 11:08:27.464 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:27.464 |         _repeat: null,
app     | 2025-09-15 11:08:27.464 |         _destroyed: true,
app     | 2025-09-15 11:08:27.464 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:27.464 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:27.464 |         [Symbol(asyncId)]: 8994,
app     | 2025-09-15 11:08:27.464 |         [Symbol(triggerId)]: 8986,
app     | 2025-09-15 11:08:27.464 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:27.464 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:27.464 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:27.464 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:27.464 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:27.464 |       },
app     | 2025-09-15 11:08:27.464 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:27.464 |       [Symbol(kBytesWritten)]: 349,
app     | 2025-09-15 11:08:27.464 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:27.464 |     },
app     | 2025-09-15 11:08:27.464 |     _header: 'GET /abf/public/api/v1/units/characteristics?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:27.464 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:27.464 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:27.464 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:27.464 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:27.464 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:27.464 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:27.464 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:27.464 |       '\r\n',
app     | 2025-09-15 11:08:27.464 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:27.464 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:27.464 |     agent: Agent {
app     | 2025-09-15 11:08:27.464 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:27.464 |       _eventsCount: 2,
app     | 2025-09-15 11:08:27.464 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:27.464 |       defaultPort: 443,
app     | 2025-09-15 11:08:27.464 |       protocol: 'https:',
app     | 2025-09-15 11:08:27.464 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:27.464 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:27.464 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:27.464 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:27.464 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:27.464 |       keepAlive: false,
app     | 2025-09-15 11:08:27.464 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:27.464 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:27.464 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:27.464 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:27.464 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:27.464 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:27.464 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:27.465 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:27.465 |     },
app     | 2025-09-15 11:08:27.465 |     socketPath: undefined,
app     | 2025-09-15 11:08:27.465 |     method: 'GET',
app     | 2025-09-15 11:08:27.465 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:27.465 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:27.465 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:27.465 |     path: '/abf/public/api/v1/units/characteristics?limit=1',
app     | 2025-09-15 11:08:27.465 |     _ended: true,
app     | 2025-09-15 11:08:27.465 |     res: IncomingMessage {
app     | 2025-09-15 11:08:27.465 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:27.465 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:27.465 |       _eventsCount: 4,
app     | 2025-09-15 11:08:27.465 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:27.465 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:27.465 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:27.465 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:27.465 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:27.465 |       complete: true,
app     | 2025-09-15 11:08:27.465 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:27.465 |       rawTrailers: [],
app     | 2025-09-15 11:08:27.465 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:27.465 |       aborted: false,
app     | 2025-09-15 11:08:27.465 |       upgrade: false,
app     | 2025-09-15 11:08:27.465 |       url: '',
app     | 2025-09-15 11:08:27.465 |       method: null,
app     | 2025-09-15 11:08:27.465 |       statusCode: 403,
app     | 2025-09-15 11:08:27.465 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:27.465 |       client: [TLSSocket],
app     | 2025-09-15 11:08:27.465 |       _consuming: false,
app     | 2025-09-15 11:08:27.465 |       _dumped: false,
app     | 2025-09-15 11:08:27.465 |       req: [Circular *1],
app     | 2025-09-15 11:08:27.465 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/units/characteristics?limit=1',
app     | 2025-09-15 11:08:27.465 |       redirects: [],
app     | 2025-09-15 11:08:27.465 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:27.465 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:27.465 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:27.465 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:27.465 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:27.465 |     },
app     | 2025-09-15 11:08:27.465 |     aborted: false,
app     | 2025-09-15 11:08:27.465 |     timeoutCb: null,
app     | 2025-09-15 11:08:27.465 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:27.465 |     parser: null,
app     | 2025-09-15 11:08:27.465 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:27.465 |     reusedSocket: false,
app     | 2025-09-15 11:08:27.465 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:27.465 |     protocol: 'https:',
app     | 2025-09-15 11:08:27.465 |     _redirectable: Writable {
app     | 2025-09-15 11:08:27.465 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:27.465 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:27.465 |       _eventsCount: 3,
app     | 2025-09-15 11:08:27.465 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:27.465 |       _options: [Object],
app     | 2025-09-15 11:08:27.465 |       _ended: true,
app     | 2025-09-15 11:08:27.465 |       _ending: true,
app     | 2025-09-15 11:08:27.465 |       _redirectCount: 0,
app     | 2025-09-15 11:08:27.465 |       _redirects: [],
app     | 2025-09-15 11:08:27.465 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:27.465 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:27.465 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:27.465 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:27.465 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/units/characteristics?limit=1',
app     | 2025-09-15 11:08:27.465 |       _timeout: null,
app     | 2025-09-15 11:08:27.465 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:27.465 |     },
app     | 2025-09-15 11:08:27.465 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:27.465 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:27.465 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:27.465 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:27.465 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:27.465 |       accept: [Array],
app     | 2025-09-15 11:08:27.465 |       'content-type': [Array],
app     | 2025-09-15 11:08:27.465 |       'user-agent': [Array],
app     | 2025-09-15 11:08:27.465 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:27.465 |       host: [Array],
app     | 2025-09-15 11:08:27.465 |       authorization: [Array]
app     | 2025-09-15 11:08:27.465 |     },
app     | 2025-09-15 11:08:27.465 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:27.465 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:27.465 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:27.465 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:27.465 |   },
app     | 2025-09-15 11:08:27.465 |   response: {
app     | 2025-09-15 11:08:27.465 |     status: 403,
app     | 2025-09-15 11:08:27.465 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:27.465 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:27.465 |       server: 'nginx',
app     | 2025-09-15 11:08:27.465 |       date: 'Mon, 15 Sep 2025 14:08:28 GMT',
app     | 2025-09-15 11:08:27.465 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:27.465 |       'content-length': '34',
app     | 2025-09-15 11:08:27.465 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:27.465 |       'x-ratelimit-remaining-minute': '194',
app     | 2025-09-15 11:08:27.465 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:27.465 |       'ratelimit-remaining': '194',
app     | 2025-09-15 11:08:27.465 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:27.466 |       'ratelimit-reset': '32',
app     | 2025-09-15 11:08:27.466 |       'x-kong-response-latency': '5',
app     | 2025-09-15 11:08:27.466 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:27.466 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:27.466 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:27.466 |       connection: 'close'
app     | 2025-09-15 11:08:27.466 |     },
app     | 2025-09-15 11:08:27.466 |     config: {
app     | 2025-09-15 11:08:27.466 |       transitional: [Object],
app     | 2025-09-15 11:08:27.466 |       adapter: [Array],
app     | 2025-09-15 11:08:27.466 |       transformRequest: [Array],
app     | 2025-09-15 11:08:27.466 |       transformResponse: [Array],
app     | 2025-09-15 11:08:27.466 |       timeout: 30000,
app     | 2025-09-15 11:08:27.466 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:27.466 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:27.466 |       maxContentLength: -1,
app     | 2025-09-15 11:08:27.466 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:27.466 |       env: [Object],
app     | 2025-09-15 11:08:27.466 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:27.466 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:27.466 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:27.466 |       auth: [Object],
app     | 2025-09-15 11:08:27.466 |       method: 'get',
app     | 2025-09-15 11:08:27.466 |       url: '/units/characteristics',
app     | 2025-09-15 11:08:27.466 |       params: [Object],
app     | 2025-09-15 11:08:27.466 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:27.466 |       metadata: [Object],
app     | 2025-09-15 11:08:27.466 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:27.466 |       data: undefined
app     | 2025-09-15 11:08:27.466 |     },
app     | 2025-09-15 11:08:27.466 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:27.466 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:27.466 |       _eventsCount: 7,
app     | 2025-09-15 11:08:27.466 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:27.466 |       outputData: [],
app     | 2025-09-15 11:08:27.466 |       outputSize: 0,
app     | 2025-09-15 11:08:27.466 |       writable: true,
app     | 2025-09-15 11:08:27.466 |       destroyed: true,
app     | 2025-09-15 11:08:27.466 |       _last: true,
app     | 2025-09-15 11:08:27.466 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:27.466 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:27.466 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:27.466 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:27.466 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:27.466 |       sendDate: false,
app     | 2025-09-15 11:08:27.466 |       _removedConnection: false,
app     | 2025-09-15 11:08:27.466 |       _removedContLen: false,
app     | 2025-09-15 11:08:27.466 |       _removedTE: false,
app     | 2025-09-15 11:08:27.466 |       strictContentLength: false,
app     | 2025-09-15 11:08:27.466 |       _contentLength: 0,
app     | 2025-09-15 11:08:27.466 |       _hasBody: true,
app     | 2025-09-15 11:08:27.466 |       _trailer: '',
app     | 2025-09-15 11:08:27.466 |       finished: true,
app     | 2025-09-15 11:08:27.466 |       _headerSent: true,
app     | 2025-09-15 11:08:27.466 |       _closed: true,
app     | 2025-09-15 11:08:27.466 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:27.466 |       _header: 'GET /abf/public/api/v1/units/characteristics?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:27.466 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:27.467 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:27.467 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:27.467 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:27.467 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:27.467 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:27.467 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:27.467 |         '\r\n',
app     | 2025-09-15 11:08:27.467 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:27.467 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:27.467 |       agent: [Agent],
app     | 2025-09-15 11:08:27.467 |       socketPath: undefined,
app     | 2025-09-15 11:08:27.467 |       method: 'GET',
app     | 2025-09-15 11:08:27.467 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:27.467 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:27.467 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:27.467 |       path: '/abf/public/api/v1/units/characteristics?limit=1',
app     | 2025-09-15 11:08:27.467 |       _ended: true,
app     | 2025-09-15 11:08:27.467 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:27.467 |       aborted: false,
app     | 2025-09-15 11:08:27.467 |       timeoutCb: null,
app     | 2025-09-15 11:08:27.467 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:27.467 |       parser: null,
app     | 2025-09-15 11:08:27.467 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:27.467 |       reusedSocket: false,
app     | 2025-09-15 11:08:27.467 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:27.467 |       protocol: 'https:',
app     | 2025-09-15 11:08:27.467 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:27.467 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:27.467 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:27.467 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:27.467 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:27.467 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:27.467 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:27.467 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:27.467 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:27.467 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:27.467 |     },
app     | 2025-09-15 11:08:27.467 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:27.467 |   },
app     | 2025-09-15 11:08:27.467 |   status: 403
app     | 2025-09-15 11:08:27.467 | }
app     | 2025-09-15 11:08:27.667 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:27.667 | [Sienge Proxy] Chamando endpoint: /units/situations com params: { limit: 1 }
app     | 2025-09-15 11:08:27.667 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:27.667 | [Sienge Proxy] Chamando endpoint: /units/situations com params: { limit: 1 }
app     | 2025-09-15 11:08:28.108 | [LOGGER] Flushing 2 log entries
app     | 2025-09-15 11:08:28.108 | [LOGGER] Flushing 2 log entries
app     | 2025-09-15 11:08:28.111 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:28.111 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:28.111 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:28.111 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:28.111 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:28.111 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:28.111 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:28.111 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:28.111 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:28.111 |   config: {
app     | 2025-09-15 11:08:28.111 |     transitional: {
app     | 2025-09-15 11:08:28.111 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:28.111 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:28.111 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:28.111 |     },
app     | 2025-09-15 11:08:28.111 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:28.111 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:28.111 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:28.111 |     timeout: 30000,
app     | 2025-09-15 11:08:28.111 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:28.111 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:28.111 |     maxContentLength: -1,
app     | 2025-09-15 11:08:28.111 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:28.111 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:28.111 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:28.111 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:28.111 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:28.111 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:28.111 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:28.111 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:28.111 |     },
app     | 2025-09-15 11:08:28.111 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:28.111 |     auth: {
app     | 2025-09-15 11:08:28.111 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:28.111 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:28.111 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:28.111 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:28.111 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:28.111 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:28.111 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:28.111 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:28.111 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:28.111 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:28.111 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:28.111 |   config: {
app     | 2025-09-15 11:08:28.111 |     transitional: {
app     | 2025-09-15 11:08:28.111 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:28.111 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:28.111 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:28.111 |     },
app     | 2025-09-15 11:08:28.111 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:28.111 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:28.111 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:28.111 |     timeout: 30000,
app     | 2025-09-15 11:08:28.111 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:28.111 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:28.111 |     maxContentLength: -1,
app     | 2025-09-15 11:08:28.111 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:28.111 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:28.111 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:28.111 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:28.111 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:28.111 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:28.111 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:28.111 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:28.111 |     },
app     | 2025-09-15 11:08:28.111 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:28.111 |     auth: {
app     | 2025-09-15 11:08:28.111 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:28.111 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:28.111 |     },
app     | 2025-09-15 11:08:28.111 |     method: 'get',
app     | 2025-09-15 11:08:28.111 |     url: '/units/situations',
app     | 2025-09-15 11:08:28.111 |     params: { limit: 1 },
app     | 2025-09-15 11:08:28.111 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:28.111 |     metadata: { startTime: 1757945307671 },
app     | 2025-09-15 11:08:28.111 |     'axios-retry': {
app     | 2025-09-15 11:08:28.111 |       retries: 3,
app     | 2025-09-15 11:08:28.111 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:28.111 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:28.111 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:28.111 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:28.111 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:28.111 |       validateResponse: null,
app     | 2025-09-15 11:08:28.111 |       retryCount: 0,
app     | 2025-09-15 11:08:28.111 |       lastRequestTime: 1757945307672
app     | 2025-09-15 11:08:28.111 |     },
app     | 2025-09-15 11:08:28.111 |     data: undefined
app     | 2025-09-15 11:08:28.111 |   },
app     | 2025-09-15 11:08:28.111 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:28.111 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:28.111 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:28.111 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:28.111 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:28.111 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:28.111 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:28.111 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:28.111 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:28.111 |     },
app     | 2025-09-15 11:08:28.111 |     _eventsCount: 7,
app     | 2025-09-15 11:08:28.111 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:28.111 |     outputData: [],
app     | 2025-09-15 11:08:28.111 |     outputSize: 0,
app     | 2025-09-15 11:08:28.111 |     writable: true,
app     | 2025-09-15 11:08:28.111 |     destroyed: true,
app     | 2025-09-15 11:08:28.111 |     _last: true,
app     | 2025-09-15 11:08:28.111 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:28.111 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:28.111 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:28.111 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:28.111 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:28.111 |     sendDate: false,
app     | 2025-09-15 11:08:28.111 |     _removedConnection: false,
app     | 2025-09-15 11:08:28.111 |     _removedContLen: false,
app     | 2025-09-15 11:08:28.111 |     _removedTE: false,
app     | 2025-09-15 11:08:28.111 |     strictContentLength: false,
app     | 2025-09-15 11:08:28.111 |     _contentLength: 0,
app     | 2025-09-15 11:08:28.111 |     _hasBody: true,
app     | 2025-09-15 11:08:28.111 |     _trailer: '',
app     | 2025-09-15 11:08:28.111 |     finished: true,
app     | 2025-09-15 11:08:28.111 |     _headerSent: true,
app     | 2025-09-15 11:08:28.111 |     _closed: true,
app     | 2025-09-15 11:08:28.111 |     socket: TLSSocket {
app     | 2025-09-15 11:08:28.111 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:28.111 |       _secureEstablished: true,
app     | 2025-09-15 11:08:28.111 |       _securePending: false,
app     | 2025-09-15 11:08:28.111 |       _newSessionPending: false,
app     | 2025-09-15 11:08:28.111 |       _controlReleased: true,
app     | 2025-09-15 11:08:28.111 |       secureConnecting: false,
app     | 2025-09-15 11:08:28.111 |       _SNICallback: null,
app     | 2025-09-15 11:08:28.111 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:28.111 |       alpnProtocol: false,
app     | 2025-09-15 11:08:28.111 |       authorized: true,
app     | 2025-09-15 11:08:28.111 |       authorizationError: null,
app     | 2025-09-15 11:08:28.111 |       encrypted: true,
app     | 2025-09-15 11:08:28.111 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:28.111 |       _eventsCount: 9,
app     | 2025-09-15 11:08:28.111 |       connecting: false,
app     | 2025-09-15 11:08:28.111 |       _hadError: false,
app     | 2025-09-15 11:08:28.111 |       _parent: null,
app     | 2025-09-15 11:08:28.111 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:28.111 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:28.112 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:28.112 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:28.112 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:28.112 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:28.112 |       _sockname: null,
app     | 2025-09-15 11:08:28.112 |       _pendingData: null,
app     | 2025-09-15 11:08:28.112 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:28.112 |       server: undefined,
app     | 2025-09-15 11:08:28.112 |       _server: null,
app     | 2025-09-15 11:08:28.111 |     },
app     | 2025-09-15 11:08:28.111 |     method: 'get',
app     | 2025-09-15 11:08:28.111 |     url: '/units/situations',
app     | 2025-09-15 11:08:28.111 |     params: { limit: 1 },
app     | 2025-09-15 11:08:28.111 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:28.111 |     metadata: { startTime: 1757945307671 },
app     | 2025-09-15 11:08:28.111 |     'axios-retry': {
app     | 2025-09-15 11:08:28.111 |       retries: 3,
app     | 2025-09-15 11:08:28.111 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:28.111 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:28.111 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:28.111 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:28.111 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:28.111 |       validateResponse: null,
app     | 2025-09-15 11:08:28.111 |       retryCount: 0,
app     | 2025-09-15 11:08:28.111 |       lastRequestTime: 1757945307672
app     | 2025-09-15 11:08:28.111 |     },
app     | 2025-09-15 11:08:28.111 |     data: undefined
app     | 2025-09-15 11:08:28.111 |   },
app     | 2025-09-15 11:08:28.111 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:28.111 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:28.111 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:28.111 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:28.111 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:28.111 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:28.111 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:28.111 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:28.111 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:28.111 |     },
app     | 2025-09-15 11:08:28.111 |     _eventsCount: 7,
app     | 2025-09-15 11:08:28.111 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:28.111 |     outputData: [],
app     | 2025-09-15 11:08:28.111 |     outputSize: 0,
app     | 2025-09-15 11:08:28.111 |     writable: true,
app     | 2025-09-15 11:08:28.111 |     destroyed: true,
app     | 2025-09-15 11:08:28.111 |     _last: true,
app     | 2025-09-15 11:08:28.111 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:28.111 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:28.111 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:28.111 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:28.111 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:28.111 |     sendDate: false,
app     | 2025-09-15 11:08:28.111 |     _removedConnection: false,
app     | 2025-09-15 11:08:28.111 |     _removedContLen: false,
app     | 2025-09-15 11:08:28.111 |     _removedTE: false,
app     | 2025-09-15 11:08:28.111 |     strictContentLength: false,
app     | 2025-09-15 11:08:28.111 |     _contentLength: 0,
app     | 2025-09-15 11:08:28.111 |     _hasBody: true,
app     | 2025-09-15 11:08:28.111 |     _trailer: '',
app     | 2025-09-15 11:08:28.111 |     finished: true,
app     | 2025-09-15 11:08:28.111 |     _headerSent: true,
app     | 2025-09-15 11:08:28.111 |     _closed: true,
app     | 2025-09-15 11:08:28.111 |     socket: TLSSocket {
app     | 2025-09-15 11:08:28.111 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:28.111 |       _secureEstablished: true,
app     | 2025-09-15 11:08:28.111 |       _securePending: false,
app     | 2025-09-15 11:08:28.111 |       _newSessionPending: false,
app     | 2025-09-15 11:08:28.111 |       _controlReleased: true,
app     | 2025-09-15 11:08:28.111 |       secureConnecting: false,
app     | 2025-09-15 11:08:28.111 |       _SNICallback: null,
app     | 2025-09-15 11:08:28.111 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:28.111 |       alpnProtocol: false,
app     | 2025-09-15 11:08:28.111 |       authorized: true,
app     | 2025-09-15 11:08:28.111 |       authorizationError: null,
app     | 2025-09-15 11:08:28.111 |       encrypted: true,
app     | 2025-09-15 11:08:28.111 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:28.111 |       _eventsCount: 9,
app     | 2025-09-15 11:08:28.111 |       connecting: false,
app     | 2025-09-15 11:08:28.111 |       _hadError: false,
app     | 2025-09-15 11:08:28.111 |       _parent: null,
app     | 2025-09-15 11:08:28.111 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:28.111 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:28.112 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:28.112 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:28.112 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:28.112 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:28.112 |       _sockname: null,
app     | 2025-09-15 11:08:28.112 |       _pendingData: null,
app     | 2025-09-15 11:08:28.112 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:28.112 |       server: undefined,
app     | 2025-09-15 11:08:28.112 |       _server: null,
app     | 2025-09-15 11:08:28.112 |       ssl: null,
app     | 2025-09-15 11:08:28.112 |       _requestCert: true,
app     | 2025-09-15 11:08:28.112 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:28.112 |       parser: null,
app     | 2025-09-15 11:08:28.112 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:28.112 |       timeout: 30000,
app     | 2025-09-15 11:08:28.112 |       write: [Function: writeAfterFIN],
app     | 2025-09-15 11:08:28.112 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:28.112 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:28.112 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:28.112 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:28.112 |       [Symbol(async_id_symbol)]: 9420,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:28.112 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:28.112 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:28.112 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:28.112 |         _idlePrev: null,
app     | 2025-09-15 11:08:28.112 |         _idleNext: null,
app     | 2025-09-15 11:08:28.112 |         _idleStart: 17167,
app     | 2025-09-15 11:08:28.112 |         _onTimeout: null,
app     | 2025-09-15 11:08:28.112 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:28.112 |         _repeat: null,
app     | 2025-09-15 11:08:28.112 |         _destroyed: true,
app     | 2025-09-15 11:08:28.112 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:28.112 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:28.112 |         [Symbol(asyncId)]: 9431,
app     | 2025-09-15 11:08:28.112 |         [Symbol(triggerId)]: 9423,
app     | 2025-09-15 11:08:28.112 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:28.112 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:28.112 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:28.112 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:28.112 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:28.112 |       },
app     | 2025-09-15 11:08:28.112 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kBytesWritten)]: 344,
app     | 2025-09-15 11:08:28.112 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:28.112 |     },
app     | 2025-09-15 11:08:28.112 |     _header: 'GET /abf/public/api/v1/units/situations?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:28.112 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:28.112 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:28.112 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:28.112 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:28.112 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:28.112 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:28.112 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:28.112 |       '\r\n',
app     | 2025-09-15 11:08:28.112 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:28.112 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:28.112 |     agent: Agent {
app     | 2025-09-15 11:08:28.112 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:28.112 |       _eventsCount: 2,
app     | 2025-09-15 11:08:28.112 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:28.112 |       defaultPort: 443,
app     | 2025-09-15 11:08:28.112 |       protocol: 'https:',
app     | 2025-09-15 11:08:28.112 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:28.112 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:28.112 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:28.112 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:28.112 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:28.112 |       keepAlive: false,
app     | 2025-09-15 11:08:28.112 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:28.112 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:28.112 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:28.112 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:28.112 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:28.112 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:28.112 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:28.112 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:28.112 |     },
app     | 2025-09-15 11:08:28.112 |     socketPath: undefined,
app     | 2025-09-15 11:08:28.112 |     method: 'GET',
app     | 2025-09-15 11:08:28.112 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:28.112 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:28.112 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:28.112 |     path: '/abf/public/api/v1/units/situations?limit=1',
app     | 2025-09-15 11:08:28.112 |     _ended: true,
app     | 2025-09-15 11:08:28.112 |     res: IncomingMessage {
app     | 2025-09-15 11:08:28.112 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:28.112 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:28.112 |       _eventsCount: 4,
app     | 2025-09-15 11:08:28.112 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:28.112 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:28.112 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:28.112 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:28.112 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:28.112 |       complete: true,
app     | 2025-09-15 11:08:28.112 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:28.112 |       rawTrailers: [],
app     | 2025-09-15 11:08:28.112 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:28.112 |       aborted: false,
app     | 2025-09-15 11:08:28.112 |       upgrade: false,
app     | 2025-09-15 11:08:28.112 |       url: '',
app     | 2025-09-15 11:08:28.112 |       method: null,
app     | 2025-09-15 11:08:28.112 |       statusCode: 403,
app     | 2025-09-15 11:08:28.112 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:28.112 |       client: [TLSSocket],
app     | 2025-09-15 11:08:28.112 |       _consuming: false,
app     | 2025-09-15 11:08:28.112 |       _dumped: false,
app     | 2025-09-15 11:08:28.112 |       req: [Circular *1],
app     | 2025-09-15 11:08:28.112 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/units/situations?limit=1',
app     | 2025-09-15 11:08:28.112 |       redirects: [],
app     | 2025-09-15 11:08:28.112 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:28.112 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:28.112 |     },
app     | 2025-09-15 11:08:28.112 |     aborted: false,
app     | 2025-09-15 11:08:28.112 |     timeoutCb: null,
app     | 2025-09-15 11:08:28.112 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:28.112 |     parser: null,
app     | 2025-09-15 11:08:28.112 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:28.112 |     reusedSocket: false,
app     | 2025-09-15 11:08:28.112 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:28.112 |     protocol: 'https:',
app     | 2025-09-15 11:08:28.112 |     _redirectable: Writable {
app     | 2025-09-15 11:08:28.112 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:28.112 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:28.113 |       _eventsCount: 3,
app     | 2025-09-15 11:08:28.113 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:28.113 |       _options: [Object],
app     | 2025-09-15 11:08:28.113 |       _ended: true,
app     | 2025-09-15 11:08:28.113 |       _ending: true,
app     | 2025-09-15 11:08:28.113 |       _redirectCount: 0,
app     | 2025-09-15 11:08:28.113 |       _redirects: [],
app     | 2025-09-15 11:08:28.113 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:28.113 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:28.113 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:28.113 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:28.113 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/units/situations?limit=1',
app     | 2025-09-15 11:08:28.113 |       _timeout: null,
app     | 2025-09-15 11:08:28.113 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:28.113 |     },
app     | 2025-09-15 11:08:28.113 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:28.113 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:28.113 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:28.113 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:28.113 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:28.113 |       accept: [Array],
app     | 2025-09-15 11:08:28.113 |       'content-type': [Array],
app     | 2025-09-15 11:08:28.113 |       'user-agent': [Array],
app     | 2025-09-15 11:08:28.113 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:28.113 |       host: [Array],
app     | 2025-09-15 11:08:28.113 |       authorization: [Array]
app     | 2025-09-15 11:08:28.113 |     },
app     | 2025-09-15 11:08:28.113 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:28.113 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:28.113 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:28.113 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:28.113 |   },
app     | 2025-09-15 11:08:28.113 |   response: {
app     | 2025-09-15 11:08:28.113 |     status: 403,
app     | 2025-09-15 11:08:28.113 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:28.113 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:28.113 |       server: 'nginx',
app     | 2025-09-15 11:08:28.113 |       date: 'Mon, 15 Sep 2025 14:08:29 GMT',
app     | 2025-09-15 11:08:28.113 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:28.113 |       'content-length': '34',
app     | 2025-09-15 11:08:28.113 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:28.113 |       'x-ratelimit-remaining-minute': '193',
app     | 2025-09-15 11:08:28.113 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:28.113 |       'ratelimit-remaining': '193',
app     | 2025-09-15 11:08:28.113 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:28.113 |       'ratelimit-reset': '31',
app     | 2025-09-15 11:08:28.113 |       'x-kong-response-latency': '3',
app     | 2025-09-15 11:08:28.113 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:28.113 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:28.113 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:28.113 |       connection: 'close'
app     | 2025-09-15 11:08:28.113 |     },
app     | 2025-09-15 11:08:28.113 |     config: {
app     | 2025-09-15 11:08:28.113 |       transitional: [Object],
app     | 2025-09-15 11:08:28.113 |       adapter: [Array],
app     | 2025-09-15 11:08:28.113 |       transformRequest: [Array],
app     | 2025-09-15 11:08:28.113 |       transformResponse: [Array],
app     | 2025-09-15 11:08:28.113 |       timeout: 30000,
app     | 2025-09-15 11:08:28.113 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:28.113 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:28.113 |       maxContentLength: -1,
app     | 2025-09-15 11:08:28.113 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:28.113 |       env: [Object],
app     | 2025-09-15 11:08:28.113 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:28.113 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:28.113 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:28.113 |       auth: [Object],
app     | 2025-09-15 11:08:28.113 |       method: 'get',
app     | 2025-09-15 11:08:28.113 |       url: '/units/situations',
app     | 2025-09-15 11:08:28.113 |       params: [Object],
app     | 2025-09-15 11:08:28.113 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:28.113 |       metadata: [Object],
app     | 2025-09-15 11:08:28.113 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:28.113 |       data: undefined
app     | 2025-09-15 11:08:28.113 |     },
app     | 2025-09-15 11:08:28.113 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:28.113 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:28.113 |       _eventsCount: 7,
app     | 2025-09-15 11:08:28.113 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:28.113 |       outputData: [],
app     | 2025-09-15 11:08:28.113 |       outputSize: 0,
app     | 2025-09-15 11:08:28.113 |       writable: true,
app     | 2025-09-15 11:08:28.113 |       destroyed: true,
app     | 2025-09-15 11:08:28.113 |       _last: true,
app     | 2025-09-15 11:08:28.113 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:28.113 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:28.113 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:28.113 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:28.113 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:28.113 |       sendDate: false,
app     | 2025-09-15 11:08:28.113 |       _removedConnection: false,
app     | 2025-09-15 11:08:28.113 |       _removedContLen: false,
app     | 2025-09-15 11:08:28.113 |       _removedTE: false,
app     | 2025-09-15 11:08:28.113 |       strictContentLength: false,
app     | 2025-09-15 11:08:28.113 |       _contentLength: 0,
app     | 2025-09-15 11:08:28.113 |       _hasBody: true,
app     | 2025-09-15 11:08:28.113 |       _trailer: '',
app     | 2025-09-15 11:08:28.113 |       finished: true,
app     | 2025-09-15 11:08:28.113 |       _headerSent: true,
app     | 2025-09-15 11:08:28.113 |       _closed: true,
app     | 2025-09-15 11:08:28.113 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:28.113 |       _header: 'GET /abf/public/api/v1/units/situations?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:28.113 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:28.113 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:28.113 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:28.113 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:28.113 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:28.113 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:28.113 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:28.113 |         '\r\n',
app     | 2025-09-15 11:08:28.113 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:28.113 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:28.113 |       agent: [Agent],
app     | 2025-09-15 11:08:28.113 |       socketPath: undefined,
app     | 2025-09-15 11:08:28.113 |       method: 'GET',
app     | 2025-09-15 11:08:28.113 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:28.113 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:28.113 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:28.113 |       path: '/abf/public/api/v1/units/situations?limit=1',
app     | 2025-09-15 11:08:28.113 |       _ended: true,
app     | 2025-09-15 11:08:28.113 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:28.113 |       aborted: false,
app     | 2025-09-15 11:08:28.113 |       timeoutCb: null,
app     | 2025-09-15 11:08:28.113 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:28.113 |       parser: null,
app     | 2025-09-15 11:08:28.113 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:28.113 |       reusedSocket: false,
app     | 2025-09-15 11:08:28.113 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:28.113 |       protocol: 'https:',
app     | 2025-09-15 11:08:28.113 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:28.113 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:28.113 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:28.113 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:28.113 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:28.113 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:28.113 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:28.113 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:28.113 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:28.113 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:28.113 |     },
app     | 2025-09-15 11:08:28.113 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:28.113 |   },
app     | 2025-09-15 11:08:28.113 |   status: 403
app     | 2025-09-15 11:08:28.113 | }
app     | 2025-09-15 11:08:28.112 |       ssl: null,
app     | 2025-09-15 11:08:28.112 |       _requestCert: true,
app     | 2025-09-15 11:08:28.112 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:28.112 |       parser: null,
app     | 2025-09-15 11:08:28.112 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:28.112 |       timeout: 30000,
app     | 2025-09-15 11:08:28.112 |       write: [Function: writeAfterFIN],
app     | 2025-09-15 11:08:28.112 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:28.112 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:28.112 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:28.112 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:28.112 |       [Symbol(async_id_symbol)]: 9420,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:28.112 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:28.112 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:28.112 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:28.112 |         _idlePrev: null,
app     | 2025-09-15 11:08:28.112 |         _idleNext: null,
app     | 2025-09-15 11:08:28.112 |         _idleStart: 17167,
app     | 2025-09-15 11:08:28.112 |         _onTimeout: null,
app     | 2025-09-15 11:08:28.112 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:28.112 |         _repeat: null,
app     | 2025-09-15 11:08:28.112 |         _destroyed: true,
app     | 2025-09-15 11:08:28.112 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:28.112 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:28.112 |         [Symbol(asyncId)]: 9431,
app     | 2025-09-15 11:08:28.112 |         [Symbol(triggerId)]: 9423,
app     | 2025-09-15 11:08:28.112 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:28.112 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:28.112 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:28.112 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:28.112 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:28.112 |       },
app     | 2025-09-15 11:08:28.112 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kBytesWritten)]: 344,
app     | 2025-09-15 11:08:28.112 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:28.112 |     },
app     | 2025-09-15 11:08:28.112 |     _header: 'GET /abf/public/api/v1/units/situations?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:28.112 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:28.112 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:28.112 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:28.112 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:28.112 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:28.112 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:28.112 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:28.112 |       '\r\n',
app     | 2025-09-15 11:08:28.112 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:28.112 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:28.112 |     agent: Agent {
app     | 2025-09-15 11:08:28.112 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:28.112 |       _eventsCount: 2,
app     | 2025-09-15 11:08:28.112 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:28.112 |       defaultPort: 443,
app     | 2025-09-15 11:08:28.112 |       protocol: 'https:',
app     | 2025-09-15 11:08:28.112 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:28.112 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:28.112 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:28.112 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:28.112 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:28.112 |       keepAlive: false,
app     | 2025-09-15 11:08:28.112 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:28.112 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:28.112 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:28.112 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:28.112 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:28.112 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:28.112 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:28.112 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:28.112 |     },
app     | 2025-09-15 11:08:28.112 |     socketPath: undefined,
app     | 2025-09-15 11:08:28.112 |     method: 'GET',
app     | 2025-09-15 11:08:28.112 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:28.112 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:28.112 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:28.112 |     path: '/abf/public/api/v1/units/situations?limit=1',
app     | 2025-09-15 11:08:28.112 |     _ended: true,
app     | 2025-09-15 11:08:28.112 |     res: IncomingMessage {
app     | 2025-09-15 11:08:28.112 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:28.112 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:28.112 |       _eventsCount: 4,
app     | 2025-09-15 11:08:28.112 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:28.112 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:28.112 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:28.112 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:28.112 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:28.112 |       complete: true,
app     | 2025-09-15 11:08:28.112 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:28.112 |       rawTrailers: [],
app     | 2025-09-15 11:08:28.112 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:28.112 |       aborted: false,
app     | 2025-09-15 11:08:28.112 |       upgrade: false,
app     | 2025-09-15 11:08:28.112 |       url: '',
app     | 2025-09-15 11:08:28.112 |       method: null,
app     | 2025-09-15 11:08:28.112 |       statusCode: 403,
app     | 2025-09-15 11:08:28.112 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:28.112 |       client: [TLSSocket],
app     | 2025-09-15 11:08:28.112 |       _consuming: false,
app     | 2025-09-15 11:08:28.112 |       _dumped: false,
app     | 2025-09-15 11:08:28.112 |       req: [Circular *1],
app     | 2025-09-15 11:08:28.112 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/units/situations?limit=1',
app     | 2025-09-15 11:08:28.112 |       redirects: [],
app     | 2025-09-15 11:08:28.112 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:28.112 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:28.112 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:28.112 |     },
app     | 2025-09-15 11:08:28.112 |     aborted: false,
app     | 2025-09-15 11:08:28.112 |     timeoutCb: null,
app     | 2025-09-15 11:08:28.112 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:28.112 |     parser: null,
app     | 2025-09-15 11:08:28.112 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:28.112 |     reusedSocket: false,
app     | 2025-09-15 11:08:28.112 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:28.112 |     protocol: 'https:',
app     | 2025-09-15 11:08:28.112 |     _redirectable: Writable {
app     | 2025-09-15 11:08:28.112 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:28.112 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:28.113 |       _eventsCount: 3,
app     | 2025-09-15 11:08:28.113 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:28.113 |       _options: [Object],
app     | 2025-09-15 11:08:28.113 |       _ended: true,
app     | 2025-09-15 11:08:28.113 |       _ending: true,
app     | 2025-09-15 11:08:28.113 |       _redirectCount: 0,
app     | 2025-09-15 11:08:28.113 |       _redirects: [],
app     | 2025-09-15 11:08:28.113 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:28.113 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:28.113 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:28.113 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:28.113 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/units/situations?limit=1',
app     | 2025-09-15 11:08:28.113 |       _timeout: null,
app     | 2025-09-15 11:08:28.113 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:28.113 |     },
app     | 2025-09-15 11:08:28.113 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:28.113 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:28.113 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:28.113 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:28.113 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:28.113 |       accept: [Array],
app     | 2025-09-15 11:08:28.113 |       'content-type': [Array],
app     | 2025-09-15 11:08:28.113 |       'user-agent': [Array],
app     | 2025-09-15 11:08:28.113 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:28.113 |       host: [Array],
app     | 2025-09-15 11:08:28.113 |       authorization: [Array]
app     | 2025-09-15 11:08:28.113 |     },
app     | 2025-09-15 11:08:28.113 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:28.113 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:28.113 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:28.113 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:28.113 |   },
app     | 2025-09-15 11:08:28.113 |   response: {
app     | 2025-09-15 11:08:28.113 |     status: 403,
app     | 2025-09-15 11:08:28.113 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:28.113 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:28.113 |       server: 'nginx',
app     | 2025-09-15 11:08:28.113 |       date: 'Mon, 15 Sep 2025 14:08:29 GMT',
app     | 2025-09-15 11:08:28.113 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:28.113 |       'content-length': '34',
app     | 2025-09-15 11:08:28.113 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:28.113 |       'x-ratelimit-remaining-minute': '193',
app     | 2025-09-15 11:08:28.113 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:28.113 |       'ratelimit-remaining': '193',
app     | 2025-09-15 11:08:28.113 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:28.113 |       'ratelimit-reset': '31',
app     | 2025-09-15 11:08:28.113 |       'x-kong-response-latency': '3',
app     | 2025-09-15 11:08:28.113 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:28.113 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:28.113 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:28.113 |       connection: 'close'
app     | 2025-09-15 11:08:28.113 |     },
app     | 2025-09-15 11:08:28.113 |     config: {
app     | 2025-09-15 11:08:28.113 |       transitional: [Object],
app     | 2025-09-15 11:08:28.113 |       adapter: [Array],
app     | 2025-09-15 11:08:28.113 |       transformRequest: [Array],
app     | 2025-09-15 11:08:28.113 |       transformResponse: [Array],
app     | 2025-09-15 11:08:28.113 |       timeout: 30000,
app     | 2025-09-15 11:08:28.113 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:28.113 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:28.113 |       maxContentLength: -1,
app     | 2025-09-15 11:08:28.113 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:28.113 |       env: [Object],
app     | 2025-09-15 11:08:28.113 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:28.113 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:28.113 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:28.113 |       auth: [Object],
app     | 2025-09-15 11:08:28.113 |       method: 'get',
app     | 2025-09-15 11:08:28.113 |       url: '/units/situations',
app     | 2025-09-15 11:08:28.113 |       params: [Object],
app     | 2025-09-15 11:08:28.113 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:28.113 |       metadata: [Object],
app     | 2025-09-15 11:08:28.113 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:28.113 |       data: undefined
app     | 2025-09-15 11:08:28.113 |     },
app     | 2025-09-15 11:08:28.113 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:28.113 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:28.113 |       _eventsCount: 7,
app     | 2025-09-15 11:08:28.113 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:28.113 |       outputData: [],
app     | 2025-09-15 11:08:28.113 |       outputSize: 0,
app     | 2025-09-15 11:08:28.113 |       writable: true,
app     | 2025-09-15 11:08:28.113 |       destroyed: true,
app     | 2025-09-15 11:08:28.113 |       _last: true,
app     | 2025-09-15 11:08:28.113 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:28.113 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:28.113 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:28.113 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:28.113 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:28.113 |       sendDate: false,
app     | 2025-09-15 11:08:28.113 |       _removedConnection: false,
app     | 2025-09-15 11:08:28.113 |       _removedContLen: false,
app     | 2025-09-15 11:08:28.113 |       _removedTE: false,
app     | 2025-09-15 11:08:28.113 |       strictContentLength: false,
app     | 2025-09-15 11:08:28.113 |       _contentLength: 0,
app     | 2025-09-15 11:08:28.113 |       _hasBody: true,
app     | 2025-09-15 11:08:28.113 |       _trailer: '',
app     | 2025-09-15 11:08:28.113 |       finished: true,
app     | 2025-09-15 11:08:28.113 |       _headerSent: true,
app     | 2025-09-15 11:08:28.113 |       _closed: true,
app     | 2025-09-15 11:08:28.113 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:28.113 |       _header: 'GET /abf/public/api/v1/units/situations?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:28.113 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:28.113 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:28.113 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:28.113 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:28.113 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:28.113 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:28.113 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:28.113 |         '\r\n',
app     | 2025-09-15 11:08:28.113 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:28.113 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:28.113 |       agent: [Agent],
app     | 2025-09-15 11:08:28.113 |       socketPath: undefined,
app     | 2025-09-15 11:08:28.113 |       method: 'GET',
app     | 2025-09-15 11:08:28.113 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:28.113 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:28.113 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:28.113 |       path: '/abf/public/api/v1/units/situations?limit=1',
app     | 2025-09-15 11:08:28.113 |       _ended: true,
app     | 2025-09-15 11:08:28.113 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:28.113 |       aborted: false,
app     | 2025-09-15 11:08:28.113 |       timeoutCb: null,
app     | 2025-09-15 11:08:28.113 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:28.113 |       parser: null,
app     | 2025-09-15 11:08:28.113 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:28.113 |       reusedSocket: false,
app     | 2025-09-15 11:08:28.113 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:28.113 |       protocol: 'https:',
app     | 2025-09-15 11:08:28.113 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:28.113 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:28.113 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:28.113 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:28.113 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:28.113 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:28.113 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:28.113 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:28.113 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:28.113 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:28.113 |     },
app     | 2025-09-15 11:08:28.113 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:28.113 |   },
app     | 2025-09-15 11:08:28.113 |   status: 403
app     | 2025-09-15 11:08:28.113 | }
app     | 2025-09-15 11:08:29.098 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:29.098 | [Sienge Proxy] Chamando endpoint: /sales-contracts com params: { limit: 1 }
app     | 2025-09-15 11:08:29.098 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:29.098 | [Sienge Proxy] Chamando endpoint: /sales-contracts com params: { limit: 1 }
app     | 2025-09-15 11:08:29.543 | [LOGGER] Flushing 2 log entries
app     | 2025-09-15 11:08:29.543 | [LOGGER] Flushing 2 log entries
app     | 2025-09-15 11:08:29.546 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:29.546 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:29.546 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:29.546 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:29.546 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:29.546 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:29.546 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:29.546 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:29.546 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:29.546 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:29.546 |   config: {
app     | 2025-09-15 11:08:29.546 |     transitional: {
app     | 2025-09-15 11:08:29.546 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:29.546 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:29.546 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:29.546 |     },
app     | 2025-09-15 11:08:29.546 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:29.546 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:29.546 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:29.546 |     timeout: 30000,
app     | 2025-09-15 11:08:29.546 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:29.546 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:29.546 |     maxContentLength: -1,
app     | 2025-09-15 11:08:29.546 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:29.546 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:29.546 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:29.546 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:29.546 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:29.546 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:29.546 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:29.546 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:29.546 |     },
app     | 2025-09-15 11:08:29.546 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:29.546 |     auth: {
app     | 2025-09-15 11:08:29.546 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:29.546 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:29.546 |     },
app     | 2025-09-15 11:08:29.546 |     method: 'get',
app     | 2025-09-15 11:08:29.546 |     url: '/sales-contracts',
app     | 2025-09-15 11:08:29.546 |     params: { limit: 1 },
app     | 2025-09-15 11:08:29.546 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:29.546 |     metadata: { startTime: 1757945309101 },
app     | 2025-09-15 11:08:29.546 |     'axios-retry': {
app     | 2025-09-15 11:08:29.546 |       retries: 3,
app     | 2025-09-15 11:08:29.546 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:29.546 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:29.546 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:29.546 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:29.546 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:29.546 |       validateResponse: null,
app     | 2025-09-15 11:08:29.546 |       retryCount: 0,
app     | 2025-09-15 11:08:29.546 |       lastRequestTime: 1757945309101
app     | 2025-09-15 11:08:29.546 |     },
app     | 2025-09-15 11:08:29.546 |     data: undefined
app     | 2025-09-15 11:08:29.546 |   },
app     | 2025-09-15 11:08:29.546 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:29.546 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:29.546 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:29.546 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:29.546 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:29.546 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:29.546 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:29.546 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:29.546 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:29.546 |     },
app     | 2025-09-15 11:08:29.546 |     _eventsCount: 7,
app     | 2025-09-15 11:08:29.546 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:29.546 |     outputData: [],
app     | 2025-09-15 11:08:29.546 |     outputSize: 0,
app     | 2025-09-15 11:08:29.546 |     writable: true,
app     | 2025-09-15 11:08:29.546 |     destroyed: true,
app     | 2025-09-15 11:08:29.546 |     _last: true,
app     | 2025-09-15 11:08:29.546 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:29.546 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:29.546 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:29.546 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:29.546 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:29.546 |     sendDate: false,
app     | 2025-09-15 11:08:29.546 |     _removedConnection: false,
app     | 2025-09-15 11:08:29.546 |     _removedContLen: false,
app     | 2025-09-15 11:08:29.546 |     _removedTE: false,
app     | 2025-09-15 11:08:29.546 |     strictContentLength: false,
app     | 2025-09-15 11:08:29.546 |     _contentLength: 0,
app     | 2025-09-15 11:08:29.546 |     _hasBody: true,
app     | 2025-09-15 11:08:29.546 |     _trailer: '',
app     | 2025-09-15 11:08:29.546 |     finished: true,
app     | 2025-09-15 11:08:29.546 |     _headerSent: true,
app     | 2025-09-15 11:08:29.546 |     _closed: true,
app     | 2025-09-15 11:08:29.546 |     socket: TLSSocket {
app     | 2025-09-15 11:08:29.546 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:29.546 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:29.546 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:29.546 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:29.546 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:29.546 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:29.546 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:29.546 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:29.546 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:29.546 |   config: {
app     | 2025-09-15 11:08:29.546 |     transitional: {
app     | 2025-09-15 11:08:29.546 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:29.546 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:29.546 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:29.546 |     },
app     | 2025-09-15 11:08:29.546 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:29.546 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:29.546 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:29.546 |     timeout: 30000,
app     | 2025-09-15 11:08:29.546 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:29.546 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:29.546 |     maxContentLength: -1,
app     | 2025-09-15 11:08:29.546 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:29.546 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:29.546 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:29.546 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:29.546 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:29.546 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:29.546 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:29.546 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:29.546 |     },
app     | 2025-09-15 11:08:29.546 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:29.546 |     auth: {
app     | 2025-09-15 11:08:29.546 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:29.546 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:29.546 |     },
app     | 2025-09-15 11:08:29.546 |     method: 'get',
app     | 2025-09-15 11:08:29.546 |     url: '/sales-contracts',
app     | 2025-09-15 11:08:29.546 |     params: { limit: 1 },
app     | 2025-09-15 11:08:29.546 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:29.546 |     metadata: { startTime: 1757945309101 },
app     | 2025-09-15 11:08:29.546 |     'axios-retry': {
app     | 2025-09-15 11:08:29.546 |       retries: 3,
app     | 2025-09-15 11:08:29.546 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:29.546 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:29.546 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:29.546 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:29.546 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:29.546 |       validateResponse: null,
app     | 2025-09-15 11:08:29.546 |       retryCount: 0,
app     | 2025-09-15 11:08:29.546 |       lastRequestTime: 1757945309101
app     | 2025-09-15 11:08:29.546 |     },
app     | 2025-09-15 11:08:29.546 |     data: undefined
app     | 2025-09-15 11:08:29.546 |   },
app     | 2025-09-15 11:08:29.546 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:29.546 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:29.546 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:29.546 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:29.546 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:29.546 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:29.546 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:29.546 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:29.546 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:29.546 |     },
app     | 2025-09-15 11:08:29.546 |     _eventsCount: 7,
app     | 2025-09-15 11:08:29.546 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:29.546 |     outputData: [],
app     | 2025-09-15 11:08:29.546 |     outputSize: 0,
app     | 2025-09-15 11:08:29.546 |     writable: true,
app     | 2025-09-15 11:08:29.546 |     destroyed: true,
app     | 2025-09-15 11:08:29.546 |     _last: true,
app     | 2025-09-15 11:08:29.546 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:29.546 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:29.546 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:29.546 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:29.546 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:29.546 |     sendDate: false,
app     | 2025-09-15 11:08:29.546 |     _removedConnection: false,
app     | 2025-09-15 11:08:29.546 |     _removedContLen: false,
app     | 2025-09-15 11:08:29.546 |     _removedTE: false,
app     | 2025-09-15 11:08:29.546 |     strictContentLength: false,
app     | 2025-09-15 11:08:29.546 |     _contentLength: 0,
app     | 2025-09-15 11:08:29.546 |     _hasBody: true,
app     | 2025-09-15 11:08:29.546 |     _trailer: '',
app     | 2025-09-15 11:08:29.546 |     finished: true,
app     | 2025-09-15 11:08:29.546 |     _headerSent: true,
app     | 2025-09-15 11:08:29.546 |     _closed: true,
app     | 2025-09-15 11:08:29.546 |     socket: TLSSocket {
app     | 2025-09-15 11:08:29.546 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:29.546 |       _secureEstablished: true,
app     | 2025-09-15 11:08:29.546 |       _securePending: false,
app     | 2025-09-15 11:08:29.546 |       _newSessionPending: false,
app     | 2025-09-15 11:08:29.546 |       _controlReleased: true,
app     | 2025-09-15 11:08:29.546 |       secureConnecting: false,
app     | 2025-09-15 11:08:29.546 |       _SNICallback: null,
app     | 2025-09-15 11:08:29.546 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:29.546 |       alpnProtocol: false,
app     | 2025-09-15 11:08:29.546 |       authorized: true,
app     | 2025-09-15 11:08:29.546 |       authorizationError: null,
app     | 2025-09-15 11:08:29.546 |       encrypted: true,
app     | 2025-09-15 11:08:29.546 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:29.546 |       _eventsCount: 9,
app     | 2025-09-15 11:08:29.546 |       connecting: false,
app     | 2025-09-15 11:08:29.546 |       _hadError: false,
app     | 2025-09-15 11:08:29.546 |       _parent: null,
app     | 2025-09-15 11:08:29.546 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:29.546 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:29.546 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:29.546 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:29.546 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:29.546 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:29.546 |       _sockname: null,
app     | 2025-09-15 11:08:29.546 |       _pendingData: null,
app     | 2025-09-15 11:08:29.546 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:29.546 |       server: undefined,
app     | 2025-09-15 11:08:29.546 |       _server: null,
app     | 2025-09-15 11:08:29.546 |       ssl: null,
app     | 2025-09-15 11:08:29.546 |       _requestCert: true,
app     | 2025-09-15 11:08:29.546 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:29.546 |       parser: null,
app     | 2025-09-15 11:08:29.546 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:29.546 |       timeout: 30000,
app     | 2025-09-15 11:08:29.546 |       write: [Function: writeAfterFIN],
app     | 2025-09-15 11:08:29.546 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:29.547 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(async_id_symbol)]: 10847,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:29.547 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:29.547 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:29.547 |         _idlePrev: null,
app     | 2025-09-15 11:08:29.547 |         _idleNext: null,
app     | 2025-09-15 11:08:29.547 |         _idleStart: 18601,
app     | 2025-09-15 11:08:29.547 |         _onTimeout: null,
app     | 2025-09-15 11:08:29.547 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:29.547 |         _repeat: null,
app     | 2025-09-15 11:08:29.547 |         _destroyed: true,
app     | 2025-09-15 11:08:29.547 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:29.547 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:29.547 |         [Symbol(asyncId)]: 10858,
app     | 2025-09-15 11:08:29.547 |         [Symbol(triggerId)]: 10850,
app     | 2025-09-15 11:08:29.547 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:29.547 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:29.547 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:29.547 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:29.547 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:29.547 |       },
app     | 2025-09-15 11:08:29.547 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kBytesWritten)]: 343,
app     | 2025-09-15 11:08:29.547 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:29.547 |     },
app     | 2025-09-15 11:08:29.547 |     _header: 'GET /abf/public/api/v1/sales-contracts?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:29.547 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:29.547 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:29.547 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:29.547 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:29.547 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:29.547 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:29.547 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:29.547 |       '\r\n',
app     | 2025-09-15 11:08:29.547 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:29.547 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:29.547 |     agent: Agent {
app     | 2025-09-15 11:08:29.547 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:29.547 |       _eventsCount: 2,
app     | 2025-09-15 11:08:29.547 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:29.547 |       defaultPort: 443,
app     | 2025-09-15 11:08:29.547 |       protocol: 'https:',
app     | 2025-09-15 11:08:29.547 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:29.547 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:29.547 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:29.547 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:29.547 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:29.547 |       keepAlive: false,
app     | 2025-09-15 11:08:29.547 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:29.547 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:29.547 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:29.547 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:29.547 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:29.547 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:29.547 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:29.547 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:29.547 |     },
app     | 2025-09-15 11:08:29.547 |     socketPath: undefined,
app     | 2025-09-15 11:08:29.547 |     method: 'GET',
app     | 2025-09-15 11:08:29.547 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:29.547 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:29.547 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:29.547 |     path: '/abf/public/api/v1/sales-contracts?limit=1',
app     | 2025-09-15 11:08:29.547 |     _ended: true,
app     | 2025-09-15 11:08:29.547 |     res: IncomingMessage {
app     | 2025-09-15 11:08:29.547 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:29.547 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:29.547 |       _eventsCount: 4,
app     | 2025-09-15 11:08:29.547 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:29.547 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:29.547 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:29.547 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:29.547 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:29.547 |       complete: true,
app     | 2025-09-15 11:08:29.547 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:29.547 |       rawTrailers: [],
app     | 2025-09-15 11:08:29.547 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:29.547 |       aborted: false,
app     | 2025-09-15 11:08:29.547 |       upgrade: false,
app     | 2025-09-15 11:08:29.547 |       url: '',
app     | 2025-09-15 11:08:29.547 |       method: null,
app     | 2025-09-15 11:08:29.547 |       statusCode: 403,
app     | 2025-09-15 11:08:29.547 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:29.547 |       client: [TLSSocket],
app     | 2025-09-15 11:08:29.547 |       _consuming: false,
app     | 2025-09-15 11:08:29.547 |       _dumped: false,
app     | 2025-09-15 11:08:29.547 |       req: [Circular *1],
app     | 2025-09-15 11:08:29.547 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/sales-contracts?limit=1',
app     | 2025-09-15 11:08:29.547 |       redirects: [],
app     | 2025-09-15 11:08:29.547 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:29.547 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:29.547 |     },
app     | 2025-09-15 11:08:29.547 |     aborted: false,
app     | 2025-09-15 11:08:29.547 |     timeoutCb: null,
app     | 2025-09-15 11:08:29.547 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:29.547 |     parser: null,
app     | 2025-09-15 11:08:29.547 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:29.547 |     reusedSocket: false,
app     | 2025-09-15 11:08:29.547 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:29.547 |     protocol: 'https:',
app     | 2025-09-15 11:08:29.547 |     _redirectable: Writable {
app     | 2025-09-15 11:08:29.547 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:29.547 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:29.547 |       _eventsCount: 3,
app     | 2025-09-15 11:08:29.547 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:29.547 |       _options: [Object],
app     | 2025-09-15 11:08:29.547 |       _ended: true,
app     | 2025-09-15 11:08:29.547 |       _ending: true,
app     | 2025-09-15 11:08:29.547 |       _redirectCount: 0,
app     | 2025-09-15 11:08:29.547 |       _redirects: [],
app     | 2025-09-15 11:08:29.547 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:29.547 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:29.547 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:29.547 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:29.547 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/sales-contracts?limit=1',
app     | 2025-09-15 11:08:29.547 |       _timeout: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:29.547 |     },
app     | 2025-09-15 11:08:29.547 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:29.547 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:29.547 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:29.547 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:29.547 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:29.547 |       accept: [Array],
app     | 2025-09-15 11:08:29.547 |       'content-type': [Array],
app     | 2025-09-15 11:08:29.547 |       'user-agent': [Array],
app     | 2025-09-15 11:08:29.547 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:29.547 |       host: [Array],
app     | 2025-09-15 11:08:29.547 |       authorization: [Array]
app     | 2025-09-15 11:08:29.547 |     },
app     | 2025-09-15 11:08:29.547 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:29.547 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:29.547 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:29.547 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:29.547 |   },
app     | 2025-09-15 11:08:29.547 |   response: {
app     | 2025-09-15 11:08:29.547 |     status: 403,
app     | 2025-09-15 11:08:29.547 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:29.547 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:29.547 |       server: 'nginx',
app     | 2025-09-15 11:08:29.547 |       date: 'Mon, 15 Sep 2025 14:08:31 GMT',
app     | 2025-09-15 11:08:29.547 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:29.547 |       'content-length': '34',
app     | 2025-09-15 11:08:29.547 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:29.547 |       'x-ratelimit-remaining-minute': '192',
app     | 2025-09-15 11:08:29.547 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:29.547 |       'ratelimit-remaining': '192',
app     | 2025-09-15 11:08:29.547 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:29.547 |       'ratelimit-reset': '29',
app     | 2025-09-15 11:08:29.547 |       'x-kong-response-latency': '3',
app     | 2025-09-15 11:08:29.547 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:29.547 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:29.547 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:29.547 |       connection: 'close'
app     | 2025-09-15 11:08:29.547 |     },
app     | 2025-09-15 11:08:29.547 |     config: {
app     | 2025-09-15 11:08:29.547 |       transitional: [Object],
app     | 2025-09-15 11:08:29.547 |       adapter: [Array],
app     | 2025-09-15 11:08:29.547 |       transformRequest: [Array],
app     | 2025-09-15 11:08:29.547 |       transformResponse: [Array],
app     | 2025-09-15 11:08:29.547 |       timeout: 30000,
app     | 2025-09-15 11:08:29.547 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:29.547 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:29.547 |       maxContentLength: -1,
app     | 2025-09-15 11:08:29.547 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:29.547 |       env: [Object],
app     | 2025-09-15 11:08:29.547 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:29.547 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:29.547 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:29.547 |       auth: [Object],
app     | 2025-09-15 11:08:29.547 |       method: 'get',
app     | 2025-09-15 11:08:29.547 |       url: '/sales-contracts',
app     | 2025-09-15 11:08:29.547 |       params: [Object],
app     | 2025-09-15 11:08:29.547 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:29.547 |       metadata: [Object],
app     | 2025-09-15 11:08:29.547 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:29.547 |       data: undefined
app     | 2025-09-15 11:08:29.547 |     },
app     | 2025-09-15 11:08:29.548 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:29.548 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:29.548 |       _eventsCount: 7,
app     | 2025-09-15 11:08:29.548 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:29.548 |       outputData: [],
app     | 2025-09-15 11:08:29.548 |       outputSize: 0,
app     | 2025-09-15 11:08:29.548 |       writable: true,
app     | 2025-09-15 11:08:29.548 |       destroyed: true,
app     | 2025-09-15 11:08:29.548 |       _last: true,
app     | 2025-09-15 11:08:29.548 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:29.548 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:29.548 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:29.548 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:29.548 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:29.548 |       sendDate: false,
app     | 2025-09-15 11:08:29.548 |       _removedConnection: false,
app     | 2025-09-15 11:08:29.548 |       _removedContLen: false,
app     | 2025-09-15 11:08:29.548 |       _removedTE: false,
app     | 2025-09-15 11:08:29.548 |       strictContentLength: false,
app     | 2025-09-15 11:08:29.548 |       _contentLength: 0,
app     | 2025-09-15 11:08:29.548 |       _hasBody: true,
app     | 2025-09-15 11:08:29.548 |       _trailer: '',
app     | 2025-09-15 11:08:29.548 |       finished: true,
app     | 2025-09-15 11:08:29.548 |       _headerSent: true,
app     | 2025-09-15 11:08:29.548 |       _closed: true,
app     | 2025-09-15 11:08:29.548 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:29.548 |       _header: 'GET /abf/public/api/v1/sales-contracts?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:29.548 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:29.549 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:29.549 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:29.549 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:29.549 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:29.549 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:29.549 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:29.549 |         '\r\n',
app     | 2025-09-15 11:08:29.549 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:29.549 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:29.549 |       agent: [Agent],
app     | 2025-09-15 11:08:29.549 |       socketPath: undefined,
app     | 2025-09-15 11:08:29.549 |       method: 'GET',
app     | 2025-09-15 11:08:29.549 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:29.549 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:29.549 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:29.549 |       path: '/abf/public/api/v1/sales-contracts?limit=1',
app     | 2025-09-15 11:08:29.549 |       _ended: true,
app     | 2025-09-15 11:08:29.546 |       _secureEstablished: true,
app     | 2025-09-15 11:08:29.546 |       _securePending: false,
app     | 2025-09-15 11:08:29.546 |       _newSessionPending: false,
app     | 2025-09-15 11:08:29.546 |       _controlReleased: true,
app     | 2025-09-15 11:08:29.546 |       secureConnecting: false,
app     | 2025-09-15 11:08:29.546 |       _SNICallback: null,
app     | 2025-09-15 11:08:29.546 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:29.546 |       alpnProtocol: false,
app     | 2025-09-15 11:08:29.546 |       authorized: true,
app     | 2025-09-15 11:08:29.546 |       authorizationError: null,
app     | 2025-09-15 11:08:29.546 |       encrypted: true,
app     | 2025-09-15 11:08:29.546 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:29.546 |       _eventsCount: 9,
app     | 2025-09-15 11:08:29.546 |       connecting: false,
app     | 2025-09-15 11:08:29.546 |       _hadError: false,
app     | 2025-09-15 11:08:29.546 |       _parent: null,
app     | 2025-09-15 11:08:29.546 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:29.546 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:29.546 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:29.546 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:29.546 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:29.546 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:29.546 |       _sockname: null,
app     | 2025-09-15 11:08:29.546 |       _pendingData: null,
app     | 2025-09-15 11:08:29.546 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:29.546 |       server: undefined,
app     | 2025-09-15 11:08:29.546 |       _server: null,
app     | 2025-09-15 11:08:29.546 |       ssl: null,
app     | 2025-09-15 11:08:29.546 |       _requestCert: true,
app     | 2025-09-15 11:08:29.546 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:29.546 |       parser: null,
app     | 2025-09-15 11:08:29.546 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:29.546 |       timeout: 30000,
app     | 2025-09-15 11:08:29.546 |       write: [Function: writeAfterFIN],
app     | 2025-09-15 11:08:29.546 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:29.547 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(async_id_symbol)]: 10847,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:29.547 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:29.547 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:29.547 |         _idlePrev: null,
app     | 2025-09-15 11:08:29.547 |         _idleNext: null,
app     | 2025-09-15 11:08:29.547 |         _idleStart: 18601,
app     | 2025-09-15 11:08:29.547 |         _onTimeout: null,
app     | 2025-09-15 11:08:29.547 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:29.547 |         _repeat: null,
app     | 2025-09-15 11:08:29.547 |         _destroyed: true,
app     | 2025-09-15 11:08:29.547 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:29.547 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:29.547 |         [Symbol(asyncId)]: 10858,
app     | 2025-09-15 11:08:29.547 |         [Symbol(triggerId)]: 10850,
app     | 2025-09-15 11:08:29.547 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:29.547 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:29.547 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:29.547 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:29.547 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:29.547 |       },
app     | 2025-09-15 11:08:29.547 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kBytesWritten)]: 343,
app     | 2025-09-15 11:08:29.547 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:29.547 |     },
app     | 2025-09-15 11:08:29.547 |     _header: 'GET /abf/public/api/v1/sales-contracts?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:29.547 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:29.547 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:29.547 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:29.547 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:29.547 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:29.547 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:29.547 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:29.547 |       '\r\n',
app     | 2025-09-15 11:08:29.547 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:29.547 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:29.547 |     agent: Agent {
app     | 2025-09-15 11:08:29.547 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:29.547 |       _eventsCount: 2,
app     | 2025-09-15 11:08:29.547 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:29.547 |       defaultPort: 443,
app     | 2025-09-15 11:08:29.547 |       protocol: 'https:',
app     | 2025-09-15 11:08:29.547 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:29.547 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:29.547 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:29.547 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:29.547 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:29.547 |       keepAlive: false,
app     | 2025-09-15 11:08:29.547 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:29.547 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:29.547 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:29.547 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:29.547 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:29.547 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:29.547 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:29.547 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:29.547 |     },
app     | 2025-09-15 11:08:29.547 |     socketPath: undefined,
app     | 2025-09-15 11:08:29.547 |     method: 'GET',
app     | 2025-09-15 11:08:29.547 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:29.547 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:29.547 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:29.547 |     path: '/abf/public/api/v1/sales-contracts?limit=1',
app     | 2025-09-15 11:08:29.547 |     _ended: true,
app     | 2025-09-15 11:08:29.547 |     res: IncomingMessage {
app     | 2025-09-15 11:08:29.547 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:29.547 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:29.547 |       _eventsCount: 4,
app     | 2025-09-15 11:08:29.547 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:29.547 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:29.547 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:29.547 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:29.547 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:29.547 |       complete: true,
app     | 2025-09-15 11:08:29.547 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:29.547 |       rawTrailers: [],
app     | 2025-09-15 11:08:29.547 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:29.547 |       aborted: false,
app     | 2025-09-15 11:08:29.547 |       upgrade: false,
app     | 2025-09-15 11:08:29.547 |       url: '',
app     | 2025-09-15 11:08:29.547 |       method: null,
app     | 2025-09-15 11:08:29.547 |       statusCode: 403,
app     | 2025-09-15 11:08:29.547 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:29.547 |       client: [TLSSocket],
app     | 2025-09-15 11:08:29.547 |       _consuming: false,
app     | 2025-09-15 11:08:29.547 |       _dumped: false,
app     | 2025-09-15 11:08:29.547 |       req: [Circular *1],
app     | 2025-09-15 11:08:29.547 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/sales-contracts?limit=1',
app     | 2025-09-15 11:08:29.547 |       redirects: [],
app     | 2025-09-15 11:08:29.547 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:29.547 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:29.547 |     },
app     | 2025-09-15 11:08:29.547 |     aborted: false,
app     | 2025-09-15 11:08:29.547 |     timeoutCb: null,
app     | 2025-09-15 11:08:29.547 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:29.547 |     parser: null,
app     | 2025-09-15 11:08:29.547 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:29.547 |     reusedSocket: false,
app     | 2025-09-15 11:08:29.547 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:29.547 |     protocol: 'https:',
app     | 2025-09-15 11:08:29.547 |     _redirectable: Writable {
app     | 2025-09-15 11:08:29.547 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:29.547 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:29.547 |       _eventsCount: 3,
app     | 2025-09-15 11:08:29.547 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:29.547 |       _options: [Object],
app     | 2025-09-15 11:08:29.547 |       _ended: true,
app     | 2025-09-15 11:08:29.547 |       _ending: true,
app     | 2025-09-15 11:08:29.547 |       _redirectCount: 0,
app     | 2025-09-15 11:08:29.547 |       _redirects: [],
app     | 2025-09-15 11:08:29.547 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:29.547 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:29.547 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:29.547 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:29.547 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/sales-contracts?limit=1',
app     | 2025-09-15 11:08:29.547 |       _timeout: null,
app     | 2025-09-15 11:08:29.547 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:29.547 |     },
app     | 2025-09-15 11:08:29.547 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:29.547 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:29.547 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:29.547 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:29.547 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:29.547 |       accept: [Array],
app     | 2025-09-15 11:08:29.547 |       'content-type': [Array],
app     | 2025-09-15 11:08:29.547 |       'user-agent': [Array],
app     | 2025-09-15 11:08:29.547 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:29.547 |       host: [Array],
app     | 2025-09-15 11:08:29.547 |       authorization: [Array]
app     | 2025-09-15 11:08:29.547 |     },
app     | 2025-09-15 11:08:29.547 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:29.547 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:29.547 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:29.547 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:29.547 |   },
app     | 2025-09-15 11:08:29.547 |   response: {
app     | 2025-09-15 11:08:29.547 |     status: 403,
app     | 2025-09-15 11:08:29.547 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:29.547 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:29.547 |       server: 'nginx',
app     | 2025-09-15 11:08:29.547 |       date: 'Mon, 15 Sep 2025 14:08:31 GMT',
app     | 2025-09-15 11:08:29.547 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:29.547 |       'content-length': '34',
app     | 2025-09-15 11:08:29.547 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:29.547 |       'x-ratelimit-remaining-minute': '192',
app     | 2025-09-15 11:08:29.547 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:29.547 |       'ratelimit-remaining': '192',
app     | 2025-09-15 11:08:29.547 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:29.547 |       'ratelimit-reset': '29',
app     | 2025-09-15 11:08:29.547 |       'x-kong-response-latency': '3',
app     | 2025-09-15 11:08:29.547 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:29.547 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:29.547 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:29.547 |       connection: 'close'
app     | 2025-09-15 11:08:29.547 |     },
app     | 2025-09-15 11:08:29.547 |     config: {
app     | 2025-09-15 11:08:29.547 |       transitional: [Object],
app     | 2025-09-15 11:08:29.547 |       adapter: [Array],
app     | 2025-09-15 11:08:29.547 |       transformRequest: [Array],
app     | 2025-09-15 11:08:29.547 |       transformResponse: [Array],
app     | 2025-09-15 11:08:29.547 |       timeout: 30000,
app     | 2025-09-15 11:08:29.547 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:29.547 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:29.547 |       maxContentLength: -1,
app     | 2025-09-15 11:08:29.547 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:29.547 |       env: [Object],
app     | 2025-09-15 11:08:29.547 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:29.547 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:29.547 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:29.547 |       auth: [Object],
app     | 2025-09-15 11:08:29.547 |       method: 'get',
app     | 2025-09-15 11:08:29.547 |       url: '/sales-contracts',
app     | 2025-09-15 11:08:29.547 |       params: [Object],
app     | 2025-09-15 11:08:29.547 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:29.547 |       metadata: [Object],
app     | 2025-09-15 11:08:29.547 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:29.547 |       data: undefined
app     | 2025-09-15 11:08:29.547 |     },
app     | 2025-09-15 11:08:29.548 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:29.548 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:29.548 |       _eventsCount: 7,
app     | 2025-09-15 11:08:29.548 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:29.548 |       outputData: [],
app     | 2025-09-15 11:08:29.548 |       outputSize: 0,
app     | 2025-09-15 11:08:29.548 |       writable: true,
app     | 2025-09-15 11:08:29.548 |       destroyed: true,
app     | 2025-09-15 11:08:29.548 |       _last: true,
app     | 2025-09-15 11:08:29.548 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:29.548 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:29.548 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:29.548 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:29.548 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:29.548 |       sendDate: false,
app     | 2025-09-15 11:08:29.548 |       _removedConnection: false,
app     | 2025-09-15 11:08:29.548 |       _removedContLen: false,
app     | 2025-09-15 11:08:29.548 |       _removedTE: false,
app     | 2025-09-15 11:08:29.548 |       strictContentLength: false,
app     | 2025-09-15 11:08:29.548 |       _contentLength: 0,
app     | 2025-09-15 11:08:29.548 |       _hasBody: true,
app     | 2025-09-15 11:08:29.548 |       _trailer: '',
app     | 2025-09-15 11:08:29.548 |       finished: true,
app     | 2025-09-15 11:08:29.548 |       _headerSent: true,
app     | 2025-09-15 11:08:29.548 |       _closed: true,
app     | 2025-09-15 11:08:29.548 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:29.548 |       _header: 'GET /abf/public/api/v1/sales-contracts?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:29.548 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:29.549 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:29.549 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:29.549 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:29.549 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:29.549 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:29.549 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:29.549 |         '\r\n',
app     | 2025-09-15 11:08:29.549 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:29.549 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:29.549 |       agent: [Agent],
app     | 2025-09-15 11:08:29.549 |       socketPath: undefined,
app     | 2025-09-15 11:08:29.549 |       method: 'GET',
app     | 2025-09-15 11:08:29.549 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:29.549 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:29.549 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:29.549 |       path: '/abf/public/api/v1/sales-contracts?limit=1',
app     | 2025-09-15 11:08:29.549 |       _ended: true,
app     | 2025-09-15 11:08:29.549 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:29.550 |       aborted: false,
app     | 2025-09-15 11:08:29.550 |       timeoutCb: null,
app     | 2025-09-15 11:08:29.550 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:29.550 |       parser: null,
app     | 2025-09-15 11:08:29.550 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:29.550 |       reusedSocket: false,
app     | 2025-09-15 11:08:29.550 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:29.550 |       protocol: 'https:',
app     | 2025-09-15 11:08:29.550 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:29.550 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:29.550 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:29.550 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:29.550 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:29.550 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:29.550 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:29.550 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:29.550 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:29.550 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:29.550 |     },
app     | 2025-09-15 11:08:29.550 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:29.550 |   },
app     | 2025-09-15 11:08:29.550 |   status: 403
app     | 2025-09-15 11:08:29.550 | }
app     | 2025-09-15 11:08:29.549 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:29.550 |       aborted: false,
app     | 2025-09-15 11:08:29.550 |       timeoutCb: null,
app     | 2025-09-15 11:08:29.550 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:29.550 |       parser: null,
app     | 2025-09-15 11:08:29.550 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:29.550 |       reusedSocket: false,
app     | 2025-09-15 11:08:29.550 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:29.550 |       protocol: 'https:',
app     | 2025-09-15 11:08:29.550 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:29.550 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:29.550 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:29.550 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:29.550 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:29.550 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:29.550 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:29.550 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:29.550 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:29.550 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:29.550 |     },
app     | 2025-09-15 11:08:29.550 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:29.550 |   },
app     | 2025-09-15 11:08:29.550 |   status: 403
app     | 2025-09-15 11:08:29.550 | }
app     | 2025-09-15 11:08:29.934 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:29.934 | [Sienge Proxy] Chamando endpoint: /supply-contracts/measurements/all com params: { limit: 1 }
app     | 2025-09-15 11:08:29.934 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:29.934 | [Sienge Proxy] Chamando endpoint: /supply-contracts/measurements/all com params: { limit: 1 }
app     | 2025-09-15 11:08:30.377 | [LOGGER] Flushing 2 log entries
app     | 2025-09-15 11:08:30.377 | [LOGGER] Flushing 2 log entries
app     | 2025-09-15 11:08:30.379 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:30.379 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:30.379 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:30.379 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:30.379 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:30.379 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:30.379 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:30.379 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:30.379 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:30.379 |   config: {
app     | 2025-09-15 11:08:30.379 |     transitional: {
app     | 2025-09-15 11:08:30.379 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:30.379 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:30.379 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:30.379 |     },
app     | 2025-09-15 11:08:30.379 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:30.379 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:30.379 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:30.379 |     timeout: 30000,
app     | 2025-09-15 11:08:30.379 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:30.379 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:30.379 |     maxContentLength: -1,
app     | 2025-09-15 11:08:30.379 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:30.379 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:30.379 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:30.379 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:30.379 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:30.379 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:30.379 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:30.379 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:30.379 |     },
app     | 2025-09-15 11:08:30.379 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:30.379 |     auth: {
app     | 2025-09-15 11:08:30.379 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:30.379 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:30.379 |     },
app     | 2025-09-15 11:08:30.379 |     method: 'get',
app     | 2025-09-15 11:08:30.379 |     url: '/supply-contracts/measurements/all',
app     | 2025-09-15 11:08:30.379 |     params: { limit: 1 },
app     | 2025-09-15 11:08:30.379 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:30.379 |     metadata: { startTime: 1757945309938 },
app     | 2025-09-15 11:08:30.379 |     'axios-retry': {
app     | 2025-09-15 11:08:30.379 |       retries: 3,
app     | 2025-09-15 11:08:30.379 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:30.379 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:30.379 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:30.379 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:30.379 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:30.379 |       validateResponse: null,
app     | 2025-09-15 11:08:30.379 |       retryCount: 0,
app     | 2025-09-15 11:08:30.379 |       lastRequestTime: 1757945309938
app     | 2025-09-15 11:08:30.379 |     },
app     | 2025-09-15 11:08:30.379 |     data: undefined
app     | 2025-09-15 11:08:30.379 |   },
app     | 2025-09-15 11:08:30.379 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:30.379 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:30.379 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:30.379 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:30.379 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:30.379 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:30.379 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:30.379 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:30.379 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:30.379 |     },
app     | 2025-09-15 11:08:30.379 |     _eventsCount: 7,
app     | 2025-09-15 11:08:30.379 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:30.379 |     outputData: [],
app     | 2025-09-15 11:08:30.379 |     outputSize: 0,
app     | 2025-09-15 11:08:30.379 |     writable: true,
app     | 2025-09-15 11:08:30.379 |     destroyed: true,
app     | 2025-09-15 11:08:30.379 |     _last: true,
app     | 2025-09-15 11:08:30.379 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:30.379 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:30.379 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:30.379 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:30.379 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:30.379 |     sendDate: false,
app     | 2025-09-15 11:08:30.379 |     _removedConnection: false,
app     | 2025-09-15 11:08:30.379 |     _removedContLen: false,
app     | 2025-09-15 11:08:30.379 |     _removedTE: false,
app     | 2025-09-15 11:08:30.379 |     strictContentLength: false,
app     | 2025-09-15 11:08:30.379 |     _contentLength: 0,
app     | 2025-09-15 11:08:30.379 |     _hasBody: true,
app     | 2025-09-15 11:08:30.379 |     _trailer: '',
app     | 2025-09-15 11:08:30.379 |     finished: true,
app     | 2025-09-15 11:08:30.379 |     _headerSent: true,
app     | 2025-09-15 11:08:30.379 |     _closed: true,
app     | 2025-09-15 11:08:30.379 |     socket: TLSSocket {
app     | 2025-09-15 11:08:30.379 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:30.379 |       _secureEstablished: true,
app     | 2025-09-15 11:08:30.379 |       _securePending: false,
app     | 2025-09-15 11:08:30.379 |       _newSessionPending: false,
app     | 2025-09-15 11:08:30.379 |       _controlReleased: true,
app     | 2025-09-15 11:08:30.379 |       secureConnecting: false,
app     | 2025-09-15 11:08:30.379 |       _SNICallback: null,
app     | 2025-09-15 11:08:30.379 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:30.379 |       alpnProtocol: false,
app     | 2025-09-15 11:08:30.379 |       authorized: true,
app     | 2025-09-15 11:08:30.379 |       authorizationError: null,
app     | 2025-09-15 11:08:30.379 |       encrypted: true,
app     | 2025-09-15 11:08:30.379 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:30.379 |       _eventsCount: 9,
app     | 2025-09-15 11:08:30.379 |       connecting: false,
app     | 2025-09-15 11:08:30.379 |       _hadError: false,
app     | 2025-09-15 11:08:30.379 |       _parent: null,
app     | 2025-09-15 11:08:30.379 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:30.379 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:30.380 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:30.380 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:30.380 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:30.380 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:30.380 |       _sockname: null,
app     | 2025-09-15 11:08:30.380 |       _pendingData: null,
app     | 2025-09-15 11:08:30.380 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:30.380 |       server: undefined,
app     | 2025-09-15 11:08:30.380 |       _server: null,
app     | 2025-09-15 11:08:30.380 |       ssl: null,
app     | 2025-09-15 11:08:30.380 |       _requestCert: true,
app     | 2025-09-15 11:08:30.380 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:30.380 |       parser: null,
app     | 2025-09-15 11:08:30.380 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:30.380 |       timeout: 30000,
app     | 2025-09-15 11:08:30.381 |       write: [Function: writeAfterFIN],
app     | 2025-09-15 11:08:30.381 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:30.381 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:30.381 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:30.381 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:30.381 |       [Symbol(async_id_symbol)]: 11533,
app     | 2025-09-15 11:08:30.381 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:30.381 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:30.381 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:30.381 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:30.381 |         _idlePrev: null,
app     | 2025-09-15 11:08:30.381 |         _idleNext: null,
app     | 2025-09-15 11:08:30.381 |         _idleStart: 19435,
app     | 2025-09-15 11:08:30.381 |         _onTimeout: null,
app     | 2025-09-15 11:08:30.381 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:30.382 |         _repeat: null,
app     | 2025-09-15 11:08:30.382 |         _destroyed: true,
app     | 2025-09-15 11:08:30.382 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:30.382 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:30.382 |         [Symbol(asyncId)]: 11544,
app     | 2025-09-15 11:08:30.379 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:30.379 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:30.379 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:30.379 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:30.379 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:30.379 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:30.379 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:30.379 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:30.379 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:30.379 |   config: {
app     | 2025-09-15 11:08:30.379 |     transitional: {
app     | 2025-09-15 11:08:30.379 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:30.379 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:30.379 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:30.379 |     },
app     | 2025-09-15 11:08:30.379 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:30.379 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:30.379 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:30.379 |     timeout: 30000,
app     | 2025-09-15 11:08:30.379 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:30.379 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:30.379 |     maxContentLength: -1,
app     | 2025-09-15 11:08:30.379 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:30.379 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:30.379 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:30.379 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:30.379 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:30.379 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:30.379 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:30.379 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:30.379 |     },
app     | 2025-09-15 11:08:30.379 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:30.379 |     auth: {
app     | 2025-09-15 11:08:30.379 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:30.379 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:30.379 |     },
app     | 2025-09-15 11:08:30.379 |     method: 'get',
app     | 2025-09-15 11:08:30.379 |     url: '/supply-contracts/measurements/all',
app     | 2025-09-15 11:08:30.379 |     params: { limit: 1 },
app     | 2025-09-15 11:08:30.379 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:30.379 |     metadata: { startTime: 1757945309938 },
app     | 2025-09-15 11:08:30.379 |     'axios-retry': {
app     | 2025-09-15 11:08:30.379 |       retries: 3,
app     | 2025-09-15 11:08:30.379 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:30.379 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:30.379 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:30.379 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:30.379 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:30.379 |       validateResponse: null,
app     | 2025-09-15 11:08:30.379 |       retryCount: 0,
app     | 2025-09-15 11:08:30.379 |       lastRequestTime: 1757945309938
app     | 2025-09-15 11:08:30.379 |     },
app     | 2025-09-15 11:08:30.379 |     data: undefined
app     | 2025-09-15 11:08:30.379 |   },
app     | 2025-09-15 11:08:30.379 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:30.379 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:30.379 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:30.379 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:30.379 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:30.379 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:30.379 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:30.379 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:30.379 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:30.379 |     },
app     | 2025-09-15 11:08:30.379 |     _eventsCount: 7,
app     | 2025-09-15 11:08:30.379 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:30.379 |     outputData: [],
app     | 2025-09-15 11:08:30.379 |     outputSize: 0,
app     | 2025-09-15 11:08:30.379 |     writable: true,
app     | 2025-09-15 11:08:30.379 |     destroyed: true,
app     | 2025-09-15 11:08:30.379 |     _last: true,
app     | 2025-09-15 11:08:30.379 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:30.379 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:30.379 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:30.379 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:30.379 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:30.379 |     sendDate: false,
app     | 2025-09-15 11:08:30.379 |     _removedConnection: false,
app     | 2025-09-15 11:08:30.379 |     _removedContLen: false,
app     | 2025-09-15 11:08:30.379 |     _removedTE: false,
app     | 2025-09-15 11:08:30.379 |     strictContentLength: false,
app     | 2025-09-15 11:08:30.379 |     _contentLength: 0,
app     | 2025-09-15 11:08:30.379 |     _hasBody: true,
app     | 2025-09-15 11:08:30.379 |     _trailer: '',
app     | 2025-09-15 11:08:30.379 |     finished: true,
app     | 2025-09-15 11:08:30.379 |     _headerSent: true,
app     | 2025-09-15 11:08:30.379 |     _closed: true,
app     | 2025-09-15 11:08:30.379 |     socket: TLSSocket {
app     | 2025-09-15 11:08:30.379 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:30.379 |       _secureEstablished: true,
app     | 2025-09-15 11:08:30.379 |       _securePending: false,
app     | 2025-09-15 11:08:30.379 |       _newSessionPending: false,
app     | 2025-09-15 11:08:30.379 |       _controlReleased: true,
app     | 2025-09-15 11:08:30.379 |       secureConnecting: false,
app     | 2025-09-15 11:08:30.379 |       _SNICallback: null,
app     | 2025-09-15 11:08:30.379 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:30.379 |       alpnProtocol: false,
app     | 2025-09-15 11:08:30.379 |       authorized: true,
app     | 2025-09-15 11:08:30.379 |       authorizationError: null,
app     | 2025-09-15 11:08:30.379 |       encrypted: true,
app     | 2025-09-15 11:08:30.379 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:30.379 |       _eventsCount: 9,
app     | 2025-09-15 11:08:30.379 |       connecting: false,
app     | 2025-09-15 11:08:30.379 |       _hadError: false,
app     | 2025-09-15 11:08:30.379 |       _parent: null,
app     | 2025-09-15 11:08:30.379 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:30.379 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:30.380 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:30.380 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:30.380 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:30.380 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:30.380 |       _sockname: null,
app     | 2025-09-15 11:08:30.380 |       _pendingData: null,
app     | 2025-09-15 11:08:30.380 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:30.380 |       server: undefined,
app     | 2025-09-15 11:08:30.380 |       _server: null,
app     | 2025-09-15 11:08:30.380 |       ssl: null,
app     | 2025-09-15 11:08:30.380 |       _requestCert: true,
app     | 2025-09-15 11:08:30.380 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:30.380 |       parser: null,
app     | 2025-09-15 11:08:30.380 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:30.380 |       timeout: 30000,
app     | 2025-09-15 11:08:30.381 |       write: [Function: writeAfterFIN],
app     | 2025-09-15 11:08:30.381 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:30.381 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:30.381 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:30.381 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:30.381 |       [Symbol(async_id_symbol)]: 11533,
app     | 2025-09-15 11:08:30.381 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:30.381 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:30.381 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:30.381 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:30.381 |         _idlePrev: null,
app     | 2025-09-15 11:08:30.381 |         _idleNext: null,
app     | 2025-09-15 11:08:30.381 |         _idleStart: 19435,
app     | 2025-09-15 11:08:30.381 |         _onTimeout: null,
app     | 2025-09-15 11:08:30.381 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:30.382 |         _repeat: null,
app     | 2025-09-15 11:08:30.382 |         _destroyed: true,
app     | 2025-09-15 11:08:30.382 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:30.382 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:30.382 |         [Symbol(asyncId)]: 11544,
app     | 2025-09-15 11:08:30.382 |         [Symbol(triggerId)]: 11536,
app     | 2025-09-15 11:08:30.382 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:30.382 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:30.382 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:30.382 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:30.382 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:30.382 |       },
app     | 2025-09-15 11:08:30.382 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:30.382 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:30.382 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:30.382 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:30.383 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:30.383 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:30.383 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:30.383 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:30.383 |       [Symbol(kBytesWritten)]: 361,
app     | 2025-09-15 11:08:30.383 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:30.383 |     },
app     | 2025-09-15 11:08:30.383 |     _header: 'GET /abf/public/api/v1/supply-contracts/measurements/all?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:30.383 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:30.383 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:30.383 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:30.383 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:30.383 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:30.383 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:30.383 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:30.383 |       '\r\n',
app     | 2025-09-15 11:08:30.383 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:30.384 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:30.384 |     agent: Agent {
app     | 2025-09-15 11:08:30.384 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:30.384 |       _eventsCount: 2,
app     | 2025-09-15 11:08:30.384 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:30.384 |       defaultPort: 443,
app     | 2025-09-15 11:08:30.384 |       protocol: 'https:',
app     | 2025-09-15 11:08:30.384 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:30.384 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:30.384 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:30.384 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:30.384 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:30.384 |       keepAlive: false,
app     | 2025-09-15 11:08:30.384 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:30.384 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:30.384 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:30.384 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:30.382 |         [Symbol(triggerId)]: 11536,
app     | 2025-09-15 11:08:30.382 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:30.382 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:30.382 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:30.382 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:30.382 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:30.382 |       },
app     | 2025-09-15 11:08:30.382 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:30.382 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:30.382 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:30.382 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:30.383 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:30.383 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:30.383 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:30.383 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:30.383 |       [Symbol(kBytesWritten)]: 361,
app     | 2025-09-15 11:08:30.383 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:30.383 |     },
app     | 2025-09-15 11:08:30.383 |     _header: 'GET /abf/public/api/v1/supply-contracts/measurements/all?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:30.383 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:30.383 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:30.383 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:30.383 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:30.383 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:30.383 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:30.383 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:30.383 |       '\r\n',
app     | 2025-09-15 11:08:30.383 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:30.384 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:30.384 |     agent: Agent {
app     | 2025-09-15 11:08:30.384 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:30.384 |       _eventsCount: 2,
app     | 2025-09-15 11:08:30.384 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:30.384 |       defaultPort: 443,
app     | 2025-09-15 11:08:30.384 |       protocol: 'https:',
app     | 2025-09-15 11:08:30.384 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:30.384 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:30.384 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:30.384 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:30.384 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:30.384 |       keepAlive: false,
app     | 2025-09-15 11:08:30.384 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:30.384 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:30.384 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:30.384 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:30.385 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:30.385 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:30.385 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:30.385 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:30.385 |     },
app     | 2025-09-15 11:08:30.385 |     socketPath: undefined,
app     | 2025-09-15 11:08:30.385 |     method: 'GET',
app     | 2025-09-15 11:08:30.385 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:30.385 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:30.385 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:30.385 |     path: '/abf/public/api/v1/supply-contracts/measurements/all?limit=1',
app     | 2025-09-15 11:08:30.385 |     _ended: true,
app     | 2025-09-15 11:08:30.385 |     res: IncomingMessage {
app     | 2025-09-15 11:08:30.385 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:30.385 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:30.385 |       _eventsCount: 4,
app     | 2025-09-15 11:08:30.386 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:30.386 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:30.386 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:30.386 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:30.386 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:30.386 |       complete: true,
app     | 2025-09-15 11:08:30.386 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:30.386 |       rawTrailers: [],
app     | 2025-09-15 11:08:30.386 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:30.386 |       aborted: false,
app     | 2025-09-15 11:08:30.386 |       upgrade: false,
app     | 2025-09-15 11:08:30.386 |       url: '',
app     | 2025-09-15 11:08:30.386 |       method: null,
app     | 2025-09-15 11:08:30.387 |       statusCode: 403,
app     | 2025-09-15 11:08:30.387 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:30.387 |       client: [TLSSocket],
app     | 2025-09-15 11:08:30.387 |       _consuming: false,
app     | 2025-09-15 11:08:30.387 |       _dumped: false,
app     | 2025-09-15 11:08:30.387 |       req: [Circular *1],
app     | 2025-09-15 11:08:30.387 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/supply-contracts/measurements/all?limit=1',
app     | 2025-09-15 11:08:30.387 |       redirects: [],
app     | 2025-09-15 11:08:30.387 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:30.387 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:30.387 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:30.387 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:30.387 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:30.387 |     },
app     | 2025-09-15 11:08:30.387 |     aborted: false,
app     | 2025-09-15 11:08:30.387 |     timeoutCb: null,
app     | 2025-09-15 11:08:30.387 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:30.387 |     parser: null,
app     | 2025-09-15 11:08:30.387 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:30.387 |     reusedSocket: false,
app     | 2025-09-15 11:08:30.387 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:30.387 |     protocol: 'https:',
app     | 2025-09-15 11:08:30.387 |     _redirectable: Writable {
app     | 2025-09-15 11:08:30.387 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:30.387 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:30.387 |       _eventsCount: 3,
app     | 2025-09-15 11:08:30.387 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:30.387 |       _options: [Object],
app     | 2025-09-15 11:08:30.387 |       _ended: true,
app     | 2025-09-15 11:08:30.387 |       _ending: true,
app     | 2025-09-15 11:08:30.387 |       _redirectCount: 0,
app     | 2025-09-15 11:08:30.387 |       _redirects: [],
app     | 2025-09-15 11:08:30.387 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:30.387 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:30.387 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:30.387 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:30.387 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/supply-contracts/measurements/all?limit=1',
app     | 2025-09-15 11:08:30.387 |       _timeout: null,
app     | 2025-09-15 11:08:30.387 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:30.387 |     },
app     | 2025-09-15 11:08:30.387 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:30.387 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:30.387 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:30.387 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:30.387 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:30.387 |       accept: [Array],
app     | 2025-09-15 11:08:30.387 |       'content-type': [Array],
app     | 2025-09-15 11:08:30.387 |       'user-agent': [Array],
app     | 2025-09-15 11:08:30.387 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:30.387 |       host: [Array],
app     | 2025-09-15 11:08:30.387 |       authorization: [Array]
app     | 2025-09-15 11:08:30.387 |     },
app     | 2025-09-15 11:08:30.387 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:30.387 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:30.388 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:30.388 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:30.388 |   },
app     | 2025-09-15 11:08:30.388 |   response: {
app     | 2025-09-15 11:08:30.388 |     status: 403,
app     | 2025-09-15 11:08:30.388 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:30.388 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:30.388 |       server: 'nginx',
app     | 2025-09-15 11:08:30.388 |       date: 'Mon, 15 Sep 2025 14:08:31 GMT',
app     | 2025-09-15 11:08:30.388 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:30.388 |       'content-length': '34',
app     | 2025-09-15 11:08:30.388 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:30.388 |       'x-ratelimit-remaining-minute': '191',
app     | 2025-09-15 11:08:30.388 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:30.388 |       'ratelimit-remaining': '191',
app     | 2025-09-15 11:08:30.388 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:30.388 |       'ratelimit-reset': '29',
app     | 2025-09-15 11:08:30.388 |       'x-kong-response-latency': '4',
app     | 2025-09-15 11:08:30.388 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:30.388 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:30.388 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:30.388 |       connection: 'close'
app     | 2025-09-15 11:08:30.388 |     },
app     | 2025-09-15 11:08:30.388 |     config: {
app     | 2025-09-15 11:08:30.388 |       transitional: [Object],
app     | 2025-09-15 11:08:30.388 |       adapter: [Array],
app     | 2025-09-15 11:08:30.388 |       transformRequest: [Array],
app     | 2025-09-15 11:08:30.388 |       transformResponse: [Array],
app     | 2025-09-15 11:08:30.388 |       timeout: 30000,
app     | 2025-09-15 11:08:30.388 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:30.388 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:30.388 |       maxContentLength: -1,
app     | 2025-09-15 11:08:30.388 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:30.388 |       env: [Object],
app     | 2025-09-15 11:08:30.388 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:30.388 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:30.388 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:30.388 |       auth: [Object],
app     | 2025-09-15 11:08:30.388 |       method: 'get',
app     | 2025-09-15 11:08:30.388 |       url: '/supply-contracts/measurements/all',
app     | 2025-09-15 11:08:30.388 |       params: [Object],
app     | 2025-09-15 11:08:30.388 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:30.388 |       metadata: [Object],
app     | 2025-09-15 11:08:30.388 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:30.388 |       data: undefined
app     | 2025-09-15 11:08:30.388 |     },
app     | 2025-09-15 11:08:30.388 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:30.388 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:30.388 |       _eventsCount: 7,
app     | 2025-09-15 11:08:30.388 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:30.388 |       outputData: [],
app     | 2025-09-15 11:08:30.388 |       outputSize: 0,
app     | 2025-09-15 11:08:30.388 |       writable: true,
app     | 2025-09-15 11:08:30.388 |       destroyed: true,
app     | 2025-09-15 11:08:30.388 |       _last: true,
app     | 2025-09-15 11:08:30.388 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:30.388 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:30.388 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:30.388 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:30.388 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:30.388 |       sendDate: false,
app     | 2025-09-15 11:08:30.388 |       _removedConnection: false,
app     | 2025-09-15 11:08:30.388 |       _removedContLen: false,
app     | 2025-09-15 11:08:30.388 |       _removedTE: false,
app     | 2025-09-15 11:08:30.388 |       strictContentLength: false,
app     | 2025-09-15 11:08:30.388 |       _contentLength: 0,
app     | 2025-09-15 11:08:30.388 |       _hasBody: true,
app     | 2025-09-15 11:08:30.388 |       _trailer: '',
app     | 2025-09-15 11:08:30.388 |       finished: true,
app     | 2025-09-15 11:08:30.388 |       _headerSent: true,
app     | 2025-09-15 11:08:30.388 |       _closed: true,
app     | 2025-09-15 11:08:30.388 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:30.388 |       _header: 'GET /abf/public/api/v1/supply-contracts/measurements/all?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:30.388 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:30.388 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:30.388 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:30.388 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:30.388 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:30.388 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:30.388 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:30.388 |         '\r\n',
app     | 2025-09-15 11:08:30.388 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:30.388 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:30.388 |       agent: [Agent],
app     | 2025-09-15 11:08:30.388 |       socketPath: undefined,
app     | 2025-09-15 11:08:30.388 |       method: 'GET',
app     | 2025-09-15 11:08:30.388 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:30.388 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:30.388 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:30.388 |       path: '/abf/public/api/v1/supply-contracts/measurements/all?limit=1',
app     | 2025-09-15 11:08:30.388 |       _ended: true,
app     | 2025-09-15 11:08:30.388 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:30.388 |       aborted: false,
app     | 2025-09-15 11:08:30.388 |       timeoutCb: null,
app     | 2025-09-15 11:08:30.388 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:30.388 |       parser: null,
app     | 2025-09-15 11:08:30.388 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:30.388 |       reusedSocket: false,
app     | 2025-09-15 11:08:30.388 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:30.388 |       protocol: 'https:',
app     | 2025-09-15 11:08:30.388 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:30.388 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:30.388 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:30.388 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:30.388 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:30.388 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:30.388 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:30.388 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:30.388 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:30.388 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:30.388 |     },
app     | 2025-09-15 11:08:30.388 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:30.388 |   },
app     | 2025-09-15 11:08:30.388 |   status: 403
app     | 2025-09-15 11:08:30.388 | }
app     | 2025-09-15 11:08:30.385 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:30.385 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:30.385 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:30.385 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:30.385 |     },
app     | 2025-09-15 11:08:30.385 |     socketPath: undefined,
app     | 2025-09-15 11:08:30.385 |     method: 'GET',
app     | 2025-09-15 11:08:30.385 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:30.385 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:30.385 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:30.385 |     path: '/abf/public/api/v1/supply-contracts/measurements/all?limit=1',
app     | 2025-09-15 11:08:30.385 |     _ended: true,
app     | 2025-09-15 11:08:30.385 |     res: IncomingMessage {
app     | 2025-09-15 11:08:30.385 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:30.385 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:30.385 |       _eventsCount: 4,
app     | 2025-09-15 11:08:30.386 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:30.386 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:30.386 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:30.386 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:30.386 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:30.386 |       complete: true,
app     | 2025-09-15 11:08:30.386 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:30.386 |       rawTrailers: [],
app     | 2025-09-15 11:08:30.386 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:30.386 |       aborted: false,
app     | 2025-09-15 11:08:30.386 |       upgrade: false,
app     | 2025-09-15 11:08:30.386 |       url: '',
app     | 2025-09-15 11:08:30.386 |       method: null,
app     | 2025-09-15 11:08:30.387 |       statusCode: 403,
app     | 2025-09-15 11:08:30.387 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:30.387 |       client: [TLSSocket],
app     | 2025-09-15 11:08:30.387 |       _consuming: false,
app     | 2025-09-15 11:08:30.387 |       _dumped: false,
app     | 2025-09-15 11:08:30.387 |       req: [Circular *1],
app     | 2025-09-15 11:08:30.387 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/supply-contracts/measurements/all?limit=1',
app     | 2025-09-15 11:08:30.387 |       redirects: [],
app     | 2025-09-15 11:08:30.387 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:30.387 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:30.387 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:30.387 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:30.387 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:30.387 |     },
app     | 2025-09-15 11:08:30.387 |     aborted: false,
app     | 2025-09-15 11:08:30.387 |     timeoutCb: null,
app     | 2025-09-15 11:08:30.387 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:30.387 |     parser: null,
app     | 2025-09-15 11:08:30.387 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:30.387 |     reusedSocket: false,
app     | 2025-09-15 11:08:30.387 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:30.387 |     protocol: 'https:',
app     | 2025-09-15 11:08:30.387 |     _redirectable: Writable {
app     | 2025-09-15 11:08:30.387 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:30.387 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:30.387 |       _eventsCount: 3,
app     | 2025-09-15 11:08:30.387 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:30.387 |       _options: [Object],
app     | 2025-09-15 11:08:30.387 |       _ended: true,
app     | 2025-09-15 11:08:30.387 |       _ending: true,
app     | 2025-09-15 11:08:30.387 |       _redirectCount: 0,
app     | 2025-09-15 11:08:30.387 |       _redirects: [],
app     | 2025-09-15 11:08:30.387 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:30.387 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:30.387 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:30.387 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:30.387 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/supply-contracts/measurements/all?limit=1',
app     | 2025-09-15 11:08:30.387 |       _timeout: null,
app     | 2025-09-15 11:08:30.387 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:30.387 |     },
app     | 2025-09-15 11:08:30.387 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:30.387 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:30.387 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:30.387 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:30.387 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:30.387 |       accept: [Array],
app     | 2025-09-15 11:08:30.387 |       'content-type': [Array],
app     | 2025-09-15 11:08:30.387 |       'user-agent': [Array],
app     | 2025-09-15 11:08:30.387 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:30.387 |       host: [Array],
app     | 2025-09-15 11:08:30.387 |       authorization: [Array]
app     | 2025-09-15 11:08:30.387 |     },
app     | 2025-09-15 11:08:30.387 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:30.387 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:30.388 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:30.388 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:30.388 |   },
app     | 2025-09-15 11:08:30.388 |   response: {
app     | 2025-09-15 11:08:30.388 |     status: 403,
app     | 2025-09-15 11:08:30.388 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:30.388 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:30.388 |       server: 'nginx',
app     | 2025-09-15 11:08:30.388 |       date: 'Mon, 15 Sep 2025 14:08:31 GMT',
app     | 2025-09-15 11:08:30.388 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:30.388 |       'content-length': '34',
app     | 2025-09-15 11:08:30.388 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:30.388 |       'x-ratelimit-remaining-minute': '191',
app     | 2025-09-15 11:08:30.388 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:30.388 |       'ratelimit-remaining': '191',
app     | 2025-09-15 11:08:30.388 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:30.388 |       'ratelimit-reset': '29',
app     | 2025-09-15 11:08:30.388 |       'x-kong-response-latency': '4',
app     | 2025-09-15 11:08:30.388 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:30.388 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:30.388 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:30.388 |       connection: 'close'
app     | 2025-09-15 11:08:30.388 |     },
app     | 2025-09-15 11:08:30.388 |     config: {
app     | 2025-09-15 11:08:30.388 |       transitional: [Object],
app     | 2025-09-15 11:08:30.388 |       adapter: [Array],
app     | 2025-09-15 11:08:30.388 |       transformRequest: [Array],
app     | 2025-09-15 11:08:30.388 |       transformResponse: [Array],
app     | 2025-09-15 11:08:30.388 |       timeout: 30000,
app     | 2025-09-15 11:08:30.388 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:30.388 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:30.388 |       maxContentLength: -1,
app     | 2025-09-15 11:08:30.388 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:30.388 |       env: [Object],
app     | 2025-09-15 11:08:30.388 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:30.388 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:30.388 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:30.388 |       auth: [Object],
app     | 2025-09-15 11:08:30.388 |       method: 'get',
app     | 2025-09-15 11:08:30.388 |       url: '/supply-contracts/measurements/all',
app     | 2025-09-15 11:08:30.388 |       params: [Object],
app     | 2025-09-15 11:08:30.388 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:30.388 |       metadata: [Object],
app     | 2025-09-15 11:08:30.388 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:30.388 |       data: undefined
app     | 2025-09-15 11:08:30.388 |     },
app     | 2025-09-15 11:08:30.388 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:30.388 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:30.388 |       _eventsCount: 7,
app     | 2025-09-15 11:08:30.388 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:30.388 |       outputData: [],
app     | 2025-09-15 11:08:30.388 |       outputSize: 0,
app     | 2025-09-15 11:08:30.388 |       writable: true,
app     | 2025-09-15 11:08:30.388 |       destroyed: true,
app     | 2025-09-15 11:08:30.388 |       _last: true,
app     | 2025-09-15 11:08:30.388 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:30.388 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:30.388 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:30.388 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:30.388 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:30.388 |       sendDate: false,
app     | 2025-09-15 11:08:30.388 |       _removedConnection: false,
app     | 2025-09-15 11:08:30.388 |       _removedContLen: false,
app     | 2025-09-15 11:08:30.388 |       _removedTE: false,
app     | 2025-09-15 11:08:30.388 |       strictContentLength: false,
app     | 2025-09-15 11:08:30.388 |       _contentLength: 0,
app     | 2025-09-15 11:08:30.388 |       _hasBody: true,
app     | 2025-09-15 11:08:30.388 |       _trailer: '',
app     | 2025-09-15 11:08:30.388 |       finished: true,
app     | 2025-09-15 11:08:30.388 |       _headerSent: true,
app     | 2025-09-15 11:08:30.388 |       _closed: true,
app     | 2025-09-15 11:08:30.388 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:30.388 |       _header: 'GET /abf/public/api/v1/supply-contracts/measurements/all?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:30.388 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:30.388 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:30.388 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:30.388 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:30.388 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:30.388 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:30.388 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:30.388 |         '\r\n',
app     | 2025-09-15 11:08:30.388 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:30.388 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:30.388 |       agent: [Agent],
app     | 2025-09-15 11:08:30.388 |       socketPath: undefined,
app     | 2025-09-15 11:08:30.388 |       method: 'GET',
app     | 2025-09-15 11:08:30.388 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:30.388 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:30.388 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:30.388 |       path: '/abf/public/api/v1/supply-contracts/measurements/all?limit=1',
app     | 2025-09-15 11:08:30.388 |       _ended: true,
app     | 2025-09-15 11:08:30.388 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:30.388 |       aborted: false,
app     | 2025-09-15 11:08:30.388 |       timeoutCb: null,
app     | 2025-09-15 11:08:30.388 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:30.388 |       parser: null,
app     | 2025-09-15 11:08:30.388 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:30.388 |       reusedSocket: false,
app     | 2025-09-15 11:08:30.388 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:30.388 |       protocol: 'https:',
app     | 2025-09-15 11:08:30.388 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:30.388 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:30.388 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:30.388 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:30.388 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:30.388 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:30.388 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:30.388 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:30.388 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:30.388 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:30.388 |     },
app     | 2025-09-15 11:08:30.388 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:30.388 |   },
app     | 2025-09-15 11:08:30.388 |   status: 403
app     | 2025-09-15 11:08:30.388 | }
app     | 2025-09-15 11:08:30.772 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:30.772 | [Sienge Proxy] Chamando endpoint: /construction-daily-report/event-type com params: { limit: 1 }
app     | 2025-09-15 11:08:30.772 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:30.772 | [Sienge Proxy] Chamando endpoint: /construction-daily-report/event-type com params: { limit: 1 }
app     | 2025-09-15 11:08:31.213 | [LOGGER] Flushing 2 log entries
app     | 2025-09-15 11:08:31.213 | [LOGGER] Flushing 2 log entries
app     | 2025-09-15 11:08:31.216 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:31.216 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:31.216 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:31.216 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:31.216 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:31.216 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:31.216 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:31.216 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:31.216 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:31.216 |   config: {
app     | 2025-09-15 11:08:31.216 |     transitional: {
app     | 2025-09-15 11:08:31.216 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:31.216 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:31.216 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:31.216 |     },
app     | 2025-09-15 11:08:31.216 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:31.216 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:31.216 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:31.216 |     timeout: 30000,
app     | 2025-09-15 11:08:31.216 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:31.216 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:31.216 |     maxContentLength: -1,
app     | 2025-09-15 11:08:31.216 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:31.216 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:31.216 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:31.216 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:31.216 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:31.216 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:31.216 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:31.216 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:31.216 |     },
app     | 2025-09-15 11:08:31.216 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:31.216 |     auth: {
app     | 2025-09-15 11:08:31.216 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:31.216 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:31.216 |     },
app     | 2025-09-15 11:08:31.216 |     method: 'get',
app     | 2025-09-15 11:08:31.216 |     url: '/construction-daily-report/event-type',
app     | 2025-09-15 11:08:31.216 |     params: { limit: 1 },
app     | 2025-09-15 11:08:31.216 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:31.216 |     metadata: { startTime: 1757945310777 },
app     | 2025-09-15 11:08:31.216 |     'axios-retry': {
app     | 2025-09-15 11:08:31.216 |       retries: 3,
app     | 2025-09-15 11:08:31.216 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:31.216 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:31.216 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:31.216 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:31.216 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:31.216 |       validateResponse: null,
app     | 2025-09-15 11:08:31.216 |       retryCount: 0,
app     | 2025-09-15 11:08:31.216 |       lastRequestTime: 1757945310778
app     | 2025-09-15 11:08:31.216 |     },
app     | 2025-09-15 11:08:31.216 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:31.216 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:31.216 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:31.216 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:31.216 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:31.216 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:31.216 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:31.216 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:31.216 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:31.216 |   config: {
app     | 2025-09-15 11:08:31.216 |     transitional: {
app     | 2025-09-15 11:08:31.216 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:31.216 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:31.216 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:31.216 |     },
app     | 2025-09-15 11:08:31.216 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:31.216 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:31.216 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:31.216 |     timeout: 30000,
app     | 2025-09-15 11:08:31.216 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:31.216 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:31.216 |     maxContentLength: -1,
app     | 2025-09-15 11:08:31.216 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:31.216 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:31.216 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:31.216 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:31.216 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:31.216 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:31.216 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:31.216 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:31.216 |     },
app     | 2025-09-15 11:08:31.216 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:31.216 |     auth: {
app     | 2025-09-15 11:08:31.216 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:31.216 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:31.216 |     },
app     | 2025-09-15 11:08:31.216 |     method: 'get',
app     | 2025-09-15 11:08:31.216 |     url: '/construction-daily-report/event-type',
app     | 2025-09-15 11:08:31.216 |     params: { limit: 1 },
app     | 2025-09-15 11:08:31.216 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:31.216 |     metadata: { startTime: 1757945310777 },
app     | 2025-09-15 11:08:31.216 |     'axios-retry': {
app     | 2025-09-15 11:08:31.216 |       retries: 3,
app     | 2025-09-15 11:08:31.216 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:31.216 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:31.216 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:31.216 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:31.216 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:31.216 |       validateResponse: null,
app     | 2025-09-15 11:08:31.216 |       retryCount: 0,
app     | 2025-09-15 11:08:31.216 |       lastRequestTime: 1757945310778
app     | 2025-09-15 11:08:31.216 |     },
app     | 2025-09-15 11:08:31.216 |     data: undefined
app     | 2025-09-15 11:08:31.216 |   },
app     | 2025-09-15 11:08:31.216 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:31.216 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:31.216 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:31.216 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:31.216 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:31.216 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:31.216 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:31.216 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:31.216 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:31.216 |     },
app     | 2025-09-15 11:08:31.216 |     _eventsCount: 7,
app     | 2025-09-15 11:08:31.216 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:31.216 |     outputData: [],
app     | 2025-09-15 11:08:31.216 |     outputSize: 0,
app     | 2025-09-15 11:08:31.216 |     writable: true,
app     | 2025-09-15 11:08:31.216 |     destroyed: true,
app     | 2025-09-15 11:08:31.216 |     _last: true,
app     | 2025-09-15 11:08:31.216 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:31.216 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:31.216 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:31.216 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:31.216 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:31.216 |     sendDate: false,
app     | 2025-09-15 11:08:31.217 |     _removedConnection: false,
app     | 2025-09-15 11:08:31.217 |     _removedContLen: false,
app     | 2025-09-15 11:08:31.217 |     _removedTE: false,
app     | 2025-09-15 11:08:31.217 |     strictContentLength: false,
app     | 2025-09-15 11:08:31.217 |     _contentLength: 0,
app     | 2025-09-15 11:08:31.217 |     _hasBody: true,
app     | 2025-09-15 11:08:31.217 |     _trailer: '',
app     | 2025-09-15 11:08:31.217 |     finished: true,
app     | 2025-09-15 11:08:31.217 |     _headerSent: true,
app     | 2025-09-15 11:08:31.217 |     _closed: true,
app     | 2025-09-15 11:08:31.217 |     socket: TLSSocket {
app     | 2025-09-15 11:08:31.217 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:31.217 |       _secureEstablished: true,
app     | 2025-09-15 11:08:31.216 |     data: undefined
app     | 2025-09-15 11:08:31.216 |   },
app     | 2025-09-15 11:08:31.216 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:31.216 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:31.216 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:31.216 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:31.216 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:31.216 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:31.216 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:31.216 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:31.216 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:31.216 |     },
app     | 2025-09-15 11:08:31.216 |     _eventsCount: 7,
app     | 2025-09-15 11:08:31.216 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:31.216 |     outputData: [],
app     | 2025-09-15 11:08:31.216 |     outputSize: 0,
app     | 2025-09-15 11:08:31.216 |     writable: true,
app     | 2025-09-15 11:08:31.216 |     destroyed: true,
app     | 2025-09-15 11:08:31.216 |     _last: true,
app     | 2025-09-15 11:08:31.216 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:31.216 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:31.216 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:31.216 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:31.216 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:31.216 |     sendDate: false,
app     | 2025-09-15 11:08:31.217 |     _removedConnection: false,
app     | 2025-09-15 11:08:31.217 |     _removedContLen: false,
app     | 2025-09-15 11:08:31.217 |     _removedTE: false,
app     | 2025-09-15 11:08:31.217 |     strictContentLength: false,
app     | 2025-09-15 11:08:31.217 |     _contentLength: 0,
app     | 2025-09-15 11:08:31.217 |     _hasBody: true,
app     | 2025-09-15 11:08:31.217 |     _trailer: '',
app     | 2025-09-15 11:08:31.217 |     finished: true,
app     | 2025-09-15 11:08:31.217 |     _headerSent: true,
app     | 2025-09-15 11:08:31.217 |     _closed: true,
app     | 2025-09-15 11:08:31.217 |     socket: TLSSocket {
app     | 2025-09-15 11:08:31.217 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:31.217 |       _secureEstablished: true,
app     | 2025-09-15 11:08:31.217 |       _securePending: false,
app     | 2025-09-15 11:08:31.217 |       _newSessionPending: false,
app     | 2025-09-15 11:08:31.217 |       _controlReleased: true,
app     | 2025-09-15 11:08:31.217 |       secureConnecting: false,
app     | 2025-09-15 11:08:31.217 |       _SNICallback: null,
app     | 2025-09-15 11:08:31.217 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:31.217 |       alpnProtocol: false,
app     | 2025-09-15 11:08:31.217 |       authorized: true,
app     | 2025-09-15 11:08:31.217 |       authorizationError: null,
app     | 2025-09-15 11:08:31.217 |       encrypted: true,
app     | 2025-09-15 11:08:31.217 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.217 |       _eventsCount: 9,
app     | 2025-09-15 11:08:31.217 |       connecting: false,
app     | 2025-09-15 11:08:31.217 |       _hadError: false,
app     | 2025-09-15 11:08:31.217 |       _parent: null,
app     | 2025-09-15 11:08:31.217 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:31.217 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:31.217 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:31.217 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.217 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:31.217 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:31.217 |       _sockname: null,
app     | 2025-09-15 11:08:31.217 |       _pendingData: null,
app     | 2025-09-15 11:08:31.217 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:31.217 |       server: undefined,
app     | 2025-09-15 11:08:31.217 |       _server: null,
app     | 2025-09-15 11:08:31.217 |       ssl: null,
app     | 2025-09-15 11:08:31.217 |       _requestCert: true,
app     | 2025-09-15 11:08:31.217 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:31.217 |       parser: null,
app     | 2025-09-15 11:08:31.217 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:31.217 |       timeout: 30000,
app     | 2025-09-15 11:08:31.217 |       write: [Function: writeAfterFIN],
app     | 2025-09-15 11:08:31.217 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:31.217 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:31.217 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:31.217 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:31.217 |       [Symbol(async_id_symbol)]: 12219,
app     | 2025-09-15 11:08:31.217 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:31.217 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:31.217 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:31.217 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:31.217 |         _idlePrev: null,
app     | 2025-09-15 11:08:31.217 |         _idleNext: null,
app     | 2025-09-15 11:08:31.217 |         _idleStart: 20272,
app     | 2025-09-15 11:08:31.217 |         _onTimeout: null,
app     | 2025-09-15 11:08:31.217 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:31.217 |         _repeat: null,
app     | 2025-09-15 11:08:31.217 |         _destroyed: true,
app     | 2025-09-15 11:08:31.217 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:31.217 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:31.217 |         [Symbol(asyncId)]: 12230,
app     | 2025-09-15 11:08:31.217 |         [Symbol(triggerId)]: 12222,
app     | 2025-09-15 11:08:31.217 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:31.217 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:31.218 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:31.218 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:31.218 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:31.218 |       },
app     | 2025-09-15 11:08:31.218 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kBytesWritten)]: 364,
app     | 2025-09-15 11:08:31.218 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:31.218 |     },
app     | 2025-09-15 11:08:31.218 |     _header: 'GET /abf/public/api/v1/construction-daily-report/event-type?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:31.218 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:31.218 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:31.218 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:31.218 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:31.218 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:31.218 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:31.218 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:31.218 |       '\r\n',
app     | 2025-09-15 11:08:31.218 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:31.218 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:31.218 |     agent: Agent {
app     | 2025-09-15 11:08:31.218 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.218 |       _eventsCount: 2,
app     | 2025-09-15 11:08:31.218 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.218 |       defaultPort: 443,
app     | 2025-09-15 11:08:31.218 |       protocol: 'https:',
app     | 2025-09-15 11:08:31.218 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:31.218 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:31.218 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:31.218 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:31.218 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:31.218 |       keepAlive: false,
app     | 2025-09-15 11:08:31.218 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:31.218 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:31.218 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:31.218 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:31.218 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:31.218 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:31.218 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:31.218 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:31.218 |     },
app     | 2025-09-15 11:08:31.218 |     socketPath: undefined,
app     | 2025-09-15 11:08:31.218 |     method: 'GET',
app     | 2025-09-15 11:08:31.218 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:31.218 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:31.218 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:31.218 |     path: '/abf/public/api/v1/construction-daily-report/event-type?limit=1',
app     | 2025-09-15 11:08:31.218 |     _ended: true,
app     | 2025-09-15 11:08:31.218 |     res: IncomingMessage {
app     | 2025-09-15 11:08:31.218 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:31.218 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.218 |       _eventsCount: 4,
app     | 2025-09-15 11:08:31.218 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.218 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:31.218 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:31.218 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:31.218 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:31.218 |       complete: true,
app     | 2025-09-15 11:08:31.218 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:31.218 |       rawTrailers: [],
app     | 2025-09-15 11:08:31.218 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:31.218 |       aborted: false,
app     | 2025-09-15 11:08:31.218 |       upgrade: false,
app     | 2025-09-15 11:08:31.218 |       url: '',
app     | 2025-09-15 11:08:31.218 |       method: null,
app     | 2025-09-15 11:08:31.218 |       statusCode: 403,
app     | 2025-09-15 11:08:31.218 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:31.218 |       client: [TLSSocket],
app     | 2025-09-15 11:08:31.218 |       _consuming: false,
app     | 2025-09-15 11:08:31.218 |       _dumped: false,
app     | 2025-09-15 11:08:31.218 |       req: [Circular *1],
app     | 2025-09-15 11:08:31.218 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/construction-daily-report/event-type?limit=1',
app     | 2025-09-15 11:08:31.218 |       redirects: [],
app     | 2025-09-15 11:08:31.218 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:31.218 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:31.218 |     },
app     | 2025-09-15 11:08:31.218 |     aborted: false,
app     | 2025-09-15 11:08:31.218 |     timeoutCb: null,
app     | 2025-09-15 11:08:31.218 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:31.218 |     parser: null,
app     | 2025-09-15 11:08:31.218 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:31.218 |     reusedSocket: false,
app     | 2025-09-15 11:08:31.218 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:31.218 |     protocol: 'https:',
app     | 2025-09-15 11:08:31.218 |     _redirectable: Writable {
app     | 2025-09-15 11:08:31.218 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:31.218 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.218 |       _eventsCount: 3,
app     | 2025-09-15 11:08:31.218 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.218 |       _options: [Object],
app     | 2025-09-15 11:08:31.218 |       _ended: true,
app     | 2025-09-15 11:08:31.218 |       _ending: true,
app     | 2025-09-15 11:08:31.218 |       _redirectCount: 0,
app     | 2025-09-15 11:08:31.218 |       _redirects: [],
app     | 2025-09-15 11:08:31.218 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:31.218 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:31.218 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:31.218 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:31.218 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/construction-daily-report/event-type?limit=1',
app     | 2025-09-15 11:08:31.218 |       _timeout: null,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:31.218 |     },
app     | 2025-09-15 11:08:31.218 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:31.218 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:31.218 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:31.218 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:31.218 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:31.218 |       accept: [Array],
app     | 2025-09-15 11:08:31.218 |       'content-type': [Array],
app     | 2025-09-15 11:08:31.218 |       'user-agent': [Array],
app     | 2025-09-15 11:08:31.218 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:31.218 |       host: [Array],
app     | 2025-09-15 11:08:31.218 |       authorization: [Array]
app     | 2025-09-15 11:08:31.218 |     },
app     | 2025-09-15 11:08:31.218 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:31.218 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:31.218 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:31.218 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:31.218 |   },
app     | 2025-09-15 11:08:31.218 |   response: {
app     | 2025-09-15 11:08:31.218 |     status: 403,
app     | 2025-09-15 11:08:31.218 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:31.218 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:31.218 |       server: 'nginx',
app     | 2025-09-15 11:08:31.218 |       date: 'Mon, 15 Sep 2025 14:08:32 GMT',
app     | 2025-09-15 11:08:31.218 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:31.218 |       'content-length': '34',
app     | 2025-09-15 11:08:31.218 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:31.218 |       'x-ratelimit-remaining-minute': '190',
app     | 2025-09-15 11:08:31.218 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:31.218 |       'ratelimit-remaining': '190',
app     | 2025-09-15 11:08:31.218 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:31.218 |       'ratelimit-reset': '28',
app     | 2025-09-15 11:08:31.218 |       'x-kong-response-latency': '5',
app     | 2025-09-15 11:08:31.218 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:31.218 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:31.218 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:31.218 |       connection: 'close'
app     | 2025-09-15 11:08:31.218 |     },
app     | 2025-09-15 11:08:31.218 |     config: {
app     | 2025-09-15 11:08:31.218 |       transitional: [Object],
app     | 2025-09-15 11:08:31.218 |       adapter: [Array],
app     | 2025-09-15 11:08:31.218 |       transformRequest: [Array],
app     | 2025-09-15 11:08:31.218 |       transformResponse: [Array],
app     | 2025-09-15 11:08:31.218 |       timeout: 30000,
app     | 2025-09-15 11:08:31.218 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:31.218 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:31.218 |       maxContentLength: -1,
app     | 2025-09-15 11:08:31.218 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:31.218 |       env: [Object],
app     | 2025-09-15 11:08:31.218 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:31.218 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:31.218 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:31.218 |       auth: [Object],
app     | 2025-09-15 11:08:31.218 |       method: 'get',
app     | 2025-09-15 11:08:31.218 |       url: '/construction-daily-report/event-type',
app     | 2025-09-15 11:08:31.218 |       params: [Object],
app     | 2025-09-15 11:08:31.218 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:31.218 |       metadata: [Object],
app     | 2025-09-15 11:08:31.218 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:31.218 |       data: undefined
app     | 2025-09-15 11:08:31.218 |     },
app     | 2025-09-15 11:08:31.218 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:31.218 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.218 |       _eventsCount: 7,
app     | 2025-09-15 11:08:31.218 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.218 |       outputData: [],
app     | 2025-09-15 11:08:31.218 |       outputSize: 0,
app     | 2025-09-15 11:08:31.218 |       writable: true,
app     | 2025-09-15 11:08:31.218 |       destroyed: true,
app     | 2025-09-15 11:08:31.218 |       _last: true,
app     | 2025-09-15 11:08:31.218 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:31.218 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:31.218 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:31.218 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:31.218 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:31.218 |       sendDate: false,
app     | 2025-09-15 11:08:31.218 |       _removedConnection: false,
app     | 2025-09-15 11:08:31.218 |       _removedContLen: false,
app     | 2025-09-15 11:08:31.218 |       _removedTE: false,
app     | 2025-09-15 11:08:31.218 |       strictContentLength: false,
app     | 2025-09-15 11:08:31.218 |       _contentLength: 0,
app     | 2025-09-15 11:08:31.218 |       _hasBody: true,
app     | 2025-09-15 11:08:31.218 |       _trailer: '',
app     | 2025-09-15 11:08:31.218 |       finished: true,
app     | 2025-09-15 11:08:31.218 |       _headerSent: true,
app     | 2025-09-15 11:08:31.218 |       _closed: true,
app     | 2025-09-15 11:08:31.218 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:31.218 |       _header: 'GET /abf/public/api/v1/construction-daily-report/event-type?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:31.218 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:31.218 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:31.218 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:31.218 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:31.218 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:31.218 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:31.218 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:31.218 |         '\r\n',
app     | 2025-09-15 11:08:31.218 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:31.218 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:31.218 |       agent: [Agent],
app     | 2025-09-15 11:08:31.218 |       socketPath: undefined,
app     | 2025-09-15 11:08:31.218 |       method: 'GET',
app     | 2025-09-15 11:08:31.218 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:31.218 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:31.218 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:31.218 |       path: '/abf/public/api/v1/construction-daily-report/event-type?limit=1',
app     | 2025-09-15 11:08:31.218 |       _ended: true,
app     | 2025-09-15 11:08:31.218 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:31.218 |       aborted: false,
app     | 2025-09-15 11:08:31.218 |       timeoutCb: null,
app     | 2025-09-15 11:08:31.218 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:31.218 |       parser: null,
app     | 2025-09-15 11:08:31.218 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:31.218 |       reusedSocket: false,
app     | 2025-09-15 11:08:31.218 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:31.218 |       protocol: 'https:',
app     | 2025-09-15 11:08:31.218 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:31.218 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:31.218 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:31.218 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:31.218 |     },
app     | 2025-09-15 11:08:31.218 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:31.218 |   },
app     | 2025-09-15 11:08:31.218 |   status: 403
app     | 2025-09-15 11:08:31.218 | }
app     | 2025-09-15 11:08:31.217 |       _securePending: false,
app     | 2025-09-15 11:08:31.217 |       _newSessionPending: false,
app     | 2025-09-15 11:08:31.217 |       _controlReleased: true,
app     | 2025-09-15 11:08:31.217 |       secureConnecting: false,
app     | 2025-09-15 11:08:31.217 |       _SNICallback: null,
app     | 2025-09-15 11:08:31.217 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:31.217 |       alpnProtocol: false,
app     | 2025-09-15 11:08:31.217 |       authorized: true,
app     | 2025-09-15 11:08:31.217 |       authorizationError: null,
app     | 2025-09-15 11:08:31.217 |       encrypted: true,
app     | 2025-09-15 11:08:31.217 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.217 |       _eventsCount: 9,
app     | 2025-09-15 11:08:31.217 |       connecting: false,
app     | 2025-09-15 11:08:31.217 |       _hadError: false,
app     | 2025-09-15 11:08:31.217 |       _parent: null,
app     | 2025-09-15 11:08:31.217 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:31.217 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:31.217 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:31.217 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.217 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:31.217 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:31.217 |       _sockname: null,
app     | 2025-09-15 11:08:31.217 |       _pendingData: null,
app     | 2025-09-15 11:08:31.217 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:31.217 |       server: undefined,
app     | 2025-09-15 11:08:31.217 |       _server: null,
app     | 2025-09-15 11:08:31.217 |       ssl: null,
app     | 2025-09-15 11:08:31.217 |       _requestCert: true,
app     | 2025-09-15 11:08:31.217 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:31.217 |       parser: null,
app     | 2025-09-15 11:08:31.217 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:31.217 |       timeout: 30000,
app     | 2025-09-15 11:08:31.217 |       write: [Function: writeAfterFIN],
app     | 2025-09-15 11:08:31.217 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:31.217 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:31.217 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:31.217 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:31.217 |       [Symbol(async_id_symbol)]: 12219,
app     | 2025-09-15 11:08:31.217 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:31.217 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:31.217 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:31.217 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:31.217 |         _idlePrev: null,
app     | 2025-09-15 11:08:31.217 |         _idleNext: null,
app     | 2025-09-15 11:08:31.217 |         _idleStart: 20272,
app     | 2025-09-15 11:08:31.217 |         _onTimeout: null,
app     | 2025-09-15 11:08:31.217 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:31.217 |         _repeat: null,
app     | 2025-09-15 11:08:31.217 |         _destroyed: true,
app     | 2025-09-15 11:08:31.217 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:31.217 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:31.217 |         [Symbol(asyncId)]: 12230,
app     | 2025-09-15 11:08:31.217 |         [Symbol(triggerId)]: 12222,
app     | 2025-09-15 11:08:31.217 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:31.217 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:31.218 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:31.218 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:31.218 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:31.218 |       },
app     | 2025-09-15 11:08:31.218 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kBytesWritten)]: 364,
app     | 2025-09-15 11:08:31.218 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:31.218 |     },
app     | 2025-09-15 11:08:31.218 |     _header: 'GET /abf/public/api/v1/construction-daily-report/event-type?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:31.218 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:31.218 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:31.218 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:31.218 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:31.218 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:31.218 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:31.218 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:31.218 |       '\r\n',
app     | 2025-09-15 11:08:31.218 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:31.218 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:31.218 |     agent: Agent {
app     | 2025-09-15 11:08:31.218 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.218 |       _eventsCount: 2,
app     | 2025-09-15 11:08:31.218 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.218 |       defaultPort: 443,
app     | 2025-09-15 11:08:31.218 |       protocol: 'https:',
app     | 2025-09-15 11:08:31.218 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:31.218 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:31.218 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:31.218 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:31.218 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:31.218 |       keepAlive: false,
app     | 2025-09-15 11:08:31.218 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:31.218 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:31.218 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:31.218 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:31.218 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:31.218 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:31.218 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:31.218 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:31.218 |     },
app     | 2025-09-15 11:08:31.218 |     socketPath: undefined,
app     | 2025-09-15 11:08:31.218 |     method: 'GET',
app     | 2025-09-15 11:08:31.218 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:31.218 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:31.218 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:31.218 |     path: '/abf/public/api/v1/construction-daily-report/event-type?limit=1',
app     | 2025-09-15 11:08:31.218 |     _ended: true,
app     | 2025-09-15 11:08:31.218 |     res: IncomingMessage {
app     | 2025-09-15 11:08:31.218 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:31.218 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.218 |       _eventsCount: 4,
app     | 2025-09-15 11:08:31.218 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.218 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:31.218 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:31.218 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:31.218 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:31.218 |       complete: true,
app     | 2025-09-15 11:08:31.218 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:31.218 |       rawTrailers: [],
app     | 2025-09-15 11:08:31.218 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:31.218 |       aborted: false,
app     | 2025-09-15 11:08:31.218 |       upgrade: false,
app     | 2025-09-15 11:08:31.218 |       url: '',
app     | 2025-09-15 11:08:31.218 |       method: null,
app     | 2025-09-15 11:08:31.218 |       statusCode: 403,
app     | 2025-09-15 11:08:31.218 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:31.218 |       client: [TLSSocket],
app     | 2025-09-15 11:08:31.218 |       _consuming: false,
app     | 2025-09-15 11:08:31.218 |       _dumped: false,
app     | 2025-09-15 11:08:31.218 |       req: [Circular *1],
app     | 2025-09-15 11:08:31.218 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/construction-daily-report/event-type?limit=1',
app     | 2025-09-15 11:08:31.218 |       redirects: [],
app     | 2025-09-15 11:08:31.218 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:31.218 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:31.218 |     },
app     | 2025-09-15 11:08:31.218 |     aborted: false,
app     | 2025-09-15 11:08:31.218 |     timeoutCb: null,
app     | 2025-09-15 11:08:31.218 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:31.218 |     parser: null,
app     | 2025-09-15 11:08:31.218 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:31.218 |     reusedSocket: false,
app     | 2025-09-15 11:08:31.218 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:31.218 |     protocol: 'https:',
app     | 2025-09-15 11:08:31.218 |     _redirectable: Writable {
app     | 2025-09-15 11:08:31.218 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:31.218 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.218 |       _eventsCount: 3,
app     | 2025-09-15 11:08:31.218 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.218 |       _options: [Object],
app     | 2025-09-15 11:08:31.218 |       _ended: true,
app     | 2025-09-15 11:08:31.218 |       _ending: true,
app     | 2025-09-15 11:08:31.218 |       _redirectCount: 0,
app     | 2025-09-15 11:08:31.218 |       _redirects: [],
app     | 2025-09-15 11:08:31.218 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:31.218 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:31.218 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:31.218 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:31.218 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/construction-daily-report/event-type?limit=1',
app     | 2025-09-15 11:08:31.218 |       _timeout: null,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:31.218 |     },
app     | 2025-09-15 11:08:31.218 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:31.218 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:31.218 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:31.218 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:31.218 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:31.218 |       accept: [Array],
app     | 2025-09-15 11:08:31.218 |       'content-type': [Array],
app     | 2025-09-15 11:08:31.218 |       'user-agent': [Array],
app     | 2025-09-15 11:08:31.218 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:31.218 |       host: [Array],
app     | 2025-09-15 11:08:31.218 |       authorization: [Array]
app     | 2025-09-15 11:08:31.218 |     },
app     | 2025-09-15 11:08:31.218 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:31.218 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:31.218 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:31.218 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:31.218 |   },
app     | 2025-09-15 11:08:31.218 |   response: {
app     | 2025-09-15 11:08:31.218 |     status: 403,
app     | 2025-09-15 11:08:31.218 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:31.218 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:31.218 |       server: 'nginx',
app     | 2025-09-15 11:08:31.218 |       date: 'Mon, 15 Sep 2025 14:08:32 GMT',
app     | 2025-09-15 11:08:31.218 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:31.218 |       'content-length': '34',
app     | 2025-09-15 11:08:31.218 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:31.218 |       'x-ratelimit-remaining-minute': '190',
app     | 2025-09-15 11:08:31.218 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:31.218 |       'ratelimit-remaining': '190',
app     | 2025-09-15 11:08:31.218 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:31.218 |       'ratelimit-reset': '28',
app     | 2025-09-15 11:08:31.218 |       'x-kong-response-latency': '5',
app     | 2025-09-15 11:08:31.218 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:31.218 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:31.218 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:31.218 |       connection: 'close'
app     | 2025-09-15 11:08:31.218 |     },
app     | 2025-09-15 11:08:31.218 |     config: {
app     | 2025-09-15 11:08:31.218 |       transitional: [Object],
app     | 2025-09-15 11:08:31.218 |       adapter: [Array],
app     | 2025-09-15 11:08:31.218 |       transformRequest: [Array],
app     | 2025-09-15 11:08:31.218 |       transformResponse: [Array],
app     | 2025-09-15 11:08:31.218 |       timeout: 30000,
app     | 2025-09-15 11:08:31.218 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:31.218 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:31.218 |       maxContentLength: -1,
app     | 2025-09-15 11:08:31.218 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:31.218 |       env: [Object],
app     | 2025-09-15 11:08:31.218 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:31.218 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:31.218 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:31.218 |       auth: [Object],
app     | 2025-09-15 11:08:31.218 |       method: 'get',
app     | 2025-09-15 11:08:31.218 |       url: '/construction-daily-report/event-type',
app     | 2025-09-15 11:08:31.218 |       params: [Object],
app     | 2025-09-15 11:08:31.218 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:31.218 |       metadata: [Object],
app     | 2025-09-15 11:08:31.218 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:31.218 |       data: undefined
app     | 2025-09-15 11:08:31.218 |     },
app     | 2025-09-15 11:08:31.218 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:31.218 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.218 |       _eventsCount: 7,
app     | 2025-09-15 11:08:31.218 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.218 |       outputData: [],
app     | 2025-09-15 11:08:31.218 |       outputSize: 0,
app     | 2025-09-15 11:08:31.218 |       writable: true,
app     | 2025-09-15 11:08:31.218 |       destroyed: true,
app     | 2025-09-15 11:08:31.218 |       _last: true,
app     | 2025-09-15 11:08:31.218 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:31.218 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:31.218 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:31.218 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:31.218 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:31.218 |       sendDate: false,
app     | 2025-09-15 11:08:31.218 |       _removedConnection: false,
app     | 2025-09-15 11:08:31.218 |       _removedContLen: false,
app     | 2025-09-15 11:08:31.218 |       _removedTE: false,
app     | 2025-09-15 11:08:31.218 |       strictContentLength: false,
app     | 2025-09-15 11:08:31.218 |       _contentLength: 0,
app     | 2025-09-15 11:08:31.218 |       _hasBody: true,
app     | 2025-09-15 11:08:31.218 |       _trailer: '',
app     | 2025-09-15 11:08:31.218 |       finished: true,
app     | 2025-09-15 11:08:31.218 |       _headerSent: true,
app     | 2025-09-15 11:08:31.218 |       _closed: true,
app     | 2025-09-15 11:08:31.218 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:31.218 |       _header: 'GET /abf/public/api/v1/construction-daily-report/event-type?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:31.218 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:31.218 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:31.218 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:31.218 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:31.218 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:31.218 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:31.218 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:31.218 |         '\r\n',
app     | 2025-09-15 11:08:31.218 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:31.218 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:31.218 |       agent: [Agent],
app     | 2025-09-15 11:08:31.218 |       socketPath: undefined,
app     | 2025-09-15 11:08:31.218 |       method: 'GET',
app     | 2025-09-15 11:08:31.218 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:31.218 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:31.218 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:31.218 |       path: '/abf/public/api/v1/construction-daily-report/event-type?limit=1',
app     | 2025-09-15 11:08:31.218 |       _ended: true,
app     | 2025-09-15 11:08:31.218 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:31.218 |       aborted: false,
app     | 2025-09-15 11:08:31.218 |       timeoutCb: null,
app     | 2025-09-15 11:08:31.218 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:31.218 |       parser: null,
app     | 2025-09-15 11:08:31.218 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:31.218 |       reusedSocket: false,
app     | 2025-09-15 11:08:31.218 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:31.218 |       protocol: 'https:',
app     | 2025-09-15 11:08:31.218 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:31.218 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:31.218 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:31.218 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:31.218 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:31.218 |     },
app     | 2025-09-15 11:08:31.218 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:31.218 |   },
app     | 2025-09-15 11:08:31.218 |   status: 403
app     | 2025-09-15 11:08:31.218 | }
app     | 2025-09-15 11:08:31.415 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:31.415 | [Sienge Proxy] Chamando endpoint: /construction-daily-report/types com params: { limit: 1 }
app     | 2025-09-15 11:08:31.415 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:31.415 | [Sienge Proxy] Chamando endpoint: /construction-daily-report/types com params: { limit: 1 }
app     | 2025-09-15 11:08:31.950 | [LOGGER] Flushing 2 log entries
app     | 2025-09-15 11:08:31.950 | [LOGGER] Flushing 2 log entries
app     | 2025-09-15 11:08:31.954 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:31.954 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:31.954 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:31.954 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:31.954 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:31.954 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:31.954 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:31.954 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:31.954 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:31.954 |   config: {
app     | 2025-09-15 11:08:31.954 |     transitional: {
app     | 2025-09-15 11:08:31.954 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:31.954 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:31.954 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:31.954 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:31.954 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:31.954 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:31.954 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:31.954 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:31.954 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:31.954 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:31.954 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:31.954 |   config: {
app     | 2025-09-15 11:08:31.954 |     transitional: {
app     | 2025-09-15 11:08:31.954 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:31.954 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:31.954 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:31.954 |     },
app     | 2025-09-15 11:08:31.954 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:31.954 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:31.954 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:31.954 |     timeout: 30000,
app     | 2025-09-15 11:08:31.954 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:31.954 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:31.954 |     maxContentLength: -1,
app     | 2025-09-15 11:08:31.954 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:31.954 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:31.954 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:31.954 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:31.954 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:31.954 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:31.954 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:31.954 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:31.954 |     },
app     | 2025-09-15 11:08:31.954 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:31.954 |     auth: {
app     | 2025-09-15 11:08:31.954 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:31.954 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:31.954 |     },
app     | 2025-09-15 11:08:31.954 |     method: 'get',
app     | 2025-09-15 11:08:31.954 |     url: '/construction-daily-report/types',
app     | 2025-09-15 11:08:31.954 |     params: { limit: 1 },
app     | 2025-09-15 11:08:31.954 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:31.954 |     metadata: { startTime: 1757945311418 },
app     | 2025-09-15 11:08:31.954 |     'axios-retry': {
app     | 2025-09-15 11:08:31.954 |       retries: 3,
app     | 2025-09-15 11:08:31.954 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:31.954 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:31.954 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:31.954 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:31.954 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:31.954 |       validateResponse: null,
app     | 2025-09-15 11:08:31.954 |       retryCount: 0,
app     | 2025-09-15 11:08:31.954 |       lastRequestTime: 1757945311418
app     | 2025-09-15 11:08:31.954 |     },
app     | 2025-09-15 11:08:31.954 |     data: undefined
app     | 2025-09-15 11:08:31.954 |   },
app     | 2025-09-15 11:08:31.954 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:31.954 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:31.954 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:31.954 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:31.954 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:31.954 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:31.954 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:31.954 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:31.954 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:31.954 |     },
app     | 2025-09-15 11:08:31.954 |     _eventsCount: 7,
app     | 2025-09-15 11:08:31.954 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:31.954 |     outputData: [],
app     | 2025-09-15 11:08:31.954 |     outputSize: 0,
app     | 2025-09-15 11:08:31.954 |     writable: true,
app     | 2025-09-15 11:08:31.954 |     destroyed: true,
app     | 2025-09-15 11:08:31.954 |     _last: true,
app     | 2025-09-15 11:08:31.954 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:31.954 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:31.954 |     },
app     | 2025-09-15 11:08:31.954 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:31.954 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:31.954 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:31.954 |     timeout: 30000,
app     | 2025-09-15 11:08:31.954 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:31.954 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:31.954 |     maxContentLength: -1,
app     | 2025-09-15 11:08:31.954 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:31.954 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:31.954 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:31.954 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:31.954 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:31.954 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:31.954 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:31.954 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:31.954 |     },
app     | 2025-09-15 11:08:31.954 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:31.954 |     auth: {
app     | 2025-09-15 11:08:31.954 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:31.954 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:31.954 |     },
app     | 2025-09-15 11:08:31.954 |     method: 'get',
app     | 2025-09-15 11:08:31.954 |     url: '/construction-daily-report/types',
app     | 2025-09-15 11:08:31.954 |     params: { limit: 1 },
app     | 2025-09-15 11:08:31.954 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:31.954 |     metadata: { startTime: 1757945311418 },
app     | 2025-09-15 11:08:31.954 |     'axios-retry': {
app     | 2025-09-15 11:08:31.954 |       retries: 3,
app     | 2025-09-15 11:08:31.954 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:31.954 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:31.954 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:31.954 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:31.954 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:31.954 |       validateResponse: null,
app     | 2025-09-15 11:08:31.954 |       retryCount: 0,
app     | 2025-09-15 11:08:31.954 |       lastRequestTime: 1757945311418
app     | 2025-09-15 11:08:31.954 |     },
app     | 2025-09-15 11:08:31.954 |     data: undefined
app     | 2025-09-15 11:08:31.954 |   },
app     | 2025-09-15 11:08:31.954 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:31.954 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:31.954 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:31.954 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:31.954 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:31.954 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:31.954 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:31.954 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:31.954 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:31.954 |     },
app     | 2025-09-15 11:08:31.954 |     _eventsCount: 7,
app     | 2025-09-15 11:08:31.954 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:31.954 |     outputData: [],
app     | 2025-09-15 11:08:31.954 |     outputSize: 0,
app     | 2025-09-15 11:08:31.954 |     writable: true,
app     | 2025-09-15 11:08:31.954 |     destroyed: true,
app     | 2025-09-15 11:08:31.954 |     _last: true,
app     | 2025-09-15 11:08:31.954 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:31.954 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:31.954 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:31.954 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:31.954 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:31.954 |     sendDate: false,
app     | 2025-09-15 11:08:31.954 |     _removedConnection: false,
app     | 2025-09-15 11:08:31.954 |     _removedContLen: false,
app     | 2025-09-15 11:08:31.954 |     _removedTE: false,
app     | 2025-09-15 11:08:31.954 |     strictContentLength: false,
app     | 2025-09-15 11:08:31.954 |     _contentLength: 0,
app     | 2025-09-15 11:08:31.954 |     _hasBody: true,
app     | 2025-09-15 11:08:31.954 |     _trailer: '',
app     | 2025-09-15 11:08:31.954 |     finished: true,
app     | 2025-09-15 11:08:31.954 |     _headerSent: true,
app     | 2025-09-15 11:08:31.954 |     _closed: true,
app     | 2025-09-15 11:08:31.954 |     socket: TLSSocket {
app     | 2025-09-15 11:08:31.954 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:31.954 |       _secureEstablished: true,
app     | 2025-09-15 11:08:31.954 |       _securePending: false,
app     | 2025-09-15 11:08:31.954 |       _newSessionPending: false,
app     | 2025-09-15 11:08:31.954 |       _controlReleased: true,
app     | 2025-09-15 11:08:31.954 |       secureConnecting: false,
app     | 2025-09-15 11:08:31.954 |       _SNICallback: null,
app     | 2025-09-15 11:08:31.954 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:31.954 |       alpnProtocol: false,
app     | 2025-09-15 11:08:31.954 |       authorized: true,
app     | 2025-09-15 11:08:31.954 |       authorizationError: null,
app     | 2025-09-15 11:08:31.954 |       encrypted: true,
app     | 2025-09-15 11:08:31.954 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.954 |       _eventsCount: 9,
app     | 2025-09-15 11:08:31.954 |       connecting: false,
app     | 2025-09-15 11:08:31.954 |       _hadError: false,
app     | 2025-09-15 11:08:31.954 |       _parent: null,
app     | 2025-09-15 11:08:31.954 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:31.954 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:31.954 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:31.954 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.954 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:31.954 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:31.954 |       _sockname: null,
app     | 2025-09-15 11:08:31.954 |       _pendingData: null,
app     | 2025-09-15 11:08:31.954 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:31.954 |       server: undefined,
app     | 2025-09-15 11:08:31.954 |       _server: null,
app     | 2025-09-15 11:08:31.954 |       ssl: null,
app     | 2025-09-15 11:08:31.954 |       _requestCert: true,
app     | 2025-09-15 11:08:31.954 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:31.954 |       parser: null,
app     | 2025-09-15 11:08:31.954 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:31.954 |       timeout: 30000,
app     | 2025-09-15 11:08:31.954 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:31.954 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:31.954 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:31.954 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:31.954 |       [Symbol(async_id_symbol)]: 12658,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:31.954 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:31.954 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:31.954 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:31.954 |         _idlePrev: null,
app     | 2025-09-15 11:08:31.954 |         _idleNext: null,
app     | 2025-09-15 11:08:31.954 |         _idleStart: 21008,
app     | 2025-09-15 11:08:31.954 |         _onTimeout: null,
app     | 2025-09-15 11:08:31.954 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:31.954 |         _repeat: null,
app     | 2025-09-15 11:08:31.954 |         _destroyed: true,
app     | 2025-09-15 11:08:31.954 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:31.954 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:31.954 |         [Symbol(asyncId)]: 12669,
app     | 2025-09-15 11:08:31.954 |         [Symbol(triggerId)]: 12661,
app     | 2025-09-15 11:08:31.954 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:31.954 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:31.954 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:31.954 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:31.954 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:31.954 |       },
app     | 2025-09-15 11:08:31.954 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kBytesWritten)]: 359,
app     | 2025-09-15 11:08:31.955 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:31.955 |     },
app     | 2025-09-15 11:08:31.955 |     _header: 'GET /abf/public/api/v1/construction-daily-report/types?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:31.955 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:31.955 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:31.955 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:31.955 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:31.955 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:31.955 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:31.955 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:31.955 |       '\r\n',
app     | 2025-09-15 11:08:31.955 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:31.955 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:31.955 |     agent: Agent {
app     | 2025-09-15 11:08:31.955 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.955 |       _eventsCount: 2,
app     | 2025-09-15 11:08:31.955 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.955 |       defaultPort: 443,
app     | 2025-09-15 11:08:31.955 |       protocol: 'https:',
app     | 2025-09-15 11:08:31.955 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:31.955 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:31.955 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:31.955 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:31.955 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:31.955 |       keepAlive: false,
app     | 2025-09-15 11:08:31.955 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:31.955 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:31.955 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:31.955 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:31.955 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:31.955 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:31.955 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:31.955 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:31.955 |     },
app     | 2025-09-15 11:08:31.955 |     socketPath: undefined,
app     | 2025-09-15 11:08:31.955 |     method: 'GET',
app     | 2025-09-15 11:08:31.955 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:31.955 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:31.955 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:31.955 |     path: '/abf/public/api/v1/construction-daily-report/types?limit=1',
app     | 2025-09-15 11:08:31.955 |     _ended: true,
app     | 2025-09-15 11:08:31.955 |     res: IncomingMessage {
app     | 2025-09-15 11:08:31.955 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:31.955 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.955 |       _eventsCount: 4,
app     | 2025-09-15 11:08:31.955 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.955 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:31.955 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:31.955 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:31.955 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:31.955 |       complete: true,
app     | 2025-09-15 11:08:31.955 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:31.955 |       rawTrailers: [],
app     | 2025-09-15 11:08:31.955 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:31.955 |       aborted: false,
app     | 2025-09-15 11:08:31.955 |       upgrade: false,
app     | 2025-09-15 11:08:31.955 |       url: '',
app     | 2025-09-15 11:08:31.955 |       method: null,
app     | 2025-09-15 11:08:31.955 |       statusCode: 403,
app     | 2025-09-15 11:08:31.955 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:31.955 |       client: [TLSSocket],
app     | 2025-09-15 11:08:31.955 |       _consuming: false,
app     | 2025-09-15 11:08:31.955 |       _dumped: false,
app     | 2025-09-15 11:08:31.955 |       req: [Circular *1],
app     | 2025-09-15 11:08:31.955 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/construction-daily-report/types?limit=1',
app     | 2025-09-15 11:08:31.955 |       redirects: [],
app     | 2025-09-15 11:08:31.955 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:31.955 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:31.955 |     },
app     | 2025-09-15 11:08:31.955 |     aborted: false,
app     | 2025-09-15 11:08:31.955 |     timeoutCb: null,
app     | 2025-09-15 11:08:31.955 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:31.955 |     parser: null,
app     | 2025-09-15 11:08:31.955 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:31.955 |     reusedSocket: false,
app     | 2025-09-15 11:08:31.955 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:31.955 |     protocol: 'https:',
app     | 2025-09-15 11:08:31.955 |     _redirectable: Writable {
app     | 2025-09-15 11:08:31.955 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:31.955 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.955 |       _eventsCount: 3,
app     | 2025-09-15 11:08:31.955 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.955 |       _options: [Object],
app     | 2025-09-15 11:08:31.955 |       _ended: true,
app     | 2025-09-15 11:08:31.955 |       _ending: true,
app     | 2025-09-15 11:08:31.955 |       _redirectCount: 0,
app     | 2025-09-15 11:08:31.955 |       _redirects: [],
app     | 2025-09-15 11:08:31.955 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:31.955 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:31.955 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:31.955 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:31.955 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/construction-daily-report/types?limit=1',
app     | 2025-09-15 11:08:31.955 |       _timeout: null,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:31.955 |     },
app     | 2025-09-15 11:08:31.955 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:31.955 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:31.955 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:31.955 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:31.955 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:31.955 |       accept: [Array],
app     | 2025-09-15 11:08:31.955 |       'content-type': [Array],
app     | 2025-09-15 11:08:31.955 |       'user-agent': [Array],
app     | 2025-09-15 11:08:31.955 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:31.955 |       host: [Array],
app     | 2025-09-15 11:08:31.955 |       authorization: [Array]
app     | 2025-09-15 11:08:31.955 |     },
app     | 2025-09-15 11:08:31.955 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:31.955 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:31.955 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:31.955 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:31.955 |   },
app     | 2025-09-15 11:08:31.955 |   response: {
app     | 2025-09-15 11:08:31.955 |     status: 403,
app     | 2025-09-15 11:08:31.955 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:31.955 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:31.955 |       server: 'nginx',
app     | 2025-09-15 11:08:31.955 |       date: 'Mon, 15 Sep 2025 14:08:33 GMT',
app     | 2025-09-15 11:08:31.955 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:31.955 |       'content-length': '34',
app     | 2025-09-15 11:08:31.955 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:31.955 |       'x-ratelimit-remaining-minute': '189',
app     | 2025-09-15 11:08:31.955 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:31.955 |       'ratelimit-remaining': '189',
app     | 2025-09-15 11:08:31.955 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:31.955 |       'ratelimit-reset': '27',
app     | 2025-09-15 11:08:31.955 |       'x-kong-response-latency': '4',
app     | 2025-09-15 11:08:31.955 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:31.955 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:31.955 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:31.955 |       connection: 'close'
app     | 2025-09-15 11:08:31.955 |     },
app     | 2025-09-15 11:08:31.955 |     config: {
app     | 2025-09-15 11:08:31.955 |       transitional: [Object],
app     | 2025-09-15 11:08:31.955 |       adapter: [Array],
app     | 2025-09-15 11:08:31.955 |       transformRequest: [Array],
app     | 2025-09-15 11:08:31.955 |       transformResponse: [Array],
app     | 2025-09-15 11:08:31.955 |       timeout: 30000,
app     | 2025-09-15 11:08:31.955 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:31.955 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:31.955 |       maxContentLength: -1,
app     | 2025-09-15 11:08:31.955 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:31.955 |       env: [Object],
app     | 2025-09-15 11:08:31.955 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:31.955 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:31.955 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:31.955 |       auth: [Object],
app     | 2025-09-15 11:08:31.955 |       method: 'get',
app     | 2025-09-15 11:08:31.955 |       url: '/construction-daily-report/types',
app     | 2025-09-15 11:08:31.955 |       params: [Object],
app     | 2025-09-15 11:08:31.955 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:31.955 |       metadata: [Object],
app     | 2025-09-15 11:08:31.955 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:31.955 |       data: undefined
app     | 2025-09-15 11:08:31.955 |     },
app     | 2025-09-15 11:08:31.955 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:31.955 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.955 |       _eventsCount: 7,
app     | 2025-09-15 11:08:31.955 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.955 |       outputData: [],
app     | 2025-09-15 11:08:31.955 |       outputSize: 0,
app     | 2025-09-15 11:08:31.955 |       writable: true,
app     | 2025-09-15 11:08:31.955 |       destroyed: true,
app     | 2025-09-15 11:08:31.955 |       _last: true,
app     | 2025-09-15 11:08:31.955 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:31.955 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:31.955 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:31.955 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:31.955 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:31.955 |       sendDate: false,
app     | 2025-09-15 11:08:31.955 |       _removedConnection: false,
app     | 2025-09-15 11:08:31.955 |       _removedContLen: false,
app     | 2025-09-15 11:08:31.955 |       _removedTE: false,
app     | 2025-09-15 11:08:31.955 |       strictContentLength: false,
app     | 2025-09-15 11:08:31.955 |       _contentLength: 0,
app     | 2025-09-15 11:08:31.955 |       _hasBody: true,
app     | 2025-09-15 11:08:31.955 |       _trailer: '',
app     | 2025-09-15 11:08:31.955 |       finished: true,
app     | 2025-09-15 11:08:31.955 |       _headerSent: true,
app     | 2025-09-15 11:08:31.955 |       _closed: true,
app     | 2025-09-15 11:08:31.955 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:31.955 |       _header: 'GET /abf/public/api/v1/construction-daily-report/types?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:31.955 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:31.955 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:31.955 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:31.955 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:31.955 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:31.955 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:31.955 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:31.955 |         '\r\n',
app     | 2025-09-15 11:08:31.955 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:31.955 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:31.955 |       agent: [Agent],
app     | 2025-09-15 11:08:31.955 |       socketPath: undefined,
app     | 2025-09-15 11:08:31.955 |       method: 'GET',
app     | 2025-09-15 11:08:31.955 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:31.955 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:31.955 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:31.955 |       path: '/abf/public/api/v1/construction-daily-report/types?limit=1',
app     | 2025-09-15 11:08:31.955 |       _ended: true,
app     | 2025-09-15 11:08:31.955 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:31.955 |       aborted: false,
app     | 2025-09-15 11:08:31.955 |       timeoutCb: null,
app     | 2025-09-15 11:08:31.955 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:31.955 |       parser: null,
app     | 2025-09-15 11:08:31.955 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:31.955 |       reusedSocket: false,
app     | 2025-09-15 11:08:31.955 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:31.955 |       protocol: 'https:',
app     | 2025-09-15 11:08:31.955 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:31.955 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:31.955 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:31.955 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:31.955 |     },
app     | 2025-09-15 11:08:31.955 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:31.955 |   },
app     | 2025-09-15 11:08:31.955 |   status: 403
app     | 2025-09-15 11:08:31.955 | }
app     | 2025-09-15 11:08:31.954 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:31.954 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:31.954 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:31.954 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:31.954 |     sendDate: false,
app     | 2025-09-15 11:08:31.954 |     _removedConnection: false,
app     | 2025-09-15 11:08:31.954 |     _removedContLen: false,
app     | 2025-09-15 11:08:31.954 |     _removedTE: false,
app     | 2025-09-15 11:08:31.954 |     strictContentLength: false,
app     | 2025-09-15 11:08:31.954 |     _contentLength: 0,
app     | 2025-09-15 11:08:31.954 |     _hasBody: true,
app     | 2025-09-15 11:08:31.954 |     _trailer: '',
app     | 2025-09-15 11:08:31.954 |     finished: true,
app     | 2025-09-15 11:08:31.954 |     _headerSent: true,
app     | 2025-09-15 11:08:31.954 |     _closed: true,
app     | 2025-09-15 11:08:31.954 |     socket: TLSSocket {
app     | 2025-09-15 11:08:31.954 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:31.954 |       _secureEstablished: true,
app     | 2025-09-15 11:08:31.954 |       _securePending: false,
app     | 2025-09-15 11:08:31.954 |       _newSessionPending: false,
app     | 2025-09-15 11:08:31.954 |       _controlReleased: true,
app     | 2025-09-15 11:08:31.954 |       secureConnecting: false,
app     | 2025-09-15 11:08:31.954 |       _SNICallback: null,
app     | 2025-09-15 11:08:31.954 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:31.954 |       alpnProtocol: false,
app     | 2025-09-15 11:08:31.954 |       authorized: true,
app     | 2025-09-15 11:08:31.954 |       authorizationError: null,
app     | 2025-09-15 11:08:31.954 |       encrypted: true,
app     | 2025-09-15 11:08:31.954 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.954 |       _eventsCount: 9,
app     | 2025-09-15 11:08:31.954 |       connecting: false,
app     | 2025-09-15 11:08:31.954 |       _hadError: false,
app     | 2025-09-15 11:08:31.954 |       _parent: null,
app     | 2025-09-15 11:08:31.954 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:31.954 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:31.954 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:31.954 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.954 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:31.954 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:31.954 |       _sockname: null,
app     | 2025-09-15 11:08:31.954 |       _pendingData: null,
app     | 2025-09-15 11:08:31.954 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:31.954 |       server: undefined,
app     | 2025-09-15 11:08:31.954 |       _server: null,
app     | 2025-09-15 11:08:31.954 |       ssl: null,
app     | 2025-09-15 11:08:31.954 |       _requestCert: true,
app     | 2025-09-15 11:08:31.954 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:31.954 |       parser: null,
app     | 2025-09-15 11:08:31.954 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:31.954 |       timeout: 30000,
app     | 2025-09-15 11:08:31.954 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:31.954 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:31.954 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:31.954 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:31.954 |       [Symbol(async_id_symbol)]: 12658,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:31.954 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:31.954 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:31.954 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:31.954 |         _idlePrev: null,
app     | 2025-09-15 11:08:31.954 |         _idleNext: null,
app     | 2025-09-15 11:08:31.954 |         _idleStart: 21008,
app     | 2025-09-15 11:08:31.954 |         _onTimeout: null,
app     | 2025-09-15 11:08:31.954 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:31.954 |         _repeat: null,
app     | 2025-09-15 11:08:31.954 |         _destroyed: true,
app     | 2025-09-15 11:08:31.954 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:31.954 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:31.954 |         [Symbol(asyncId)]: 12669,
app     | 2025-09-15 11:08:31.954 |         [Symbol(triggerId)]: 12661,
app     | 2025-09-15 11:08:31.954 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:31.954 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:31.954 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:31.954 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:31.954 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:31.954 |       },
app     | 2025-09-15 11:08:31.954 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:31.954 |       [Symbol(kBytesWritten)]: 359,
app     | 2025-09-15 11:08:31.955 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:31.955 |     },
app     | 2025-09-15 11:08:31.955 |     _header: 'GET /abf/public/api/v1/construction-daily-report/types?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:31.955 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:31.955 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:31.955 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:31.955 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:31.955 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:31.955 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:31.955 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:31.955 |       '\r\n',
app     | 2025-09-15 11:08:31.955 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:31.955 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:31.955 |     agent: Agent {
app     | 2025-09-15 11:08:31.955 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.955 |       _eventsCount: 2,
app     | 2025-09-15 11:08:31.955 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.955 |       defaultPort: 443,
app     | 2025-09-15 11:08:31.955 |       protocol: 'https:',
app     | 2025-09-15 11:08:31.955 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:31.955 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:31.955 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:31.955 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:31.955 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:31.955 |       keepAlive: false,
app     | 2025-09-15 11:08:31.955 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:31.955 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:31.955 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:31.955 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:31.955 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:31.955 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:31.955 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:31.955 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:31.955 |     },
app     | 2025-09-15 11:08:31.955 |     socketPath: undefined,
app     | 2025-09-15 11:08:31.955 |     method: 'GET',
app     | 2025-09-15 11:08:31.955 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:31.955 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:31.955 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:31.955 |     path: '/abf/public/api/v1/construction-daily-report/types?limit=1',
app     | 2025-09-15 11:08:31.955 |     _ended: true,
app     | 2025-09-15 11:08:31.955 |     res: IncomingMessage {
app     | 2025-09-15 11:08:31.955 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:31.955 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.955 |       _eventsCount: 4,
app     | 2025-09-15 11:08:31.955 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.955 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:31.955 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:31.955 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:31.955 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:31.955 |       complete: true,
app     | 2025-09-15 11:08:31.955 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:31.955 |       rawTrailers: [],
app     | 2025-09-15 11:08:31.955 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:31.955 |       aborted: false,
app     | 2025-09-15 11:08:31.955 |       upgrade: false,
app     | 2025-09-15 11:08:31.955 |       url: '',
app     | 2025-09-15 11:08:31.955 |       method: null,
app     | 2025-09-15 11:08:31.955 |       statusCode: 403,
app     | 2025-09-15 11:08:31.955 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:31.955 |       client: [TLSSocket],
app     | 2025-09-15 11:08:31.955 |       _consuming: false,
app     | 2025-09-15 11:08:31.955 |       _dumped: false,
app     | 2025-09-15 11:08:31.955 |       req: [Circular *1],
app     | 2025-09-15 11:08:31.955 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/construction-daily-report/types?limit=1',
app     | 2025-09-15 11:08:31.955 |       redirects: [],
app     | 2025-09-15 11:08:31.955 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:31.955 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:31.955 |     },
app     | 2025-09-15 11:08:31.955 |     aborted: false,
app     | 2025-09-15 11:08:31.955 |     timeoutCb: null,
app     | 2025-09-15 11:08:31.955 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:31.955 |     parser: null,
app     | 2025-09-15 11:08:31.955 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:31.955 |     reusedSocket: false,
app     | 2025-09-15 11:08:31.955 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:31.955 |     protocol: 'https:',
app     | 2025-09-15 11:08:31.955 |     _redirectable: Writable {
app     | 2025-09-15 11:08:31.955 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:31.955 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.955 |       _eventsCount: 3,
app     | 2025-09-15 11:08:31.955 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.955 |       _options: [Object],
app     | 2025-09-15 11:08:31.955 |       _ended: true,
app     | 2025-09-15 11:08:31.955 |       _ending: true,
app     | 2025-09-15 11:08:31.955 |       _redirectCount: 0,
app     | 2025-09-15 11:08:31.955 |       _redirects: [],
app     | 2025-09-15 11:08:31.955 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:31.955 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:31.955 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:31.955 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:31.955 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/construction-daily-report/types?limit=1',
app     | 2025-09-15 11:08:31.955 |       _timeout: null,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:31.955 |     },
app     | 2025-09-15 11:08:31.955 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:31.955 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:31.955 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:31.955 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:31.955 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:31.955 |       accept: [Array],
app     | 2025-09-15 11:08:31.955 |       'content-type': [Array],
app     | 2025-09-15 11:08:31.955 |       'user-agent': [Array],
app     | 2025-09-15 11:08:31.955 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:31.955 |       host: [Array],
app     | 2025-09-15 11:08:31.955 |       authorization: [Array]
app     | 2025-09-15 11:08:31.955 |     },
app     | 2025-09-15 11:08:31.955 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:31.955 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:31.955 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:31.955 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:31.955 |   },
app     | 2025-09-15 11:08:31.955 |   response: {
app     | 2025-09-15 11:08:31.955 |     status: 403,
app     | 2025-09-15 11:08:31.955 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:31.955 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:31.955 |       server: 'nginx',
app     | 2025-09-15 11:08:31.955 |       date: 'Mon, 15 Sep 2025 14:08:33 GMT',
app     | 2025-09-15 11:08:31.955 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:31.955 |       'content-length': '34',
app     | 2025-09-15 11:08:31.955 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:31.955 |       'x-ratelimit-remaining-minute': '189',
app     | 2025-09-15 11:08:31.955 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:31.955 |       'ratelimit-remaining': '189',
app     | 2025-09-15 11:08:31.955 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:31.955 |       'ratelimit-reset': '27',
app     | 2025-09-15 11:08:31.955 |       'x-kong-response-latency': '4',
app     | 2025-09-15 11:08:31.955 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:31.955 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:31.955 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:31.955 |       connection: 'close'
app     | 2025-09-15 11:08:31.955 |     },
app     | 2025-09-15 11:08:31.955 |     config: {
app     | 2025-09-15 11:08:31.955 |       transitional: [Object],
app     | 2025-09-15 11:08:31.955 |       adapter: [Array],
app     | 2025-09-15 11:08:31.955 |       transformRequest: [Array],
app     | 2025-09-15 11:08:31.955 |       transformResponse: [Array],
app     | 2025-09-15 11:08:31.955 |       timeout: 30000,
app     | 2025-09-15 11:08:31.955 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:31.955 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:31.955 |       maxContentLength: -1,
app     | 2025-09-15 11:08:31.955 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:31.955 |       env: [Object],
app     | 2025-09-15 11:08:31.955 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:31.955 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:31.955 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:31.955 |       auth: [Object],
app     | 2025-09-15 11:08:31.955 |       method: 'get',
app     | 2025-09-15 11:08:31.955 |       url: '/construction-daily-report/types',
app     | 2025-09-15 11:08:31.955 |       params: [Object],
app     | 2025-09-15 11:08:31.955 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:31.955 |       metadata: [Object],
app     | 2025-09-15 11:08:31.955 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:31.955 |       data: undefined
app     | 2025-09-15 11:08:31.955 |     },
app     | 2025-09-15 11:08:31.955 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:31.955 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:31.955 |       _eventsCount: 7,
app     | 2025-09-15 11:08:31.955 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:31.955 |       outputData: [],
app     | 2025-09-15 11:08:31.955 |       outputSize: 0,
app     | 2025-09-15 11:08:31.955 |       writable: true,
app     | 2025-09-15 11:08:31.955 |       destroyed: true,
app     | 2025-09-15 11:08:31.955 |       _last: true,
app     | 2025-09-15 11:08:31.955 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:31.955 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:31.955 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:31.955 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:31.955 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:31.955 |       sendDate: false,
app     | 2025-09-15 11:08:31.955 |       _removedConnection: false,
app     | 2025-09-15 11:08:31.955 |       _removedContLen: false,
app     | 2025-09-15 11:08:31.955 |       _removedTE: false,
app     | 2025-09-15 11:08:31.955 |       strictContentLength: false,
app     | 2025-09-15 11:08:31.955 |       _contentLength: 0,
app     | 2025-09-15 11:08:31.955 |       _hasBody: true,
app     | 2025-09-15 11:08:31.955 |       _trailer: '',
app     | 2025-09-15 11:08:31.955 |       finished: true,
app     | 2025-09-15 11:08:31.955 |       _headerSent: true,
app     | 2025-09-15 11:08:31.955 |       _closed: true,
app     | 2025-09-15 11:08:31.955 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:31.955 |       _header: 'GET /abf/public/api/v1/construction-daily-report/types?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:31.955 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:31.955 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:31.955 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:31.955 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:31.955 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:31.955 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:31.955 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:31.955 |         '\r\n',
app     | 2025-09-15 11:08:31.955 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:31.955 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:31.955 |       agent: [Agent],
app     | 2025-09-15 11:08:31.955 |       socketPath: undefined,
app     | 2025-09-15 11:08:31.955 |       method: 'GET',
app     | 2025-09-15 11:08:31.955 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:31.955 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:31.955 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:31.955 |       path: '/abf/public/api/v1/construction-daily-report/types?limit=1',
app     | 2025-09-15 11:08:31.955 |       _ended: true,
app     | 2025-09-15 11:08:31.955 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:31.955 |       aborted: false,
app     | 2025-09-15 11:08:31.955 |       timeoutCb: null,
app     | 2025-09-15 11:08:31.955 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:31.955 |       parser: null,
app     | 2025-09-15 11:08:31.955 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:31.955 |       reusedSocket: false,
app     | 2025-09-15 11:08:31.955 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:31.955 |       protocol: 'https:',
app     | 2025-09-15 11:08:31.955 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:31.955 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:31.955 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:31.955 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:31.955 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:31.955 |     },
app     | 2025-09-15 11:08:31.955 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:31.955 |   },
app     | 2025-09-15 11:08:31.955 |   status: 403
app     | 2025-09-15 11:08:31.955 | }
app     | 2025-09-15 11:08:32.149 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:32.149 | [Sienge Proxy] Chamando endpoint: /hooks com params: { limit: 1 }
app     | 2025-09-15 11:08:32.149 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:32.149 | [Sienge Proxy] Chamando endpoint: /hooks com params: { limit: 1 }
app     | 2025-09-15 11:08:32.590 | [LOGGER] Flushing 2 log entries
app     | 2025-09-15 11:08:32.590 | [LOGGER] Flushing 2 log entries
app     | 2025-09-15 11:08:32.593 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:32.593 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:32.593 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:32.593 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:32.593 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:32.593 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:32.593 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:32.593 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:32.593 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:32.593 |   config: {
app     | 2025-09-15 11:08:32.593 |     transitional: {
app     | 2025-09-15 11:08:32.593 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:32.593 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:32.593 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:32.593 |     },
app     | 2025-09-15 11:08:32.593 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:32.593 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:32.593 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:32.593 |     timeout: 30000,
app     | 2025-09-15 11:08:32.593 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:32.593 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:32.593 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:32.593 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:32.593 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:32.593 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:32.593 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:32.593 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:32.593 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:32.593 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:32.593 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:32.593 |   config: {
app     | 2025-09-15 11:08:32.593 |     transitional: {
app     | 2025-09-15 11:08:32.593 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:32.593 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:32.593 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:32.593 |     },
app     | 2025-09-15 11:08:32.593 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:32.593 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:32.593 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:32.593 |     timeout: 30000,
app     | 2025-09-15 11:08:32.593 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:32.593 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:32.593 |     maxContentLength: -1,
app     | 2025-09-15 11:08:32.593 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:32.593 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:32.593 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:32.593 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:32.593 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:32.593 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:32.593 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:32.593 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:32.593 |     },
app     | 2025-09-15 11:08:32.593 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:32.593 |     auth: {
app     | 2025-09-15 11:08:32.593 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:32.593 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:32.593 |     },
app     | 2025-09-15 11:08:32.593 |     method: 'get',
app     | 2025-09-15 11:08:32.593 |     url: '/hooks',
app     | 2025-09-15 11:08:32.593 |     params: { limit: 1 },
app     | 2025-09-15 11:08:32.593 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:32.593 |     metadata: { startTime: 1757945312153 },
app     | 2025-09-15 11:08:32.593 |     'axios-retry': {
app     | 2025-09-15 11:08:32.593 |       retries: 3,
app     | 2025-09-15 11:08:32.593 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:32.593 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:32.593 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:32.593 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:32.593 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:32.593 |       validateResponse: null,
app     | 2025-09-15 11:08:32.593 |       retryCount: 0,
app     | 2025-09-15 11:08:32.593 |       lastRequestTime: 1757945312153
app     | 2025-09-15 11:08:32.593 |     },
app     | 2025-09-15 11:08:32.593 |     data: undefined
app     | 2025-09-15 11:08:32.593 |   },
app     | 2025-09-15 11:08:32.593 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:32.593 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:32.593 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:32.593 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:32.593 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:32.593 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:32.593 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:32.593 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:32.593 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:32.593 |     },
app     | 2025-09-15 11:08:32.593 |     _eventsCount: 7,
app     | 2025-09-15 11:08:32.593 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:32.593 |     outputData: [],
app     | 2025-09-15 11:08:32.593 |     outputSize: 0,
app     | 2025-09-15 11:08:32.593 |     writable: true,
app     | 2025-09-15 11:08:32.593 |     destroyed: true,
app     | 2025-09-15 11:08:32.593 |     _last: true,
app     | 2025-09-15 11:08:32.593 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:32.593 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:32.593 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:32.593 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:32.593 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:32.593 |     sendDate: false,
app     | 2025-09-15 11:08:32.593 |     _removedConnection: false,
app     | 2025-09-15 11:08:32.593 |     _removedContLen: false,
app     | 2025-09-15 11:08:32.593 |     _removedTE: false,
app     | 2025-09-15 11:08:32.593 |     strictContentLength: false,
app     | 2025-09-15 11:08:32.593 |     _contentLength: 0,
app     | 2025-09-15 11:08:32.593 |     _hasBody: true,
app     | 2025-09-15 11:08:32.593 |     _trailer: '',
app     | 2025-09-15 11:08:32.593 |     finished: true,
app     | 2025-09-15 11:08:32.593 |     _headerSent: true,
app     | 2025-09-15 11:08:32.593 |     _closed: true,
app     | 2025-09-15 11:08:32.594 |     socket: TLSSocket {
app     | 2025-09-15 11:08:32.594 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:32.594 |       _secureEstablished: true,
app     | 2025-09-15 11:08:32.594 |       _securePending: false,
app     | 2025-09-15 11:08:32.594 |       _newSessionPending: false,
app     | 2025-09-15 11:08:32.594 |       _controlReleased: true,
app     | 2025-09-15 11:08:32.594 |       secureConnecting: false,
app     | 2025-09-15 11:08:32.594 |       _SNICallback: null,
app     | 2025-09-15 11:08:32.594 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:32.594 |       alpnProtocol: false,
app     | 2025-09-15 11:08:32.594 |       authorized: true,
app     | 2025-09-15 11:08:32.594 |       authorizationError: null,
app     | 2025-09-15 11:08:32.594 |       encrypted: true,
app     | 2025-09-15 11:08:32.594 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:32.594 |       _eventsCount: 9,
app     | 2025-09-15 11:08:32.594 |       connecting: false,
app     | 2025-09-15 11:08:32.594 |       _hadError: false,
app     | 2025-09-15 11:08:32.594 |       _parent: null,
app     | 2025-09-15 11:08:32.594 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:32.594 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:32.594 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:32.594 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:32.594 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:32.594 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:32.594 |       _sockname: null,
app     | 2025-09-15 11:08:32.594 |       _pendingData: null,
app     | 2025-09-15 11:08:32.594 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:32.593 |     maxContentLength: -1,
app     | 2025-09-15 11:08:32.593 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:32.593 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:32.593 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:32.593 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:32.593 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:32.593 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:32.593 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:32.593 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:32.593 |     },
app     | 2025-09-15 11:08:32.593 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:32.593 |     auth: {
app     | 2025-09-15 11:08:32.593 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:32.593 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:32.593 |     },
app     | 2025-09-15 11:08:32.593 |     method: 'get',
app     | 2025-09-15 11:08:32.593 |     url: '/hooks',
app     | 2025-09-15 11:08:32.593 |     params: { limit: 1 },
app     | 2025-09-15 11:08:32.593 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:32.593 |     metadata: { startTime: 1757945312153 },
app     | 2025-09-15 11:08:32.593 |     'axios-retry': {
app     | 2025-09-15 11:08:32.593 |       retries: 3,
app     | 2025-09-15 11:08:32.593 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:32.593 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:32.593 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:32.593 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:32.593 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:32.593 |       validateResponse: null,
app     | 2025-09-15 11:08:32.593 |       retryCount: 0,
app     | 2025-09-15 11:08:32.593 |       lastRequestTime: 1757945312153
app     | 2025-09-15 11:08:32.593 |     },
app     | 2025-09-15 11:08:32.593 |     data: undefined
app     | 2025-09-15 11:08:32.593 |   },
app     | 2025-09-15 11:08:32.593 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:32.593 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:32.593 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:32.593 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:32.593 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:32.593 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:32.593 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:32.593 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:32.593 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:32.593 |     },
app     | 2025-09-15 11:08:32.593 |     _eventsCount: 7,
app     | 2025-09-15 11:08:32.593 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:32.593 |     outputData: [],
app     | 2025-09-15 11:08:32.593 |     outputSize: 0,
app     | 2025-09-15 11:08:32.593 |     writable: true,
app     | 2025-09-15 11:08:32.593 |     destroyed: true,
app     | 2025-09-15 11:08:32.593 |     _last: true,
app     | 2025-09-15 11:08:32.593 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:32.593 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:32.593 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:32.593 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:32.593 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:32.593 |     sendDate: false,
app     | 2025-09-15 11:08:32.593 |     _removedConnection: false,
app     | 2025-09-15 11:08:32.593 |     _removedContLen: false,
app     | 2025-09-15 11:08:32.593 |     _removedTE: false,
app     | 2025-09-15 11:08:32.593 |     strictContentLength: false,
app     | 2025-09-15 11:08:32.593 |     _contentLength: 0,
app     | 2025-09-15 11:08:32.593 |     _hasBody: true,
app     | 2025-09-15 11:08:32.593 |     _trailer: '',
app     | 2025-09-15 11:08:32.593 |     finished: true,
app     | 2025-09-15 11:08:32.593 |     _headerSent: true,
app     | 2025-09-15 11:08:32.593 |     _closed: true,
app     | 2025-09-15 11:08:32.594 |     socket: TLSSocket {
app     | 2025-09-15 11:08:32.594 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:32.594 |       _secureEstablished: true,
app     | 2025-09-15 11:08:32.594 |       _securePending: false,
app     | 2025-09-15 11:08:32.594 |       _newSessionPending: false,
app     | 2025-09-15 11:08:32.594 |       _controlReleased: true,
app     | 2025-09-15 11:08:32.594 |       secureConnecting: false,
app     | 2025-09-15 11:08:32.594 |       _SNICallback: null,
app     | 2025-09-15 11:08:32.594 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:32.594 |       alpnProtocol: false,
app     | 2025-09-15 11:08:32.594 |       authorized: true,
app     | 2025-09-15 11:08:32.594 |       authorizationError: null,
app     | 2025-09-15 11:08:32.594 |       encrypted: true,
app     | 2025-09-15 11:08:32.594 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:32.594 |       _eventsCount: 9,
app     | 2025-09-15 11:08:32.594 |       connecting: false,
app     | 2025-09-15 11:08:32.594 |       _hadError: false,
app     | 2025-09-15 11:08:32.594 |       _parent: null,
app     | 2025-09-15 11:08:32.594 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:32.594 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:32.594 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:32.594 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:32.594 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:32.594 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:32.594 |       _sockname: null,
app     | 2025-09-15 11:08:32.594 |       _pendingData: null,
app     | 2025-09-15 11:08:32.594 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:32.594 |       server: undefined,
app     | 2025-09-15 11:08:32.594 |       _server: null,
app     | 2025-09-15 11:08:32.594 |       ssl: null,
app     | 2025-09-15 11:08:32.594 |       _requestCert: true,
app     | 2025-09-15 11:08:32.594 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:32.594 |       parser: null,
app     | 2025-09-15 11:08:32.594 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:32.594 |       timeout: 30000,
app     | 2025-09-15 11:08:32.594 |       write: [Function: writeAfterFIN],
app     | 2025-09-15 11:08:32.594 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:32.594 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:32.594 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:32.594 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:32.594 |       [Symbol(async_id_symbol)]: 13094,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:32.594 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:32.594 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:32.594 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:32.594 |         _idlePrev: null,
app     | 2025-09-15 11:08:32.594 |         _idleNext: null,
app     | 2025-09-15 11:08:32.594 |         _idleStart: 21649,
app     | 2025-09-15 11:08:32.594 |         _onTimeout: null,
app     | 2025-09-15 11:08:32.594 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:32.594 |         _repeat: null,
app     | 2025-09-15 11:08:32.594 |         _destroyed: true,
app     | 2025-09-15 11:08:32.594 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:32.594 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:32.594 |         [Symbol(asyncId)]: 13105,
app     | 2025-09-15 11:08:32.594 |         [Symbol(triggerId)]: 13097,
app     | 2025-09-15 11:08:32.594 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:32.594 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:32.594 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:32.594 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:32.594 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:32.594 |       },
app     | 2025-09-15 11:08:32.594 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kBytesWritten)]: 333,
app     | 2025-09-15 11:08:32.595 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:32.595 |     },
app     | 2025-09-15 11:08:32.595 |     _header: 'GET /abf/public/api/v1/hooks?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:32.595 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:32.595 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:32.595 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:32.595 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:32.595 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:32.595 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:32.595 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:32.595 |       '\r\n',
app     | 2025-09-15 11:08:32.595 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:32.595 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:32.595 |     agent: Agent {
app     | 2025-09-15 11:08:32.595 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:32.595 |       _eventsCount: 2,
app     | 2025-09-15 11:08:32.595 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:32.595 |       defaultPort: 443,
app     | 2025-09-15 11:08:32.595 |       protocol: 'https:',
app     | 2025-09-15 11:08:32.595 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:32.595 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:32.595 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:32.595 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:32.595 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:32.595 |       keepAlive: false,
app     | 2025-09-15 11:08:32.595 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:32.595 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:32.595 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:32.595 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:32.595 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:32.595 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:32.595 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:32.595 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:32.595 |     },
app     | 2025-09-15 11:08:32.595 |     socketPath: undefined,
app     | 2025-09-15 11:08:32.595 |     method: 'GET',
app     | 2025-09-15 11:08:32.595 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:32.595 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:32.595 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:32.595 |     path: '/abf/public/api/v1/hooks?limit=1',
app     | 2025-09-15 11:08:32.595 |     _ended: true,
app     | 2025-09-15 11:08:32.595 |     res: IncomingMessage {
app     | 2025-09-15 11:08:32.595 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:32.595 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:32.595 |       _eventsCount: 4,
app     | 2025-09-15 11:08:32.595 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:32.595 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:32.595 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:32.595 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:32.595 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:32.595 |       complete: true,
app     | 2025-09-15 11:08:32.595 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:32.595 |       rawTrailers: [],
app     | 2025-09-15 11:08:32.595 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:32.595 |       aborted: false,
app     | 2025-09-15 11:08:32.595 |       upgrade: false,
app     | 2025-09-15 11:08:32.595 |       url: '',
app     | 2025-09-15 11:08:32.595 |       method: null,
app     | 2025-09-15 11:08:32.595 |       statusCode: 403,
app     | 2025-09-15 11:08:32.595 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:32.595 |       client: [TLSSocket],
app     | 2025-09-15 11:08:32.595 |       _consuming: false,
app     | 2025-09-15 11:08:32.595 |       _dumped: false,
app     | 2025-09-15 11:08:32.595 |       req: [Circular *1],
app     | 2025-09-15 11:08:32.595 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/hooks?limit=1',
app     | 2025-09-15 11:08:32.595 |       redirects: [],
app     | 2025-09-15 11:08:32.595 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:32.595 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:32.595 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:32.595 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:32.595 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:32.595 |     },
app     | 2025-09-15 11:08:32.595 |     aborted: false,
app     | 2025-09-15 11:08:32.595 |     timeoutCb: null,
app     | 2025-09-15 11:08:32.595 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:32.595 |     parser: null,
app     | 2025-09-15 11:08:32.595 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:32.595 |     reusedSocket: false,
app     | 2025-09-15 11:08:32.595 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:32.595 |     protocol: 'https:',
app     | 2025-09-15 11:08:32.595 |     _redirectable: Writable {
app     | 2025-09-15 11:08:32.595 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:32.595 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:32.595 |       _eventsCount: 3,
app     | 2025-09-15 11:08:32.595 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:32.595 |       _options: [Object],
app     | 2025-09-15 11:08:32.595 |       _ended: true,
app     | 2025-09-15 11:08:32.595 |       _ending: true,
app     | 2025-09-15 11:08:32.596 |       _redirectCount: 0,
app     | 2025-09-15 11:08:32.596 |       _redirects: [],
app     | 2025-09-15 11:08:32.596 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:32.596 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:32.596 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:32.596 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:32.596 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/hooks?limit=1',
app     | 2025-09-15 11:08:32.596 |       _timeout: null,
app     | 2025-09-15 11:08:32.596 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:32.596 |     },
app     | 2025-09-15 11:08:32.596 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:32.596 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:32.596 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:32.596 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:32.596 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:32.596 |       accept: [Array],
app     | 2025-09-15 11:08:32.596 |       'content-type': [Array],
app     | 2025-09-15 11:08:32.596 |       'user-agent': [Array],
app     | 2025-09-15 11:08:32.596 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:32.596 |       host: [Array],
app     | 2025-09-15 11:08:32.596 |       authorization: [Array]
app     | 2025-09-15 11:08:32.596 |     },
app     | 2025-09-15 11:08:32.596 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:32.596 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:32.596 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:32.596 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:32.596 |   },
app     | 2025-09-15 11:08:32.596 |   response: {
app     | 2025-09-15 11:08:32.596 |     status: 403,
app     | 2025-09-15 11:08:32.596 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:32.596 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:32.596 |       server: 'nginx',
app     | 2025-09-15 11:08:32.596 |       date: 'Mon, 15 Sep 2025 14:08:34 GMT',
app     | 2025-09-15 11:08:32.596 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:32.596 |       'content-length': '34',
app     | 2025-09-15 11:08:32.596 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:32.596 |       'x-ratelimit-remaining-minute': '188',
app     | 2025-09-15 11:08:32.596 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:32.596 |       'ratelimit-remaining': '188',
app     | 2025-09-15 11:08:32.596 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:32.596 |       'ratelimit-reset': '26',
app     | 2025-09-15 11:08:32.596 |       'x-kong-response-latency': '2',
app     | 2025-09-15 11:08:32.596 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:32.596 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:32.596 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:32.596 |       connection: 'close'
app     | 2025-09-15 11:08:32.596 |     },
app     | 2025-09-15 11:08:32.596 |     config: {
app     | 2025-09-15 11:08:32.596 |       transitional: [Object],
app     | 2025-09-15 11:08:32.596 |       adapter: [Array],
app     | 2025-09-15 11:08:32.596 |       transformRequest: [Array],
app     | 2025-09-15 11:08:32.596 |       transformResponse: [Array],
app     | 2025-09-15 11:08:32.596 |       timeout: 30000,
app     | 2025-09-15 11:08:32.596 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:32.596 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:32.596 |       maxContentLength: -1,
app     | 2025-09-15 11:08:32.596 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:32.596 |       env: [Object],
app     | 2025-09-15 11:08:32.596 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:32.596 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:32.596 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:32.596 |       auth: [Object],
app     | 2025-09-15 11:08:32.596 |       method: 'get',
app     | 2025-09-15 11:08:32.596 |       url: '/hooks',
app     | 2025-09-15 11:08:32.596 |       params: [Object],
app     | 2025-09-15 11:08:32.596 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:32.596 |       metadata: [Object],
app     | 2025-09-15 11:08:32.596 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:32.597 |       data: undefined
app     | 2025-09-15 11:08:32.597 |     },
app     | 2025-09-15 11:08:32.597 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:32.597 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:32.597 |       _eventsCount: 7,
app     | 2025-09-15 11:08:32.597 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:32.597 |       outputData: [],
app     | 2025-09-15 11:08:32.597 |       outputSize: 0,
app     | 2025-09-15 11:08:32.597 |       writable: true,
app     | 2025-09-15 11:08:32.597 |       destroyed: true,
app     | 2025-09-15 11:08:32.597 |       _last: true,
app     | 2025-09-15 11:08:32.597 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:32.597 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:32.597 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:32.597 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:32.597 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:32.597 |       sendDate: false,
app     | 2025-09-15 11:08:32.597 |       _removedConnection: false,
app     | 2025-09-15 11:08:32.597 |       _removedContLen: false,
app     | 2025-09-15 11:08:32.597 |       _removedTE: false,
app     | 2025-09-15 11:08:32.597 |       strictContentLength: false,
app     | 2025-09-15 11:08:32.597 |       _contentLength: 0,
app     | 2025-09-15 11:08:32.597 |       _hasBody: true,
app     | 2025-09-15 11:08:32.597 |       _trailer: '',
app     | 2025-09-15 11:08:32.597 |       finished: true,
app     | 2025-09-15 11:08:32.597 |       _headerSent: true,
app     | 2025-09-15 11:08:32.597 |       _closed: true,
app     | 2025-09-15 11:08:32.597 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:32.597 |       _header: 'GET /abf/public/api/v1/hooks?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:32.597 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:32.597 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:32.597 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:32.597 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:32.597 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:32.597 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:32.597 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:32.597 |         '\r\n',
app     | 2025-09-15 11:08:32.597 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:32.597 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:32.597 |       agent: [Agent],
app     | 2025-09-15 11:08:32.597 |       socketPath: undefined,
app     | 2025-09-15 11:08:32.597 |       method: 'GET',
app     | 2025-09-15 11:08:32.597 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:32.597 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:32.597 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:32.597 |       path: '/abf/public/api/v1/hooks?limit=1',
app     | 2025-09-15 11:08:32.597 |       _ended: true,
app     | 2025-09-15 11:08:32.597 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:32.597 |       aborted: false,
app     | 2025-09-15 11:08:32.597 |       timeoutCb: null,
app     | 2025-09-15 11:08:32.597 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:32.597 |       parser: null,
app     | 2025-09-15 11:08:32.597 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:32.597 |       reusedSocket: false,
app     | 2025-09-15 11:08:32.597 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:32.597 |       protocol: 'https:',
app     | 2025-09-15 11:08:32.597 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:32.597 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:32.597 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:32.597 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:32.597 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:32.597 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:32.597 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:32.597 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:32.597 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:32.597 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:32.597 |     },
app     | 2025-09-15 11:08:32.597 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:32.597 |   },
app     | 2025-09-15 11:08:32.597 |   status: 403
app     | 2025-09-15 11:08:32.597 | }
app     | 2025-09-15 11:08:32.594 |       server: undefined,
app     | 2025-09-15 11:08:32.594 |       _server: null,
app     | 2025-09-15 11:08:32.594 |       ssl: null,
app     | 2025-09-15 11:08:32.594 |       _requestCert: true,
app     | 2025-09-15 11:08:32.594 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:32.594 |       parser: null,
app     | 2025-09-15 11:08:32.594 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:32.594 |       timeout: 30000,
app     | 2025-09-15 11:08:32.594 |       write: [Function: writeAfterFIN],
app     | 2025-09-15 11:08:32.594 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:32.594 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:32.594 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:32.594 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:32.594 |       [Symbol(async_id_symbol)]: 13094,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:32.594 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:32.594 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:32.594 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:32.594 |         _idlePrev: null,
app     | 2025-09-15 11:08:32.594 |         _idleNext: null,
app     | 2025-09-15 11:08:32.594 |         _idleStart: 21649,
app     | 2025-09-15 11:08:32.594 |         _onTimeout: null,
app     | 2025-09-15 11:08:32.594 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:32.594 |         _repeat: null,
app     | 2025-09-15 11:08:32.594 |         _destroyed: true,
app     | 2025-09-15 11:08:32.594 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:32.594 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:32.594 |         [Symbol(asyncId)]: 13105,
app     | 2025-09-15 11:08:32.594 |         [Symbol(triggerId)]: 13097,
app     | 2025-09-15 11:08:32.594 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:32.594 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:32.594 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:32.594 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:32.594 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:32.594 |       },
app     | 2025-09-15 11:08:32.594 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:32.594 |       [Symbol(kBytesWritten)]: 333,
app     | 2025-09-15 11:08:32.595 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:32.595 |     },
app     | 2025-09-15 11:08:32.595 |     _header: 'GET /abf/public/api/v1/hooks?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:32.595 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:32.595 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:32.595 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:32.595 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:32.595 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:32.595 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:32.595 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:32.595 |       '\r\n',
app     | 2025-09-15 11:08:32.595 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:32.595 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:32.595 |     agent: Agent {
app     | 2025-09-15 11:08:32.595 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:32.595 |       _eventsCount: 2,
app     | 2025-09-15 11:08:32.595 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:32.595 |       defaultPort: 443,
app     | 2025-09-15 11:08:32.595 |       protocol: 'https:',
app     | 2025-09-15 11:08:32.595 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:32.595 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:32.595 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:32.595 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:32.595 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:32.595 |       keepAlive: false,
app     | 2025-09-15 11:08:32.595 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:32.595 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:32.595 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:32.595 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:32.595 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:32.595 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:32.595 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:32.595 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:32.595 |     },
app     | 2025-09-15 11:08:32.595 |     socketPath: undefined,
app     | 2025-09-15 11:08:32.595 |     method: 'GET',
app     | 2025-09-15 11:08:32.595 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:32.595 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:32.595 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:32.595 |     path: '/abf/public/api/v1/hooks?limit=1',
app     | 2025-09-15 11:08:32.595 |     _ended: true,
app     | 2025-09-15 11:08:32.595 |     res: IncomingMessage {
app     | 2025-09-15 11:08:32.595 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:32.595 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:32.595 |       _eventsCount: 4,
app     | 2025-09-15 11:08:32.595 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:32.595 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:32.595 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:32.595 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:32.595 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:32.595 |       complete: true,
app     | 2025-09-15 11:08:32.595 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:32.595 |       rawTrailers: [],
app     | 2025-09-15 11:08:32.595 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:32.595 |       aborted: false,
app     | 2025-09-15 11:08:32.595 |       upgrade: false,
app     | 2025-09-15 11:08:32.595 |       url: '',
app     | 2025-09-15 11:08:32.595 |       method: null,
app     | 2025-09-15 11:08:32.595 |       statusCode: 403,
app     | 2025-09-15 11:08:32.595 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:32.595 |       client: [TLSSocket],
app     | 2025-09-15 11:08:32.595 |       _consuming: false,
app     | 2025-09-15 11:08:32.595 |       _dumped: false,
app     | 2025-09-15 11:08:32.595 |       req: [Circular *1],
app     | 2025-09-15 11:08:32.595 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/hooks?limit=1',
app     | 2025-09-15 11:08:32.595 |       redirects: [],
app     | 2025-09-15 11:08:32.595 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:32.595 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:32.595 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:32.595 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:32.595 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:32.595 |     },
app     | 2025-09-15 11:08:32.595 |     aborted: false,
app     | 2025-09-15 11:08:32.595 |     timeoutCb: null,
app     | 2025-09-15 11:08:32.595 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:32.595 |     parser: null,
app     | 2025-09-15 11:08:32.595 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:32.595 |     reusedSocket: false,
app     | 2025-09-15 11:08:32.595 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:32.595 |     protocol: 'https:',
app     | 2025-09-15 11:08:32.595 |     _redirectable: Writable {
app     | 2025-09-15 11:08:32.595 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:32.595 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:32.595 |       _eventsCount: 3,
app     | 2025-09-15 11:08:32.595 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:32.595 |       _options: [Object],
app     | 2025-09-15 11:08:32.595 |       _ended: true,
app     | 2025-09-15 11:08:32.595 |       _ending: true,
app     | 2025-09-15 11:08:32.596 |       _redirectCount: 0,
app     | 2025-09-15 11:08:32.596 |       _redirects: [],
app     | 2025-09-15 11:08:32.596 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:32.596 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:32.596 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:32.596 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:32.596 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/hooks?limit=1',
app     | 2025-09-15 11:08:32.596 |       _timeout: null,
app     | 2025-09-15 11:08:32.596 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:32.596 |     },
app     | 2025-09-15 11:08:32.596 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:32.596 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:32.596 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:32.596 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:32.596 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:32.596 |       accept: [Array],
app     | 2025-09-15 11:08:32.596 |       'content-type': [Array],
app     | 2025-09-15 11:08:32.596 |       'user-agent': [Array],
app     | 2025-09-15 11:08:32.596 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:32.596 |       host: [Array],
app     | 2025-09-15 11:08:32.596 |       authorization: [Array]
app     | 2025-09-15 11:08:32.596 |     },
app     | 2025-09-15 11:08:32.596 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:32.596 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:32.596 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:32.596 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:32.596 |   },
app     | 2025-09-15 11:08:32.596 |   response: {
app     | 2025-09-15 11:08:32.596 |     status: 403,
app     | 2025-09-15 11:08:32.596 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:32.596 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:32.596 |       server: 'nginx',
app     | 2025-09-15 11:08:32.596 |       date: 'Mon, 15 Sep 2025 14:08:34 GMT',
app     | 2025-09-15 11:08:32.596 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:32.596 |       'content-length': '34',
app     | 2025-09-15 11:08:32.596 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:32.596 |       'x-ratelimit-remaining-minute': '188',
app     | 2025-09-15 11:08:32.596 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:32.596 |       'ratelimit-remaining': '188',
app     | 2025-09-15 11:08:32.596 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:32.596 |       'ratelimit-reset': '26',
app     | 2025-09-15 11:08:32.596 |       'x-kong-response-latency': '2',
app     | 2025-09-15 11:08:32.596 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:32.596 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:32.596 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:32.596 |       connection: 'close'
app     | 2025-09-15 11:08:32.596 |     },
app     | 2025-09-15 11:08:32.596 |     config: {
app     | 2025-09-15 11:08:32.596 |       transitional: [Object],
app     | 2025-09-15 11:08:32.596 |       adapter: [Array],
app     | 2025-09-15 11:08:32.596 |       transformRequest: [Array],
app     | 2025-09-15 11:08:32.596 |       transformResponse: [Array],
app     | 2025-09-15 11:08:32.596 |       timeout: 30000,
app     | 2025-09-15 11:08:32.596 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:32.596 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:32.596 |       maxContentLength: -1,
app     | 2025-09-15 11:08:32.596 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:32.596 |       env: [Object],
app     | 2025-09-15 11:08:32.596 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:32.596 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:32.596 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:32.596 |       auth: [Object],
app     | 2025-09-15 11:08:32.596 |       method: 'get',
app     | 2025-09-15 11:08:32.596 |       url: '/hooks',
app     | 2025-09-15 11:08:32.596 |       params: [Object],
app     | 2025-09-15 11:08:32.596 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:32.596 |       metadata: [Object],
app     | 2025-09-15 11:08:32.596 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:32.597 |       data: undefined
app     | 2025-09-15 11:08:32.597 |     },
app     | 2025-09-15 11:08:32.597 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:32.597 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:32.597 |       _eventsCount: 7,
app     | 2025-09-15 11:08:32.597 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:32.597 |       outputData: [],
app     | 2025-09-15 11:08:32.597 |       outputSize: 0,
app     | 2025-09-15 11:08:32.597 |       writable: true,
app     | 2025-09-15 11:08:32.597 |       destroyed: true,
app     | 2025-09-15 11:08:32.597 |       _last: true,
app     | 2025-09-15 11:08:32.597 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:32.597 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:32.597 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:32.597 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:32.597 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:32.597 |       sendDate: false,
app     | 2025-09-15 11:08:32.597 |       _removedConnection: false,
app     | 2025-09-15 11:08:32.597 |       _removedContLen: false,
app     | 2025-09-15 11:08:32.597 |       _removedTE: false,
app     | 2025-09-15 11:08:32.597 |       strictContentLength: false,
app     | 2025-09-15 11:08:32.597 |       _contentLength: 0,
app     | 2025-09-15 11:08:32.597 |       _hasBody: true,
app     | 2025-09-15 11:08:32.597 |       _trailer: '',
app     | 2025-09-15 11:08:32.597 |       finished: true,
app     | 2025-09-15 11:08:32.597 |       _headerSent: true,
app     | 2025-09-15 11:08:32.597 |       _closed: true,
app     | 2025-09-15 11:08:32.597 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:32.597 |       _header: 'GET /abf/public/api/v1/hooks?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:32.597 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:32.597 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:32.597 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:32.597 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:32.597 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:32.597 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:32.597 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:32.597 |         '\r\n',
app     | 2025-09-15 11:08:32.597 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:32.597 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:32.597 |       agent: [Agent],
app     | 2025-09-15 11:08:32.597 |       socketPath: undefined,
app     | 2025-09-15 11:08:32.597 |       method: 'GET',
app     | 2025-09-15 11:08:32.597 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:32.597 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:32.597 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:32.597 |       path: '/abf/public/api/v1/hooks?limit=1',
app     | 2025-09-15 11:08:32.597 |       _ended: true,
app     | 2025-09-15 11:08:32.597 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:32.597 |       aborted: false,
app     | 2025-09-15 11:08:32.597 |       timeoutCb: null,
app     | 2025-09-15 11:08:32.597 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:32.597 |       parser: null,
app     | 2025-09-15 11:08:32.597 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:32.597 |       reusedSocket: false,
app     | 2025-09-15 11:08:32.597 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:32.597 |       protocol: 'https:',
app     | 2025-09-15 11:08:32.597 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:32.597 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:32.597 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:32.597 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:32.597 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:32.597 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:32.597 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:32.597 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:32.597 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:32.597 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:32.597 |     },
app     | 2025-09-15 11:08:32.597 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:32.597 |   },
app     | 2025-09-15 11:08:32.597 |   status: 403
app     | 2025-09-15 11:08:32.597 | }
app     | 2025-09-15 11:08:32.784 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:32.784 | [Sienge Proxy] Chamando endpoint: /patrimony/fixed com params: { limit: 1 }
app     | 2025-09-15 11:08:32.784 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:32.784 | [Sienge Proxy] Chamando endpoint: /patrimony/fixed com params: { limit: 1 }
app     | 2025-09-15 11:08:33.233 | [LOGGER] Flushing 2 log entries
app     | 2025-09-15 11:08:33.233 | [LOGGER] Flushing 2 log entries
app     | 2025-09-15 11:08:33.236 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:33.236 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:33.236 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:33.236 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:33.236 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:33.236 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:33.236 | [Sienge Proxy] Erro: X [AxiosError]: Request failed with status code 403
app     | 2025-09-15 11:08:33.236 |     at eN (/app/.next/server/chunks/263.js:1:62181)
app     | 2025-09-15 11:08:33.236 |     at IncomingMessage.<anonymous> (/app/.next/server/chunks/263.js:3:10321)
app     | 2025-09-15 11:08:33.236 |     at IncomingMessage.emit (node:events:529:35)
app     | 2025-09-15 11:08:33.236 |     at endReadableNT (node:internal/streams/readable:1400:12)
app     | 2025-09-15 11:08:33.236 |     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
app     | 2025-09-15 11:08:33.236 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:33.236 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:33.236 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:33.236 |   config: {
app     | 2025-09-15 11:08:33.236 |     transitional: {
app     | 2025-09-15 11:08:33.236 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:33.236 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:33.236 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:33.236 |     },
app     | 2025-09-15 11:08:33.236 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:33.236 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:33.236 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:33.236 |     timeout: 30000,
app     | 2025-09-15 11:08:33.236 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:33.236 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:33.236 |     maxContentLength: -1,
app     | 2025-09-15 11:08:33.236 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:33.236 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:33.236 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:33.236 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:33.236 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:33.236 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:33.236 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:33.236 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:33.236 |     },
app     | 2025-09-15 11:08:33.236 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:33.236 |     auth: {
app     | 2025-09-15 11:08:33.236 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:33.236 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:33.236 |     },
app     | 2025-09-15 11:08:33.236 |     method: 'get',
app     | 2025-09-15 11:08:33.236 |     url: '/patrimony/fixed',
app     | 2025-09-15 11:08:33.236 |     params: { limit: 1 },
app     | 2025-09-15 11:08:33.236 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:33.236 |     metadata: { startTime: 1757945312789 },
app     | 2025-09-15 11:08:33.236 |     'axios-retry': {
app     | 2025-09-15 11:08:33.236 |       retries: 3,
app     | 2025-09-15 11:08:33.236 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:33.236 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:33.236 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:33.236 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:33.236 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:33.236 |       validateResponse: null,
app     | 2025-09-15 11:08:33.236 |       retryCount: 0,
app     | 2025-09-15 11:08:33.236 |       lastRequestTime: 1757945312789
app     | 2025-09-15 11:08:33.236 |     },
app     | 2025-09-15 11:08:33.236 |     data: undefined
app     | 2025-09-15 11:08:33.236 |   },
app     | 2025-09-15 11:08:33.236 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:33.236 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:33.236 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:33.236 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:33.236 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:33.236 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:33.236 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:33.236 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:33.236 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:33.236 |     },
app     | 2025-09-15 11:08:33.236 |     _eventsCount: 7,
app     | 2025-09-15 11:08:33.236 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:33.236 |     outputData: [],
app     | 2025-09-15 11:08:33.236 |     outputSize: 0,
app     | 2025-09-15 11:08:33.236 |     writable: true,
app     | 2025-09-15 11:08:33.236 |     destroyed: true,
app     | 2025-09-15 11:08:33.236 |     _last: true,
app     | 2025-09-15 11:08:33.236 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:33.236 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:33.236 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:33.236 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:33.236 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:33.236 |     sendDate: false,
app     | 2025-09-15 11:08:33.236 |     _removedConnection: false,
app     | 2025-09-15 11:08:33.236 |     _removedContLen: false,
app     | 2025-09-15 11:08:33.236 |     at a$.request (/app/.next/server/chunks/263.js:3:22526)
app     | 2025-09-15 11:08:33.236 |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
app     | 2025-09-15 11:08:33.236 |   code: 'ERR_BAD_REQUEST',
app     | 2025-09-15 11:08:33.236 |   config: {
app     | 2025-09-15 11:08:33.236 |     transitional: {
app     | 2025-09-15 11:08:33.236 |       silentJSONParsing: true,
app     | 2025-09-15 11:08:33.236 |       forcedJSONParsing: true,
app     | 2025-09-15 11:08:33.236 |       clarifyTimeoutError: false
app     | 2025-09-15 11:08:33.236 |     },
app     | 2025-09-15 11:08:33.236 |     adapter: [ 'xhr', 'http', 'fetch' ],
app     | 2025-09-15 11:08:33.236 |     transformRequest: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:33.236 |     transformResponse: [ [Function (anonymous)] ],
app     | 2025-09-15 11:08:33.236 |     timeout: 30000,
app     | 2025-09-15 11:08:33.236 |     xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:33.236 |     xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:33.236 |     maxContentLength: -1,
app     | 2025-09-15 11:08:33.236 |     maxBodyLength: -1,
app     | 2025-09-15 11:08:33.236 |     env: { FormData: [Function [FormData]], Blob: [class Blob] },
app     | 2025-09-15 11:08:33.236 |     validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:33.236 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:33.236 |       Accept: 'application/json, text/plain, */*',
app     | 2025-09-15 11:08:33.236 |       'Content-Type': 'application/json',
app     | 2025-09-15 11:08:33.236 |       'User-Agent': 'Sienge-Data-Sync/1.0.0',
app     | 2025-09-15 11:08:33.236 |       'Accept-Encoding': 'gzip, compress, deflate, br'
app     | 2025-09-15 11:08:33.236 |     },
app     | 2025-09-15 11:08:33.236 |     baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:33.236 |     auth: {
app     | 2025-09-15 11:08:33.236 |       username: 'abf-gfragoso',
app     | 2025-09-15 11:08:33.236 |       password: '2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ'
app     | 2025-09-15 11:08:33.236 |     },
app     | 2025-09-15 11:08:33.236 |     method: 'get',
app     | 2025-09-15 11:08:33.236 |     url: '/patrimony/fixed',
app     | 2025-09-15 11:08:33.236 |     params: { limit: 1 },
app     | 2025-09-15 11:08:33.236 |     allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:33.236 |     metadata: { startTime: 1757945312789 },
app     | 2025-09-15 11:08:33.236 |     'axios-retry': {
app     | 2025-09-15 11:08:33.236 |       retries: 3,
app     | 2025-09-15 11:08:33.236 |       retryCondition: [Function: retryCondition],
app     | 2025-09-15 11:08:33.236 |       retryDelay: [Function: retryDelay],
app     | 2025-09-15 11:08:33.236 |       shouldResetTimeout: false,
app     | 2025-09-15 11:08:33.236 |       onRetry: [Function: onRetry],
app     | 2025-09-15 11:08:33.236 |       onMaxRetryTimesExceeded: [Function: onMaxRetryTimesExceeded],
app     | 2025-09-15 11:08:33.236 |       validateResponse: null,
app     | 2025-09-15 11:08:33.236 |       retryCount: 0,
app     | 2025-09-15 11:08:33.236 |       lastRequestTime: 1757945312789
app     | 2025-09-15 11:08:33.236 |     },
app     | 2025-09-15 11:08:33.236 |     data: undefined
app     | 2025-09-15 11:08:33.236 |   },
app     | 2025-09-15 11:08:33.236 |   request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:33.236 |     _events: [Object: null prototype] {
app     | 2025-09-15 11:08:33.236 |       abort: [Function (anonymous)],
app     | 2025-09-15 11:08:33.236 |       aborted: [Function (anonymous)],
app     | 2025-09-15 11:08:33.236 |       connect: [Function (anonymous)],
app     | 2025-09-15 11:08:33.236 |       error: [Function (anonymous)],
app     | 2025-09-15 11:08:33.236 |       socket: [Function (anonymous)],
app     | 2025-09-15 11:08:33.236 |       timeout: [Function (anonymous)],
app     | 2025-09-15 11:08:33.236 |       finish: [Function: requestOnFinish]
app     | 2025-09-15 11:08:33.236 |     },
app     | 2025-09-15 11:08:33.236 |     _eventsCount: 7,
app     | 2025-09-15 11:08:33.236 |     _maxListeners: undefined,
app     | 2025-09-15 11:08:33.236 |     outputData: [],
app     | 2025-09-15 11:08:33.236 |     outputSize: 0,
app     | 2025-09-15 11:08:33.236 |     writable: true,
app     | 2025-09-15 11:08:33.236 |     destroyed: true,
app     | 2025-09-15 11:08:33.236 |     _last: true,
app     | 2025-09-15 11:08:33.236 |     chunkedEncoding: false,
app     | 2025-09-15 11:08:33.236 |     shouldKeepAlive: false,
app     | 2025-09-15 11:08:33.236 |     maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:33.236 |     _defaultKeepAlive: true,
app     | 2025-09-15 11:08:33.236 |     useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:33.236 |     sendDate: false,
app     | 2025-09-15 11:08:33.236 |     _removedConnection: false,
app     | 2025-09-15 11:08:33.236 |     _removedContLen: false,
app     | 2025-09-15 11:08:33.236 |     _removedTE: false,
app     | 2025-09-15 11:08:33.236 |     strictContentLength: false,
app     | 2025-09-15 11:08:33.236 |     _contentLength: 0,
app     | 2025-09-15 11:08:33.236 |     _hasBody: true,
app     | 2025-09-15 11:08:33.236 |     _trailer: '',
app     | 2025-09-15 11:08:33.236 |     finished: true,
app     | 2025-09-15 11:08:33.236 |     _headerSent: true,
app     | 2025-09-15 11:08:33.236 |     _closed: true,
app     | 2025-09-15 11:08:33.236 |     socket: TLSSocket {
app     | 2025-09-15 11:08:33.236 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:33.236 |       _secureEstablished: true,
app     | 2025-09-15 11:08:33.236 |       _securePending: false,
app     | 2025-09-15 11:08:33.236 |       _newSessionPending: false,
app     | 2025-09-15 11:08:33.236 |       _controlReleased: true,
app     | 2025-09-15 11:08:33.236 |       secureConnecting: false,
app     | 2025-09-15 11:08:33.236 |       _SNICallback: null,
app     | 2025-09-15 11:08:33.236 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:33.236 |       alpnProtocol: false,
app     | 2025-09-15 11:08:33.236 |       authorized: true,
app     | 2025-09-15 11:08:33.236 |       authorizationError: null,
app     | 2025-09-15 11:08:33.236 |       encrypted: true,
app     | 2025-09-15 11:08:33.236 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:33.236 |       _eventsCount: 9,
app     | 2025-09-15 11:08:33.236 |       connecting: false,
app     | 2025-09-15 11:08:33.236 |       _hadError: false,
app     | 2025-09-15 11:08:33.236 |       _parent: null,
app     | 2025-09-15 11:08:33.236 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:33.236 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:33.236 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:33.236 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:33.236 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:33.236 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:33.236 |       _sockname: null,
app     | 2025-09-15 11:08:33.236 |       _pendingData: null,
app     | 2025-09-15 11:08:33.236 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:33.236 |       server: undefined,
app     | 2025-09-15 11:08:33.236 |       _server: null,
app     | 2025-09-15 11:08:33.236 |       ssl: null,
app     | 2025-09-15 11:08:33.236 |       _requestCert: true,
app     | 2025-09-15 11:08:33.236 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:33.236 |       parser: null,
app     | 2025-09-15 11:08:33.236 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:33.236 |       timeout: 30000,
app     | 2025-09-15 11:08:33.236 |       write: [Function: writeAfterFIN],
app     | 2025-09-15 11:08:33.236 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:33.236 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:33.236 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:33.236 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:33.236 |       [Symbol(async_id_symbol)]: 13533,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:33.236 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:33.236 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:33.236 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:33.236 |         _idlePrev: null,
app     | 2025-09-15 11:08:33.236 |         _idleNext: null,
app     | 2025-09-15 11:08:33.236 |         _idleStart: 22292,
app     | 2025-09-15 11:08:33.236 |         _onTimeout: null,
app     | 2025-09-15 11:08:33.236 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:33.236 |         _repeat: null,
app     | 2025-09-15 11:08:33.236 |         _destroyed: true,
app     | 2025-09-15 11:08:33.236 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:33.236 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:33.236 |         [Symbol(asyncId)]: 13544,
app     | 2025-09-15 11:08:33.236 |         [Symbol(triggerId)]: 13536,
app     | 2025-09-15 11:08:33.236 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:33.236 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:33.236 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:33.236 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:33.236 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:33.236 |       },
app     | 2025-09-15 11:08:33.236 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kBytesWritten)]: 343,
app     | 2025-09-15 11:08:33.236 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:33.236 |     },
app     | 2025-09-15 11:08:33.236 |     _header: 'GET /abf/public/api/v1/patrimony/fixed?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:33.236 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:33.236 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:33.236 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:33.236 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:33.236 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:33.236 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:33.236 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:33.236 |       '\r\n',
app     | 2025-09-15 11:08:33.236 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:33.236 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:33.236 |     agent: Agent {
app     | 2025-09-15 11:08:33.236 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:33.236 |       _eventsCount: 2,
app     | 2025-09-15 11:08:33.236 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:33.236 |       defaultPort: 443,
app     | 2025-09-15 11:08:33.236 |       protocol: 'https:',
app     | 2025-09-15 11:08:33.236 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:33.236 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:33.236 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:33.236 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:33.236 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:33.236 |       keepAlive: false,
app     | 2025-09-15 11:08:33.236 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:33.236 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:33.236 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:33.236 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:33.236 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:33.236 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:33.236 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:33.236 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:33.236 |     },
app     | 2025-09-15 11:08:33.236 |     socketPath: undefined,
app     | 2025-09-15 11:08:33.236 |     method: 'GET',
app     | 2025-09-15 11:08:33.236 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:33.236 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:33.236 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:33.236 |     path: '/abf/public/api/v1/patrimony/fixed?limit=1',
app     | 2025-09-15 11:08:33.236 |     _ended: true,
app     | 2025-09-15 11:08:33.236 |     res: IncomingMessage {
app     | 2025-09-15 11:08:33.236 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:33.236 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:33.236 |       _eventsCount: 4,
app     | 2025-09-15 11:08:33.236 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:33.236 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:33.236 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:33.236 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:33.236 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:33.236 |       complete: true,
app     | 2025-09-15 11:08:33.236 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:33.236 |       rawTrailers: [],
app     | 2025-09-15 11:08:33.236 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:33.236 |       aborted: false,
app     | 2025-09-15 11:08:33.236 |       upgrade: false,
app     | 2025-09-15 11:08:33.236 |       url: '',
app     | 2025-09-15 11:08:33.237 |       method: null,
app     | 2025-09-15 11:08:33.237 |       statusCode: 403,
app     | 2025-09-15 11:08:33.237 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:33.237 |       client: [TLSSocket],
app     | 2025-09-15 11:08:33.237 |       _consuming: false,
app     | 2025-09-15 11:08:33.237 |       _dumped: false,
app     | 2025-09-15 11:08:33.237 |       req: [Circular *1],
app     | 2025-09-15 11:08:33.237 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/patrimony/fixed?limit=1',
app     | 2025-09-15 11:08:33.237 |       redirects: [],
app     | 2025-09-15 11:08:33.237 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:33.237 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:33.237 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:33.237 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:33.237 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:33.237 |     },
app     | 2025-09-15 11:08:33.237 |     aborted: false,
app     | 2025-09-15 11:08:33.237 |     timeoutCb: null,
app     | 2025-09-15 11:08:33.237 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:33.237 |     parser: null,
app     | 2025-09-15 11:08:33.237 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:33.237 |     reusedSocket: false,
app     | 2025-09-15 11:08:33.237 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:33.237 |     protocol: 'https:',
app     | 2025-09-15 11:08:33.237 |     _redirectable: Writable {
app     | 2025-09-15 11:08:33.237 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:33.237 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:33.237 |       _eventsCount: 3,
app     | 2025-09-15 11:08:33.237 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:33.237 |       _options: [Object],
app     | 2025-09-15 11:08:33.237 |       _ended: true,
app     | 2025-09-15 11:08:33.237 |       _ending: true,
app     | 2025-09-15 11:08:33.237 |       _redirectCount: 0,
app     | 2025-09-15 11:08:33.237 |       _redirects: [],
app     | 2025-09-15 11:08:33.237 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:33.237 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:33.237 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:33.237 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:33.237 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/patrimony/fixed?limit=1',
app     | 2025-09-15 11:08:33.237 |       _timeout: null,
app     | 2025-09-15 11:08:33.237 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:33.237 |     },
app     | 2025-09-15 11:08:33.237 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:33.237 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:33.237 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:33.237 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:33.237 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:33.237 |       accept: [Array],
app     | 2025-09-15 11:08:33.237 |       'content-type': [Array],
app     | 2025-09-15 11:08:33.237 |       'user-agent': [Array],
app     | 2025-09-15 11:08:33.237 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:33.237 |       host: [Array],
app     | 2025-09-15 11:08:33.237 |       authorization: [Array]
app     | 2025-09-15 11:08:33.237 |     },
app     | 2025-09-15 11:08:33.237 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:33.237 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:33.237 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:33.237 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:33.237 |   },
app     | 2025-09-15 11:08:33.237 |   response: {
app     | 2025-09-15 11:08:33.237 |     status: 403,
app     | 2025-09-15 11:08:33.237 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:33.238 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:33.238 |       server: 'nginx',
app     | 2025-09-15 11:08:33.238 |       date: 'Mon, 15 Sep 2025 14:08:35 GMT',
app     | 2025-09-15 11:08:33.238 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:33.238 |       'content-length': '34',
app     | 2025-09-15 11:08:33.238 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:33.238 |       'x-ratelimit-remaining-minute': '187',
app     | 2025-09-15 11:08:33.238 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:33.238 |       'ratelimit-remaining': '187',
app     | 2025-09-15 11:08:33.238 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:33.238 |       'ratelimit-reset': '25',
app     | 2025-09-15 11:08:33.238 |       'x-kong-response-latency': '4',
app     | 2025-09-15 11:08:33.238 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:33.238 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:33.238 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:33.238 |       connection: 'close'
app     | 2025-09-15 11:08:33.238 |     },
app     | 2025-09-15 11:08:33.238 |     config: {
app     | 2025-09-15 11:08:33.238 |       transitional: [Object],
app     | 2025-09-15 11:08:33.238 |       adapter: [Array],
app     | 2025-09-15 11:08:33.238 |       transformRequest: [Array],
app     | 2025-09-15 11:08:33.238 |       transformResponse: [Array],
app     | 2025-09-15 11:08:33.238 |       timeout: 30000,
app     | 2025-09-15 11:08:33.238 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:33.238 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:33.238 |       maxContentLength: -1,
app     | 2025-09-15 11:08:33.238 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:33.238 |       env: [Object],
app     | 2025-09-15 11:08:33.238 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:33.238 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:33.238 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:33.238 |       auth: [Object],
app     | 2025-09-15 11:08:33.238 |       method: 'get',
app     | 2025-09-15 11:08:33.238 |       url: '/patrimony/fixed',
app     | 2025-09-15 11:08:33.238 |       params: [Object],
app     | 2025-09-15 11:08:33.238 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:33.238 |       metadata: [Object],
app     | 2025-09-15 11:08:33.238 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:33.238 |       data: undefined
app     | 2025-09-15 11:08:33.238 |     },
app     | 2025-09-15 11:08:33.238 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:33.238 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:33.238 |       _eventsCount: 7,
app     | 2025-09-15 11:08:33.238 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:33.238 |       outputData: [],
app     | 2025-09-15 11:08:33.238 |       outputSize: 0,
app     | 2025-09-15 11:08:33.238 |       writable: true,
app     | 2025-09-15 11:08:33.238 |       destroyed: true,
app     | 2025-09-15 11:08:33.238 |       _last: true,
app     | 2025-09-15 11:08:33.238 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:33.238 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:33.238 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:33.238 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:33.238 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:33.238 |       sendDate: false,
app     | 2025-09-15 11:08:33.238 |       _removedConnection: false,
app     | 2025-09-15 11:08:33.238 |       _removedContLen: false,
app     | 2025-09-15 11:08:33.238 |       _removedTE: false,
app     | 2025-09-15 11:08:33.238 |       strictContentLength: false,
app     | 2025-09-15 11:08:33.238 |       _contentLength: 0,
app     | 2025-09-15 11:08:33.238 |       _hasBody: true,
app     | 2025-09-15 11:08:33.238 |       _trailer: '',
app     | 2025-09-15 11:08:33.238 |       finished: true,
app     | 2025-09-15 11:08:33.238 |       _headerSent: true,
app     | 2025-09-15 11:08:33.238 |       _closed: true,
app     | 2025-09-15 11:08:33.238 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:33.238 |       _header: 'GET /abf/public/api/v1/patrimony/fixed?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:33.238 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:33.238 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:33.238 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:33.238 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:33.238 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:33.238 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:33.238 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:33.238 |         '\r\n',
app     | 2025-09-15 11:08:33.238 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:33.238 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:33.238 |       agent: [Agent],
app     | 2025-09-15 11:08:33.238 |       socketPath: undefined,
app     | 2025-09-15 11:08:33.238 |       method: 'GET',
app     | 2025-09-15 11:08:33.238 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:33.238 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:33.238 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:33.238 |       path: '/abf/public/api/v1/patrimony/fixed?limit=1',
app     | 2025-09-15 11:08:33.238 |       _ended: true,
app     | 2025-09-15 11:08:33.238 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:33.238 |       aborted: false,
app     | 2025-09-15 11:08:33.238 |       timeoutCb: null,
app     | 2025-09-15 11:08:33.238 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:33.238 |       parser: null,
app     | 2025-09-15 11:08:33.238 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:33.238 |       reusedSocket: false,
app     | 2025-09-15 11:08:33.238 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:33.238 |       protocol: 'https:',
app     | 2025-09-15 11:08:33.238 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:33.238 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:33.238 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:33.238 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:33.238 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:33.238 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:33.238 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:33.238 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:33.238 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:33.238 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:33.238 |     },
app     | 2025-09-15 11:08:33.238 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:33.238 |   },
app     | 2025-09-15 11:08:33.238 |   status: 403
app     | 2025-09-15 11:08:33.238 | }
app     | 2025-09-15 11:08:33.236 |     _removedTE: false,
app     | 2025-09-15 11:08:33.236 |     strictContentLength: false,
app     | 2025-09-15 11:08:33.236 |     _contentLength: 0,
app     | 2025-09-15 11:08:33.236 |     _hasBody: true,
app     | 2025-09-15 11:08:33.236 |     _trailer: '',
app     | 2025-09-15 11:08:33.236 |     finished: true,
app     | 2025-09-15 11:08:33.236 |     _headerSent: true,
app     | 2025-09-15 11:08:33.236 |     _closed: true,
app     | 2025-09-15 11:08:33.236 |     socket: TLSSocket {
app     | 2025-09-15 11:08:33.236 |       _tlsOptions: [Object],
app     | 2025-09-15 11:08:33.236 |       _secureEstablished: true,
app     | 2025-09-15 11:08:33.236 |       _securePending: false,
app     | 2025-09-15 11:08:33.236 |       _newSessionPending: false,
app     | 2025-09-15 11:08:33.236 |       _controlReleased: true,
app     | 2025-09-15 11:08:33.236 |       secureConnecting: false,
app     | 2025-09-15 11:08:33.236 |       _SNICallback: null,
app     | 2025-09-15 11:08:33.236 |       servername: 'api.sienge.com.br',
app     | 2025-09-15 11:08:33.236 |       alpnProtocol: false,
app     | 2025-09-15 11:08:33.236 |       authorized: true,
app     | 2025-09-15 11:08:33.236 |       authorizationError: null,
app     | 2025-09-15 11:08:33.236 |       encrypted: true,
app     | 2025-09-15 11:08:33.236 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:33.236 |       _eventsCount: 9,
app     | 2025-09-15 11:08:33.236 |       connecting: false,
app     | 2025-09-15 11:08:33.236 |       _hadError: false,
app     | 2025-09-15 11:08:33.236 |       _parent: null,
app     | 2025-09-15 11:08:33.236 |       _host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:33.236 |       _closeAfterHandlingError: false,
app     | 2025-09-15 11:08:33.236 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:33.236 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:33.236 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:33.236 |       allowHalfOpen: false,
app     | 2025-09-15 11:08:33.236 |       _sockname: null,
app     | 2025-09-15 11:08:33.236 |       _pendingData: null,
app     | 2025-09-15 11:08:33.236 |       _pendingEncoding: '',
app     | 2025-09-15 11:08:33.236 |       server: undefined,
app     | 2025-09-15 11:08:33.236 |       _server: null,
app     | 2025-09-15 11:08:33.236 |       ssl: null,
app     | 2025-09-15 11:08:33.236 |       _requestCert: true,
app     | 2025-09-15 11:08:33.236 |       _rejectUnauthorized: true,
app     | 2025-09-15 11:08:33.236 |       parser: null,
app     | 2025-09-15 11:08:33.236 |       _httpMessage: [Circular *1],
app     | 2025-09-15 11:08:33.236 |       timeout: 30000,
app     | 2025-09-15 11:08:33.236 |       write: [Function: writeAfterFIN],
app     | 2025-09-15 11:08:33.236 |       [Symbol(alpncallback)]: null,
app     | 2025-09-15 11:08:33.236 |       [Symbol(res)]: null,
app     | 2025-09-15 11:08:33.236 |       [Symbol(verified)]: true,
app     | 2025-09-15 11:08:33.236 |       [Symbol(pendingSession)]: null,
app     | 2025-09-15 11:08:33.236 |       [Symbol(async_id_symbol)]: 13533,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kHandle)]: null,
app     | 2025-09-15 11:08:33.236 |       [Symbol(lastWriteQueueSize)]: 0,
app     | 2025-09-15 11:08:33.236 |       [Symbol(timeout)]: Timeout {
app     | 2025-09-15 11:08:33.236 |         _idleTimeout: -1,
app     | 2025-09-15 11:08:33.236 |         _idlePrev: null,
app     | 2025-09-15 11:08:33.236 |         _idleNext: null,
app     | 2025-09-15 11:08:33.236 |         _idleStart: 22292,
app     | 2025-09-15 11:08:33.236 |         _onTimeout: null,
app     | 2025-09-15 11:08:33.236 |         _timerArgs: undefined,
app     | 2025-09-15 11:08:33.236 |         _repeat: null,
app     | 2025-09-15 11:08:33.236 |         _destroyed: true,
app     | 2025-09-15 11:08:33.236 |         [Symbol(refed)]: false,
app     | 2025-09-15 11:08:33.236 |         [Symbol(kHasPrimitive)]: false,
app     | 2025-09-15 11:08:33.236 |         [Symbol(asyncId)]: 13544,
app     | 2025-09-15 11:08:33.236 |         [Symbol(triggerId)]: 13536,
app     | 2025-09-15 11:08:33.236 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:33.236 |         [Symbol(kResourceStore)]: [Object],
app     | 2025-09-15 11:08:33.236 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:33.236 |         [Symbol(kResourceStore)]: undefined,
app     | 2025-09-15 11:08:33.236 |         [Symbol(kResourceStore)]: [Object]
app     | 2025-09-15 11:08:33.236 |       },
app     | 2025-09-15 11:08:33.236 |       [Symbol(kBuffer)]: null,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kBufferCb)]: null,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kBufferGen)]: null,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kSetNoDelay)]: false,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kSetKeepAlive)]: true,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kSetKeepAliveInitialDelay)]: 60,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kBytesRead)]: 495,
app     | 2025-09-15 11:08:33.236 |       [Symbol(kBytesWritten)]: 343,
app     | 2025-09-15 11:08:33.236 |       [Symbol(connect-options)]: [Object]
app     | 2025-09-15 11:08:33.236 |     },
app     | 2025-09-15 11:08:33.236 |     _header: 'GET /abf/public/api/v1/patrimony/fixed?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:33.236 |       'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:33.236 |       'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:33.236 |       'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:33.236 |       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:33.236 |       'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:33.236 |       'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:33.236 |       'Connection: close\r\n' +
app     | 2025-09-15 11:08:33.236 |       '\r\n',
app     | 2025-09-15 11:08:33.236 |     _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:33.236 |     _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:33.236 |     agent: Agent {
app     | 2025-09-15 11:08:33.236 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:33.236 |       _eventsCount: 2,
app     | 2025-09-15 11:08:33.236 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:33.236 |       defaultPort: 443,
app     | 2025-09-15 11:08:33.236 |       protocol: 'https:',
app     | 2025-09-15 11:08:33.236 |       options: [Object: null prototype],
app     | 2025-09-15 11:08:33.236 |       requests: [Object: null prototype] {},
app     | 2025-09-15 11:08:33.236 |       sockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:33.236 |       freeSockets: [Object: null prototype] {},
app     | 2025-09-15 11:08:33.236 |       keepAliveMsecs: 1000,
app     | 2025-09-15 11:08:33.236 |       keepAlive: false,
app     | 2025-09-15 11:08:33.236 |       maxSockets: Infinity,
app     | 2025-09-15 11:08:33.236 |       maxFreeSockets: 256,
app     | 2025-09-15 11:08:33.236 |       scheduling: 'lifo',
app     | 2025-09-15 11:08:33.236 |       maxTotalSockets: Infinity,
app     | 2025-09-15 11:08:33.236 |       totalSocketCount: 0,
app     | 2025-09-15 11:08:33.236 |       maxCachedSessions: 100,
app     | 2025-09-15 11:08:33.236 |       _sessionCache: [Object],
app     | 2025-09-15 11:08:33.236 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:33.236 |     },
app     | 2025-09-15 11:08:33.236 |     socketPath: undefined,
app     | 2025-09-15 11:08:33.236 |     method: 'GET',
app     | 2025-09-15 11:08:33.236 |     maxHeaderSize: undefined,
app     | 2025-09-15 11:08:33.236 |     insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:33.236 |     joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:33.236 |     path: '/abf/public/api/v1/patrimony/fixed?limit=1',
app     | 2025-09-15 11:08:33.236 |     _ended: true,
app     | 2025-09-15 11:08:33.236 |     res: IncomingMessage {
app     | 2025-09-15 11:08:33.236 |       _readableState: [ReadableState],
app     | 2025-09-15 11:08:33.236 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:33.236 |       _eventsCount: 4,
app     | 2025-09-15 11:08:33.236 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:33.236 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:33.236 |       httpVersionMajor: 1,
app     | 2025-09-15 11:08:33.236 |       httpVersionMinor: 1,
app     | 2025-09-15 11:08:33.236 |       httpVersion: '1.1',
app     | 2025-09-15 11:08:33.236 |       complete: true,
app     | 2025-09-15 11:08:33.236 |       rawHeaders: [Array],
app     | 2025-09-15 11:08:33.236 |       rawTrailers: [],
app     | 2025-09-15 11:08:33.236 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:33.236 |       aborted: false,
app     | 2025-09-15 11:08:33.236 |       upgrade: false,
app     | 2025-09-15 11:08:33.236 |       url: '',
app     | 2025-09-15 11:08:33.237 |       method: null,
app     | 2025-09-15 11:08:33.237 |       statusCode: 403,
app     | 2025-09-15 11:08:33.237 |       statusMessage: 'Forbidden',
app     | 2025-09-15 11:08:33.237 |       client: [TLSSocket],
app     | 2025-09-15 11:08:33.237 |       _consuming: false,
app     | 2025-09-15 11:08:33.237 |       _dumped: false,
app     | 2025-09-15 11:08:33.237 |       req: [Circular *1],
app     | 2025-09-15 11:08:33.237 |       responseUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/patrimony/fixed?limit=1',
app     | 2025-09-15 11:08:33.237 |       redirects: [],
app     | 2025-09-15 11:08:33.237 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:33.237 |       [Symbol(kHeaders)]: [Object],
app     | 2025-09-15 11:08:33.237 |       [Symbol(kHeadersCount)]: 30,
app     | 2025-09-15 11:08:33.237 |       [Symbol(kTrailers)]: null,
app     | 2025-09-15 11:08:33.237 |       [Symbol(kTrailersCount)]: 0
app     | 2025-09-15 11:08:33.237 |     },
app     | 2025-09-15 11:08:33.237 |     aborted: false,
app     | 2025-09-15 11:08:33.237 |     timeoutCb: null,
app     | 2025-09-15 11:08:33.237 |     upgradeOrConnect: false,
app     | 2025-09-15 11:08:33.237 |     parser: null,
app     | 2025-09-15 11:08:33.237 |     maxHeadersCount: null,
app     | 2025-09-15 11:08:33.237 |     reusedSocket: false,
app     | 2025-09-15 11:08:33.237 |     host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:33.237 |     protocol: 'https:',
app     | 2025-09-15 11:08:33.237 |     _redirectable: Writable {
app     | 2025-09-15 11:08:33.237 |       _writableState: [WritableState],
app     | 2025-09-15 11:08:33.237 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:33.237 |       _eventsCount: 3,
app     | 2025-09-15 11:08:33.237 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:33.237 |       _options: [Object],
app     | 2025-09-15 11:08:33.237 |       _ended: true,
app     | 2025-09-15 11:08:33.237 |       _ending: true,
app     | 2025-09-15 11:08:33.237 |       _redirectCount: 0,
app     | 2025-09-15 11:08:33.237 |       _redirects: [],
app     | 2025-09-15 11:08:33.237 |       _requestBodyLength: 0,
app     | 2025-09-15 11:08:33.237 |       _requestBodyBuffers: [],
app     | 2025-09-15 11:08:33.237 |       _onNativeResponse: [Function (anonymous)],
app     | 2025-09-15 11:08:33.237 |       _currentRequest: [Circular *1],
app     | 2025-09-15 11:08:33.237 |       _currentUrl: 'https://abf-gfragoso:2grGSPuKaEyFtwhrKVttAIimPbP2AfNJ@api.sienge.com.br/abf/public/api/v1/patrimony/fixed?limit=1',
app     | 2025-09-15 11:08:33.237 |       _timeout: null,
app     | 2025-09-15 11:08:33.237 |       [Symbol(kCapture)]: false
app     | 2025-09-15 11:08:33.237 |     },
app     | 2025-09-15 11:08:33.237 |     [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:33.237 |     [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:33.237 |     [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:33.237 |     [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:33.237 |     [Symbol(kOutHeaders)]: [Object: null prototype] {
app     | 2025-09-15 11:08:33.237 |       accept: [Array],
app     | 2025-09-15 11:08:33.237 |       'content-type': [Array],
app     | 2025-09-15 11:08:33.237 |       'user-agent': [Array],
app     | 2025-09-15 11:08:33.237 |       'accept-encoding': [Array],
app     | 2025-09-15 11:08:33.237 |       host: [Array],
app     | 2025-09-15 11:08:33.237 |       authorization: [Array]
app     | 2025-09-15 11:08:33.237 |     },
app     | 2025-09-15 11:08:33.237 |     [Symbol(errored)]: null,
app     | 2025-09-15 11:08:33.237 |     [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:33.237 |     [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:33.237 |     [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:33.237 |   },
app     | 2025-09-15 11:08:33.237 |   response: {
app     | 2025-09-15 11:08:33.237 |     status: 403,
app     | 2025-09-15 11:08:33.237 |     statusText: 'Forbidden',
app     | 2025-09-15 11:08:33.238 |     headers: Object [AxiosHeaders] {
app     | 2025-09-15 11:08:33.238 |       server: 'nginx',
app     | 2025-09-15 11:08:33.238 |       date: 'Mon, 15 Sep 2025 14:08:35 GMT',
app     | 2025-09-15 11:08:33.238 |       'content-type': 'application/json',
app     | 2025-09-15 11:08:33.238 |       'content-length': '34',
app     | 2025-09-15 11:08:33.238 |       vary: 'Accept-Encoding',
app     | 2025-09-15 11:08:33.238 |       'x-ratelimit-remaining-minute': '187',
app     | 2025-09-15 11:08:33.238 |       'x-ratelimit-limit-minute': '200',
app     | 2025-09-15 11:08:33.238 |       'ratelimit-remaining': '187',
app     | 2025-09-15 11:08:33.238 |       'ratelimit-limit': '200',
app     | 2025-09-15 11:08:33.238 |       'ratelimit-reset': '25',
app     | 2025-09-15 11:08:33.238 |       'x-kong-response-latency': '4',
app     | 2025-09-15 11:08:33.238 |       'x-xss-protection': '1; mode=block',
app     | 2025-09-15 11:08:33.238 |       'x-frame-options': 'SAMEORIGIN',
app     | 2025-09-15 11:08:33.238 |       'strict-transport-security': 'max-age=31536000; includeSubDomains',
app     | 2025-09-15 11:08:33.238 |       connection: 'close'
app     | 2025-09-15 11:08:33.238 |     },
app     | 2025-09-15 11:08:33.238 |     config: {
app     | 2025-09-15 11:08:33.238 |       transitional: [Object],
app     | 2025-09-15 11:08:33.238 |       adapter: [Array],
app     | 2025-09-15 11:08:33.238 |       transformRequest: [Array],
app     | 2025-09-15 11:08:33.238 |       transformResponse: [Array],
app     | 2025-09-15 11:08:33.238 |       timeout: 30000,
app     | 2025-09-15 11:08:33.238 |       xsrfCookieName: 'XSRF-TOKEN',
app     | 2025-09-15 11:08:33.238 |       xsrfHeaderName: 'X-XSRF-TOKEN',
app     | 2025-09-15 11:08:33.238 |       maxContentLength: -1,
app     | 2025-09-15 11:08:33.238 |       maxBodyLength: -1,
app     | 2025-09-15 11:08:33.238 |       env: [Object],
app     | 2025-09-15 11:08:33.238 |       validateStatus: [Function: validateStatus],
app     | 2025-09-15 11:08:33.238 |       headers: [Object [AxiosHeaders]],
app     | 2025-09-15 11:08:33.238 |       baseURL: 'https://api.sienge.com.br/abf/public/api/v1',
app     | 2025-09-15 11:08:33.238 |       auth: [Object],
app     | 2025-09-15 11:08:33.238 |       method: 'get',
app     | 2025-09-15 11:08:33.238 |       url: '/patrimony/fixed',
app     | 2025-09-15 11:08:33.238 |       params: [Object],
app     | 2025-09-15 11:08:33.238 |       allowAbsoluteUrls: true,
app     | 2025-09-15 11:08:33.238 |       metadata: [Object],
app     | 2025-09-15 11:08:33.238 |       'axios-retry': [Object],
app     | 2025-09-15 11:08:33.238 |       data: undefined
app     | 2025-09-15 11:08:33.238 |     },
app     | 2025-09-15 11:08:33.238 |     request: <ref *1> ClientRequest {
app     | 2025-09-15 11:08:33.238 |       _events: [Object: null prototype],
app     | 2025-09-15 11:08:33.238 |       _eventsCount: 7,
app     | 2025-09-15 11:08:33.238 |       _maxListeners: undefined,
app     | 2025-09-15 11:08:33.238 |       outputData: [],
app     | 2025-09-15 11:08:33.238 |       outputSize: 0,
app     | 2025-09-15 11:08:33.238 |       writable: true,
app     | 2025-09-15 11:08:33.238 |       destroyed: true,
app     | 2025-09-15 11:08:33.238 |       _last: true,
app     | 2025-09-15 11:08:33.238 |       chunkedEncoding: false,
app     | 2025-09-15 11:08:33.238 |       shouldKeepAlive: false,
app     | 2025-09-15 11:08:33.238 |       maxRequestsOnConnectionReached: false,
app     | 2025-09-15 11:08:33.238 |       _defaultKeepAlive: true,
app     | 2025-09-15 11:08:33.238 |       useChunkedEncodingByDefault: false,
app     | 2025-09-15 11:08:33.238 |       sendDate: false,
app     | 2025-09-15 11:08:33.238 |       _removedConnection: false,
app     | 2025-09-15 11:08:33.238 |       _removedContLen: false,
app     | 2025-09-15 11:08:33.238 |       _removedTE: false,
app     | 2025-09-15 11:08:33.238 |       strictContentLength: false,
app     | 2025-09-15 11:08:33.238 |       _contentLength: 0,
app     | 2025-09-15 11:08:33.238 |       _hasBody: true,
app     | 2025-09-15 11:08:33.238 |       _trailer: '',
app     | 2025-09-15 11:08:33.238 |       finished: true,
app     | 2025-09-15 11:08:33.238 |       _headerSent: true,
app     | 2025-09-15 11:08:33.238 |       _closed: true,
app     | 2025-09-15 11:08:33.238 |       socket: [TLSSocket],
app     | 2025-09-15 11:08:33.238 |       _header: 'GET /abf/public/api/v1/patrimony/fixed?limit=1 HTTP/1.1\r\n' +
app     | 2025-09-15 11:08:33.238 |         'Accept: application/json, text/plain, */*\r\n' +
app     | 2025-09-15 11:08:33.238 |         'Content-Type: application/json\r\n' +
app     | 2025-09-15 11:08:33.238 |         'User-Agent: Sienge-Data-Sync/1.0.0\r\n' +
app     | 2025-09-15 11:08:33.238 |         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
app     | 2025-09-15 11:08:33.238 |         'Host: api.sienge.com.br\r\n' +
app     | 2025-09-15 11:08:33.238 |         'Authorization: Basic YWJmLWdmcmFnb3NvOjJnckdTUHVLYUV5RnR3aHJLVnR0QUlpbVBiUDJBZk5K\r\n' +
app     | 2025-09-15 11:08:33.238 |         'Connection: close\r\n' +
app     | 2025-09-15 11:08:33.238 |         '\r\n',
app     | 2025-09-15 11:08:33.238 |       _keepAliveTimeout: 0,
app     | 2025-09-15 11:08:33.238 |       _onPendingData: [Function: nop],
app     | 2025-09-15 11:08:33.238 |       agent: [Agent],
app     | 2025-09-15 11:08:33.238 |       socketPath: undefined,
app     | 2025-09-15 11:08:33.238 |       method: 'GET',
app     | 2025-09-15 11:08:33.238 |       maxHeaderSize: undefined,
app     | 2025-09-15 11:08:33.238 |       insecureHTTPParser: undefined,
app     | 2025-09-15 11:08:33.238 |       joinDuplicateHeaders: undefined,
app     | 2025-09-15 11:08:33.238 |       path: '/abf/public/api/v1/patrimony/fixed?limit=1',
app     | 2025-09-15 11:08:33.238 |       _ended: true,
app     | 2025-09-15 11:08:33.238 |       res: [IncomingMessage],
app     | 2025-09-15 11:08:33.238 |       aborted: false,
app     | 2025-09-15 11:08:33.238 |       timeoutCb: null,
app     | 2025-09-15 11:08:33.238 |       upgradeOrConnect: false,
app     | 2025-09-15 11:08:33.238 |       parser: null,
app     | 2025-09-15 11:08:33.238 |       maxHeadersCount: null,
app     | 2025-09-15 11:08:33.238 |       reusedSocket: false,
app     | 2025-09-15 11:08:33.238 |       host: 'api.sienge.com.br',
app     | 2025-09-15 11:08:33.238 |       protocol: 'https:',
app     | 2025-09-15 11:08:33.238 |       _redirectable: [Writable],
app     | 2025-09-15 11:08:33.238 |       [Symbol(kCapture)]: false,
app     | 2025-09-15 11:08:33.238 |       [Symbol(kBytesWritten)]: 0,
app     | 2025-09-15 11:08:33.238 |       [Symbol(kNeedDrain)]: false,
app     | 2025-09-15 11:08:33.238 |       [Symbol(corked)]: 0,
app     | 2025-09-15 11:08:33.238 |       [Symbol(kOutHeaders)]: [Object: null prototype],
app     | 2025-09-15 11:08:33.238 |       [Symbol(errored)]: null,
app     | 2025-09-15 11:08:33.238 |       [Symbol(kHighWaterMark)]: 16384,
app     | 2025-09-15 11:08:33.238 |       [Symbol(kRejectNonStandardBodyWrites)]: false,
app     | 2025-09-15 11:08:33.238 |       [Symbol(kUniqueHeaders)]: null
app     | 2025-09-15 11:08:33.238 |     },
app     | 2025-09-15 11:08:33.238 |     data: { message: 'Permission denied' }
app     | 2025-09-15 11:08:33.238 |   },
app     | 2025-09-15 11:08:33.238 |   status: 403
app     | 2025-09-15 11:08:33.238 | }
app     | 2025-09-15 11:08:33.428 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:33.428 | [Sienge Proxy] Chamando endpoint: /customers com params: {
app     | 2025-09-15 11:08:33.428 |   createdAfter: '2024-09-15',
app     | 2025-09-15 11:08:33.428 |   createdBefore: '2025-09-15',
app     | 2025-09-15 11:08:33.428 |   limit: 200,
app     | 2025-09-15 11:08:33.428 |   offset: 0
app     | 2025-09-15 11:08:33.428 | }
app     | 2025-09-15 11:08:33.428 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:33.428 | [Sienge Proxy] Chamando endpoint: /customers com params: {
app     | 2025-09-15 11:08:33.428 |   createdAfter: '2024-09-15',
app     | 2025-09-15 11:08:33.428 |   createdBefore: '2025-09-15',
app     | 2025-09-15 11:08:33.428 |   limit: 200,
app     | 2025-09-15 11:08:33.428 |   offset: 0
app     | 2025-09-15 11:08:33.428 | }
app     | 2025-09-15 11:08:34.634 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:34.634 | [Sienge Proxy] Chamando endpoint: /customers com params: {
app     | 2025-09-15 11:08:34.634 |   createdAfter: '2024-09-15',
app     | 2025-09-15 11:08:34.634 |   createdBefore: '2025-09-15',
app     | 2025-09-15 11:08:34.634 |   limit: 200,
app     | 2025-09-15 11:08:34.634 |   offset: 200
app     | 2025-09-15 11:08:34.634 | }
app     | 2025-09-15 11:08:34.634 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:34.634 | [Sienge Proxy] Chamando endpoint: /customers com params: {
app     | 2025-09-15 11:08:34.634 |   createdAfter: '2024-09-15',
app     | 2025-09-15 11:08:34.634 |   createdBefore: '2025-09-15',
app     | 2025-09-15 11:08:34.634 |   limit: 200,
app     | 2025-09-15 11:08:34.634 |   offset: 200
app     | 2025-09-15 11:08:34.634 | }
app     | 2025-09-15 11:08:35.824 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:35.824 | [Sienge Proxy] Chamando endpoint: /customers com params: {
app     | 2025-09-15 11:08:35.824 |   createdAfter: '2024-09-15',
app     | 2025-09-15 11:08:35.825 |   createdBefore: '2025-09-15',
app     | 2025-09-15 11:08:35.825 |   limit: 200,
app     | 2025-09-15 11:08:35.825 |   offset: 400
app     | 2025-09-15 11:08:35.825 | }
app     | 2025-09-15 11:08:35.824 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:35.824 | [Sienge Proxy] Chamando endpoint: /customers com params: {
app     | 2025-09-15 11:08:35.824 |   createdAfter: '2024-09-15',
app     | 2025-09-15 11:08:35.825 |   createdBefore: '2025-09-15',
app     | 2025-09-15 11:08:35.825 |   limit: 200,
app     | 2025-09-15 11:08:35.825 |   offset: 400
app     | 2025-09-15 11:08:35.825 | }
adminer | 2025-09-15 11:08:36.823 | [Mon Sep 15 14:08:36 2025] [::1]:45940 Accepted
adminer | 2025-09-15 11:08:36.825 | [Mon Sep 15 14:08:36 2025] [::1]:45940 [200]: GET /
adminer | 2025-09-15 11:08:36.825 | [Mon Sep 15 14:08:36 2025] [::1]:45940 Closing
app     | 2025-09-15 11:08:37.433 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:37.433 | [Sienge Proxy] Chamando endpoint: /customers com params: {
app     | 2025-09-15 11:08:37.433 |   createdAfter: '2024-09-15',
app     | 2025-09-15 11:08:37.433 |   createdBefore: '2025-09-15',
app     | 2025-09-15 11:08:37.433 |   limit: 200,
app     | 2025-09-15 11:08:37.433 |   offset: 600
app     | 2025-09-15 11:08:37.433 | }
app     | 2025-09-15 11:08:37.433 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:37.433 | [Sienge Proxy] Chamando endpoint: /customers com params: {
app     | 2025-09-15 11:08:37.433 |   createdAfter: '2024-09-15',
app     | 2025-09-15 11:08:37.433 |   createdBefore: '2025-09-15',
app     | 2025-09-15 11:08:37.433 |   limit: 200,
app     | 2025-09-15 11:08:37.433 |   offset: 600
app     | 2025-09-15 11:08:37.433 | }
app     | 2025-09-15 11:08:38.682 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:38.682 | [Sienge Proxy] Chamando endpoint: /customers com params: {
app     | 2025-09-15 11:08:38.682 |   createdAfter: '2024-09-15',
app     | 2025-09-15 11:08:38.682 |   createdBefore: '2025-09-15',
app     | 2025-09-15 11:08:38.682 |   limit: 200,
app     | 2025-09-15 11:08:38.682 |   offset: 800
app     | 2025-09-15 11:08:38.682 | }
app     | 2025-09-15 11:08:38.682 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:38.682 | [Sienge Proxy] Chamando endpoint: /customers com params: {
app     | 2025-09-15 11:08:38.682 |   createdAfter: '2024-09-15',
app     | 2025-09-15 11:08:38.682 |   createdBefore: '2025-09-15',
app     | 2025-09-15 11:08:38.682 |   limit: 200,
app     | 2025-09-15 11:08:38.682 |   offset: 800
app     | 2025-09-15 11:08:38.682 | }
app     | 2025-09-15 11:08:40.615 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:40.615 | [Sienge Proxy] Chamando endpoint: /companies com params: { limit: 200, offset: 0 }
app     | 2025-09-15 11:08:40.615 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:40.615 | [Sienge Proxy] Chamando endpoint: /companies com params: { limit: 200, offset: 0 }
app     | 2025-09-15 11:08:45.040 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:45.040 | [Sienge Proxy] Chamando endpoint: /enterprises com params: { limit: 200, offset: 0 }
app     | 2025-09-15 11:08:45.040 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:45.040 | [Sienge Proxy] Chamando endpoint: /enterprises com params: { limit: 200, offset: 0 }
app     | 2025-09-15 11:08:46.704 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:46.704 | [Sienge Proxy] Chamando endpoint: /enterprises com params: { limit: 200, offset: 200 }
app     | 2025-09-15 11:08:46.704 | Cliente Sienge API inicializado para: abf
app     | 2025-09-15 11:08:46.704 | [Sienge Proxy] Chamando endpoint: /enterprises com params: { limit: 200, offset: 200 }
adminer | 2025-09-15 11:08:47.395 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44170 Accepted
adminer | 2025-09-15 11:08:47.397 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44170 [200]: GET /
adminer | 2025-09-15 11:08:47.397 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44170 Closing
adminer | 2025-09-15 11:08:47.398 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44174 Accepted
adminer | 2025-09-15 11:08:47.422 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44174 [200]: GET /?file=default.css&version=5.4.0
adminer | 2025-09-15 11:08:47.422 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44174 Closing
adminer | 2025-09-15 11:08:47.423 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44184 Accepted
adminer | 2025-09-15 11:08:47.424 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44184 [200]: GET /?file=dark.css&version=5.4.0
adminer | 2025-09-15 11:08:47.424 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44184 Closing
adminer | 2025-09-15 11:08:47.424 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44186 Accepted
adminer | 2025-09-15 11:08:47.429 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44186 [200]: GET /?file=functions.js&version=5.4.0
adminer | 2025-09-15 11:08:47.429 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44186 Closing
adminer | 2025-09-15 11:08:47.436 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44188 Accepted
adminer | 2025-09-15 11:08:47.440 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44188 [200]: GET /?file=functions.js&version=5.4.0
adminer | 2025-09-15 11:08:47.440 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44188 Closing
adminer | 2025-09-15 11:08:47.440 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44202 Accepted
adminer | 2025-09-15 11:08:47.441 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44202 [200]: GET /?file=logo.png&version=5.4.0
adminer | 2025-09-15 11:08:47.441 | [Mon Sep 15 14:08:47 2025] [::ffff:172.19.0.1]:44202 Closing
adminer | 2025-09-15 11:08:48.983 | [Mon Sep 15 14:08:48 2025] [::ffff:172.19.0.1]:44212 Accepted
adminer | 2025-09-15 11:08:48.984 | [Mon Sep 15 14:08:48 2025] [::ffff:172.19.0.1]:44212 [200]: POST /?server=&script=version
adminer | 2025-09-15 11:08:48.984 | [Mon Sep 15 14:08:48 2025] [::ffff:172.19.0.1]:44212 Closing
adminer | 2025-09-15 11:08:54.550 | [Mon Sep 15 14:08:54 2025] [::1]:35808 Accepted
adminer | 2025-09-15 11:08:54.561 | [Mon Sep 15 14:08:54 2025] [::1]:35808 [200]: GET /
adminer | 2025-09-15 11:08:54.561 | [Mon Sep 15 14:08:54 2025] [::1]:35808 Closing
app     | 2025-09-15 11:08:56.584 | [LOGGER] Flushing 16 log entries
app     | 2025-09-15 11:08:56.584 | [LOGGER] Flushing 16 log entries
adminer | 2025-09-15 11:09:07.508 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50680 Accepted
adminer | 2025-09-15 11:09:07.510 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50680 [302]: POST /
adminer | 2025-09-15 11:09:07.510 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50680 Closing
adminer | 2025-09-15 11:09:07.510 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50682 Accepted
adminer | 2025-09-15 11:09:07.529 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50682 [302]: GET /?pgsql=db&username=sienge_app&db=sienge_dev
adminer | 2025-09-15 11:09:07.529 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50682 Closing
adminer | 2025-09-15 11:09:07.553 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50696 Accepted
adminer | 2025-09-15 11:09:07.596 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50696 [200]: GET /?pgsql=db&username=sienge_app&db=sienge_dev&ns=public
adminer | 2025-09-15 11:09:07.596 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50696 Closing
adminer | 2025-09-15 11:09:07.597 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50698 Accepted
adminer | 2025-09-15 11:09:07.619 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50698 [200]: GET /?pgsql=db&username=sienge_app&db=sienge_dev&ns=public&script=db
adminer | 2025-09-15 11:09:07.619 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50698 Closing
adminer | 2025-09-15 11:09:07.619 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50700 Accepted
adminer | 2025-09-15 11:09:07.629 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50700 [200]: GET /?file=jush.js&version=5.4.0
adminer | 2025-09-15 11:09:07.630 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50700 Closing
adminer | 2025-09-15 11:09:07.684 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50706 Accepted
adminer | 2025-09-15 11:09:07.692 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50706 [200]: GET /?file=jush.js&version=5.4.0
adminer | 2025-09-15 11:09:07.692 | [Mon Sep 15 14:09:07 2025] [::ffff:172.19.0.1]:50706 Closing
adminer | 2025-09-15 11:09:09.605 | [Mon Sep 15 14:09:09 2025] [::1]:54386 Accepted
adminer | 2025-09-15 11:09:09.606 | [Mon Sep 15 14:09:09 2025] [::1]:54386 [200]: GET /
adminer | 2025-09-15 11:09:09.606 | [Mon Sep 15 14:09:09 2025] [::1]:54386 Closing
adminer | 2025-09-15 11:09:11.953 | [Mon Sep 15 14:09:11 2025] [::ffff:172.19.0.1]:57106 Accepted
adminer | 2025-09-15 11:09:12.080 | [Mon Sep 15 14:09:12 2025] [::ffff:172.19.0.1]:57106 [200]: GET /?pgsql=db&username=sienge_app&db=sienge_dev&ns=public&select=clientes
adminer | 2025-09-15 11:09:12.080 | [Mon Sep 15 14:09:12 2025] [::ffff:172.19.0.1]:57106 Closing
adminer | 2025-09-15 11:09:12.080 | [Mon Sep 15 14:09:12 2025] [::ffff:172.19.0.1]:57114 Accepted
adminer | 2025-09-15 11:09:27.286 | [Mon Sep 15 14:09:27 2025] [::1]:43562 Accepted
adminer | 2025-09-15 11:09:27.436 | [Mon Sep 15 14:09:27 2025] [::1]:43562 [200]: GET /
adminer | 2025-09-15 11:09:27.436 | [Mon Sep 15 14:09:27 2025] [::1]:43562 Closing
adminer | 2025-09-15 11:09:42.476 | [Mon Sep 15 14:09:42 2025] [::1]:41628 Accepted
adminer | 2025-09-15 11:09:42.478 | [Mon Sep 15 14:09:42 2025] [::1]:41628 [200]: GET /
adminer | 2025-09-15 11:09:42.478 | [Mon Sep 15 14:09:42 2025] [::1]:41628 Closing