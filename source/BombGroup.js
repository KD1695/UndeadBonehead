class BombGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene)
	{
		super(scene.physics.world, scene);
		this.totalActiveBombs = 0;
		this.createNewBombs();
	}
	
	spawnBomb(x, y, explosionGroup)
	{
		var bomb = this.getFirstDead(false);
		
		if (bomb === null)
		{
			this.createNewBombs();
			bomb = this.getFirstDead(false);
		}
		
		bomb.spawn(x, y, this, explosionGroup);
	}
	
	createNewBombs()
	{
		this.createMultiple(
		{
			classType:BombObject,
			quantity: 20,
			active:false,
			visible:false,
			key:"bomb",
		});	
	}
}