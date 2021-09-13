class SceneMain extends Phaser.Scene
{
    constructor()
    {
        super("SceneMain");
    }

    preload()
    {
        this.load.image("player", "assets/star.png");
    }

    create()
    {
        this.player = new Player({scene:this,x:400,y:300});
    }

    update()
    {
        this.player.update();
    }
}