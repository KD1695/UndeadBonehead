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
		scene.add.existing(this);
    }
	
	spawn(spawnX, spawnY, bombGroup)
	{		
		//console.log("Bomb Spawned at: (" + spawnX + ", " + spawnY + ")");
		
		this.x = spawnX;
		this.y = spawnY;
		this.body.setBounce(0.0000002,0.0000002);
        this.setCollideWorldBounds(true);
        this.setScale(2);
		this.setActive(true);
		this.setVisible(true);
		
		this.minActiveTime = 15;
		this.maxActiveTime = 20;
		
		this.fuseTime = Phaser.Math.Between(this.minActiveTime, this.maxActiveTime);
		
		this.bombGroup = bombGroup;
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
		this.bombGroup.totalActiveBombs -= 1;
		this.destroy();
	}
}