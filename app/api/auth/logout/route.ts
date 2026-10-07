import{clearSession}from'../../../../lib/auth';import{seeOther}from'../../../../lib/http';export async function POST(){await clearSession();return seeOther('/login')}
