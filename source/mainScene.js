class SceneMain extends Phaser.Scene
{
    constructor()
    {
        super({key: "SceneMain"});
    }

    preload()
    {
        this.load.image("player", "assets/star.png");
		this.load.image("bomb", "assets/bomb.png");
		this.load.image("bug", "assets/bug.png");
		this.load.image("wall", "assets/wall.png");
        this.load.image("bullet", "assets/bullet.png");
    }

    create()
    {
		this.gameManager = new GameManager();
		
		this.bombSpawnManager = new ObjectSpawnManager({camera:this.cameras.main, objectKey:'bomb', minDelay:1, maxDelay:2, spawnZoneBuffer:60});
		this.bugSpawnManager = new ObjectSpawnManager({camera:this.cameras.main, objectKey:'bug', minDelay:5, maxDelay:8, spawnZoneBuffer:60});
		this.gameManager.bombsPhysicsGroup = new BombGroup(this);
		this.gameManager.bugsPhysicsGroup = new BugGroup(this);
		this.gameManager.wallsPhysicsGroup = new WallGroup(this);
		this.gameManager.wallsPhysicsGroup.spawnWalls(this.bombSpawnManager, 30);
		
		
		//this.sys.arcadePhysics.world.enableBody(this.gameManager.bombsPhysicsGroup, 0);
		//this.physics.add.group.existing(this.gameManager.bugsPhysicsGroup);
		//this.physics.add.group.existing(this.gameManager.wallsPhysicsGroup);
		//this.sys.arcadePhysics.world.enableBody(this.gameManager.bugsPhysicsGroup, 0);
		//this.sys.arcadePhysics.world.enableBody(this.gameManager.wallsPhysicsGroup, 0);
		
		this.player = new Player({scene:this,x:400,y:300});
		this.physics.add.collider(this.gameManager.bugsPhysicsGroup, this.gameManager.wallsPhysicsGroup, this.blockBug, null, this);
        this.player.create(this);
    }

    update(timestep, dt)
    {
        this.player.update(this, dt);
		
		this.spawnObjects(dt);
    }
	
	blockBug(bug, wall)
	{
		console.log("BlockBug Called");
	}
	
	spawnObjects(dt)
	{
		//Spawn bombs
		if (this.gameManager.bombsPhysicsGroup.countActive(true) < this.gameManager.maxBombsOnScreen &&
			this.bombSpawnManager.shouldSpawnObject(dt / 1000) === true)
		{
			var spawnCoordinates = this.bombSpawnManager.getObjectSpawnCoordinates();
			this.gameManager.bombsPhysicsGroup.spawnBomb(spawnCoordinates.x, spawnCoordinates.y);
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
}