class ExplosionGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene)
	{
		super(scene.physics.world, scene);
		this.totalActiveBombs = 0;
		this.createNewExplosions();
	}
	
	spawnExplosion(x, y)
	{
		var explosion = this.getFirstDead(false);
		
		if (explosion === null)
		{
			this.createNewExplosions();
			explosion = this.getFirstDead(false);
		}
		
		explosion.spawn(x, y, this);
	}
	
	createNewExplosions()
	{
		this.createMultiple(
		{
			classType:ExplosionObject,
			quantity: 20,
			active:false,
			visible:false,
			key:"explosion",
		});	
	}
}