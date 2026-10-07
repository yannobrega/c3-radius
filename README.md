# C3 RADIUS
Painel moderno e compatível com o schema SQL padrão do FreeRADIUS.

## EasyPanel
Crie um App via Git ou faça upload deste projeto. Build: Dockerfile. Porta: 3000.

### Environment
DB_HOST=portalc3_radius-db
DB_PORT=3306
DB_NAME=radius
DB_USER=radius
DB_PASSWORD=<senha atual do usuário radius>
ADMIN_USER=admin
ADMIN_PASSWORD=<senha forte>
AUTH_SECRET=<string aleatória com 32+ bytes>

## Compatibilidade
O app escreve diretamente nas tabelas `radcheck`, `radreply`, `radusergroup`, `nas` e lê `radacct`/`radpostauth`. Não substitui o FreeRADIUS e pode coexistir com daloRADIUS.

## Importante
Após adicionar/alterar/remover um NAS, reinicie/recarregue o FreeRADIUS para que clients SQL sejam relidos, conforme a configuração atual `read_clients = yes`.
