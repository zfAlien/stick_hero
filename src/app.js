var gameView=null;
var FontLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add a "close" icon to exit the progress. it's an autorelease object
       var closeItem = new cc.MenuItemImage(
           res.start_bt,
           res.start_bts,
           this.start,
           this);
       closeItem.attr({
           x: size.width/2,
           y: size.height/2,
           anchorX: 0.5,
           anchorY: 0.5,
           scaleY:3,
           scaleX:3,
           opacity :0.2
       });
       var fadeIn=new cc.FadeIn(1);
        var scaleIn=new cc.ScaleTo(1,1,1);
       //var menu = new cc.Menu(closeItem);
       closeItem.runAction(new cc.Spawn(fadeIn,scaleIn));
       var menu = new cc.Menu(closeItem);
       menu.x = 0;
       menu.y = 0;
       this.addChild(menu, 1);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("猴子传奇", "Arial", 64);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2+120;
        helloLabel.anchorY=0;
        helloLabel.color="#000000";
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);
        return true;
    },
    start:function(){
        this.removeFromParent(true);
        gameView.start();
    }
});

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new FontLayer();
        this.addChild(layer,2);
        gameView=new GameView();
        this.addChild(gameView);

    }
});

