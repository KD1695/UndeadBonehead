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
    constructor(scene)   
    {
        this.scene = scene;
		this.lives = 3;
        this.shields = 8;
        this.playerDirection = 0;
		this.bugsSpawned = 0;
		this.totalBugsToSpawn = 15;
		this.maxBugsOnScreen = 3;
		this.maxBombsOnScreen = 7;
        this.bombsPhysicsGroup = null;
		this.explosionsPhysicsGroup = null;
		this.bugsPhysicsGroup = [];
		this.wallsPhysicsGroup = [];
		this.bordersPhysicsGroup = null;
		this.bonusesPhysicsGroup = null;
        this.bulletGroup = null;
        this.specials = {};
        this.gameState = gameStates.START;
        this.punch = null;
		this.bone = null;
		this.chain = null;
        this.livesGroup = null;
        this.lastExplosion = null;
		this.playerGrabbedBonus = false;
		this.playerConsumedBonus = false;
        this.score = 0;
    }

    create(scene)
    {
        scene.physics.add.overlap(this.bombsPhysicsGroup, this.bulletGroup, this.bombBulletCollision, null, scene);
		scene.physics.add.overlap(this.bugsPhysicsGroup, this.wallsPhysicsGroup, this.stopBug, null, scene);
		scene.physics.add.overlap(this.explosionsPhysicsGroup, this.wallsPhysicsGroup, this.destroyWall, null, scene);
		scene.physics.add.overlap(this.bombsPhysicsGroup, this.bordersPhysicsGroup, this.stopBombMovement, null, scene);
        scene.physics.add.overlap(this.punch, this.bugsPhysicsGroup, this.killBug, null, scene);
        scene.physics.add.overlap(scene.player.familiarSprite, this.explosionsPhysicsGroup, this.playerDeathEvent, null, scene);
		scene.physics.add.overlap(this.punch, this.bonusesPhysicsGroup, this.grabPotion, null, scene);
		scene.physics.add.overlap(this.bonusesPhysicsGroup, this.bulletGroup, this.bonusBulletCollision, null, scene);
		scene.physics.add.overlap(this.bugsPhysicsGroup, this.trapsPhysicsGroup, this.trapBug, null, scene);
    }

    update(scene)
    {
        let toDestroy = this.bulletGroup.getChildren().filter(bullet => bullet.x < 0 || bullet.y < 0 || bullet.x > scene.physics.world.bounds.width || bullet.y > scene.physics.world.bounds.height);
        toDestroy.forEach(bullet => {
            bullet.destroy();
        });

        if(this.lives == 0 && this.gameState !== gameStates.GAMEOVER)
        {
            scene.playerDeathSound.play();
			this.gameState = gameStates.GAMEOVER;
        }
    }

    resetGame(scene)
    {
        this.lives = 3;
        scene.player.resetPlayer();
        //reset all bombs
        var bomb = this.bombsPhysicsGroup.getFirstAlive();
		while (bomb !== null)
		{
			bomb.destroy();
			bomb = this.bombsPhysicsGroup.getFirstAlive();
		}
        //reset all bugs
        var bug = this.bugsPhysicsGroup.getFirstAlive();
		while (bug !== null)
		{
			bug.destroy();
			bug = this.bugsPhysicsGroup.getFirstAlive();
		}
        this.bugsSpawned = 0;
        //reset powerups
        var powerup = this.bonusesPhysicsGroup.getFirstAlive();
        while (powerup !== null)
		{
			powerup.destroy();
			powerup = this.bonusesPhysicsGroup.getFirstAlive();
		}
        //regen walls
        this.wallsPhysicsGroup.regenerateWalls();
        this.gameState = gameStates.PLAYING;
    }

    bombBulletCollision(bomb, bullet)
    {
		this.gameManager.scene.shootOnBombSound.play();
		bullet.destroy();
		bomb.name = "collided";
    }
	
	bonusBulletCollision(bonus, bullet)
    {
		this.gameManager.scene.shootOnBonusSound.play();
		bonus.name = "explode";
    }
	
	stopBug(bug, wall)
	{
		bug.name = "collided";
	}
	
	trapBug(bug, trap)
	{
		bug.name = "trapped";
	}
	
	destroyWall(explosion, wall)
	{
		this.gameManager.scene.wallBreakSound.play();
		wall.destroy();
	}
	
	stopBombMovement(bomb, border)
	{
		bomb.name = "blocked";
	}
	
	killBug(punch, bug)
	{
        if(!this.player.canPunch)
        {
            bug.name = "dead";
        }
        this.gameManager.score += 10;
        let str = this.gameManager.score.toString().padStart(3, "0")
        this.scoreText.setText(str);
	}

    playerDeathEvent(player, explosion)
    {
        if(this.gameManager.lastExplosion == null)
        {
            this.gameManager.lastExplosion = explosion;
        }
        else if(this.gameManager.lastExplosion == explosion)
        {
            return;
        }
        this.gameManager.lives -= 1;
        this.gameManager.livesGroup.remove(this.gameManager.livesGroup.children.getArray()[this.gameManager.lives], true, true);
		this.gameManager.scene.playerHitSound.play();
    }
	
	grabPotion(punch, bonus)
	{
		if (bonus.name === "colliderActive")
		{
			this.gameManager.playerGrabbedBonus = true;
			bonus.x = punch.x;
			bonus.y = punch.y;
		}
		
		if (bonus.name === "colliderActive" && this.gameManager.playerConsumedBonus === true)
		{
			bonus.name = "consumed";
			this.gameManager.playerConsumedBonus = false;
			this.gameManager.playerGrabbedBonus = false;
			
			this.gameManager.wallsPhysicsGroup.regenerateWalls();
		}
	}
}