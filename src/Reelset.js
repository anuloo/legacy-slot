function Reelset(reels,winLines){
    PIXI.Container.call(this);

    // Reels
    this.reels = [];
    for(var reel in reels)
    {
        this.reels.push(new Reel(reel, reels[reel]));
    }
    for(reel in this.reels){
        this.addChild(this.reels[reel]);
    }

   /* this.reelStopSound = soundManager.createSound({
        url: "sounds/reelstop.ogg"
    });*/

    this.winLines = winLines;
    this.symbolsInView = [];
    this.winLineSequence = [];
    this.pivot.x = this.width/2;
    this.pivot.y = this.height/2;
    //console.log(this)
    this.position.x = getWindowBounds().x/2;
    this.position.y = getWindowBounds().y/2;

    this.reelStoppedCounter=0;
    this.winlineDisplayIndex = 0;

    // Masking
    var thing = new PIXI.Graphics();
    thing.beginFill(0x000000,0.0);
    var start = new Point(0,200);
    var height = 600;
    var width = 810;
    thing.drawRect(start.x,start.y,width,height);

    // set mask
    this.addChild(thing);
    thing.isMask = true;
    this.mask = thing;

    stage.addChild(this);

    this.onWinLine = this.onWinLine.bind(this);
    Events.Dispatcher.addEventListener("WIN_LINE",this.onWinLine);
    this.onReelStopped = this.onReelStopped.bind(this);
    Events.Dispatcher.addEventListener("REEL_STOPPED",this.onReelStopped);

    this.ticker = PIXI.ticker.shared;
    this.ticker.autoStart = false;
    this.ticker.stop();
    var that = this;
    this.ticker.add(function (time) {
        //this.winLineSequencer.animateWinLine(time);
        for(var reel in that.reels)that.reels[reel].animate(time);
    });


}

Reelset.prototype = Object.create(PIXI.Container.prototype);
Reelset.prototype.constructor = Reelset;

Reelset.prototype.resize = function(data){
    // Scale both by X to maintain aspect ratio
    this.scale.x = data.scale.x;
    this.scale.y = data.scale.x;
    // Reposition to center
    this.position.x = data.size.x/2;
    this.position.y = data.size.y/2;
};
Reelset.prototype.spinReels = function(timing){
    this.ticker.start();
    this.winlineDisplayIndex = 0;
    this.clearHighlight();
    var that = this;
    var next = 0;
    this.reelStoppedCounter = 0;
    for(var t in timing){
        setTimeout(function(){

            that.reels[next].spin();
            if(next==4) {
                Events.Dispatcher.dispatchEvent(new Event("STOP"));
            }
            ++next
        },timing[t]);
    }
};

Reelset.prototype.getSymbolAt = function(reelIndex,symbolIndex){

};

Reelset.prototype.stopReels = function(timing,stopPosition){
  console.log("stop pos;" + stopPosition);
    var that = this;
    var next = 0;
    for(var t in timing){
        setTimeout(function(){
            //console.log(next)
            that.reels[next].stop(stopPosition[next]);
            ++next
        },timing[t]);
    }
};


Reelset.prototype.showNextWinline = function(){
    while(!this.setWinlineSequencence(this.winlineDisplayIndex++) && this.winlineDisplayIndex<10){
    }
    console.log(this.winlineDisplayIndex);
}


Reelset.prototype.setWinlineSequencence = function(winlineIndex){
    //take first winline
    var lineWin = this.winLines[winlineIndex];

    var winLineResult = [];
    for (var reelIndex =0;reelIndex<5; reelIndex++){

        //Ask the winline which cellIndex is on each reel position
        var cellIndex = lineWin[reelIndex]%3;

        //save off the symbol on each winline position  (ie J,J,J,Q,K)
        winLineResult[reelIndex] =  this.symbolsInView[reelIndex][cellIndex].getId();

        //if(lineWin == )
    }

    var winLineMatchFirst = [];

    //Whats our first symbol on our winline? As everything else has to match that fopr this winline to win
    var firstSymbol = winLineResult[0];
    var winlineLineIsStillWinning = true;

    for (var reelIndex =0;reelIndex<5; reelIndex++) {
        //Produce a array of ticks which show if each winliune positions matches the first
        if (winlineLineIsStillWinning && (firstSymbol ==  winLineResult[reelIndex])){
            winLineMatchFirst[reelIndex] =  true;
        }else{
            winLineMatchFirst[reelIndex] =  false;
            winlineLineIsStillWinning = false;
        }
    }
    //If position for 3 symbols is a win, then we show.
    if (winLineMatchFirst[2]) {
        for (var reelIndex = 0; reelIndex < 5; reelIndex++) {
            if (winLineMatchFirst[reelIndex]){
                this.symbolsInView[reelIndex][lineWin[reelIndex]%3].show();
            }

        }
        soundManager.play("lineWin");
        return true;
    }
    return false;


}

Reelset.prototype.clearHighlight = function() {
    for (var reelIndex = 0; reelIndex < 5; reelIndex++) {
        for (var cellIndex = 0; cellIndex < 3; cellIndex++) {
            if (this.symbolsInView[reelIndex]){
                this.symbolsInView[reelIndex][cellIndex].hide();
            }


        }

    }
}
Reelset.prototype.onReelStopped = function(event){
    soundManager.play("reelStop");
}

Reelset.prototype.onWinLine = function(event){
   this.symbolsInView.push(event.data);

   if(this.reelStoppedCounter == 4)
   {
        this.ticker.stop();
       console.log("Symbols in view: " + this.symbolsInView[1][1].getId());
       /*for (var reelIndex = 0; reelIndex < 5; reelIndex++) {
           this.setWinlineSequencence(reelIndex);
       }*/

       var that = this;
       //this.winLineSequence[2].show();


       function myFunction() {
           if (that.winlineDisplayIndex<10){
               setTimeout(function(){
                   that.clearHighlight();
                   that.showNextWinline();
                   myFunction();

               }, 600);
           }

       }
       myFunction();
           //}
       Events.Dispatcher.dispatchEvent(new Event("ALL_REEL_STOPPED"));
   }
    this.reelStoppedCounter++;
};