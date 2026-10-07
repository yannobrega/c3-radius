import {setSession} from '../../../../lib/auth';import{seeOther}from'../../../../lib/http';
export async function POST(r:Request){const f=await r.formData();if(f.get('username')!==process.env.ADMIN_USER||f.get('password')!==process.env.ADMIN_PASSWORD)return seeOther('/login?error=1');await setSession(String(f.get('username')));return seeOther('/')}
