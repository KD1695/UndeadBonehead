const gameStates = 
{
    START : "start",
    INTRO : "intro",
    PLAYING : "playing",
    DEAD : "playerDead",
    GAMEOVER : "gameOver",
}

class GameManager 
{
    constructor()   
    {
        this.lives = 3;
        this.shields = 8;
        this.playerDirection = 0;
        this.canPlayerPunch = true;
        this.canPlayerShoot = true;
        this.bugs = {};
        this.bombs = this.physics.add.group();
        this.specials = {};
        this.gameState = gameStates.START;
    }
}