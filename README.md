# C3 RADIUS v2
Painel moderno da C3 Support para administrar o schema SQL padrão do FreeRADIUS.

## EasyPanel
Build: Dockerfile • porta interna: 3000.

### Environment
DB_HOST=portalc3_radius-db
DB_PORT=3306
DB_NAME=radius
DB_USER=radius
DB_PASSWORD=<senha>
ADMIN_USER=admin
ADMIN_PASSWORD=<senha forte>
AUTH_SECRET=<32+ bytes aleatórios>

## Logo C3 Support
Adicione a logo PNG oficial em `public/c3-logo.png`. O painel já está preparado para carregá-la automaticamente. Se não houver PNG, um fallback C3 SUPPORT é exibido.

## Compatibilidade
Escreve diretamente em `radcheck`, `radreply`, `radusergroup`, `nas` e lê `radacct`, `radpostauth`, `radgroupcheck` e `radgroupreply`. Pode coexistir com daloRADIUS.

## Segurança
Não publique o MariaDB. Mantenha DB_PASSWORD, ADMIN_PASSWORD e AUTH_SECRET apenas nas variáveis de runtime do EasyPanel.
