(function(){
const $=id=>document.getElementById(id);
const rows=[['AC','fn'],['DEL','fn'],['%','op'],['÷','op'],['7'],['8'],['9'],['×','op'],['4'],['5'],['6'],['−','op'],['1'],['2'],['3'],['+','op'],['0'],['.'],['=','eq','eq']];
let expr='',justEq=false,hist=[];
try{hist=JSON.parse(localStorage.getItem('calcHist')||'[]')}catch(e){}
const keys=$('keys');
rows.forEach(([l,c,x])=>{const b=document.createElement('button');b.textContent=l;b.className=c||'';if(x==='eq')b.style.gridColumn='span 2';b.onclick=()=>press(l);keys.appendChild(b)});
// recursive-descent evaluator: respects precedence, no eval()
function calc(s){const t=s.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').match(/\d*\.?\d+|[-+*/%()]/g)||[];let i=0;
function prim(){let v;const k=t[i];if(k==='('){i++;v=add();if(t[i]===')')i++}else if(k==='-'){i++;return -prim()}else if(k==='+'){i++;return prim()}else if(k!==undefined&&!isNaN(k)){v=parseFloat(k);i++}else throw 0;while(t[i]==='%'){v/=100;i++}return v}
function mul(){let v=prim();while(t[i]==='*'||t[i]==='/'){const o=t[i++],r=prim();v=o==='*'?v*r:v/r}return v}
function add(){let v=mul();while(t[i]==='+'||t[i]==='-'){const o=t[i++],r=mul();v=o==='+'?v+r:v-r}return v}
const r=add();if(i<t.length)throw 0;if(!isFinite(r))throw 0;return r}
const fmt=n=>String(parseFloat(n.toPrecision(12)));
function show(){$('out').textContent=expr||'0';$('expr').textContent=''}
function press(k){
 if(window.Launcher&&window.Launcher.intercept(k,expr,v=>{expr=v;show()}))return;
 const ops='+−×÷';
 if(k==='AC'){expr=''}
 else if(k==='DEL'){expr=expr.slice(0,-1)}
 else if(k==='='){if(!expr)return;try{const r=fmt(calc(expr));hist.unshift(expr+' = '+r);hist=hist.slice(0,50);save();$('expr').textContent=expr+' =';$('out').textContent=r;expr=r;justEq=true;renderHist();return}catch(e){$('out').textContent='Error';expr='';return}}
 else if(ops.includes(k)){if(!expr&&k!=='−')return;if(ops.includes(expr.slice(-1)))expr=expr.slice(0,-1);expr+=k;justEq=false}
 else if(k==='%'){if(expr&&!ops.includes(expr.slice(-1)))expr+='%'}
 else{if(justEq){expr=''}justEq=false;if(k==='.'){const last=expr.split(/[+−×÷()%]/).pop();if(last.includes('.'))return}expr+=k}
 show()}
function save(){try{localStorage.setItem('calcHist',JSON.stringify(hist))}catch(e){}}
function renderHist(){const ul=$('histList');ul.innerHTML='';if(!hist.length){ul.innerHTML='<li>No calculations yet</li>';return}
 hist.forEach(h=>{const li=document.createElement('li');li.textContent=h;li.onclick=()=>{expr=h.split(' = ')[1];show()};ul.appendChild(li)})}
$('histBtn').onclick=()=>{$('hist').hidden=!$('hist').hidden};
$('histClear').onclick=()=>{hist=[];save();renderHist()};
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key;let m=null;
 if(/^[0-9.]$/.test(k))m=k;else if(k==='+')m='+';else if(k==='-')m='−';else if(k==='*'||k==='x')m='×';else if(k==='/'){m='÷';e.preventDefault()}
 else if(k==='%')m='%';else if(k==='Enter'||k==='='){m='=';e.preventDefault()}else if(k==='Backspace')m='DEL';else if(k==='Escape')m='AC';
 if(m)press(m)});
renderHist();show();
})();
