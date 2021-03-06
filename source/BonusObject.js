class BonusObject extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
    {	
		super(scene, x, y, 'bonus');		
		this.setActive(false);
		this.setVisible(false);
		
		this.currentColliderDelay = 0;
		this.colliderDelay = 1;
		this.colliderActive = false;
		
		this.scene.sys.arcadePhysics.world.disableBody(this);
    }
	
	spawn(spawnX, spawnY, trapGroup)
	{		
		this.x = spawnX;
		this.y = spawnY;
		this.trapGroup = trapGroup;
		this.setActive(true);
		this.setVisible(true);
		this.name = "none";
		this.setScale(1.25);
		
		this.anims.create({
			key: 'idle',
			frames: [
				{key: 'bonus', frame: "ManaPotion_1.png"},
				{key: 'bonus', frame: "ManaPotion_2.png"},
				{key: 'bonus', frame: "ManaPotion_3.png"},
 			],
			frameRate: 5,
			repeat: -1	
		});
		
		this.anims.play('idle', true);
	}
	
	preUpdate(timestep, dt)
	{
		super.preUpdate(timestep, dt);
		
		if (this.name === "explode")
		{
			this.explodeBonus();
			return;
		}
		
		if (this.name === "consumed")
		{
			this.consumeBonus();
			return;
		}
		
		if (this.currentColliderDelay >= this.colliderDelay && this.name !== "colliderActive")
		{
			this.name = "colliderActive";
			this.scene.sys.arcadePhysics.world.enableBody(this, 0);
		}
		else
		{
			this.currentColliderDelay += (dt / 1000);
		}
	}
	
	explodeBonus()
	{	
		this.scene.gameManager.trapsPhysicsGroup.spawnTrap(this.x, this.y);
		this.destroy();
	}
	
	consumeBonus()
	{
		this.destroy();
	}
	
}