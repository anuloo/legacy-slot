/**
 * Created by zoltan.varga on 13/08/2015.
 */
function Symbol(id){
    var symbolTextureNames=["t","j","q","k","a","1","2","3","4","5","s"];
    var iconTextures = [];

    for(var i = 0; i<symbolTextureNames.length;i++) {

        iconTextures.push(PIXI.Texture.fromFrame("symbol."+symbolTextureNames[i]));
    }

    PIXI.extras.MovieClip.call(this, iconTextures);

    this.id = id;
    this.gotoAndStop(this.id);
    //console.log("Symbol set to " + this.id);
}

Symbol.prototype = Object.create(PIXI.extras.MovieClip.prototype);
Symbol.prototype.constructor = Symbol;

Symbol.prototype.spin = function(){
    //console.log("Reel "+this.id+" spin.");
}
Symbol.prototype.getId = function (){
    return this.id;
}
Symbol.prototype.setId = function(id,blur){

    if(blur){
        this.filters = [blur];
    }else{
        this.filters = null;
    }
    if(this.id != id)
    {

        this.id = id;
       this.gotoAndStop(this.id);
    }
}