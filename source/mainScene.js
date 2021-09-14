class SceneMain extends Phaser.Scene
{
    constructor()
    {
        super("SceneMain");
    }

    preload()
    {
        this.load.image("player", "assets/star.png");
		this.load.image("bomb", "assets/bomb.png");
    }

    create()
    {
        this.gameManager = new GameManager();
		this.player = new Player({scene:this,x:400,y:300});
		this.bomb = new Bomb({scene:this});
    }

    update()
    {
        this.player.update();
    }
}