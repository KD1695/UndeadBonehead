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
		this.maxBugsOnScreen = 3;
		this.maxBombsOnScreen = 7;
        this.canPlayerPunch = true;
        this.canPlayerShoot = true;
        this.bombsPhysicsGroup = null;
		this.bugsPhysicsGroup = [];
		this.wallsPhysicsGroup = [];
        this.bulletGroup = null;
        this.specials = {};
        this.gameState = gameStates.START;
    }

    create(scene)
    {
        scene.physics.add.collider(this.bombsPhysicsGroup, this.bulletGroup, this.testfunc, null, scene);
		scene.physics.add.overlap(this.bugsPhysicsGroup, this.wallsPhysicsGroup, this.testFunc2, null, scene);
    }

    update(scene)
    {
        let toDestroy = this.bulletGroup.getChildren().filter(bullet => bullet.x < 0 || bullet.y < 0 || bullet.x > scene.physics.world.bounds.width || bullet.y > scene.physics.world.bounds.height);
        toDestroy.forEach(bullet => {
            bullet.destroy();
        });
    }

    testfunc(bomb, bullet)
    {
        bullet.destroy();
    }
	
	testFunc2(bug, wall)
	{
		bug.name = "collided";
	}
}