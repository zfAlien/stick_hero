/**
 * Created by mq on 2015/9/23.
 */
var obSize = {width:120,height:287};
var limit={minWidth:70,maxWidth:140,between:40};
function playerSprite(){
    var self=this;
    this.sfCache=cc.spriteFrameCache;
    this.sfCache.addSpriteFrames(res.yao_plist,res.yao_png);
    this.sfCache.addSpriteFrames(res.walk_plist,res.walk_png);
    self.player = new cc.Sprite('#d0001.png');
    cc.log(self.player);
    var playSize = self.player.getContentSize();
    self.player.setScale(1, 1);
    self.player.x = cc.winSize.width / 2;
    self.player.y = obSize.height + playSize.height / 2;
    this.yaoAction=function(flag){
        self.player.stopAllActions();
        var animFrames = [];
        var str = "";
        var frame;
        for(var i=1;i<10;i++){
            str = "d00" + (i < 10 ? ("0" + i) : i) + ".png";
            frame=self.sfCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, flag);
        return cc.animate(animation).repeatForever();
    };
    this.yao=function(flag){
        this.player.runAction(this.yaoAction(flag));
    }
    this.walkAction=function(flag){
        self.player.stopAllActions();
        var animFrames = [];
        var str = "";
        var frame;
        for(var i=1;i<10;i++){
            str = "z00" + (i < 10 ? ("0" + i) : i) + ".png";
            frame=self.sfCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, flag);
        return cc.animate(animation).repeatForever();
    };
    this.walk=function(flag){
        this.player.runAction(this.walkAction(flag));
    }
}

//棍子
//var stickView=cc.Sprite.extend({
//    ctor:function(){
//        this._super();
//        this.initWithFile(res.stick);
//        return true;
//    }
//});

