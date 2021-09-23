class ExplosionObject extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
    {	
		super(scene, x, y, 'explosion');		
		this.setActive(false);
		this.setVisible(false);
		scene.sys.arcadePhysics.world.enableBody(this, 0)
		
		this.explosionUptime = 0.5;
		this.currentUptime = 0;
    }
	
	spawn(spawnX, spawnY, explosionGroup)
	{		
		//console.log("Bomb Spawned at: (" + spawnX + ", " + spawnY + ")");
		
		this.x = spawnX;
		this.y = spawnY;
		this.setActive(true);
		this.setVisible(true);
		
		this.explosionGroup = explosionGroup;
		
		this.anims.create({
			key: 'explode',
			frames: [
				{key: 'explosion', frame: "Molotov_6.png"},
				{key: 'explosion', frame: "Molotov_7.png"},
 			],
			frameRate: 5,
			repeat: 0	
		});
		
		this.anims.play('explode', true);
	}
	
	preUpdate(timestep, dt)
	{
		super.preUpdate(timestep, dt);
				
		if (this.currentUptime < this.explosionUptime)
		{
			this.currentUptime += dt / 1000;
		}
		else
		{
			this.destroyExplosion();
		}
	}
	
	destroyExplosion()
	{
		this.destroy();
	}
}