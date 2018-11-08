/**
 * Created by zoltan.varga on 13/08/2015.
 */
function WinSymbol(id){
    var symbolTextureNames=["t","j","q","k","a","1","2","3","4","5","s"];
    var iconTextures = [];

    for(var i = 0; i<symbolTextureNames.length;i++) {

        iconTextures.push(PIXI.Texture.fromFrame("win.symbol."+symbolTextureNames[i]));
    }

    PIXI.extras.MovieClip.call(this, iconTextures);

    this.id = id;
    this.gotoAndStop(this.id);
   // console.log("WinSymbol set to " + this.id);
}

WinSymbol.prototype = Object.create(PIXI.extras.MovieClip.prototype);
WinSymbol.prototype.constructor = WinSymbol;

WinSymbol.prototype.show = function(){
    this.visible = true;
    //console.log("Reel "+this.id+" show.");
}

WinSymbol.prototype.hide = function(){
    this.visible = false;
    //console.log("Reel "+this.id+" hide.");
}

WinSymbol.prototype.getId = function (){
    return this.id;
}

WinSymbol.prototype.setId = function(id,show){

    if(this.id != id)
    {
        this.id = id;
       this.gotoAndStop(this.id);
        this.visible = show;
    }
}
