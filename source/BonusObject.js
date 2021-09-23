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
		this.setScale(2);
		this.trapGroup = trapGroup;
		this.setActive(true);
		this.setVisible(true);
		this.name = "none";
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('bonus', { start: 0, end: 2 }),
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