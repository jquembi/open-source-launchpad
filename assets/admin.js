(()=>{
'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let token='';
async function refresh(){
 try{
  const r=await fetch('/api/admin/entries',{headers:{authorization:'Bearer '+token}});
  if(!r.ok)throw Error('Acesso recusado ou serviço indisponível');
  const {entries=[]}=await r.json();
  $('#info').textContent=entries.length+' publicações encontradas.';
  $('#moderation').innerHTML=entries.map(e=>`<article class="entry"><div class="meta"><span class="pill ${e.type==='need'?'need':''}">${e.type==='need'?'Pedido':'Oferta'}</span><span class="location">${esc(e.status)}</span></div><h3>${esc(e.title)}</h3><p>${esc(e.description)}</p><p>${esc(e.municipality)}, ${esc(e.province)} · ${esc(e.category)}</p><p><strong>Contacto privado:</strong> ${esc(e.contact)}</p><div class="toolbar"><button class="button primary" data-id="${esc(e.id)}" data-status="approved">Aprovar</button><button class="button secondary" data-id="${esc(e.id)}" data-status="rejected">Rejeitar</button><button class="button tertiary" data-id="${esc(e.id)}" data-status="closed">Fechar</button></div></article>`).join('');
 }catch(err){$('#info').textContent=err.message;$('#moderation').replaceChildren()}
}
$('#login').addEventListener('submit',e=>{e.preventDefault();token=$('#token').value;$('#token').value='';refresh()});
$('#moderation').addEventListener('click',async e=>{
 const button=e.target.closest('button[data-status]');
 if(!button)return;
 button.disabled=true;
 try{
  const r=await fetch('/api/admin/entries/'+encodeURIComponent(button.dataset.id),{method:'PATCH',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify({status:button.dataset.status})});
  if(!r.ok)throw Error('Operação não autorizada ou inválida');
  await refresh();
 }catch(err){$('#info').textContent=err.message;button.disabled=false}
});
})();