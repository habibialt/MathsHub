// Private launcher: not a security boundary. The code is visible to anyone who reads this file.
window.Launcher=(function(){
const CODE='1234',btn=document.getElementById('codeBtn');if(!btn)return{intercept(){return false}};let on=false;
btn.onclick=()=>{on=!on;btn.classList.toggle('on',on);document.getElementById('expr').textContent=on?'enter code, then =':'';document.getElementById('out').textContent='0'};
return{intercept(k,expr,set){
 if(!on)return false;
 if(k==='='){const ok=expr===CODE;on=false;btn.classList.remove('on');
  if(ok){document.body.classList.add('leaving');sessionStorage.setItem('ok','1');setTimeout(()=>location.href='work.html',450)}
  else{const o=document.getElementById('out');o.classList.add('shake');setTimeout(()=>o.classList.remove('shake'),400);set('')}
  return true}
 return false}}})();
