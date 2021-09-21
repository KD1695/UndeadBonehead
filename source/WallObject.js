class WallObject extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y)
    {	
		console.log("Creating Wall!");
		super(scene, x, y, 'horizontalWall');
		this.setActive(false);
		this.setVisible(false);
		scene.add.existing(this);
		scene.sys.arcadePhysics.world.enableBody(this, 0)
    }
	
	spawn(spawnX, spawnY, shouldRotate)
	{				
		console.log("Wall Spawned at: (" + spawnX + ", " + spawnY + ")");
		
		this.x = spawnX;
		this.y = spawnY;
		this.setActive(true);
		this.setVisible(true);
		this.body.enable = true;
		
		if (shouldRotate === true)
		{
			this.setTexture('verticalWall');
		}
	}
}