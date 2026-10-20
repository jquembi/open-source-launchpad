const JSON_HEADERS = {'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'};
const ok = (payload,status=200) => new Response(JSON.stringify(payload),{status,headers:JSON_HEADERS});
const valid = (x,max) => typeof x === 'string' && x.trim().length>0 && x.trim().length<=max;
const clip = (x,max) => String(x??'').trim().slice(0,max);
const categories = ['Alimentação','Educação','Saúde','Emprego','Habitação','Transporte','Outros'];
const cors = (response, origin, site) => {
  if (site && origin===site) response.headers.set('access-control-allow-origin',site);
  response.headers.set('vary','Origin'); return response;
};
export default {
 async fetch(request,env) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
  const origin = request.headers.get('origin');
  const site = url.origin;
  if (origin && origin!==site) return ok({error:'Origem não permitida'},403);
  const respond = (obj,status) => cors(ok(obj,status),origin,site);
  if (!env.DB) return respond({error:'Base de dados não configurada'},503);
  if (request.method==='GET' && url.pathname==='/api/health') return respond({ok:true});
  if (request.method==='GET' && url.pathname==='/api/entries') {
   const rows=await env.DB.prepare("SELECT id,type,title,description,category,province,municipality,created_at FROM entries WHERE status='approved' ORDER BY created_at DESC LIMIT 150").all();
   return respond({entries:rows.results});
  }
  if (request.method==='POST' && url.pathname==='/api/entries') {
   if (Number(request.headers.get('content-length')||0)>6000) return respond({error:'Pedido demasiado grande'},413);
   let data;try {data=await request.json()}catch{return respond({error:'JSON inválido'},400)}
   if (!data || !['need','offer'].includes(data.type) ||
      !valid(data.title,90) || !valid(data.description,1200) ||
      !categories.includes(data.category) ||
      !valid(data.province,80) || !valid(data.municipality,80) ||
      !valid(data.contact,150) || data.contact_consent!==true)
       return respond({error:'Preencha os campos e aceite o consentimento para contacto.'},422);
   const id=crypto.randomUUID();
   await env.DB.prepare("INSERT INTO entries (id,type,title,description,category,province,municipality,contact,contact_consent) VALUES (?,?,?,?,?,?,?,?,1)")
     .bind(id,data.type,clip(data.title,90),clip(data.description,1200),data.category,clip(data.province,80),clip(data.municipality,80),clip(data.contact,150)).run();
   return respond({id,status:'pending',message:'Registo recebido. Aguarda moderação.'},201);
  }
  if (url.pathname.startsWith('/api/admin/')) {
   const auth=request.headers.get('authorization');
   if (!env.ADMIN_TOKEN || auth!==`Bearer ${env.ADMIN_TOKEN}`) return respond({error:'Não autorizado'},401);
   if(request.method==='GET' && url.pathname==='/api/admin/entries') {
    const rows=await env.DB.prepare("SELECT * FROM entries ORDER BY created_at DESC LIMIT 200").all();
    return respond({entries:rows.results});
   }
   const match=url.pathname.match(/^\/api\/admin\/entries\/([0-9a-f-]{36})$/);
   if(request.method==='PATCH' && match){
    let body;try{body=await request.json()}catch{return respond({error:'JSON inválido'},400)}
    if(!['approved','rejected','closed'].includes(body.status))return respond({error:'Estado inválido'},422);
    const result=await env.DB.prepare("UPDATE entries SET status=?,reviewed_at=datetime('now') WHERE id=?").bind(body.status,match[1]).run();
    return respond({updated:result.meta.changes>0});
   }
  }
  return respond({error:'Rota não encontrada'},404);
 }
};