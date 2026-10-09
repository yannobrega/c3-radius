import type { PoolConnection } from 'mysql2/promise';
export async function validGroups(c:PoolConnection):Promise<string[]>{
 const [rows]=await c.query<any[]>(`SELECT DISTINCT groupname FROM (SELECT groupname FROM radgroupcheck UNION SELECT groupname FROM radgroupreply) groups ORDER BY groupname`);
 return rows.map(x=>String(x.groupname));
}
export function groupError(group:string, groups:string[]):string|null {
 if(!group || groups.includes(group))return null;
 return `Perfil/grupo inexistente: "${group}". Grupos disponíveis: ${groups.length?groups.join(', '):'nenhum grupo cadastrado'}.`;
}
