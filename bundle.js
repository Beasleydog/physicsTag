(()=>{"use strict";const t=new class{constructor(){this.players=[]}addPlayer(t){this.players.push(t)}getPlayers(){return this.players}},e=document.createElement("canvas");e.width=window.innerWidth,e.height=window.innerHeight,document.body.appendChild(e),new class{constructor(t,e){this.world=t,this.ctx=e,this.render()}render(){const t=this.world.getPlayers(),e=this.ctx;e.clearRect(0,0,window.innerWidth,window.innerHeight),t.forEach((t=>{e.beginPath();const i=t.getPosition();console.log(i.x,i.y,t.radius),e.arc(i.x,i.y,t.radius,0,2*Math.PI),e.fillStyle="black",e.fill()})),requestAnimationFrame((()=>{this.render()}))}}(t,e.getContext("2d"));const i=new class{constructor(t,e){this.x=t,this.y=e,this.radius=10,this.v={x:0,y:0},this.a={x:0,y:0},this.id=Math.random()}getPosition(){return{x:this.x,y:this.y}}getID(){return this.id}}(100,100);t.addPlayer(i)})();