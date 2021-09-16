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
		this.moveSpeed = 400;
		this.currentPushDelayTime = 0;
		this.pushDelay = 1;
		this.stateDuration = Phaser.Math.Between(this.minStateDuration, this.maxStateDuration);
		this.currentStateTime = 0;
		scene.add.existing(this);
    }
	
	spawn(spawnX, spawnY, bombsPhysicsGroup, spawnManager)
	{		
		this.x = spawnX;
		this.y = spawnY;
		this.bombs = bombsPhysicsGroup;
		this.spawnManager = spawnManager
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
				this.targetingUpdate();
				break;
			case bugStates.PUSHING:
				this.pushingUpdate(dt / 1000);
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
		
		if (Math.abs(this.x - this.moveDestination.x) < 5 && Math.abs(this.y - this.moveDestination.y) < 5)
		{
			this.x = this.moveDestination.x;
			this.y = this.moveDestination.y;
			this.scene.physics.moveToObject(this, this, 0);
			this.currentState = bugStates.IDLE;
			this.currentStateTime = 0;
		}
		else
		{
			this.scene.physics.moveTo(this, this.moveDestination.x, this.moveDestination.y, this.moveSpeed);
		}
	}
	
	targetingUpdate()
	{
		if (this.targetBomb.active === true)
		{
			this.targetBomb.targeted = true;
			
			if (Math.abs(this.x - this.targetBomb.x) < 5 && Math.abs(this.y - this.targetBomb.y) < 5)
			{
				this.x = this.targetBomb.x;
				this.y = this.targetBomb.y;
				this.scene.physics.moveToObject(this, this, 0);
				this.currentState = bugStates.PUSHING;
			}
			else
			{
				this.moveTowardsBomb();
			}
		}
		else
		{
			this.scene.physics.moveToObject(this, this, 0);
			this.currentState = bugStates.IDLE;
		}
	}
	
	moveTowardsBomb()
	{
		var moveDirection = {x: this.targetBomb.x - this.x, y: this.targetBomb.y - this.y };
		
		var horizontalCollision = false;
		var verticalCollision = false;
		
		//Check for horizontal dead zone collision
		if (Math.abs(this.y - this.targetBomb.y) > 5)
		{
			if (moveDirection.x < 0)
			{
				for (let i = this.x; i > this.targetBomb.x; i--)
				{
					if (i < this.spawnManager.maxDeadZoneX)
					{
						if (this.y > this.spawnManager.minDeadZoneY && this.y < this.spawnManager.maxDeadZoneY)
						{
							horizontalCollision = true;
							break;
						}
					}
				}	
			}
			else
			{
				for (let i = this.x; i < this.targetBomb.x; i++)
				{
					if (i > this.spawnManager.minDeadZoneX)
					{
						if (this.y > this.spawnManager.minDeadZoneY && this.y < this.spawnManager.maxDeadZoneY)
						{
							horizontalCollision = true;
							break;
						}
					}
				}
			}
		}
		
		//Check for vertical dead zone collision
		if (Math.abs(this.x - this.targetBomb.x) > 5)
		{
			if (moveDirection.y < 0)
			{
				for (let i = this.y; i > this.targetBomb.y; i--)
				{
					if (i < this.spawnManager.maxDeadZoneY)
					{
						if (this.x > this.spawnManager.minDeadZoneX && this.x < this.spawnManager.maxDeadZoneX)
						{
							verticalCollision = true;
							break;
						}
					}
				}	
			}
			else
			{
				for (let i = this.y; i < this.targetBomb.y; i++)
				{
					if (i > this.spawnManager.minDeadZoneY)
					{
						if (this.x > this.spawnManager.minDeadZoneX && this.x < this.spawnManager.maxDeadZoneX)
						{
							verticalCollision = true;
							break;
						}
					}
				}
			}
		}
		
		/*
		if (this.y < this.spawnManager.minDeadZoneY && this.y > this.spawnManager.maxDeadZoneY)
		{
			verticalCollision = false;
		}
		
		if (this.x < this.spawnManager.minDeadZoneX && this.x > this.spawnManager.maxDeadZoneX)
		{
			horizontalCollision = false;
		}
		*/
		
		//Prioritize horizontal collisions first (picked arbitrarily)
		if (horizontalCollision === true)
		{
			console.log("Horizontal Collision! Bug Position: (" + this.x + ", " + this.y + ") Bomb Position: (" + this.targetBomb.x + ", " + this.targetBomb.y + ")");
			this.scene.physics.moveTo(this, this.x, this.targetBomb.y, this.moveSpeed);	
		}
		else if (verticalCollision === true)
		{
			console.log("Vertical Collision! Bug Position: (" + this.x + ", " + this.y + ") Bomb Position: (" + this.targetBomb.x + ", " + this.targetBomb.y + ")");
			this.scene.physics.moveTo(this, this.targetBomb.x, this.y, this.moveSpeed);	
		}
		else
		{
			console.log("No Collision");
			this.scene.physics.moveTo(this, this.targetBomb.x, this.targetBomb.y, this.moveSpeed);	
		}
	}
	
	pushingUpdate(timestep)
	{
		if (this.currentPushDelayTime < this.pushDelay)
		{
			this.currentPushDelayTime += timestep;
			return;
		}
		
		if (this.targetBomb.active === true)
		{
			if (this.hasEnteredDeadZone() === true)
			{
				console.log("Entered dead zone");
				this.currentState = bugStates.MOVING;
				this.currentPushDelayTime = 0;
				this.scene.physics.moveToObject(this, this, 0);
				this.scene.physics.moveToObject(this.targetBomb, this.targetBomb, 0);
				var moveDirection = {x: this.x - this.spawnManager.screenCenter.x, y: this.y - this.spawnManager.screenCenter.y };
				this.moveDestination = {x: this.x + moveDirection.x, y: this.y + moveDirection.y };
			}
			else
			{
				console.log("Pushing towards center");
				this.scene.physics.moveTo(this, this.spawnManager.screenCenter.x, this.spawnManager.screenCenter.y, this.moveSpeed);
				this.scene.physics.moveTo(this.targetBomb, this.spawnManager.screenCenter.x, this.spawnManager.screenCenter.y, this.moveSpeed);
			}
			
		}
		else
		{
			this.scene.physics.moveToObject(this, this, 0);
			this.currentPushDelayTime = 0;
			this.currentState = bugStates.IDLE;
		}
	}
	
	hasEnteredDeadZone()
	{
		//Left border
		if (Math.abs(this.x - this.spawnManager.minDeadZoneX) < 5 && this.y > this.spawnManager.minDeadZoneY && this.y < this.spawnManager.maxDeadZoneY)
		{
			console.log("Touched left border");
			return true;
		}
		//Right border
		if (Math.abs(this.x - this.spawnManager.maxDeadZoneX) < 5 && this.y > this.spawnManager.minDeadZoneY && this.y < this.spawnManager.maxDeadZoneY)
		{
			console.log("Touched right border");
			return true;
		}
		//Top border
		if (Math.abs(this.y - this.spawnManager.minDeadZoneY) < 5 && this.x > this.spawnManager.minDeadZoneX && this.x < this.spawnManager.maxDeadZoneX)
		{
			console.log("Touched top border");
			return true;
		}
		//Bottom border
		if (Math.abs(this.y - this.spawnManager.maxDeadZoneY) < 5 && this.x > this.spawnManager.minDeadZoneX && this.x < this.spawnManager.maxDeadZoneX)
		{
			console.log("Touched bottom border");
			return true;
		}
		
		return false;
	}
}