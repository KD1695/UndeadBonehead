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
		this.name = "uncollided";
	    this.body.setBounce(0,0);
        this.setCollideWorldBounds(true);
		
		this.pushSpeed = 400;
		this.x = spawnX;
		this.y = spawnY;
        //this.setScale(1.5);
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
		
		this.anims.create({
			key: 'idle',
			frames: [
				{key: 'bomb', frame: "Molotov_1.png"},
				{key: 'bomb', frame: "Molotov_2.png"},
				{key: 'bomb', frame: "Molotov_3.png"},
				{key: 'bomb', frame: "Molotov_4.png"},
				{key: 'bomb', frame: "Molotov_5.png"},
 			],
			frameRate: 5,
			repeat: -1	
		});
		
		this.anims.play('idle', true);
	}
	
	preUpdate(timestep, dt)
	{
		super.preUpdate(timestep, dt);
		
		this.setVelocity(0,0);
		
		if (this.fuseTime === -1)
		{
			return;
		}
		
		this.fuseTime -= dt / 1000;
		
		if (this.name === "collided")
		{
			this.name = "pushing";
			var moveDirection = {x: this.x - this.scene.cameras.main.centerX, y: this.y - this.scene.cameras.main.centerY };
			this.moveDestination = {x: this.x + moveDirection.x, y: this.y + moveDirection.y };
			this.targeted = false;
		}
		
		if (this.name === "pushing")
		{
			this.pushBomb();
		}
		
		if (this.fuseTime <= 0)
		{
			this.explodeBomb();
		}
	}
	
	explodeBomb()
	{
		this.scene.bombExplodeSound.play();
		
		if (this.explosionGroup === null)
		{
			console.log("Explosion group is null IN EXPLODE BOMB");
		}
		
		this.bombGroup.totalActiveBombs -= 1;
		this.explosionGroup.spawnExplosion(this.x, this.y);
		this.destroy();
	}
	
	pushBomb()
	{
		
		
		if (Math.abs(this.x - this.moveDestination.x) < 5 && Math.abs(this.y - this.moveDestination.y) < 5)
		{
			this.x = this.moveDestination.x;
			this.y = this.moveDestination.y;
			this.scene.physics.moveToObject(this, this, 0);
			this.name = "uncollided";
		}
		else
		{
			this.scene.physics.moveTo(this, this.moveDestination.x, this.moveDestination.y, this.pushSpeed);
		}
		
	}
}