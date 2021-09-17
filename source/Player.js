class Player
{
    constructor(config)
    {
        this.rotationSpeed = 0.02;
        this.canRotate = true;
        this.canPunch = true;
        this.rpm = 400;
        this.animationAngle = 0;
        this.secondsSinceLastShot = 60/this.rpm;

        this.playerSprite = config.scene.physics.add.sprite(config.x, config.y, 'player');
        this.familiarSprite = config.scene.physics.add.sprite(config.x, config.y, 'familiars');
    }

    create(scene)
    {
        this.playerSprite.anims.create({
            key: 'front',
            frames: [ { key: 'player', frame: 0 } ],
            frameRate: 20
        });
        this.cursors = scene.input.keyboard.createCursorKeys();
        scene.gameManager.bulletGroup = scene.physics.add.group();
    }

    update(scene, dt)
    {
        if(this.canPunch == false)
        {
            //punch animation frames
            //check punch animation frames end
            //reset punch state
            this.Punch(false);
        }
        else
        {
            this.playerSprite.anims.play('front', true);
        }

        if (this.cursors.left.isDown)
        {
            if(this.canRotate)
                this.familiarSprite.rotation -= this.rotationSpeed;
        }
        else if (this.cursors.right.isDown)
        {
            if(this.canRotate)
                this.familiarSprite.rotation += this.rotationSpeed;
        }
        if(this.cursors.up.isDown)
        {
            if(this.canPunch)
                this.Punch(true);
        }
        if(this.cursors.down.isDown)
        {
            if(this.canRotate && this.secondsSinceLastShot >= 60/this.rpm)
            {
                this.Shoot(scene);
                this.secondsSinceLastShot = 0;
            }
        }
        this.secondsSinceLastShot += dt/1000;
    }

    Punch(isPunching)
    {
        this.canPunch = !isPunching;
        this.canRotate = !isPunching;
    }

    Shoot(scene)
    {
        let bullet = scene.gameManager.bulletGroup.create(this.playerSprite.x,this.playerSprite.y,'bullet');
        bullet.body.setBounce(0,0);
        bullet.setScale(0.25);
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
}