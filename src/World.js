class World {
    constructor() {
        this.players = [];
    }
    addPlayer(player) {
        this.players.push(player);
    }
    getPlayers() {
        return this.players;
    }
}
export default World;