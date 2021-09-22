class TrapObject extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
    {	
		super(scene, x, y, 'trap');		
		this.setActive(false);
		this.setVisible(false);
		scene.sys.arcadePhysics.world.enableBody(this, 0)
		
		this.trapUptime = 5;
		this.currentUptime = 0;
    }
	
	spawn(spawnX, spawnY, trapGroup)
	{		
		//console.log("Bomb Spawned at: (" + spawnX + ", " + spawnY + ")");
		
		this.x = spawnX;
		this.y = spawnY;
		this.setActive(true);
		this.setVisible(true);
		
		this.trapGroup = trapGroup;
	}
	
	preUpdate(timestep, dt)
	{
		super.preUpdate(timestep, dt);
				
		if (this.currentUptime < this.trapUptime)
		{
			this.currentUptime += dt / 1000;
		}
		else
		{
			this.destroyTrap();
		}
	}
	
	destroyTrap()
	{
		this.destroy();
	}
}