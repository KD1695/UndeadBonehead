//For whatever reason, the game craps itself when I just call this "Bomb" :|
class BombObject extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
    {	
		super(scene, x, y, 'bomb');		
		this.fuseTime = -1;
		this.setActive(false);
		this.setVisible(false);
		this.targeted = false;
		scene.sys.arcadePhysics.world.enableBody(this, 0)
    }
	
	spawn(spawnX, spawnY, bombGroup, explosionGroup)
	{		
		//console.log("Bomb Spawned at: (" + spawnX + ", " + spawnY + ")");
		
		this.x = spawnX;
		this.y = spawnY;
		this.body.setBounce(0.0000002,0.0000002);
        this.setCollideWorldBounds(true);
        this.setScale(2);
		this.setActive(true);
		this.setVisible(true);
		
		this.minActiveTime = 10;
		this.maxActiveTime = 15;
		
		this.fuseTime = Phaser.Math.Between(this.minActiveTime, this.maxActiveTime);
		
		this.bombGroup = bombGroup;
		this.explosionGroup = explosionGroup;
		
		if (this.explosionGroup === null)
		{
			console.log("Explosion group is null");
		}
		
		this.bombGroup.totalActiveBombs += 1;
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
		if (this.explosionGroup === null)
		{
			console.log("Explosion group is null IN EXPLODE BOMB");
		}
		
		this.bombGroup.totalActiveBombs -= 1;
		this.explosionGroup.spawnExplosion(this.x, this.y);
		this.destroy();
	}
}