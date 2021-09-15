class SceneMain extends Phaser.Scene
{
    constructor()
    {
        super("SceneMain");
    }

    preload()
    {
        this.load.image("player", "assets/star.png");
		this.load.image("bomb", "assets/bomb.png");
		this.load.image("bug", "assets/bug.png");
    }

    create()
    {
        this.gameManager = new GameManager();
		
		this.bombSpawnManager = new ObjectSpawnManager({camera:this.cameras.main, objectKey:'bomb', minDelay:3, maxDelay:5});
		this.bugSpawnManager = new ObjectSpawnManager({camera:this.cameras.main, objectKey:'bug', minDelay:5, maxDelay:8});
		this.gameManager.bombs = this.physics.add.group();
		this.gameManager.bugs = this.physics.add.group();
		
		this.player = new Player({scene:this,x:400,y:300});
		this.bomb = new Bomb({scene:this});
    }

    update(timestep, dt)
    {
        this.player.update();
		
		this.spawnObjects(dt);
    }
	
	spawnObjects(dt)
	{
		//Spawn bombs
		if (this.gameManager.bombs.countActive(true) < this.gameManager.maxBombsOnScreen &&
			this.bombSpawnManager.shouldSpawnObject(dt / 1000) === true)
		{
			var spawnCoordinates = this.bombSpawnManager.getObjectSpawnCoordinates();
			this.gameManager.bombs.create(spawnCoordinates.x, spawnCoordinates.y, this.bombSpawnManager.objectKey);
		}

		//Spawn bugs
		if (this.gameManager.bugsSpawned < this.gameManager.totalBugsToSpawn && 
			this.gameManager.bugs.countActive(true) < this.gameManager.maxBugsOnScreen &&
			this.bugSpawnManager.shouldSpawnObject(dt / 1000) === true)
		{
			var spawnCoordinates = this.bombSpawnManager.getObjectSpawnCoordinates();
			this.gameManager.bugs.create(spawnCoordinates.x, spawnCoordinates.y, this.bugSpawnManager.objectKey);
		}
	}
}