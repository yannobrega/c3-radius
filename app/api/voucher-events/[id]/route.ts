import {db} from '../../../../lib/db';
import {ensureVoucherTables} from '../../../../lib/vouchers';
export async function DELETE(_req:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 if(!/^\d+$/.test(id))return Response.json({error:'Evento inválido.'},{status:400});
 await ensureVoucherTables();
 const c=await db.getConnection();
 try{
  await c.beginTransaction();
  const [events]=await c.query<any[]>('SELECT id,name FROM c3_events WHERE id=? FOR UPDATE',[id]);
  if(!events.length){await c.rollback();return Response.json({error:'Evento não encontrado.'},{status:404})}
  const [vouchers]=await c.query<any[]>('SELECT username FROM c3_vouchers WHERE event_id=? FOR UPDATE',[id]);
  // Exclui apenas credenciais efetivamente vinculadas a este evento. Mantém radacct/radpostauth para auditoria.
  for(const v of vouchers){
   await c.query('DELETE FROM radusergroup WHERE username=?',[v.username]);
   await c.query('DELETE FROM radreply WHERE username=?',[v.username]);
   await c.query('DELETE FROM radcheck WHERE username=?',[v.username]);
  }
  await c.query('DELETE FROM c3_vouchers WHERE event_id=?',[id]);
  await c.query('DELETE FROM c3_events WHERE id=?',[id]);
  await c.commit();
  return Response.json({message:`Evento excluído e ${vouchers.length} credenciais removidas. O histórico de accounting foi preservado.`,redirect:'/voucher-events'});
 }catch(e){await c.rollback();return Response.json({error:'Falha ao excluir o evento. Nenhuma alteração foi aplicada.'},{status:500})}finally{c.release()}
}
