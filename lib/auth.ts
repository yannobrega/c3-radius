import { SignJWT, jwtVerify } from 'jose'; import { cookies } from 'next/headers';
const key=()=>new TextEncoder().encode(process.env.AUTH_SECRET||'change-me');
export async function setSession(user:string){const token=await new SignJWT({user}).setProtectedHeader({alg:'HS256'}).setExpirationTime('12h').sign(key());(await cookies()).set('c3r_session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:43200});}
export async function getSession(){try{const t=(await cookies()).get('c3r_session')?.value;if(!t)return null;return (await jwtVerify(t,key())).payload}catch{return null}}
export async function clearSession(){(await cookies()).delete('c3r_session')}
