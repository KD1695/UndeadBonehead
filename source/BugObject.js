const bugStates = 
	{
		IDLE : 0,
		MOVING : 1,
		TARGETING : 2,
		PUSHING : 3,
		DEAD : 4
	};

class BugObject extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
    {			
		super(scene, x, y, 'bug');	
		this.setActive(false);
		this.setVisible(false);
		this.currentState = bugStates.IDLE;
		this.minStateDuration = 0.5;
		this.maxStateDuration = 1.5;
		this.randomMoveDirection = {x: 0, y: 0}
		this.moveSpeed = 200;
		this.stateDuration = Phaser.Math.Between(this.minStateDuration, this.maxStateDuration);
		this.currentStateTime = 0;
		scene.add.existing(this);
    }
	
	spawn(spawnX, spawnY, bombsPhysicsGroup)
	{		
		this.x = spawnX;
		this.y = spawnY;
		this.bombs = bombsPhysicsGroup;
		this.setActive(true);
		this.setVisible(true);
	}
	
	preUpdate(timestep, dt)
	{	
		switch (this.currentState)
		{
			case bugStates.IDLE:
				this.idleUpdate(dt / 1000);
				break;
			case bugStates.MOVING:
				this.movingUpdate(dt / 1000);
				break;
			case bugStates.TARGETING:
				this.targetingUpdate(dt / 1000);
				break;
			default:
				break;
		}
	}
	
	idleUpdate(timestep)
	{		
		if (this.currentStateTime < this.stateDuration)
		{
			this.currentStateTime += timestep;
			return;
		}
		
		this.stateDuration = Phaser.Math.Between(this.minStateDuration, this.maxStateDuration);
		this.currentStateTime = 0;
		
		this.currentState = bugStates.TARGETING;
		
		this.getRandomTargetBomb();
		
		//Retry a maximum of 20 times to find an untargeted bomb
		for (let i = 0; i < 20; i++)
		{
			if (this.targetBomb.targeted === false)
			{
				break;
			}
			
			this.getRandomTargetBomb();
		}
		
		//Return to idle if no targeted bomb was found
		if (this.targetBomb.targeted === true)
		{
			this.currentState = bugStates.IDLE;
		}
	}
	
	getRandomTargetBomb()
	{
		var targetBombIndex = Phaser.Math.Between(0, this.bombs.totalActiveBombs);
		
		if (targetBombIndex === 0)
		{
			this.targetBomb = this.bombs.getFirstAlive();
		}
		else
		{
			this.targetBomb = this.bombs.getFirstNth(targetBombIndex, true);	
		}
	}
	
	movingUpdate(timestep)
	{
		console.log("MOVING");
		
		if (this.currentStateTime < this.stateDuration)
		{
			this.currentStateTime += timestep;
			return;
		}
		
		this.stateDuration = Phaser.Math.Between(this.minStateDuration, this.maxStateDuration);
		this.currentStateTime = 0;
		
		//30% chance bug goes into TARGETING mode from MOVING
		var targetingChance = Phaser.Math.Between(0, 100);
		if (targetingChance < 30)
		{
			this.currentState = bugStates.TARGETING;
		}
		else
		{
			this.currentState = bugStates.IDLE;	
		}
	}
	
	targetingUpdate(timestep)
	{
		if (this.targetBomb.active === true)
		{
			this.targetBomb.targeted = true;
			
			if (Math.abs(this.x - this.targetBomb.x) < 5 && Math.abs(this.y - this.targetBomb.y) < 5)
			{
				this.scene.physics.moveToObject(this, this.targetBomb, 1);
			}
			else
			{
				this.scene.physics.moveToObject(this, this.targetBomb, this.moveSpeed);	
			}
		}
		else
		{
			this.scene.physics.moveToObject(this, this, 0);
			this.currentState = bugStates.IDLE;
		}	
	}
}