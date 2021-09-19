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
    }

    create()
    {
		this.gameManager = new GameManager();

		this.add.image(300, 300, 'level_bg');
		this.add.image(300, 300, 'level_floor');
		this.add.image(300, 300, 'level_walls');
		this.add.image(300, 300, 'level_decor');
		
		this.bombSpawnManager = new ObjectSpawnManager({camera:this.cameras.main, objectKey:'bomb', minDelay:1, maxDelay:2, spawnZoneBuffer:60});
		this.bugSpawnManager = new ObjectSpawnManager({camera:this.cameras.main, objectKey:'bug', minDelay:5, maxDelay:8, spawnZoneBuffer:60});
		this.gameManager.bombsPhysicsGroup = new BombGroup(this);
		this.gameManager.explosionsPhysicsGroup = new ExplosionGroup(this);
		this.gameManager.bugsPhysicsGroup = new BugGroup(this);
		this.gameManager.wallsPhysicsGroup = new WallGroup(this);
		this.gameManager.wallsPhysicsGroup.spawnWalls(this.bombSpawnManager, 40);
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
			this.gameManager.bugsPhysicsGroup.spawnBug({x: spawnCoordinates.x, y: spawnCoordinates.y, bombsPhysicsGroup: this.gameManager.bombsPhysicsGroup, spawnManager: this.bugSpawnManager});
			this.gameManager.bugsSpawned += 1;
		}
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