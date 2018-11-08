/**
 * Created by jollzy on 13/08/2015.
 */
var ButtonState = {
    SPIN: 0,
    STOP: 1
};

function SpinButton() {
    var size = getWindowBounds();
    this.state = ButtonState.SPIN;
    var buttonTextureResources = ["spin","stop"];
    var buttonTextures = [];
    for(var i=0; i< buttonTextureResources.length;i++){
        buttonTextures.push(PIXI.loader.resources[buttonTextureResources[i]].texture);
    }



    PIXI.extras.MovieClip.call(this,buttonTextures);
    this.setState(this.state);
    stage.addChild(this);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.position.x = size.x - this.width
    this.position.y = size.x/2;
    this.interactive = true;

    this.on('mousedown', onDown);
    this.on('touchstart', onDown);
    function onDown(event){
        if(this.state==ButtonState.SPIN) {
            this.setState(ButtonState.STOP);
            Events.Dispatcher.dispatchEvent(new Event("SPIN"));
        }else{
            //this.setState(ButtonState.SPIN);
            //Events.Dispatcher.dispatchEvent(new Event("STOP"));
        }
    }

}
SpinButton.prototype = Object.create(PIXI.extras.MovieClip.prototype);
SpinButton.prototype.constructor = SpinButton;

SpinButton.prototype.resize = function(data){
    // Scale both by X to maintain aspect ratio
    this.scale.x = data.scale.x;
    this.scale.y = data.scale.x;
    // Reposition to center
    this.position.x = data.size.x - this.width;
    this.position.y = data.size.y/2;
};

SpinButton.prototype.setState = function(state){
    this.state = state;
   // this.gotoAndStop(state);
    this.visible = false;
    if(state==ButtonState.SPIN){
       this.visible = true;
    }
};



