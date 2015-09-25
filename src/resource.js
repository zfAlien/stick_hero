var res = {
    HelloWorld_png : "res/HelloWorld.png",
    MainScene_json : "res/MainScene.json",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    bg_0:"res/texture/background0.png",
    bg_1:"res/texture/background1.png",
    bg_2:"res/texture/background2.png",
    bg_3:"res/texture/background3.png",
    stick:"res/texture/stick_black.png",
    start_bt:"res/texture/start_normal.png",
    start_bts:"res/texture/start_select.png",
    walk_plist:"res/texture/walk.plist",
    walk_png:"res/texture/walk.png",
    yao_plist:"res/texture/yao.plist",
    yao_png:"res/texture/yao.png"

};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
