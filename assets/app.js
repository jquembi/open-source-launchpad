(() => {
'use strict';
const $=s=>document.querySelector(s);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categories=['Alimentação','Educação','Saúde','Emprego','Habitação','Transporte','Outros'];
let entries=[];
$('#year').textContent=new Date().getFullYear();
const affiliate=window.LAUNCHPAD_CONFIG?.hostingerAffiliateUrl;
if(typeof affiliate==='string' && /^https:\/\//.test(affiliate)) $('#hostinger-link').href=affiliate;
const filter=$('#category-filter');
for(const c of categories){const option=document.createElement('option');option.value=c;option.textContent=c;filter.appendChild(option)}
function render(){
 const query=$('#search').value.toLocaleLowerCase('pt').trim();
 const type=$('#type-filter').value,category=filter.value;
 const matching=entries.filter(e=>(type==='all'||e.type===type)&&(category==='all'||e.category===category)&&[e.title,e.description,e.category,e.province,e.municipality].join(' ').toLocaleLowerCase('pt').includes(query));
 $('#entries').innerHTML=matching.map(e=>`<article class="entry"><div class="meta"><span class="pill ${e.type==='need'?'need':''}">${e.type==='need'?'Pedido de apoio':'Oferta de ajuda'}</span><span class="location">⌖ ${esc(e.municipality)}, ${esc(e.province)}</span></div><h3>${esc(e.title)}</h3><p>${esc(e.description)}</p><div class="category">${esc(e.category)} · Publicação moderada</div></article>`).join('');
 $('#empty').hidden=matching.length!==0;
}
async function load(){
 try {
  const response=await fetch('/api/entries',{headers:{accept:'application/json'}});
  if(!response.ok)throw Error('A plataforma ainda não está ligada à base de dados.');
  const payload=await response.json();entries=Array.isArray(payload.entries)?payload.entries:[];
  $('#load-status').textContent=entries.length?`${entries.length} publicação(ões) disponível(eis)`:'Ainda não existem publicações aprovadas.';
  render();
 } catch(error){
  $('#load-status').textContent='Não foi possível carregar as publicações: '+error.message;
  $('#entries').replaceChildren();
  $('#empty').hidden=true;
 }
}
$('#search').addEventListener('input',render);
$('#type-filter').addEventListener('change',render);
filter.addEventListener('change',render);
$('#entry-form').addEventListener('submit',async event=>{
 event.preventDefault();
 const form=event.currentTarget;
 if(!form.reportValidity())return;
 const data=new FormData(form);
 const payload={type:data.get('type'),title:data.get('title'),description:data.get('description'),category:data.get('category'),province:data.get('province'),municipality:data.get('municipality'),contact:data.get('contact'),contact_consent:data.get('contact_consent')==='on'};
 const button=$('#submit'),message=$('#form-message');
 button.disabled=true;button.textContent='A enviar…';message.textContent='';
 try{
  const response=await fetch('/api/entries',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
  const result=await response.json();
  if(!response.ok)throw Error(result.error||'Falha ao enviar');
  form.reset();message.style.color='#15745e';message.textContent='Recebido! A sua publicação está pendente de aprovação. Guarde o código: '+result.id;
 }catch(err){message.style.color='#b33b35';message.textContent='Não foi possível enviar: '+err.message}
 finally{button.disabled=false;button.textContent='Enviar para moderação ↗'}
});
load();
})();