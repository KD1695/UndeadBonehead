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
	
	spawn(spawnX, spawnY)
	{		
		this.x = spawnX;
		this.y = spawnY;
		this.setActive(true);
		this.setVisible(true);
	}
	
	preUpdate(timestep, dt)
	{
		super.preUpdate(timestep, dt);
		
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
	
	consumeBonus()
	{
		this.destroy();
	}
	
}