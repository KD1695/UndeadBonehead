class ObjectSpawnManager
{
	constructor(config)
    {	
		this.timeSinceLastObject = 0;
		
		this.minXSpawnPoint = 0;
		this.minYSpawnPoint = 0;	
		this.maxXSpawnPoint = 800;
		this.maxYSpawnPoint = 600;
	
		this.deadZoneWidth = 150;

		this.minDelayBetweenObjects = config.minDelay;
		this.maxDelayBetweenObjects = config.maxDelay;
	
		this.objectKey = config.objectKey;
	
		this.minDeadZoneX = config.camera.centerX - this.deadZoneWidth;
		this.minDeadZoneY = config.camera.centerY - this.deadZoneWidth;
		this.maxDeadZoneX = config.camera.centerX + this.deadZoneWidth;;
		this.maxDeadZoneY = config.camera.centerY + this.deadZoneWidth;;
		
		this.delayUntilNextObject = Phaser.Math.Between(this.minDelayBetweenObjects, this.maxDelayBetweenObjects);
    }
	
	shouldSpawnObject(timeScale)
	{		
		if (this.timeSinceLastObject < this.delayUntilNextObject)
		{
			this.timeSinceLastObject += timeScale;
			return false;
		}
		else
		{
			this.timeSinceLastObject = 0;
			this.delayUntilNextObject = Phaser.Math.Between(this.minDelayBetweenObjects, this.maxDelayBetweenObjects);
			return true;
		}
	}
	
    getObjectSpawnCoordinates()
	{		
		var xSpawnPoint =  Phaser.Math.Between(this.minXSpawnPoint, this.maxXSpawnPoint);
		var ySpawnPoint =  Phaser.Math.Between(this.minYSpawnPoint, this.maxYSpawnPoint);
		
		while (this.isInDeadZone({x:xSpawnPoint, y:ySpawnPoint}))
		{
			xSpawnPoint =  Phaser.Math.Between(this.minXSpawnPoint, this.maxXSpawnPoint);
			ySpawnPoint =  Phaser.Math.Between(this.minYSpawnPoint, this.maxYSpawnPoint);
		}
		
		return {x:xSpawnPoint, y:ySpawnPoint};
	}
	
	isInDeadZone(spawnPoint)
	{
		if (spawnPoint.x > this.minDeadZoneX && spawnPoint.x < this.maxDeadZoneX &&
		    spawnPoint.y > this.minDeadZoneY && spawnPoint.y < this.maxDeadZoneY)
		{
			return true;
		}
		
		return false;
	}
}