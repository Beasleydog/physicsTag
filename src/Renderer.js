class Renderer {
    constructor(world, ctx) {
        this.world = world;
        this.ctx = ctx;
        this.render();
    }
    render() {
        const players = this.world.getPlayers();
        const ctx = this.ctx;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        players.forEach((player) => {
            ctx.beginPath();
            const pos = player.getPosition();
            ctx.arc(pos.x, pos.y, player.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${Math.round(100*player.id)} 100% 50%`;
            ctx.fill();

            if(player.isIt()){
                ctx.strokeStyle="black";
                ctx.lineWidth=10;
                ctx.stroke();
            }
        });

        requestAnimationFrame(() => { this.render() });
    }
}
export default Renderer;