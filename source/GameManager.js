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
		this.bugsSpawned = 0;
		this.totalBugsToSpawn = 15;
		this.maxBugsOnScreen = 5;
		this.maxBombsOnScreen = 7;
        this.canPlayerPunch = true;
        this.canPlayerShoot = true;
        this.bombsPhysicsGroup = [];
		this.bugsPhysicsGroup = [];
        this.specials = {};
        this.gameState = gameStates.START;
    }
}