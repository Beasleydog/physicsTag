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
            ctx.fillStyle = "black";
            ctx.fill();
        });

        const debugPoints = this.world.getDebugPoints();
        debugPoints.forEach((point)=>{
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
            ctx.fillStyle = point.color;
            ctx.fill();
        })

        requestAnimationFrame(() => { this.render() });
    }
}
export default Renderer;