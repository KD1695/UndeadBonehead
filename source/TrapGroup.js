class TrapGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene)
	{
		super(scene.physics.world, scene);
		this.createNewTraps();
	}
	
	spawnTrap(x, y)
	{
		var trap = this.getFirstDead(false);
		
		if (trap === null)
		{
			this.createNewTraps();
			trap = this.getFirstDead(false);
		}
		
		trap.spawn(x, y, this);
	}
	
	createNewTraps()
	{
		this.createMultiple(
		{
			classType:TrapObject,
			quantity: 20,
			active:false,
			visible:false,
			key:"trap",
		});	
	}
}