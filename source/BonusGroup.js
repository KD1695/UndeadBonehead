class BonusGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene)
	{
		super(scene.physics.world, scene);
		this.createNewBonuses();
	}
	
	spawnBonus(x, y, trapGroup)
	{
		var bonus = this.getFirstDead(false);
		
		if (bonus === null)
		{
			this.createNewBonuses();
			bonus = this.getFirstDead(false);
		}
		
		bonus.spawn(x, y, trapGroup);
	}
	
	createNewBonuses()
	{
		this.createMultiple(
		{
			classType:BonusObject,
			quantity: 20,
			active:false,
			visible:false,
			key:"bonus",
		});	
	}
}