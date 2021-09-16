//For whatever reason, the game craps itself when I just call this "Bomb" :|
class BombObject extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
    {	
		super(scene, x, y, 'bomb');
		this.fuseTime = -1;
		this.setActive(false);
		this.setVisible(false);
		scene.add.existing(this);
    }
	
	spawn(spawnX, spawnY)
	{		
		this.x = spawnX;
		this.y = spawnY;
		this.setActive(true);
		this.setVisible(true);
		
		this.minActiveTime = 7;
		this.maxActiveTime = 10;
		
		this.fuseTime = Phaser.Math.Between(this.minActiveTime, this.maxActiveTime);
	}
	
	preUpdate(timestep, dt)
	{
		super.preUpdate(timestep, dt);
				
		if (this.fuseTime === -1)
		{
			return;
		}
		
		this.fuseTime -= dt / 1000;
		
		if (this.fuseTime <= 0)
		{
			this.explodeBomb();
		}
	}
	
	explodeBomb()
	{
		this.destroy();
	}
}