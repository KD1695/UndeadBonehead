class WallGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene)
	{
		super(scene.physics.world, scene);
		
		this.createNewWalls();
	}
	
	spawnWalls(spawnManager, deadZoneBuffer)
	{
		var wallSeparation = 10;
		
		//Left Side
		var wall = this.getFirstDead(false);
		wall.spawn(spawnManager.minDeadZoneX - deadZoneBuffer, spawnManager.maxDeadZoneY - wallSeparation, true);
		wall = this.getFirstDead(false);
		wall.spawn(spawnManager.minDeadZoneX - deadZoneBuffer, spawnManager.screenCenter.y, true);
		wall = this.getFirstDead(false);
		wall.spawn(spawnManager.minDeadZoneX - deadZoneBuffer, spawnManager.minDeadZoneY + wallSeparation, true);
		
		//Right Side
		wall = this.getFirstDead(false);
		wall.spawn(spawnManager.maxDeadZoneX + deadZoneBuffer, spawnManager.maxDeadZoneY - wallSeparation, true);
		wall = this.getFirstDead(false);
		wall.spawn(spawnManager.maxDeadZoneX + deadZoneBuffer, spawnManager.screenCenter.y, true);
		wall = this.getFirstDead(false);
		wall.spawn(spawnManager.maxDeadZoneX + deadZoneBuffer, spawnManager.minDeadZoneY + wallSeparation, true);
		
		//Top Side
		wall = this.getFirstDead(false);
		wall.spawn(spawnManager.minDeadZoneX + wallSeparation, spawnManager.minDeadZoneY - deadZoneBuffer, false);
		wall = this.getFirstDead(false);
		wall.spawn(spawnManager.screenCenter.x, spawnManager.minDeadZoneY - deadZoneBuffer, false);
		wall = this.getFirstDead(false);
		wall.spawn(spawnManager.maxDeadZoneX - wallSeparation, spawnManager.minDeadZoneY - deadZoneBuffer, false);
		
		//Bottom Side
		wall = this.getFirstDead(false);
		wall.spawn(spawnManager.minDeadZoneX + wallSeparation, spawnManager.maxDeadZoneY + deadZoneBuffer, false);
		wall = this.getFirstDead(false);
		wall.spawn(spawnManager.screenCenter.x, spawnManager.maxDeadZoneY + deadZoneBuffer, false);
		wall = this.getFirstDead(false);
		wall.spawn(spawnManager.maxDeadZoneX - wallSeparation, spawnManager.maxDeadZoneY + deadZoneBuffer, false);
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
}