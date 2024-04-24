function Vector(x, y) {
    this.x = x;
    this.y = y;
    this.normalize = () => {
        return new Vector(this.x / this.getMag(), this.y / this.getMag());
    };
    this.getMag = () => {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
    this.dotProduct = (v) => {
        return this.x * v.x + this.y * v.y;
    };
    this.scalarMultiply = (s) => {
        return new Vector(this.x * s, this.y * s);
    };
    this.add = (v) => {
        return new Vector(this.x + v.x, this.y + v.y);
    };
    this.subtract = (v) => {
        return this.add(v.scalarMultiply(-1));
    };
}
function HandleCollision(playerOne,playerTwo){
    let pos1 = new Vector(playerOne.p.x, playerOne.p.y);
    let pos2 = new Vector(playerTwo.p.x,playerTwo.p.y);

    if(pos1.subtract(pos2).getMag()>playerOne.radius+playerTwo.radius)return false;

    let normal = pos1.subtract(pos2).normalize();
    let v1 = new Vector(playerOne.v.x, playerOne.v.y);
    let v2 = new Vector(playerTwo.v.x, playerTwo.v.y);
    let relVel = v1.subtract(v2);
    let sepVel = relVel.dotProduct(normal);
    let newSepVel = -sepVel * 1;

    let vsepdiff = newSepVel - sepVel;
    let impulse = vsepdiff / ((1/playerOne.mass) + (1/playerTwo.mass));
    let impulseVec = normal.scalarMultiply(impulse);

    let fv1 = v1.add(impulseVec.scalarMultiply(1/playerOne.mass));
    let fv2 = v2.subtract(impulseVec.scalarMultiply(1/playerTwo.mass));

    playerOne.v.x = fv1.x;
    playerOne.v.y = fv1.y;
    playerTwo.v.x = fv2.x;
    playerTwo.v.y = fv2.y;

    let distance = pos1.subtract(pos2);
    let depth =
        playerOne.radius + playerTwo.radius - distance.getMag();
    let penres = distance.normalize().scalarMultiply(depth / 2);
    let fpos1 = pos1.add(penres);
    let fpos2 = pos2.subtract(penres);

    playerOne.p={x:fpos1.x,y: fpos1.y};
    playerTwo.p={x:fpos2.x, y:fpos2.y};

    return true;
}
module.exports= HandleCollision