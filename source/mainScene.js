class SceneMain extends Phaser.Scene
{
    constructor()
    {
        super({key: "SceneMain"});
    }

    preload()
    {
        this.load.spritesheet("player", "assets/undeadvamp.png", { frameWidth: 37.6666, frameHeight: 46 });
		this.load.image("bomb", "assets/bomb.png");
		this.load.image("bug", "assets/bug.png");
		this.load.image("wall", "assets/wall.png");
        this.load.image("bullet", "assets/bullet.png");
		this.load.image("explosion", "assets/explosion.png");
		this.load.image("punch", "assets/bullet.png");
		this.load.image("familiars", "assets/circle.png");
		this.load.image("level_bg", "assets/Level/Level_BG_0.png");
		this.load.image("level_floor", "assets/Level/Level_Floor_1.png");
		this.load.image("level_walls", "assets/Level/Level_Walls_2.png");
		this.load.image("level_decor", "assets/Level/Level_Decoration_3.png");
		this.load.image("borderVertical", "assets/borderWallVertical.png");
		this.load.image("borderHorizontal", "assets/borderWallHorizontal.png");
		this.load.image("lives", "assets/tile000.png");
		this.load.image("horizontalWall", "assets/Level/FrontWall.png");
		this.load.image("verticalWall", "assets/Level/SideWall.png");
		this.load.image("bat", "assets/bat.png");
		this.load.image("bone", "assets/bone.png");
		this.load.image("bonus", "assets/potion.png");
		this.load.image("trap", "assets/trap.png");
		
		this.load.audio("music", ['assets/Audio/Theme_of_Undead_Bonehead.ogg', 'assets/Audio/Theme_of_Undead_Bonehead.mp3']);
		this.load.audio("bombExplode", 'assets/Audio/bombExplode.wav');
		this.load.audio("bugKill", 'assets/Audio/bugKill.wav');
		this.load.audio("playerDeath", 'assets/Audio/playerDeath.wav');
		this.load.audio("playerHit", 'assets/Audio/playerHit.wav');
		this.load.audio("powerUpChew", 'assets/Audio/powerUpChew.wav');
		this.load.audio("powerUpComplete", 'assets/Audio/powerUpComplete.wav');
		this.load.audio("punch", 'assets/Audio/punch.wav');
		this.load.audio("shoot", 'assets/Audio/shoot.wav');
		this.load.audio("shootOnBomb", 'assets/Audio/shootOnBomb.wav');
		this.load.audio("wallBreak", 'assets/Audio/wallBreak.wav');
		this.load.audio("wallGenerate", 'assets/Audio/wallGenerate.wav');
    }

    create()
    {
		var music = this.sound.add('music');
		music.setLoop(true);
		music.play();
		
		createAudio();
		
		this.gameManager = new GameManager();

		this.add.image(300, 300, 'level_bg');
		this.add.image(300, 300, 'level_floor');
		this.add.image(300, 300, 'level_walls');
		this.add.image(300, 300, 'level_decor');

		this.gameManager.livesGroup = this.add.group({
			key: 'lives',
			repeat: 2,
			setXY: {x:25, y:567, stepX:25}
		});
		console.log("DEATH EVENT RECORDED!!!! " + this.gameManager.livesGroup.getLength());
		
		this.bombSpawnManager = new ObjectSpawnManager({camera:this.cameras.main, objectKey:'bomb', minDelay:1, maxDelay:2, spawnZoneBuffer:60});
		this.bugSpawnManager = new ObjectSpawnManager({camera:this.cameras.main, objectKey:'bug', minDelay:5, maxDelay:8, spawnZoneBuffer:60});
		this.gameManager.bombsPhysicsGroup = new BombGroup(this);
		this.gameManager.explosionsPhysicsGroup = new ExplosionGroup(this);
		this.gameManager.trapsPhysicsGroup = new TrapGroup(this);
		this.gameManager.bugsPhysicsGroup = new BugGroup(this);
		this.gameManager.wallsPhysicsGroup = new WallGroup(this);
		this.gameManager.bonusesPhysicsGroup = new BonusGroup(this);
		this.gameManager.wallsPhysicsGroup.spawnWalls(this.bombSpawnManager, 10);
		this.gameManager.bordersPhysicsGroup = this.physics.add.group();
		
		this.createBorders();
		
		this.player = new Player({scene:this,x:this.cameras.main.centerX,y:this.cameras.main.centerY});
        this.player.create(this);
		this.gameManager.create(this);
    }

    update(timestep, dt)
    {
        this.player.update(this, dt);
		this.spawnObjects(dt);
		this.gameManager.update(this);
    }
	
	spawnObjects(dt)
	{		
		//Spawn bombs
		if (this.gameManager.bombsPhysicsGroup.countActive(true) < this.gameManager.maxBombsOnScreen &&
			this.bombSpawnManager.shouldSpawnObject(dt / 1000) === true)
		{
			var spawnCoordinates = this.bombSpawnManager.getObjectSpawnCoordinates();
			this.gameManager.bombsPhysicsGroup.spawnBomb(spawnCoordinates.x, spawnCoordinates.y, this.gameManager.explosionsPhysicsGroup);
		}

		//Spawn bugs
		if (this.gameManager.bugsSpawned < this.gameManager.totalBugsToSpawn && 
			this.gameManager.bugsPhysicsGroup.countActive(true) < this.gameManager.maxBugsOnScreen &&
			this.bugSpawnManager.shouldSpawnObject(dt / 1000) === true)
		{
			var spawnCoordinates = this.bugSpawnManager.getObjectSpawnCoordinates();
			this.gameManager.bugsPhysicsGroup.spawnBug({x: spawnCoordinates.x, y: spawnCoordinates.y, bombsPhysicsGroup: this.gameManager.bombsPhysicsGroup, spawnManager: this.bugSpawnManager, bonusesPhysicsGroup: this.gameManager.bonusesPhysicsGroup});
			this.gameManager.bugsSpawned += 1;
		}
	}
	
	createAudio()
	{
		this.load.audio("bombExplode", 'assets/Audio/bombExplode.wav');
		this.load.audio("bugKill", 'assets/Audio/bugKill.wav');
		this.load.audio("playerDeath", 'assets/Audio/playerDeath.wav');
		this.load.audio("playerHit", 'assets/Audio/playerHit.wav');
		this.load.audio("powerUpChew", 'assets/Audio/powerUpChew.wav');
		this.load.audio("powerUpComplete", 'assets/Audio/powerUpComplete.wav');
		this.load.audio("punch", 'assets/Audio/punch.wav');
		this.load.audio("shoot", 'assets/Audio/shoot.wav');
		this.load.audio("shootOnBomb", 'assets/Audio/shootOnBomb.wav');
		this.load.audio("wallBreak", 'assets/Audio/wallBreak.wav');
		this.load.audio("wallGenerate", 'assets/Audio/wallGenerate.wav');
		
		this.bombExplodeSound = this.sound.add('bombExplode');
		this.bugKillSound = this.sound.add('bugKill');
		this.playerDeathSound = this.sound.add('playerDeath');
		this.playerHitSound = this.sound.add('playerHit');
		this.powerUpChewSound = this.sound.add('powerUpChew');
		this.powerUpCompleteSound = this.sound.add('powerUpComplete');
		this.punchSound = this.sound.add('punch');
		this.shootSound = this.sound.add('shoot');
		this.shootOnBombSound = this.sound.add('shootOnBomb');
		this.wallBreakSound = this.sound.add('wallBreak');
		this.wallGenerateSound = this.sound.add('wallGenerate');
	}
	
	createBorders()
	{
		//Left
		var border = this.gameManager.bordersPhysicsGroup.create(0,this.cameras.main.centerY,'borderVertical');
		//Top
		border = this.gameManager.bordersPhysicsGroup.create(this.cameras.main.centerX,0,'borderHorizontal');
		//Right
		border = this.gameManager.bordersPhysicsGroup.create(2*this.cameras.main.centerX,this.cameras.main.centerY,'borderVertical');
		//Bottom
		border = this.gameManager.bordersPhysicsGroup.create(this.cameras.main.centerX,2*this.cameras.main.centerY,'borderHorizontal');
	}
}