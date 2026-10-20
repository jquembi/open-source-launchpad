import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';
const request = (method,path,body,headers={}) => new Request('https://community.example'+path,{method,headers:{'content-type':'application/json',...headers},...(body?{body:JSON.stringify(body)}:{})});
const env={ASSETS:{fetch:async()=>new Response('SITE')},ADMIN_TOKEN:'example-secret',DB:{
 prepare(sql){return {
  bind(...params){return {run:async()=>({meta:{changes:1},params})}},
  all:async()=>({results:[]})
 }}}
}};
const payload={type:'need',title:'Livros escolares',description:'Procuro manuais para estudar no ensino secundário.',category:'Educação',province:'Huíla',municipality:'Lubango',contact:'pessoa@example.org',contact_consent:true};
test('public listing returns a list',async()=>{const res=await worker.fetch(request('GET','/api/entries'),env);assert.equal(res.status,200);assert.deepEqual((await res.json()).entries,[])});
test('submission requires consent',async()=>{const res=await worker.fetch(request('POST','/api/entries',{...payload,contact_consent:false}),env);assert.equal(res.status,422)});
test('valid request enters the moderation queue',async()=>{const res=await worker.fetch(request('POST','/api/entries',payload),env);assert.equal(res.status,201);assert.equal((await res.json()).status,'pending')});
test('admin listing requires authentication',async()=>{const res=await worker.fetch(request('GET','/api/admin/entries'),env);assert.equal(res.status,401)});
test('admin can retrieve moderation list',async()=>{const res=await worker.fetch(request('GET','/api/admin/entries',null,{authorization:'Bearer example-secret'}),env);assert.equal(res.status,200)});
test('unauthorised origins are rejected',async()=>{const res=await worker.fetch(request('POST','/api/entries',payload,{origin:'https://attacker.example'}),env);assert.equal(res.status,403)});
