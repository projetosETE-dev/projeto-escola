const r=document.documentElement;
try{const t=localStorage.getItem('tema');if(t)r.dataset.theme=t}catch(e){}
document.querySelector('.tema').addEventListener('click',()=>{
  const t=r.dataset.theme==='dark'?'light':'dark';r.dataset.theme=t;
  try{localStorage.setItem('tema',t)}catch(e){}
});
/* formulários simples (contato) */
document.querySelectorAll('form:not([data-custom])').forEach(f=>f.addEventListener('submit',e=>{
  e.preventDefault();const m=f.parentElement.querySelector('.msg');
  m.textContent=f.dataset.ok;m.hidden=false;f.reset();
}));
const tx=document.querySelector('textarea'),ct=document.getElementById('cont');
if(tx&&ct)tx.addEventListener('input',()=>ct.textContent=tx.value.length+'/500');
/* mostrar/ocultar senha */
document.querySelectorAll('.ver').forEach(v=>v.addEventListener('click',()=>{
  const s=document.getElementById(v.dataset.alvo),o=s.type==='password';
  s.type=o?'text':'password';v.textContent=o?'Ocultar senha':'Mostrar senha';
}));
/* login + registro na mesma página */
const abas=document.querySelectorAll('.abas button');
if(abas.length){
  const $=id=>document.getElementById(id);
  const aviso=(p,t)=>{const m=$(p).querySelector('.msg');m.textContent=t;m.hidden=false};
  const abrir=id=>{
    abas.forEach(b=>{const on=b.dataset.p===id;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1});
    document.querySelectorAll('.painel').forEach(p=>{p.hidden=p.id!==id;p.querySelectorAll('.msg,.erro').forEach(m=>m.hidden=true)});
  };
  abas.forEach(b=>b.addEventListener('click',()=>abrir(b.dataset.p)));
  document.querySelectorAll('[data-abrir]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();abrir(a.dataset.abrir)}));
  if(location.hash==='#cadastro')abrir('p-cadastro');
  const rot=['Muito fraca','Fraca','Média','Boa','Forte'];
  $('nsenha').addEventListener('input',e=>{
    const v=e.target.value;
    const n=v?(v.length>=8)+/[A-Z]/.test(v)+/\d/.test(v)+/[^A-Za-z0-9]/.test(v):0;
    const f=document.querySelector('.forca');f.dataset.n=n;
    f.firstElementChild.style.width=(v?Math.max(n,1)*25:0)+'%';
    $('ftxt').textContent=v?'Força: '+rot[n]:'Use 8+ caracteres, maiúscula, número e símbolo.';
  });
  $('f-entrar').addEventListener('submit',e=>{
    e.preventDefault();aviso('p-entrar','Bem-vindo(a)! (Demonstração: sem conexão com o sistema acadêmico.)');
  });
  $('f-cadastro').addEventListener('submit',e=>{
    e.preventDefault();const er=document.querySelector('#p-cadastro .erro'),s=$('nsenha').value;
    const falha=s.length<6?'A senha precisa ter ao menos 6 caracteres.':s!==$('csenha').value?'As senhas não coincidem.':'';
    if(falha){er.textContent=falha;er.hidden=false;$(s.length<6?'nsenha':'csenha').focus();return}
    const nome=$('nome').value.split(' ')[0],mail=$('nemail').value;
    e.target.reset();$('nsenha').dispatchEvent(new Event('input'));
    abrir('p-entrar');$('usuario').value=mail;$('senha').focus();
    aviso('p-entrar','Conta criada, '+nome+'! Agora é só entrar com sua senha. (Demonstração: nada foi salvo.)');
  });
}

/* ===== animações: rolagem e clique ===== */
const io=new IntersectionObserver(es=>es.forEach(en=>{
  if(en.isIntersecting){en.target.classList.add('vis');io.unobserve(en.target)}
}),{threshold:.12});
document.querySelectorAll('main>section,main>article,#motivos>div>div').forEach(el=>{
  el.classList.add('rev');
  if(el.matches('#motivos>div>div'))el.style.setProperty('--d',[...el.parentElement.children].indexOf(el)*.12+'s');
  io.observe(el);
});
document.addEventListener('click',e=>{
  const b=e.target.closest('.btn,button:not(.ver)');if(!b)return;
  const rc=b.getBoundingClientRect(),d=Math.max(rc.width,rc.height)*2,o=document.createElement('span');
  const x=e.detail?e.clientX-rc.left:rc.width/2,y=e.detail?e.clientY-rc.top:rc.height/2;
  o.className='onda';o.style.cssText=`width:${d}px;height:${d}px;left:${x-d/2}px;top:${y-d/2}px`;
  b.appendChild(o);o.addEventListener('animationend',()=>o.remove());
});
const hd=document.querySelector('header'),topo=document.createElement('button');
topo.className='topo';topo.type='button';topo.setAttribute('aria-label','Voltar ao topo');topo.textContent='↑';
document.body.appendChild(topo);
topo.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
addEventListener('scroll',()=>{hd.classList.toggle('compacto',scrollY>20);topo.classList.toggle('mostra',scrollY>400)},{passive:true});
