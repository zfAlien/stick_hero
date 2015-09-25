/**
 * Created by mq on 2015/9/23.
 */
var obSize = {width:120,height:287};
var limit={minWidth:50,maxWidth:140,between:40};
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
    _start:true,
    ctor:function(){
        this._super();
        this.ready();
        return true;
    },
    onTouchBegan:function(touch,event){
        event.getCurrentTarget().changeHeight();
        return true;
    },
    onTouchEnded:function(touch,event){
        if(this._start){
            event.getCurrentTarget().stopChangeHeight();
            return true;
        }

        return false;
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
        //this.obstacles
    },
    nextStep:function(){

    },
    changeHeight:function(){
        this.schedule(this.updateDB,0.02);
    },
    stopChangeHeight:function(){
        this.unschedule(this.updateDB);
    },
    updateDB:function(){
        this.stick.setScaleY(this.stick.getScaleY()+0.05);
    }

});

//障碍物
var obstaclesLayer=cc.Layer.extend({
    thisOB:null,//当前障碍物
    prevOB:null,//前一个障碍物
    nextOB:null,//下个障碍物
    ctor:function(){
        this._super();
        this.nextOB=new cc.Sprite(res.stick);
        this.nextOB.attr({
            x: cc.winSize.width/2,
            y:0,
            scaleX:10,
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
        var between=(cc.winSize.width-this.getRealW(this.thisOB)-nextW)*Math.random();
        between=between<limit.between?limit.between:between;
        //需要移动X轴距离
        var moveX=this.thisOB.x-this.getRealW(this.thisOB)/2;
        this.nextOB=new cc.Sprite(res.stick);
        this.nextOB.attr({
            x:between+this.getRealW(this.thisOB)+nextW/2,
            y:0,
            anchorY:0
        });
        this.addChild(this.nextOB);
    }
});
