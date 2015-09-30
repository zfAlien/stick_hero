/**
 * Created by mq on 2015/9/29.
 */
var GameOver=cc.Layer.extend({
    ctor:function(){
        this._super();

        var menu=new cc.MenuItemImage(res.start_bt,res.start_bts,function(){cc.log(1)},this);
        menu.attr({
            x:cc.winSize.width/2,
            y:cc.winSize.height/2*1.5

        });

        var listener=cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){cc.log(2222);},
            onTouchEnded:self.onTouchEnded
        });
        menu.addTouchEventListener(listener,menu);
        this.addChild(menu,5);
        return true;
    }
});
