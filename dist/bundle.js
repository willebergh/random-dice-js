(()=>{var t={125:(t,e,a)=>{function c(t){this.deck=t,this.board=[],this.sp=0}a(536),c.prototype.spawnDice=function(){this.deck.drawDice();const t=Math.floor(15*Math.random());console.log(t)},t.exports=c},536:(t,e,a)=>{function c(t,e,a,c,i){this.dices=[t,e,a,c,i]}a(173),c.prototype.drawDice=function(){const t=Math.floor(5*Math.random());return this.dices[t]},t.exports=c},173:t=>{function e({name:t,type:e,target:a,attackSpeed:c,basicDamage:i}){this.name=t,this.type=e,this.target=a,this.attackSpeed=c,this.basicDamage=i,this.dotCount=1}e.prototype.attack=function(){};const a=[{name:"Basic Dice",type:"physical",target:"front",attackSpeed:1,basicDamage:100},{name:"Fire Dice",type:"magic",target:"front",attackSpeed:.73,basicDamage:41},{name:"Electric Dice",type:"magic",target:"front",attackSpeed:.56,basicDamage:51},{name:"Wind Dice",type:"physical",target:"front",attackSpeed:.45,basicDamage:41},{name:"Poison Dice",type:"debuff",target:"random",attackSpeed:1.3,basicDamage:34},{name:"Ice Dice",type:"debuff",target:"front",attackSpeed:1.36,basicDamage:51}].map((t=>new e(t)));t.exports=a}},e={};function a(c){if(e[c])return e[c].exports;var i=e[c]={exports:{}};return t[c](i,i.exports,a),i.exports}(()=>{const t=a(125),e=a(536),[c]=a(173);new t(new e(c,c,c,c,c)).spawnDice()})()})();