var _Mathfloor=Math.floor,_NumberisInteger=Number.isInteger;'serviceWorker'in navigator&&navigator.serviceWorker.register('/sw.js').then(function(a){a.onupdatefound=function(){var c=a.installing;c.onstatechange=function(){switch(c.state){case'installed':if(navigator.serviceWorker.controller){var g=document.createElement('div');g.classList.add('sw-notice'),g.setAttribute('data-sw','updated'),g.setAttribute('role','status'),g.setAttribute('aria-live','polite'),g.textContent='Content has been added or updated, refresh to get it!',document.body.appendChild(g)}else{var h=document.createElement('div');h.classList.add('sw-notice'),h.setAttribute('data-sw','offline'),h.setAttribute('role','status'),h.setAttribute('aria-live','polite'),h.textContent='Content is now available offline!',document.body.appendChild(h)}break;case'redundant':console.error('Redundant ServiceWorker');}}}}).catch(function(b){console.error('Error during service worker registration:',b)});var Options=class{constructor(a={}){this.options=a,this._find=(b,c,d)=>{const g=c.split('.'),h=g[0];return b.hasOwnProperty(c)?b[c]:b.hasOwnProperty(h)?'object'==typeof b[h]?(g.shift(),this._find(b[h],g.join('.'),d)):b[h]:d}}get(a,b){return this._find(this.options,a,b)}};function nodeMap(a,b){return Array.prototype.map.call(a,b)}function idleRun(a){if('requestIdleCallback'in window)window.requestIdleCallback(a);else{const b=Date.now();return setTimeout(()=>{a({didTimeout:!1,timeRemaining:()=>{return Math.max(0,50-(Date.now()-b))}})},1)}}function getActiveSlide(){const a=location.hash.split('/');return a.shift(),{section:parseInt(a[0]),slide:parseInt(a[1]),fragment:parseInt(a[2])}}var Matrix=class{constructor(){const a=document.currentScript.src.split('?'),b=a[0];let c={};1<a.length&&(c=buildOptions(a[1])),document.location.search&&(c=buildOptions(document.location.search.substr(1))),this._script=b,this._options=c,this._notes=!1,this._raw={stage:document.querySelector('._stage'),groups:document.querySelectorAll('._stage--group'),slides:document.querySelectorAll('._stage--slide')},this._slides=nodeMap(this._raw.groups,(h)=>{const l=h.querySelectorAll('._stage--slide');return nodeMap(l,(m)=>{const n=m.querySelectorAll('.fragment');return 0===n.length?m:[m].concat(nodeMap(n,(q)=>q))})});const d=document.createElement('div'),g=this._raw.stage;d.classList.add('stage-fright'),g.parentNode.replaceChild(d,g),d.appendChild(g)}get slides(){return this._slides}get stage(){return this._raw.stage}get script(){return this._script}get options(){return this._options}get notes(){return this._notes}set notes(a){return this._notes=a,a}};function buildOptions(a,b){let c=b||{};if(a){const d=`{"${decodeURI(a).replace(/&/g,'","').replace(/=/g,'":"')}"}`,g=JSON.parse(d,(h,l)=>{if(parseFloat(l).toString()===l)return parseFloat(l);try{return JSON.parse(l)}catch(m){return l}return l});c=Object.assign(g,c)}return c}var init=function(){const a=getActiveSlide();(isNaN(a.section)||isNaN(a.slide))&&history.pushState(null,null,`#/${0}/${0}`)},translate=function(a,b,c){const d=document.querySelector('._stage');let g=a,h=b;if(!(a&&b)&&0!==a&&0!==b){const n=getActiveSlide();a||(g=n.section),b||(h=n.slide)}const m=document.querySelector(`[data-slide="${h}"][data-section="${g}"]`).querySelectorAll('.fragment');for(let n=0;n<c;n++)m[n].setAttribute('data-active',!0);d.style.transform=`translateX(${-100*g}vw) translateY(${-100*h}vh)`},nav=class{static next(a){const c=getActiveSlide();let d=c.section,g=c.slide,h=c.fragment;return next(d,g,h,a)}static previous(a){const c=getActiveSlide();let d=c.section,g=c.slide,h=c.fragment;return previous(d,g,h,a)}static left(a){const c=getActiveSlide();let d=c.section,g=c.slide,h=c.fragment;return left(d,g,h,a)}static right(a){const c=getActiveSlide();let d=c.section,g=c.slide,h=c.fragment;return right(d,g,h,a)}static move(a,b,c){return translate(a,b,c)}};function move(a){let b=`#/${a.section}/${a.slide}`;const c=document.querySelector(`[data-slide="${a.slide}"][data-section="${a.section}"]`).querySelectorAll('.fragment[data-active]').length;isNaN(a.fragment)?(updateProgress(a.section,a.slide),translate(a.section,a.slide),0!==c&&(updateProgress(a.section,a.slide,c),a.fragment=c,b+=`/${c}`)):(updateProgress(a.section,a.slide,a.fragment),0!==a.fragment&&(b+=`/${a.fragment}`));const d=a.matrix.slides[a.section][a.slide].length-1;return _NumberisInteger(d)&&isNaN(a.fragment)&&(a.fragment=0),history.pushState(null,null,b),sendMessage(a.matrix.notes,{position:{section:a.section+1,slide:a.slide+1,fragment:a.fragment,fragmentTotal:d,sectionTotal:a.matrix.slides.length,slideTotal:a.matrix.slides[a.section].length}}),sendNotes(a.section,a.slide,a.matrix),{section:a.section,slide:a.slide,fragment:a.fragment}}function right(a,b,c,d){let g=a,h=b;return sendMessage(d.notes,{move:'right'}),g=nextSection(g,d),h>lastSlide(g,d)&&(h=0),move({section:g,slide:h,matrix:d})}function left(a,b,c,d){let g=a,h=b;return sendMessage(d.notes,{move:'left'}),g=previousSection(g),h>lastSlide(g,d)&&(h=0),move({section:g,slide:h,matrix:d})}function previous(a,b,c,d){let g=a,h=b;if(sendMessage(d.notes,{move:'previous'}),Array.isArray(d.slides[g][h])){let m=d.slides[g][h][0].querySelectorAll('.fragment[data-active]');if(m){const n=m.length-1;if(0<=n)return m[n].removeAttribute('data-active'),move({section:g,slide:h,fragment:n,matrix:d})}}return h-=1,0>h&&(g=previousSection(g),h=0===g?0:lastSlide(g,d)),move({section:g,slide:h,matrix:d})}function next(a,b,c,d){let g=a,h=b,l=c;const m=d.slides.length;if(sendMessage(d.notes,{move:'next'}),Array.isArray(d.slides[g][h])){let n=d.slides[g][h][0].querySelector('.fragment:not([data-active])');if(n){const q=d.slides[g][h][0].querySelectorAll('.fragment[data-active]').length+1;return n.setAttribute('data-active',!0),move({section:g,slide:h,fragment:q,matrix:d})}}if(h+=1,l=void 0,h>lastSlide(g,d)){g=nextSection(g,d);let n=lastSlide(g,d);g===m-1&&h>n?h=n:g<=m-1&&(h=0)}return move({section:g,slide:h,fragment:l,matrix:d})}function previousSection(a){let b=a;return b-=1,0>b&&(b=0),b}function nextSection(a,b){let c=a;const d=b.slides.length;return c+=1,c>=d&&(c=d-1),c}function lastSlide(a,b){const d=b.slides[a].length;return d-1}function openNotes(a){const b={go:getActiveSlide()},c=a.slides[b.go.section][b.go.slide].length-1;let d=b.go.fragment;_NumberisInteger(c)&&isNaN(b.go.fragment)&&(d=0);const g={position:{section:b.go.section+1,slide:b.go.slide+1,fragment:d,fragmentTotal:c,sectionTotal:a.slides.length,slideTotal:a.slides[b.go.section].length}},h=window.location;slideMessage(a);const l=window.open(`${h.origin}${h.pathname}?notes=true`,'Stage Fright - Notes','width=1100,height=700');return setTimeout(()=>{sendMessage(l,b),sendMessage(l,g),sendNotes(b.go.section,b.go.slide,a)},1e3),l}function body(){const a=window.location,b=`
<style>
  body {
    margin: 0;
    padding: 0;
  }
</style>
<div class="_speaker-notes">
  <!-- Slide Preview -->
  <!-- Current Slide -->
  <div class="_speaker-notes--current">
    <iframe class="_speaker-notes--current-slide" src="${a.origin}${a.pathname}?progress=false&responsive=true&listen=true${a.hash}" frameborder="0" height="1024" width="1280"></iframe>
  </div>

  <!-- Upcoming Slide Slide -->
  <div class="_speaker-notes--upcoming">
    <span class="_speaker-notes--label">Upcoming:</span>
    <iframe class="_speaker-notes--upcoming-slide" src="${a.origin}${a.pathname}?progress=false&responsive=true&listen=true${a.hash}" frameborder="0" height="1024" width="1280"></iframe>
  </div>

  <!-- Controls -->
  <div class="_speaker-notes--controls">
    <div class="controls">
      <div class="controls--time">
        <h4 class="controls--label">Time <span class="controls--reset">Click to Reset</span></h4>
        <div class="timer">
          <span class="timer--hours">00</span><span class="timer--minutes">:00</span><span class="timer--seconds">:00</span>
        </div>
        <div class="clock">
          <span class="clock--value">0:00 AM</span>
        </div>
        <div class="controls--clear"></div>
      </div>
      <div class="controls--position">
        <p class="controls--fragment">Fragment <span class="controls--fragment-current"></span>/<span class="controls--fragment-total"></span></p>

        <p class="controls--slide">Slide <span class="controls--slide-current"></span>/<span class="controls--slide-total"></span></p>

        <p class="controls--section">Section <span class="controls--section-current"></span>/<span class="controls--section-total"></span></p>

      </div>
    </div>
  </div>

  <article class="_speaker-notes--notes">
    <div class="slide-notes">
      <h4 class="slide-notes--label">Notes</h4>
      <div class="slide-notes--content"></div>
    </div>
  </article>

</div>
`;return document.body.innerHTML=b,b}function sendNotes(a,b,c){let d=document.querySelector(`[data-slide="${b}"][data-section="${a}"] ._stage--notes`);return d=d?d.innerHTML:'<p></p>',sendMessage(c.notes,{notes:d}),d}function timing(){function a(){const q=new Date,r=q.getTime()-m.getTime(),t=_Mathfloor(r/3600000),u=_Mathfloor(r/60000%60),w=_Mathfloor(r/1e3%60);c.textContent=q.toLocaleTimeString('en-US',{hour12:!1,hour:'2-digit',minute:'2-digit'}),d.textContent=b(t),g.textContent=`:${b(u)}`,h.textContent=`:${b(w)}`,0>=t?d.setAttribute('data-mute',!0):d.removeAttribute('data-mute'),0>=u?g.setAttribute('data-mute',!0):g.removeAttribute('data-mute')}function b(q){const r=`00${parseInt(q)}`;return r.substring(r.length-2)}const c=document.querySelector('.clock--value'),d=document.querySelector('.timer--hours'),g=document.querySelector('.timer--minutes'),h=document.querySelector('.timer--seconds'),l=document.querySelector('.controls--time');let m=new Date;a();let n=setInterval(a,1e3);l.addEventListener('click',()=>{m=new Date,clearInterval(n),d.textContent=b(0),g.textContent=`:${b(0)}`,h.textContent=`:${b(0)}`,n=setInterval(a,1e3)})}function sendMessage(a,b){const c=window.location;a&&a.postMessage(b,c.origin)}function slideMessage(a){window.addEventListener('message',(b)=>{const c=b.origin||event.originalEvent.origin;return c===window.location.origin?b.data.move?nav[b.data.move](a):void 0:void 0},!1)}function notesMessage(){const a=document.querySelector('._speaker-notes--current-slide'),b=document.querySelector('._speaker-notes--upcoming-slide'),c=document.querySelector('.controls--fragment'),d=document.querySelector('.controls--fragment-current'),g=document.querySelector('.controls--fragment-total'),h=document.querySelector('.controls--slide-current'),l=document.querySelector('.controls--slide-total'),m=document.querySelector('.controls--section-current'),n=document.querySelector('.controls--section-total'),q=document.querySelector('.slide-notes--content'),r=window.opener;sendMessage(r,'Speaker Notes Opened'),document.addEventListener('keydown',(t)=>{(38===t.keyCode||33===t.keyCode||!0===t.shiftKey&&32===t.keyCode)&&sendMessage(r,{move:'previous'}),(40===t.keyCode||34===t.keyCode||32===t.keyCode)&&sendMessage(r,{move:'next'})}),window.addEventListener('message',(t)=>{const u=t.origin||event.originalEvent.origin;if(u===window.location.origin){if(t.data.position)if(h.textContent=t.data.position.slide,l.textContent=t.data.position.slideTotal,m.textContent=t.data.position.section,n.textContent=t.data.position.sectionTotal,_NumberisInteger(t.data.position.fragmentTotal)){c.setAttribute('data-active',!0);t.data.position.fragment;d.textContent=t.data.position.fragment,g.textContent=t.data.position.fragmentTotal}else c.removeAttribute('data-active'),d.textContent=1,g.textContent=1;if(t.data.move&&(sendMessage(a.contentWindow,{move:t.data.move}),sendMessage(b.contentWindow,{move:t.data.move})),t.data.go){console.log(t.data.go);let w=`#/${t.data.go.section}/${t.data.go.slide}`;t.data.go.fragment&&(w+=`/${t.data.go.fragment}`),a.src+=w,b.src+=w,sendMessage(b.contentWindow,{move:'next'})}t.data.notes&&(q.innerHTML=t.data.notes)}},!1)}var progress=function(a){idleRun(()=>{const b=document.createElement('nav');b.classList.add('progress');const c=getActiveSlide();let d=0;a.slides.forEach((g)=>{const h=document.createElement('div');h.setAttribute('data-section',d),h.classList.add('progress--section');let l=0;g.forEach((m)=>{const n=document.createElement('a');n.href=`#/${d}/${l}`,n.classList.add('progress--slide'),n.setAttribute('data-slide',l),n.setAttribute('data-section',d),n.setAttribute('tabindex','-1'),n.textContent=`Section ${d}, Slide ${l}`,Array.isArray(m)&&(n.style.opacity=.5,n.setAttribute('data-fragments',m.length-1)),c.section===d&&c.slide===l&&n.setAttribute('data-active','true'),h.appendChild(n),Array.isArray(m)?(m[0].setAttribute('data-slide',l),m[0].setAttribute('data-section',d),c.section===d&&c.slide===l&&m[0].setAttribute('data-active',!0)):(m.setAttribute('data-slide',l),m.setAttribute('data-section',d),c.section===d&&c.slide===l&&m.setAttribute('data-active',!0)),l++}),b.appendChild(h),d++}),!1!==a.options.progress&&document.body.appendChild(b),translate(c.section,c.slide,c.fragment),updateProgress(c.section,c.slide,c.fragment)}),window.addEventListener('hashchange',()=>{const c=getActiveSlide();updateProgress(c.section,c.slide,c.fragment),translate(c.section,c.slide,c.fragment),sendMessage(a.notes,{go:c})})};function updateProgress(a,b,c){const d=document.querySelectorAll('[data-active]:not(.fragment)'),g=document.querySelectorAll(`[data-section="${a}"][data-slide="${b}"`),h=document.querySelector('.progress--slide[data-active]');if(h)if(c){const l=parseInt(h.getAttribute('data-fragments'));c===l?(h.style.transitionProperty='none',h.style.opacity=1):(h.style.transitionProperty='none',h.style.opacity=.5)}else h.style.transitionProperty='all',nodeMap(d,(l)=>{l.removeAttribute('data-active')}),nodeMap(g,(l)=>{l.setAttribute('data-active','true')})}var keys=function(a,b){function c(r){return 37===r.keyCode?nav.left(a):39===r.keyCode?nav.right(a):38===r.keyCode?nav.previous(a):40===r.keyCode?nav.next(a):void 0}function d(r){return!0===r.shiftKey&&32===r.keyCode?nav.previous(a):32===r.keyCode?nav.next(a):void 0}function g(r){if(83===r.keyCode)return a.notes=openNotes(a),a}function h(r,t,u){!0===r?t(u):'ctrl'===r?u.ctrlKey&&t(u):'alt'===r?u.altKey&&t(u):'meta'===r&&u.metaKey&&t(u)}const l=b.get('navigation.arrows',!0),m=b.get('navigation.remote',!0),n=b.get('navigation.spacebar',!0),q=b.get('notes',!0);document.addEventListener('keydown',(r)=>{if(!a.stage.hasAttribute('data-overlay')){if(h(l,c,r),!0===m){if(33===r.keyCode)return nav.previous(a);if(34===r.keyCode)return nav.next(a)}return h(n,d,r),void h(q,g,r)}})},overview=function(a){let b=!1;const c=a._raw.slides;document.addEventListener('keydown',(d)=>{if(27===d.keyCode){function g(u){const w=u.target.closest('[data-section][data-slide]');let y=w.getAttribute('data-section'),z=w.getAttribute('data-slide');h(c),a.stage.removeAttribute('data-overlay'),history.pushState(null,null,`#/${y}/${z}`),updateProgress(y,z),translate(y,z),b=!1}function h(u){nodeMap(u,(w)=>{w.removeEventListener('click',g)})}if(b=!b,!1==b)return a.stage.removeAttribute('data-overlay'),h(c),void translate();const l=window.innerWidth,m=window.innerHeight,n=a.stage.scrollWidth,q=a.stage.scrollHeight,r=l/n,t=m/q;if(r<=t){a.stage.style.transform=`scale(${l/(n+64/r)})`,a.stage.style.transformOrigin=`32px ${q*r/2-32}px`}else{let w=hwidth/(n+64/t);a.stage.style.transform=`scale(${w})`,a.stage.style.transformOrigin=`${n*t/2-32}px 32px`}a.stage.setAttribute('data-overlay','true'),nodeMap(c,(u)=>{u.addEventListener('click',g)})}})},stageFright=function(a){const b=new Options(a),c=new Matrix;c.options.notes?(body(),timing(),notesMessage()):(init(),progress(c),keys(c,b),overview(c)),c.options.listen&&slideMessage(c),c.options.responsive&&(document.documentElement.style.fontSize='1.5vw')},commonjsGlobal='undefined'==typeof window?'undefined'==typeof global?'undefined'==typeof self?{}:self:global:window;function createCommonjsModule(a,b){return b={exports:{}},a(b,b.exports),b.exports}var prism=createCommonjsModule(function(a){var b='undefined'==typeof window?'undefined'!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{}:window,c=function(){var d=/\blang(?:uage)?-(\w+)\b/i,g=0,h=b.Prism={util:{encode:function(n){return n instanceof l?new l(n.type,h.util.encode(n.content),n.alias):'Array'===h.util.type(n)?n.map(h.util.encode):n.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\u00a0/g,' ')},type:function(n){return Object.prototype.toString.call(n).match(/\[object (\w+)\]/)[1]},objId:function(n){return n.__id||Object.defineProperty(n,'__id',{value:++g}),n.__id},clone:function(n){var q=h.util.type(n);switch(q){case'Object':var r={};for(var t in n)n.hasOwnProperty(t)&&(r[t]=h.util.clone(n[t]));return r;case'Array':return n.map&&n.map(function(u){return h.util.clone(u)});}return n}},languages:{extend:function(n,q){var r=h.util.clone(h.languages[n]);for(var t in q)r[t]=q[t];return r},insertBefore:function(n,q,r,t){t=t||h.languages;var u=t[n];if(2==arguments.length){for(var w in r=arguments[1],r)r.hasOwnProperty(w)&&(u[w]=r[w]);return u}var y={};for(var z in u)if(u.hasOwnProperty(z)){if(z==q)for(var w in r)r.hasOwnProperty(w)&&(y[w]=r[w]);y[z]=u[z]}return h.languages.DFS(h.languages,function(A,B){B===t[n]&&A!=n&&(this[A]=y)}),t[n]=y},DFS:function(n,q,r,t){for(var u in t=t||{},n)n.hasOwnProperty(u)&&(q.call(n,u,n[u],r||u),'Object'!==h.util.type(n[u])||t[h.util.objId(n[u])]?'Array'===h.util.type(n[u])&&!t[h.util.objId(n[u])]&&(t[h.util.objId(n[u])]=!0,h.languages.DFS(n[u],q,u,t)):(t[h.util.objId(n[u])]=!0,h.languages.DFS(n[u],q,null,t)))}},plugins:{},highlightAll:function(n,q){var r={callback:q,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};h.hooks.run('before-highlightall',r);for(var w,t=r.elements||document.querySelectorAll(r.selector),u=0;w=t[u++];)h.highlightElement(w,!0===n,r.callback)},highlightElement:function(n,q,r){for(var t,u,w=n;w&&!d.test(w.className);)w=w.parentNode;w&&(t=(w.className.match(d)||[,''])[1].toLowerCase(),u=h.languages[t]),n.className=n.className.replace(d,'').replace(/\s+/g,' ')+' language-'+t,w=n.parentNode,/pre/i.test(w.nodeName)&&(w.className=w.className.replace(d,'').replace(/\s+/g,' ')+' language-'+t);var y=n.textContent,z={element:n,language:t,grammar:u,code:y};if(h.hooks.run('before-sanity-check',z),!z.code||!z.grammar)return z.code&&(z.element.textContent=z.code),void h.hooks.run('complete',z);if(h.hooks.run('before-highlight',z),q&&b.Worker){var A=new Worker(h.filename);A.onmessage=function(B){z.highlightedCode=B.data,h.hooks.run('before-insert',z),z.element.innerHTML=z.highlightedCode,r&&r.call(z.element),h.hooks.run('after-highlight',z),h.hooks.run('complete',z)},A.postMessage(JSON.stringify({language:z.language,code:z.code,immediateClose:!0}))}else z.highlightedCode=h.highlight(z.code,z.grammar,z.language),h.hooks.run('before-insert',z),z.element.innerHTML=z.highlightedCode,r&&r.call(n),h.hooks.run('after-highlight',z),h.hooks.run('complete',z)},highlight:function(n,q,r){var t=h.tokenize(n,q);return l.stringify(h.util.encode(t),r)},tokenize:function(n,q){var t=h.Token,u=[n],w=q.rest;if(w){for(var y in w)q[y]=w[y];delete q.rest}tokenloop:for(var y in q)if(q.hasOwnProperty(y)&&q[y]){var z=q[y];z='Array'===h.util.type(z)?z:[z];for(var A=0;A<z.length;++A){var B=z[A],C=B.inside,D=!!B.lookbehind,E=!!B.greedy,F=0,G=B.alias;if(E&&!B.pattern.global){var H=B.pattern.toString().match(/[imuy]*$/)[0];B.pattern=RegExp(B.pattern.source,H+'g')}B=B.pattern||B;for(var K,I=0,J=0;I<u.length;J+=u[I].length,++I){if(K=u[I],u.length>n.length)break tokenloop;if(!(K instanceof t)){B.lastIndex=0;var L=B.exec(K),M=1;if(!L&&E&&I!=u.length-1){if(B.lastIndex=J,L=B.exec(n),!L)break;for(var N=L.index+(D?L[1].length:0),O=L.index+L[0].length,P=I,Q=J,R=u.length;P<R&&Q<O;++P)Q+=u[P].length,N>=Q&&(++I,J=Q);if(u[I]instanceof t||u[P-1].greedy)continue;M=P-I,K=n.slice(J,Q),L.index-=J}if(L){D&&(F=L[1].length);var N=L.index+F,L=L[0].slice(F),O=N+L.length,S=K.slice(0,N),T=K.slice(O),U=[I,M];S&&U.push(S);var V=new t(y,C?h.tokenize(L,C):L,G,L,E);U.push(V),T&&U.push(T),Array.prototype.splice.apply(u,U)}}}}}return u},hooks:{all:{},add:function(n,q){var r=h.hooks.all;r[n]=r[n]||[],r[n].push(q)},run:function(n,q){var r=h.hooks.all[n];if(r&&r.length)for(var u,t=0;u=r[t++];)u(q)}}},l=h.Token=function(n,q,r,t,u){this.type=n,this.content=q,this.alias=r,this.length=0|(t||'').length,this.greedy=!!u};if(l.stringify=function(n,q,r){if('string'==typeof n)return n;if('Array'===h.util.type(n))return n.map(function(y){return l.stringify(y,q,n)}).join('');var t={type:n.type,content:l.stringify(n.content,q,r),tag:'span',classes:['token',n.type],attributes:{},language:q,parent:r};if('comment'==t.type&&(t.attributes.spellcheck='true'),n.alias){var u='Array'===h.util.type(n.alias)?n.alias:[n.alias];Array.prototype.push.apply(t.classes,u)}h.hooks.run('wrap',t);var w=Object.keys(t.attributes).map(function(y){return y+'="'+(t.attributes[y]||'').replace(/"/g,'&quot;')+'"'}).join(' ');return'<'+t.tag+' class="'+t.classes.join(' ')+'"'+(w?' '+w:'')+'>'+t.content+'</'+t.tag+'>'},!b.document)return b.addEventListener?(b.addEventListener('message',function(n){var q=JSON.parse(n.data),r=q.language,t=q.code,u=q.immediateClose;b.postMessage(h.highlight(t,h.languages[r],r)),u&&b.close()},!1),b.Prism):b.Prism;var m=document.currentScript||[].slice.call(document.getElementsByTagName('script')).pop();return m&&(h.filename=m.src,document.addEventListener&&!m.hasAttribute('data-manual')&&('loading'===document.readyState?document.addEventListener('DOMContentLoaded',h.highlightAll):window.requestAnimationFrame?window.requestAnimationFrame(h.highlightAll):window.setTimeout(h.highlightAll,16))),b.Prism}();a.exports&&(a.exports=c),'undefined'!=typeof commonjsGlobal&&(commonjsGlobal.Prism=c),c.languages.markup={comment:/<!--[\w\W]*?-->/,prolog:/<\?[\w\W]+?\?>/,doctype:/<!DOCTYPE[\w\W]+?>/i,cdata:/<!\[CDATA\[[\w\W]*?]]>/i,tag:{pattern:/<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,inside:{tag:{pattern:/^<\/?[^\s>\/]+/i,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"attr-value":{pattern:/=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,inside:{punctuation:/[=>"']/}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:/&#?[\da-z]{1,8};/i},c.hooks.add('wrap',function(d){'entity'===d.type&&(d.attributes.title=d.content.replace(/&amp;/,'&'))}),c.languages.xml=c.languages.markup,c.languages.html=c.languages.markup,c.languages.mathml=c.languages.markup,c.languages.svg=c.languages.markup,c.languages.css={comment:/\/\*[\w\W]*?\*\//,atrule:{pattern:/@[\w-]+?.*?(;|(?=\s*\{))/i,inside:{rule:/@[\w-]+/}},url:/url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,selector:/[^\{\}\s][^\{\};]*?(?=\s*\{)/,string:{pattern:/("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,greedy:!0},property:/(\b|\B)[\w-]+(?=\s*:)/i,important:/\B!important\b/i,function:/[-a-z0-9]+(?=\()/i,punctuation:/[(){};:]/},c.languages.css.atrule.inside.rest=c.util.clone(c.languages.css),c.languages.markup&&(c.languages.insertBefore('markup','tag',{style:{pattern:/(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,lookbehind:!0,inside:c.languages.css,alias:'language-css'}}),c.languages.insertBefore('inside','attr-value',{"style-attr":{pattern:/\s*style=("|').*?\1/i,inside:{"attr-name":{pattern:/^\s*style/i,inside:c.languages.markup.tag.inside},punctuation:/^\s*=\s*['"]|['"]\s*$/,"attr-value":{pattern:/.+/i,inside:c.languages.css}},alias:'language-css'}},c.languages.markup.tag)),c.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\w\W]*?\*\//,lookbehind:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0}],string:{pattern:/(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,lookbehind:!0,inside:{punctuation:/(\.|\\)/}},keyword:/\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,boolean:/\b(true|false)\b/,function:/[a-z0-9_]+(?=\()/i,number:/\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,operator:/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,punctuation:/[{}[\];(),.:]/},c.languages.javascript=c.languages.extend('clike',{keyword:/\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,number:/\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,function:/[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,operator:/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/}),c.languages.insertBefore('javascript','keyword',{regex:{pattern:/(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,lookbehind:!0,greedy:!0}}),c.languages.insertBefore('javascript','string',{"template-string":{pattern:/`(?:\\\\|\\?[^\\])*?`/,greedy:!0,inside:{interpolation:{pattern:/\$\{[^}]+\}/,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:'punctuation'},rest:c.languages.javascript}},string:/[\s\S]+/}}}),c.languages.markup&&c.languages.insertBefore('markup','tag',{script:{pattern:/(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,lookbehind:!0,inside:c.languages.javascript,alias:'language-javascript'}}),c.languages.js=c.languages.javascript,function(){'undefined'!=typeof self&&self.Prism&&self.document&&document.querySelector&&(self.Prism.fileHighlight=function(){var d={js:'javascript',py:'python',rb:'ruby',ps1:'powershell',psm1:'powershell',sh:'bash',bat:'batch',h:'c',tex:'latex'};Array.prototype.forEach&&Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function(g){for(var l,h=g.getAttribute('data-src'),m=g,n=/\blang(?:uage)?-(?!\*)(\w+)\b/i;m&&!n.test(m.className);)m=m.parentNode;if(m&&(l=(g.className.match(n)||[,''])[1]),!l){var q=(h.match(/\.(\w+)$/)||[,''])[1];l=d[q]||q}var r=document.createElement('code');r.className='language-'+l,g.textContent='',r.textContent='Loading\u2026',g.appendChild(r);var t=new XMLHttpRequest;t.open('GET',h,!0),t.onreadystatechange=function(){4==t.readyState&&(400>t.status&&t.responseText?(r.textContent=t.responseText,c.highlightElement(r)):400<=t.status?r.textContent='\u2716 Error '+t.status+' while fetching file: '+t.statusText:r.textContent='\u2716 Error: File does not exist or is empty')},t.send(null)})},document.addEventListener('DOMContentLoaded',self.Prism.fileHighlight))}()}),Editor=class{constructor(a='  '){this.indent=a,this._isString=(b)=>{return'[object String]'===Object.prototype.toString.call(b)},this._run=(b,c={})=>{const d=this._isString(b)?document.querySelectorAll(b):b;for(let g=0;g<d.length;g++)this._scaffold(d[g],!0,c)},this._scaffold=(b,c,d={})=>{const g=document.createElement('textarea'),h=document.createElement('pre'),l=document.createElement('code'),m=document.createElement('style'),n=b.dataset.language||d.language||'markup',q=b.textContent,r=this._language(n);d.enableAutocorrect||(g.setAttribute('spellcheck',!1),g.setAttribute('autocapitalize','off'),g.setAttribute('autocomplete','off'),g.setAttribute('autocorrect','off')),b.classList.add('editor'),g.classList.add('editor--textarea'),h.classList.add('editor--pre'),l.classList.add('editor--code',`language-${n}`),m.classList.add('editor--live'),/iPad|iPhone|iPod/.test(navigator.platform)&&(l.style.paddingLeft='3px'),d.rtl&&(g.setAttribute('dir','rtl'),h.setAttribute('dir','rtl')),d.lineNumbers&&(h.classList.add('line-numbers','editor--numbered-pre'),h.classList.remove('editor--pre'),g.classList.add('editor--numbered-textarea'),g.classList.remove('editor--textarea')),b.innerHTML='',b.appendChild(g),b.appendChild(h),h.appendChild(l),g.value=q;const t=this._render(l,g);return d.live&&n.match(/css/)&&(b.appendChild(m),m.innerText=t),this._input(b),this._scroll(g,h),b},this._input=(b)=>{const c=b.querySelector('.editor--textarea'),d=b.querySelector('.editor--pre'),g=b.querySelector('.editor--code'),h=b.querySelector('.editor--live');c.addEventListener('input',(l)=>{const m=l.target;m.value=m.value.replace(/\t/g,this.indent);const n=this._render(g,c);h&&(h.innerText=n)})},this._scroll=(b,c)=>{b.addEventListener('scroll',(d)=>{const g=Math.floow(d.target.scrollTop);0>navigator.userAgent.toLowerCase().indexOf('firefox')&&(d.target.scrollTop=g),c.style.transformY=`-${g}px`})},this._render=(b,c)=>{const d=c.value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');return b.innerHTML=d,prism.highlightElement(b),d},this._language=(b)=>{return b.match(/html|xml|xhtml|svg/)?'markup':b.match(/js/)?'javascript':b}}run(a,b){return this._run(a,b)}};Prism.languages.scss=Prism.languages.extend('css',{comment:{pattern:/(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/,lookbehind:!0},atrule:{pattern:/@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,inside:{rule:/@[\w-]+/}},url:/(?:[-a-z]+-)*url(?=\()/i,selector:{pattern:/(?=\S)[^@;\{\}\(\)]?([^@;\{\}\(\)]|&|#\{\$[-_\w]+\})+(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/m,inside:{parent:{pattern:/&/,alias:'important'},placeholder:/%[-_\w]+/,variable:/\$[-_\w]+|#\{\$[-_\w]+\}/}}}),Prism.languages.insertBefore('scss','atrule',{keyword:[/@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i,{pattern:/( +)(?:from|through)(?= )/,lookbehind:!0}]}),Prism.languages.scss.property={pattern:/(?:[\w-]|\$[-_\w]+|#\{\$[-_\w]+\})+(?=\s*:)/i,inside:{variable:/\$[-_\w]+|#\{\$[-_\w]+\}/}},Prism.languages.insertBefore('scss','important',{variable:/\$[-_\w]+|#\{\$[-_\w]+\}/}),Prism.languages.insertBefore('scss','function',{placeholder:{pattern:/%[-_\w]+/,alias:'selector'},statement:{pattern:/\B!(?:default|optional)\b/i,alias:'keyword'},boolean:/\b(?:true|false)\b/,null:/\bnull\b/,operator:{pattern:/(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,lookbehind:!0}}),Prism.languages.scss.atrule.inside.rest=Prism.util.clone(Prism.languages.scss),Prism.languages.javascript=Prism.languages.extend('clike',{keyword:/\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,number:/\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,function:/[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,operator:/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/}),Prism.languages.insertBefore('javascript','keyword',{regex:{pattern:/(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,lookbehind:!0,greedy:!0}}),Prism.languages.insertBefore('javascript','string',{"template-string":{pattern:/`(?:\\\\|\\?[^\\])*?`/,greedy:!0,inside:{interpolation:{pattern:/\$\{[^}]+\}/,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:'punctuation'},rest:Prism.languages.javascript}},string:/[\s\S]+/}}}),Prism.languages.markup&&Prism.languages.insertBefore('markup','tag',{script:{pattern:/(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,lookbehind:!0,inside:Prism.languages.javascript,alias:'language-javascript'}}),Prism.languages.js=Prism.languages.javascript,stageFright({navigation:{arrows:!1,spacebar:'alt'},notes:'alt'});const editor=new Editor;editor.run('.editor',{live:!0});const borderColors={"<color>+":{initial:'currentcolor',items:['--border-top-color','--border-right-color','--border-bottom-color','--border-left-color']},"<number>":{initial:'0',items:['--border-top-width','--border-right-width','--border-bottom-width','--border-left-width']}};if(window.CSS)for(type in window.CSS.registerProperty({name:'--registered-color',syntax:'<color>',inherits:!1,initialValue:'rebeccapurple'}),borderColors){const a=borderColors[type];a.items.forEach((b)=>{window.CSS.registerProperty({name:b,syntax:type,inherits:!1,initialValue:a.initial})})}window.CSS.paintWorklet&&(window.CSS.paintWorklet.addModule('js/circle.not.min.js'),window.CSS.paintWorklet.addModule('js/face.not.min.js'),window.CSS.paintWorklet.addModule('js/border-colors.not.min.js'));
//# sourceMappingURL=../maps/main.js.map
