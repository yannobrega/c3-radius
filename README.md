# C3 RADIUS v6

Painel Next.js para administração do FreeRADIUS / MariaDB.

## V6
- Consolida registros duplicados que compartilham o mesmo `Acct-Session-Id`.
- Dashboard conta sessões lógicas, não linhas cruas de `radacct`.
- Sessões usam atividade recente (`Acct-Update-Time`) para status online.
- Site/NAS mostra nome cadastrado e IP do NAS separadamente.
- IP do dispositivo continua vindo de `Framed-IP-Address`.
- Ao "Marcar encerrada", todos os registros abertos do mesmo `Acct-Session-Id` são fechados no histórico.
- Mantém aviso explícito: encerrar accounting não envia CoA/Disconnect ao dispositivo.

Configure `SESSION_FRESH_MINUTES=15` (ou outro valor >=5). Com Interim-Update de 300s no UniFi, 15 min é uma margem segura.
