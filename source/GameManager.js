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
        this.bombs = {};
        this.specials = {};
        this.gameState = gameStates.START;
    }

    set lives (lives)
    {
        this.lives = lives;
    }

    get lives ()
    {
        return this.lives;
    }

    set shields (shields)
    {
        this.shields = shields;
    }

    get shields ()
    {
        return this.shields;
    }
    
    set bugs (bugs)
    {
        this.bugs = bugs;
    }

    get bugs ()
    {
        return this.bugs;
    }

    set bombs (bombs)
    {
        this.bombs = bombs;
    }

    get bombs ()
    {
        return this.bombs;
    }
}