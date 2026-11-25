(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var isMobile=function(){return window.innerWidth<=720};

/* ---------- Formulaire en 2 étapes ---------- */
var steps=$$('[data-step]');
function showStep(n){steps.forEach(function(el){el.hidden=el.getAttribute('data-step')!==String(n)})}
$$('[data-next]').forEach(function(b){b.addEventListener('click',function(){showStep(2)})});
$$('[data-back]').forEach(function(b){b.addEventListener('click',function(){showStep(1)})});
$$('[data-submit]').forEach(function(b){b.addEventListener('click',function(){showStep(3)})});
$$('[data-back-all]').forEach(function(b){b.addEventListener('click',function(){showStep(1)})});
$$('.pick').forEach(function(p){p.addEventListener('click',function(){
  $$('.pick').forEach(function(q){q.classList.remove('on');q.setAttribute('aria-pressed','false')});
  p.classList.add('on');p.setAttribute('aria-pressed','true');
})});

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

/* ---------- Carrousel « Ce qui est inclus » ---------- */
var view=$('[data-pb-view]'),track=$('[data-pb-track]');
if(view&&track){
  var N=$$('.pbc',track).length,idx=0,prev=$('[data-pb-prev]'),next=$('[data-pb-next]'),count=$('[data-pb-count]');
  var vis=function(){return isMobile()?1:2};
  var render=function(){
    var v=vis(),max=N-v;idx=Math.max(0,Math.min(max,idx));
    track.style.transform='translateX(calc(-1 * '+idx+' * ((100% - var(--n) * var(--gap) - var(--peek)) / var(--n) + var(--gap))))';
    prev.classList.toggle('off',idx<=0);next.classList.toggle('off',idx>=max);
    count.textContent=v===1?(idx+1)+' / '+N:(idx+1)+'–'+(idx+2)+' sur '+N;
  };
  var go=function(d){idx+=d;render()};
  prev.addEventListener('click',function(){go(-1)});
  next.addEventListener('click',function(){go(1)});
  var tx=null;
  view.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
  view.addEventListener('touchend',function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>40)go(dx<0?1:-1);tx=null});
  window.addEventListener('resize',render);
  render();
}

/* ---------- Bouton WhatsApp flottant ---------- */
var wa=$('[data-wa]');
if(wa){
  var onScroll=function(){wa.classList.toggle('show',window.scrollY>600)};
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
}

/* ---------- Apparition au défilement ---------- */
if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  var targets=$$('.sec .wrap > *, .proof .pitem, .sec .grid3 > *, .sec .steps > *, .sec .events > *');
  var seen=[];
  targets.forEach(function(el){
    if(el.closest('.hero')||seen.indexOf(el)>-1)return;seen.push(el);
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
