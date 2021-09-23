class Player
{
    constructor(config)
    {
        this.rotationSpeed = 0.04;
        this.canRotate = true;
        this.canPunch = true;
        this.rpm = 400;
        this.animationAngle = 0;
        this.secondsSinceLastShot = 60/this.rpm;

		this.inputsUntilBonusConsumption = 7;
		this.currentInputsConsumingBonus = 0;
        this.spaceMashBar = config.scene.add.rectangle(300, 580, 490, 5, 0x1dd6d3);
        this.spaceMashBar.visible = false;
        this.scene = config.scene;
		
        this.playerSprite = config.scene.physics.add.sprite(config.x, config.y, 'player');
        this.familiarSprite = config.scene.physics.add.sprite(config.x, config.y, 'familiars');
    }

    create(scene)
    {
        this.playerSprite.anims.create({
            key: 'S',
            frames: [ { key: 'player', frame: 0 } ],
            frameRate: 20
        });
		this.playerSprite.anims.create({
            key: 'SW',
            frames: [ { key: 'player', frame: 1 } ],
            frameRate: 20
        });
		this.playerSprite.anims.create({
            key: 'W',
            frames: [ { key: 'player', frame: 2 } ],
            frameRate: 20
        });
		this.playerSprite.anims.create({
            key: 'NW',
            frames: [ { key: 'player', frame: 3 } ],
            frameRate: 20
        });
		this.playerSprite.anims.create({
            key: 'N',
            frames: [ { key: 'player', frame: 4 } ],
            frameRate: 20
        });
		this.playerSprite.anims.create({
            key: 'NE',
            frames: [ { key: 'player', frame: 5 } ],
            frameRate: 20
        });
		this.playerSprite.anims.create({
            key: 'E',
            frames: [ { key: 'player', frame: 6 } ],
            frameRate: 20
        });
		this.playerSprite.anims.create({
            key: 'SE',
            frames: [ { key: 'player', frame: 7 } ],
            frameRate: 20
        });	
		
        this.punchGroup = scene.physics.add.group();
        
		scene.gameManager.bone = this.punchGroup.create(this.playerSprite.x-30, this.playerSprite.y, 'bat');
		scene.gameManager.chain = this.scene.add.tileSprite(this.playerSprite.x, this.playerSprite.y, 8, 0, "boneLink");
		scene.gameManager.punch = this.punchGroup.create(this.playerSprite.x+30, this.playerSprite.y, 'boneHand');
        scene.gameManager.bone.anims.create({
            key: 'idle',
			frames: scene.gameManager.punch.anims.generateFrameNumbers('bat', { start: 0, end: 2 }),
			frameRate: 8,
			repeat: -1
        });
		
		scene.gameManager.bone.anims.play("idle", true);
		
		scene.gameManager.chain.originY = 1;
		scene.gameManager.chain.setVisible(false);
		scene.gameManager.chain.setDepth(2);
		scene.gameManager.punch.setDepth(3);
		this.playerSprite.setDepth(4);
		scene.gameManager.bone.setScale(1.5);
		scene.gameManager.punch.setScale(1.5);
        this.cursors = scene.input.keyboard.createCursorKeys();
        scene.gameManager.bulletGroup = scene.physics.add.group();
    }

    update(scene, dt)
    {		
		if(this.canPunch == false)
        {
            //rotate player if needed
        }
        else
        {
            this.updateAnimation();
			//this.playerSprite.anims.play('S', true);
        }

		if (scene.gameManager.playerGrabbedBonus === true)
		{
            this.spaceMashBar.visible = true;
			if (this.cursors.space.isDown && this.cursors.space.getDuration() < 8)
			{
				this.consumeBonus(scene);				
			}
		}
        else
        {
            this.spaceMashBar.visible = false;
        }
		
        if (this.cursors.left.isDown)
        {
            if(this.canRotate)
            {
                if (scene.gameManager.playerGrabbedBonus === false)
				{
					this.familiarSprite.rotation -= this.rotationSpeed;
					Phaser.Actions.RotateAroundDistance(this.punchGroup.getChildren(), {x : this.playerSprite.x, y : this.playerSprite.y}, -this.rotationSpeed, 30);	
				}
            }
        }
        else if (this.cursors.right.isDown)
        {
            if(this.canRotate)
            {
                if (scene.gameManager.playerGrabbedBonus === false)
				{
					this.familiarSprite.rotation += this.rotationSpeed;
					Phaser.Actions.RotateAroundDistance(this.punchGroup.getChildren(), {x : this.playerSprite.x, y : this.playerSprite.y}, this.rotationSpeed, 30);	
				}
            }
        }
        if(this.cursors.up.isDown)
        {
            if(this.canPunch)
            {
                if (scene.gameManager.playerGrabbedBonus === false)
				{
					scene.punchSound.play();
					
					var angle = this.familiarSprite.rotation;
					var currentX = scene.gameManager.punch.x;
					var currentY = scene.gameManager.punch.y;
					var punchDistance = 250;
					this.Punch(true);
					var punchTween = scene.tweens.add({
						targets: scene.gameManager.punch,
						props: {
							x: { value: function () { return currentX + punchDistance*Math.cos(angle); }, ease: 'Power2' },
							y: { value: function () { return currentY + punchDistance*Math.sin(angle);; }, ease: 'Power2' }
						},
						duration: 500,
						delay: 50,
						yoyo: true,
						onComplete: this.onCompleteHandler.bind(this)
					});
				}
            }
        }
        if(this.cursors.down.isDown)
        {
            if(this.canRotate && this.secondsSinceLastShot >= 60/this.rpm)
            {
                if (scene.gameManager.playerGrabbedBonus === false)
				{
					this.Shoot(scene);
					this.secondsSinceLastShot = 0;	
				}
            }
        }
        this.secondsSinceLastShot += dt/1000;
		
		if (Phaser.Math.Distance.Between(this.playerSprite.x, this.playerSprite.y, scene.gameManager.punch.x, scene.gameManager.punch.y) > 35)
		{
			scene.gameManager.chain.setVisible(true);
		}
		else
		{
			scene.gameManager.chain.setVisible(false);
		}
		
		scene.gameManager.chain.height = Phaser.Math.Distance.Between(this.playerSprite.x, this.playerSprite.y, scene.gameManager.punch.x, scene.gameManager.punch.y);
		scene.gameManager.chain.rotation = this.familiarSprite.rotation + (Math.PI / 2);
		scene.gameManager.punch.rotation = this.familiarSprite.rotation;
    }

    Punch(isPunching)
    {
		this.canPunch = !isPunching;
        this.canRotate = !isPunching;
    }

    onCompleteHandler()
    {
        this.Punch(false);
    }

    Shoot(scene)
    {
        scene.shootSound.play();
		let bullet = scene.gameManager.bulletGroup.create(this.playerSprite.x,this.playerSprite.y,'bone');
        bullet.body.setBounce(0,0);
        bullet.setScale(1.5);
        scene.physics.velocityFromAngle(this.familiarSprite.angle-180, 600, bullet.body.velocity);
    }

    createAnimation()
    {
        this.anims.create({
            key: 'rotate',
            frames: this.playerSprite.anims.generateFrameNumbers('player', { start: Math.floor(Math.abs(this.animationAngle)/40), end: Math.floor(Math.abs(this.familiarSprite.angle)/40) }),
            frameRate: 10,
            repeat: 0
        });
    }
	
	consumeBonus(scene)
	{
		if (this.currentInputsConsumingBonus < this.inputsUntilBonusConsumption)
		{
            this.spaceMashBar.displayWidth = 490-this.currentInputsConsumingBonus*70;
			scene.powerUpChewSound.play();
			this.currentInputsConsumingBonus++;
		}
		else
		{
			scene.powerUpCompleteSound.play();
			scene.gameManager.playerConsumedBonus = true;
			this.currentInputsConsumingBonus = 0;
            this.spaceMashBar.visible = false;
            this.spaceMashBar.displayWidth = 490;
		}
	}
	
	updateAnimation()
	{
		var currentRotation = Math.abs(360 + (this.familiarSprite.rotation * (180/Math.PI))) % 360;
		
		if (currentRotation < 30)
		{
			this.playerSprite.anims.play('E', true);
		}
		else if (currentRotation < 60)
		{
			this.playerSprite.anims.play('SE', true);
		}
		else if (currentRotation < 120)
		{
			this.playerSprite.anims.play('S', true);
		}
		else if (currentRotation < 150)
		{
			this.playerSprite.anims.play('SW', true);
		}
		else if (currentRotation < 210)
		{
			this.playerSprite.anims.play('W', true);
		}
		else if (currentRotation < 240)
		{
			this.playerSprite.anims.play('NW', true);
		}
		else if (currentRotation < 300)
		{
			this.playerSprite.anims.play('N', true);
		}
		else if (currentRotation < 330)
		{
			this.playerSprite.anims.play('NE', true);
		}
		else
		{
			this.playerSprite.anims.play('E', true);
		}
	}
}