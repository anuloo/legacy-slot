/**
 * Created by jollzy on 13/08/2015.
 */
//EventEmitter = require('AssetLoader'),
var stage = new PIXI.Container();
var game = null;
var gameWidth = 1136;
var gameHeight = 640;
var size = getWindowBounds();
var renderer = PIXI.autoDetectRenderer(size.x, size.y);
var bgsound;


window.onload = function() {

    function loadJSON(file,callback) {

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            }
        };
        xobj.send(null);

    }



    function responseHandler(response) {
        // Parse JSON string into object
        var actual_JSON = JSON.parse(response);
        //console.log(actual_JSON);
        var assetLoader = new AssetLoader();
        Events.Dispatcher.addEventListener("ASSETS_LOADED",onAssetsLoaded);
        assetLoader.loadX(actual_JSON);
    }

    function loadSound(){
        var that = this;
        soundManager.setup({


            onready: function() {
				bgsound = soundManager.createSound({
                    id: "bgsound",
                    url: "sounds/bg.mp3"
                });
				
                soundManager.createSound({
                    id: "reelStop",
                    url: "sounds/reelstop.ogg"
                });
                soundManager.createSound({
                    id: "lineWin",
                    url: "sounds/linewin.ogg"
                });
            },

            ontimeout: function() {
                alert("oops no sound");
            }

        });
        /*var mysound = new Audio();
        mysound.src = "";*/
        /*this.bgsound.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);*/

    }

    function onAssetsLoaded(){
        Events.Dispatcher.removeEventListener("ASSETS_LOADED",onAssetsLoaded);
        //var bgTexture = PIXI.loader.resources["gameBackground"].texture;
        game = new Game();
        game.onAssetsLoaded();
        gameWidth = game.bg.getBounds().width;
        gameHeight = game.bg.getBounds().height;
        document.body.appendChild(renderer.view);

        requestAnimationFrame( animate );
        window.addEventListener('resize', onWindowResize);
        onWindowResize();
        console.log("[LOG:]ASSET LOADED");
        loadSound();

    }

    loadJSON("loaderAsset.json", responseHandler);

    function animate() {

        requestAnimationFrame( animate );

        // render the stage
        renderer.render(stage);
    };

};
function getWindowBounds(){
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    return new Point(x,y);
};

function Point(x, y){
    this.x = x;
    this.y = y;
};

function Rectangle(x,y,w,h){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
};

function onWindowResize(Event){
    var size = getWindowBounds();
    renderer.resize(size.x,size.y);

    var scaleX = size.x / gameWidth;
    var scaleY = size.y / gameHeight;
    var finalScale = scaleY;
    if(scaleX < scaleY){
        finalScale = scaleX;
    }

    var scale = new Point(finalScale, finalScale);

    // Temp: center everything on the stage!
    for(var child=0; child<stage.children.length; ++child){
        if(stage.children[child].resize)stage.children[child].resize({size:size,scale:scale});
    }
};
function loopSound(sound) {
    sound.play({
        onfinish: function() {
            loopSound(sound);
        }

    });
};