//游戏背景
var GameView=cc.Layer.extend({
    audioEngine:cc.audioEngine,
    ps:null,
    obstacles:null,
    stick:null,
    ss:21,
    menu:null,
    score:null,
    _start:false,
    ctor:function(){
        this._super();
        this.ready();
        return true;
    },
    onTouchBegan:function(touch,event){
        var self=event.getCurrentTarget();
        if(self._start){
            self.changeHeight();
            self._start=false;
            return true;
        }

        return false;
    },
    onTouchEnded:function(touch,event){
        event.getCurrentTarget().stopChangeHeight();
        return true;
    },
    ready:function(){
        var bg=new cc.Sprite(res.bg_0);
        bg.attr({
            x:cc.winSize.width/2,
            y:cc.winSize.height/2
        });
        this.addChild(bg);
        this.ps=new playerSprite();
        var npc=this.ps;
        this.addChild(npc.player);
        this.ps.player.runAction(this.ps.yaoAction(0.1));
        this.obstacles=new obstaclesLayer();//初始化障碍物
        this.addChild(this.obstacles);
        this.stick=new cc.Sprite(res.stick);
        this.stick.attr({
            x:cc.winSize.width/2,
            y:obSize.height,
            scaleY:0,
            anchorY:0
        });
        this.addChild(this.stick);
    },
    start:function(){
        var self = this;
        var listener=cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: self.onTouchBegan,
            onTouchEnded:self.onTouchEnded
        });
        cc.eventManager.addListener(listener,self);
        this.obstacles.updateOB();
        this.nextStep();
    },
    nextStep:function(between){
        var moveX;
        //向后移动
        if(this.obstacles.prevOB!=null){
            moveX=between+this.obstacles.getRealW(this.obstacles.prevOB);
        }else{
            moveX=this.obstacles.thisOB.x-this.obstacles.getRealW(this.obstacles.thisOB)/2;
        }
        var moveBy=new cc.moveBy(moveX/500,cc.p(-moveX,0));
        var moveByPS=new cc.moveBy(moveX/500 ,cc.p(-moveX,0));
        var moveByStick=new cc.moveBy(moveX/500,cc.p(-moveX,0));
        //移动猴子动作
        var move_ps=new cc.CallFunc(function(){this.ps.player.runAction(moveByPS)},this);
        //移动木棍动作
        var move_stick=new cc.CallFunc(function(){this.stick.runAction(moveByStick)},this);
        //建立一个同时执行的动作,移动障碍物的同时，添加移动木棍和猴子的动作
        var spawn=new cc.Spawn(moveBy,move_ps,move_stick);
        //移动结束后需要移除超出边界的上一个障碍物
        this.obstacles.runAction(new cc.Sequence(spawn,new cc.CallFunc(function(){
            if(this.obstacles.prevOB!=null){
                this.obstacles.prevOB.removeFromParent(true);
            }
            this.stick.removeFromParent(true);
            this.stick=new cc.Sprite(res.stick);
            this.stick.attr({
                x:this.obstacles.getRealW(this.obstacles.thisOB)-this.stick.getContentSize().width/2,
                y:obSize.height,
                scaleY:0,
                anchorY:0
            });
            this.addChild(this.stick);
            this._start=true;
        },this)));
    },
    changeHeight:function(){
        this.schedule(this.updateDB,0.02);
    },
    stopChangeHeight:function(){
        this.unschedule(this.updateDB);
        this.drawWalk();
    },
    updateDB:function(){
        this.stick.setScaleY(this.stick.getScaleY()+0.05);
    },
    stickRealH:function(item){
        return item.getScaleY()*item.getContentSize().height;
    },
    drawWalk:function(){
        this.stick.runAction(new cc.RotateTo(0.01,90));
        var between=this.obstacles.between;
        //障碍物左边的位置
        var left=between;
        var right=between+this.obstacles.getRealW(this.obstacles.nextOB);
        var height=this.stickRealH(this.stick);
        if(height<left||height>right){
            var move=new cc.MoveBy(height/500,new cc.p(height,0));
            var rotate=new cc.RotateTo(0.01,90);
            var fallHeight=this.obstacles.thisOB.getContentSize().height+this.ps.player.getContentSize().width;
            var fall=new cc.MoveBy(fallHeight/500,new cc.p(50,-fallHeight));
            var spawn=new cc.Spawn(rotate,fall,new cc.CallFunc(function(){
                var rotate=new cc.RotateTo(0.01,120);
                var fallHeight=this.obstacles.thisOB.getContentSize().height+this.stick.getContentSize().width;
                var fall=new cc.MoveBy(fallHeight/500,new cc.p(0,-fallHeight));
                var spawn=new cc.Spawn(rotate,fall);
                this.stick.runAction(spawn);
            },this));
            var seq=new cc.Sequence(move,spawn);
            this.ps.player.runAction(seq);
            //this.addChild(new GameOver());
        }else{
            var moveX=between+this.obstacles.getRealW(this.obstacles.nextOB);
            var move=new cc.MoveBy(moveX/500,new cc.p(moveX,0));
            var seq=new cc.Sequence(move,new cc.CallFunc(function(){this.obstacles.updateOB();},this),new cc.CallFunc(function(){this.nextStep(between);},this));
            this.ps.player.runAction(seq);
        }

    }

});

//障碍物
var obstaclesLayer=cc.Layer.extend({
    thisOB:null,//当前障碍物
    prevOB:null,//前一个障碍物
    nextOB:null,//下个障碍物,
    between:null,//下个障碍物间距
    ctor:function(){
        this._super();
        this.nextOB=new cc.Sprite(res.stick);
        this.nextOB.attr({
            x: cc.winSize.width/2,
            y:0,
            scaleX:14,
            anchorY:0
        });
        this.addChild(this.nextOB);
        return true;
    },
    getRealW:function(item){
        return item.getContentSize().width*item.getScaleX() ;
    },
    updateOB:function(){
        if(this.thisOB!=null){//判断是否第一次开始游戏
            this.prevOB=this.thisOB;
        }
        this.thisOB=this.nextOB;
        //下个障碍物的宽度
        var nextW=Math.random()*limit.maxWidth;
        nextW=nextW<limit.minWidth?limit.minWidth:nextW;
        //下个障碍物与原先障碍物的距离
        this.between=(cc.winSize.width-this.getRealW(this.thisOB)-nextW)*Math.random();
        this.between=this.between<limit.between?limit.between:this.between;
        this.nextOB=new cc.Sprite(res.stick);
        this.nextOB.attr({
            x:this.between+nextW/2+this.thisOB.x+this.getRealW(this.thisOB)/2,
            y:0,
            anchorY:0,
            scaleX:nextW/this.getRealW(this.nextOB)
        });
        this.addChild(this.nextOB);
    }
});
