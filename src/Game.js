/**
 * Created by jollzy on 13/08/2015.
 */
var once = false;
function Game(){
    this.bg = null;
}

var reels_0 = [ [0,1,2,8,3,0,4,1,9,5,0,4,2,3,0,8,9,2,1,3,4,3,9,2,0,6,0,2,1,4,0,4,0,10,1,7,7,2,1,0,8,4,0],
    [0,1,2,1,9,0,4,0,5,9,10,1,8,2,3,0,9,4,1,0,1,4,6,2,10,1,3,1,3,6,7,4,3,1,3,2,7,10,8,1,4,0,9,4,8,3,1],
    [4,3,2,9,3,5,8,9,6,6,10,2,8,4,1,2,3,9,7,5,0,9,1,0,4,8,2,3,8,10,2,0,2,1],
    [0,7,4,3,6,7,8,5,4,7,0,6,1,0,8,1,2,0,10,7,4,1,0,5,4,2,1,8,3,7,1,6,9,4,4,6,9,1,0],
    [3,2,3,4,5,3,9,7,8,9,2,3,9,9,8,5,10,6,1,2,8,4,7,5,0,8,4,0,1,2,5,6,3,9,0,6,4,7,1,2,5,0,7,7,1,6,6,8,1,0,4] ];

var winLines = [
    [1,4,7,10,13],
    [0,3,6,9,12],
    [2,5,8,11,14],
    [0,4,8,10,12],
    [2,4,6,10,14],
    [1,3,6,9,13],
    [1,5,8,11,13],
    [0,3,7,11,14],
    [2,5,7,9,12],
    [1,4,8,10,13]
]

Game.prototype.onAssetsLoaded = function(){
    this.bg = new GameBackground();
    this.reelset = new Reelset(reels_0,winLines);
    this.spinButton = new SpinButton();
    this.onSpinReels = this.onSpinReels.bind(this);
    Events.Dispatcher.addEventListener("SPIN",this.onSpinReels);
    this.onStopReels = this.onStopReels.bind(this);
    Events.Dispatcher.addEventListener("STOP",this.onStopReels);
    this.onReelStopped = this.onReelStopped.bind(this);
    Events.Dispatcher.addEventListener("ALL_REEL_STOPPED",this.onReelStopped);
};
Game.prototype.onSpinReels = function(){
    console.log("call spin");
    if(!once){
        //alert("oops bg sound once :  "+once);
        once = true;
        loopSound(bgsound);
    }

    this.reelset.spinReels([0,200,400,600,800]);

};

Game.prototype.onReelStopped = function() {
    this.spinButton.setState(ButtonState.SPIN);
};


Game.prototype.onStopReels = function(){

    console.log("call stop");
    //[0,1,2,3,16]
    var rands = [];
    for(var r=0; r<5; ++r){
        rand = Math.floor(Math.random() * reels_0[r].length);
        rands.push(rand);
    }
    //line 5:   9,16,16,5,33
    //line 1 and 2:   1,1,14,5,33
    this.reelset.stopReels([0,250,500,750,1000],rands);

};
