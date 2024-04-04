class Renderer{
    constructor(world,ctx){
        this.world = world;     
        this.ctx=ctx; 
    }
    render(){
        const players = this.world.getPlayers();
        
        this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);

        players.forEach((player)=>{
          this.ctx.beginPath();
          const pos = player.getPosition();
          this.ctx.arc(pos.x,pos.y,pos.radius,Math.PI*2,0);
          this.ctx.fill();
        })        
        
        requestAnimationFrame(render);
    }
}
export default Renderer;