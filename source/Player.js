class Player extends Phaser.GameObjects.Sprite
{
    constructor(config)
    {
        super(config.scene, config.x, config.y, "player");
        this.speed = 2.5;
        this.canRotate = true;
        this.canPunch = false;
        this.rpm = 400;
        this.secondsSinceLastShot = 60/this.rpm;
        config.scene.add.existing(this);
    }

    create(scene)
    {
        this.cursors = scene.input.keyboard.createCursorKeys();
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

        if (this.cursors.left.isDown)
        {
            if(this.canRotate)
                this.angle -= this.speed;
        }
        else if (this.cursors.right.isDown)
        {
            if(this.canRotate)
                this.angle += this.speed;
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
        let bullet = scene.physics.add.sprite(this.x, this.y, 'bullet').setScale(0.25);
        scene.physics.velocityFromRotation(this.angle, 600, bullet.body.velocity);
    }
}