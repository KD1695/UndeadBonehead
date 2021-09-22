class WallGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene)
	{
		super(scene.physics.world, scene);
		
		this.createNewWalls();
	}
	
	spawnWalls(spawnManager, deadZoneBuffer)
	{
		this.wallSeparation = 30;
		
		this.minXBuffer = spawnManager.minDeadZoneX - deadZoneBuffer;
		this.maxXBuffer = spawnManager.maxDeadZoneX + deadZoneBuffer;
		this.minYBuffer = spawnManager.minDeadZoneY - deadZoneBuffer;
		this.maxYBuffer = spawnManager.maxDeadZoneY + deadZoneBuffer;
		
		//Left Side
		var wall = this.getFirstDead(false);
		wall.spawn(this.minXBuffer, this.scene.cameras.main.centerY - this.wallSeparation, true);
		wall = this.getFirstDead(false);
		wall.spawn(this.minXBuffer, this.scene.cameras.main.centerY, true);
		wall = this.getFirstDead(false);
		wall.spawn(this.minXBuffer, this.scene.cameras.main.centerY + this.wallSeparation, true);
		
		//Right Side
		wall = this.getFirstDead(false);
		wall.spawn(this.maxXBuffer, this.scene.cameras.main.centerY - this.wallSeparation, true);
		wall = this.getFirstDead(false);
		wall.spawn(this.maxXBuffer, spawnManager.screenCenter.y, true);
		wall = this.getFirstDead(false);
		wall.spawn(this.maxXBuffer, this.scene.cameras.main.centerY + this.wallSeparation, true);
		
		//Top Side
		wall = this.getFirstDead(false);
		wall.spawn(this.scene.cameras.main.centerX + this.wallSeparation, this.minYBuffer, false);
		wall = this.getFirstDead(false);
		wall.spawn(spawnManager.screenCenter.x, this.minYBuffer, false);
		wall = this.getFirstDead(false);
		wall.spawn(this.scene.cameras.main.centerX - this.wallSeparation, this.minYBuffer, false);
		
		//Bottom Side
		wall = this.getFirstDead(false);
		wall.spawn(this.scene.cameras.main.centerX + this.wallSeparation, this.maxYBuffer, false);
		wall = this.getFirstDead(false);
		wall.spawn(spawnManager.screenCenter.x, this.maxYBuffer, false);
		wall = this.getFirstDead(false);
		wall.spawn(this.scene.cameras.main.centerX - this.wallSeparation, this.maxYBuffer, false);
	}
	
	createNewWalls()
	{
		console.log("Creating new walls because I exist!");
		this.createMultiple(
		{
			classType:WallObject,
			quantity: 12,
			active:false,
			visible:false,
			key:"wall",
		});	
	}
	
	regenerateWalls()
	{
		//Destroy all existing walls
		var wall = this.getFirstAlive();
		while (wall !== null)
		{
			wall.destroy();
			wall = this.getFirstAlive();
		}
		
		//Populate new walls
		this. createNewWalls();
		//Left Side
		var wall = this.getFirstDead(false);
		wall.spawn(this.minXBuffer, this.scene.cameras.main.centerY - this.wallSeparation, true);
		wall = this.getFirstDead(false);
		wall.spawn(this.minXBuffer, this.scene.cameras.main.centerY, true);
		wall = this.getFirstDead(false);
		wall.spawn(this.minXBuffer, this.scene.cameras.main.centerY + this.wallSeparation, true);
		
		//Right Side
		wall = this.getFirstDead(false);
		wall.spawn(this.maxXBuffer, this.scene.cameras.main.centerY - this.wallSeparation, true);
		wall = this.getFirstDead(false);
		wall.spawn(this.maxXBuffer, this.scene.cameras.main.centerY, true);
		wall = this.getFirstDead(false);
		wall.spawn(this.maxXBuffer, this.scene.cameras.main.centerY + this.wallSeparation, true);
		
		//Top Side
		wall = this.getFirstDead(false);
		wall.spawn(this.scene.cameras.main.centerX + this.wallSeparation, this.minYBuffer, false);
		wall = this.getFirstDead(false);
		wall.spawn(this.scene.cameras.main.centerX, this.minYBuffer, false);
		wall = this.getFirstDead(false);
		wall.spawn(this.scene.cameras.main.centerX - this.wallSeparation, this.minYBuffer, false);
		
		//Bottom Side
		wall = this.getFirstDead(false);
		wall.spawn(this.scene.cameras.main.centerX + this.wallSeparation, this.maxYBuffer, false);
		wall = this.getFirstDead(false);
		wall.spawn(this.scene.cameras.main.centerX, this.maxYBuffer, false);
		wall = this.getFirstDead(false);
		wall.spawn(this.scene.cameras.main.centerX - this.wallSeparation, this.maxYBuffer, false);
	}
	
	
}