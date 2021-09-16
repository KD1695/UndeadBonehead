class BugGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene)
	{
		super(scene.physics.world, scene);
		
		this.createNewBugs();
	}
	
	spawnBug(config)
	{
		var bug = this.getFirstDead(false);
		
		config.bombPhysicsGroup.getFirstDead(false);
		
		bug.spawn(config.x, config.y, config.bombPhysicsGroup);
	}
	
	createNewBugs()
	{
		this.createMultiple(
		{
			classType:BugObject,
			quantity: 15,
			active:false,
			visible:false,
			key:"bug",
		});	
	}
}