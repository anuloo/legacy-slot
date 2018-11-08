/*var AssetLoader = ( function() {
    EventEmitter.call(this);
    var privateHello = 'hello twat';

    function doPrivateShit() {
        alert('awww yeaaaa');
    }



    return function() {

        this.myMethod = function() {
            doPrivateShit();
        };

        this.loadX = function(loaderConfig) {
            var loader = PIXI.loader;
            for(var obj in loaderConfig){
                console.log(obj);
                for(var key in loaderConfig[obj]){
                    //console.log(key);
                    loader.add(key,loaderConfig[obj][key]);
                }
            }
            loader.once('complete', onComplete);
            loader.load();
        };

        function onComplete(){
            var mySprite = PIXI.Sprite.fromFrame("symbol.k");
            var event = new CustomEvent("cat", {
                detail: {
                    hazcheeseburger: true
                }
            });
            this.emit("eventtest");

        }

    };

} )();*/
//EventEmitter = require('eventemitter3'),
function AssetLoader(){
    this.loadX = function(loaderConfig) {
        var loader = PIXI.loader;
        for(var obj in loaderConfig){
            //console.log(obj);
            for(var key in loaderConfig[obj]){
                //console.log(key);
                loader.add(key,loaderConfig[obj][key]);
            }
        }
        loader.once('complete', onComplete);
        loader.load();
    };

    function onComplete(){
        //var mySprite = PIXI.Sprite.fromFrame("symbol.k");
        Events.Dispatcher.dispatchEvent(new Event('ASSETS_LOADED'));

    }
}
