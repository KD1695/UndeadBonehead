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
		
		//console.log("Game Manager Check: " + config.gameManager.bugsSpawned);
		
		bug.spawn(config.x, config.y, config.bombsPhysicsGroup);
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