(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var isMobile=function(){return window.innerWidth<=720};

/* ---------- Formulaire en 3 étapes ---------- */
var steps=$$('[data-step]');
function showStep(n){steps.forEach(function(el){el.hidden=el.getAttribute('data-step')!==String(n)})}
var cur=1;
$$('[data-next]').forEach(function(b){b.addEventListener('click',function(){cur=Math.min(3,cur+1);showStep(cur)})});
$$('[data-back]').forEach(function(b){b.addEventListener('click',function(){cur=Math.max(1,cur-1);showStep(cur)})});
$$('[data-submit]').forEach(function(b){b.addEventListener('click',function(){cur=4;showStep(4)})});
$$('[data-back-all]').forEach(function(b){b.addEventListener('click',function(){cur=1;showStep(1)})});
$$('.pick').forEach(function(p){p.addEventListener('click',function(){
  $$('.pick').forEach(function(q){q.classList.remove('on');q.setAttribute('aria-pressed','false')});
  p.classList.add('on');p.setAttribute('aria-pressed','true');
})});
/* Compteurs (chambres, couchages, salles de bains) */
$$('[data-stepper]').forEach(function(st){
  var val=$('[data-val]',st),min=Number(st.getAttribute('data-min')),max=Number(st.getAttribute('data-max'));
  var set=function(d){val.textContent=Math.max(min,Math.min(max,Number(val.textContent)+d))};
  $('[data-dec]',st).addEventListener('click',function(){set(-1)});
  $('[data-inc]',st).addEventListener('click',function(){set(1)});
});

/* ---------- Formules : courte durée / bail mobilité ---------- */
var tabs=$$('[data-tab]');
tabs.forEach(function(t){t.addEventListener('click',function(){
  tabs.forEach(function(o){var on=o===t;o.classList.toggle('on',on);o.setAttribute('aria-selected',on?'true':'false')});
  $$('[data-panel]').forEach(function(p){p.hidden=p.getAttribute('data-panel')!==t.getAttribute('data-tab')});
})});

/* ---------- Simulateur ---------- */
var sim=$('.sim');
if(sim){
  var PRICES=[106,125,145,165,185,205,224,244,264,284,304,323];
  var RATES={Smart:[24,22,20],Essentiel:[20,18,16]};
  var st={sc:4,sn:200,sd:0,sf:'Smart'};
  var fmt=function(n){return Math.round(n).toLocaleString('fr-FR').replace(/[\u202f\u00a0]/g,' ')};
  var out=function(k,v){$$('[data-o="'+k+'"]',sim).forEach(function(e){e.textContent=v})};
  var calc=function(){
    var price=PRICES[st.sc-1],gross=price*st.sn,rate=RATES[st.sf][st.sd],com=gross*rate/100,net=gross-com,gain=net-net/1.3;
    $('[data-sc-label]',sim).textContent=st.sc+(st.sc>1?' couchages':' couchage');
    $$('[data-sn]',sim).forEach(function(e){e.textContent=st.sn});
    out('price',fmt(price));out('gross',fmt(gross));out('rate',rate);out('com',fmt(com));out('net',fmt(net));out('gain',fmt(gain));
  };
  $('[data-sc-dec]',sim).addEventListener('click',function(){st.sc=Math.max(1,st.sc-1);calc()});
  $('[data-sc-inc]',sim).addEventListener('click',function(){st.sc=Math.min(12,st.sc+1);calc()});
  $('[data-sn-range]',sim).addEventListener('input',function(e){st.sn=Number(e.target.value);calc()});
  var group=function(attr,apply){
    var bs=$$('['+attr+']',sim);
    bs.forEach(function(b){b.addEventListener('click',function(){
      bs.forEach(function(o){o.classList.toggle('on',o===b)});apply(b.getAttribute(attr));calc();
    })});
  };
  group('data-sd',function(v){st.sd=Number(v)});
  group('data-sf',function(v){st.sf=v});
  calc();
}

/* ---------- FAQ ---------- */
$$('.qbtn').forEach(function(btn){btn.addEventListener('click',function(){
  var qa=btn.parentNode,open=qa.classList.contains('open');
  $$('.qa.open').forEach(function(o){o.classList.remove('open');$('.qbtn',o).setAttribute('aria-expanded','false')});
  if(!open){qa.classList.add('open');btn.setAttribute('aria-expanded','true')}
})});
var first=$('.qa');if(first){first.classList.add('open');$('.qbtn',first).setAttribute('aria-expanded','true')}

/* ---------- Comparateur avant / après ---------- */
var cmp=$('.cmp');
if(cmp){
  var range=$('[data-cmp-range]',cmp),before=$('[data-cmp-before]',cmp),lines=$$('[data-cmp-line]',cmp);
  var setPos=function(p){before.style.clipPath='inset(0 '+(100-p)+'% 0 0)';lines.forEach(function(l){l.style.left=p+'%'})};
  range.addEventListener('input',function(){cmp.classList.add('touched');setPos(Number(range.value))});
  setPos(50);
}

/* ---------- Bouton WhatsApp flottant ---------- */
var wa=$('[data-wa]');
if(wa){
  var onScroll=function(){wa.classList.toggle('show',window.scrollY>600)};
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
}

/* ---------- Apparition au défilement ---------- */
if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  var targets=$$('.sec .wrap > *, .proof .pitem, .sec .grid3 > *, .sec .steps > *, .sec .events > *, .path > *, .svcgrid > *, .rvgrid > *, .qgrid > *, .feelist > *, .advs > *, .pstable .psr');
  var seen=[];
  targets.forEach(function(el){
    if(el.closest('.hero')||el.hasAttribute('data-panel')||el.classList.contains('path')||seen.indexOf(el)>-1)return;seen.push(el);
    el.classList.add('rv');
    var sib=el.parentNode.children,i=Array.prototype.indexOf.call(sib,el);
    el.style.setProperty('--d',(Math.min(i,5)*0.07)+'s');
  });
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
  },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
  seen.forEach(function(el){io.observe(el)});
}
})();
