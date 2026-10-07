export function seeOther(path:string){return new Response(null,{status:303,headers:{Location:path}})}
