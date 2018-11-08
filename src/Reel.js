/**
 * Created by jollzy on 13/08/2015.
 */
var ReelState = {
    IDLE : 0,
    STARTING : 1,
    SPINNING : 2,
    SETTING :3,
    STOPPING : 4,
    BOUNCING : 5,
    SHOW_WIN : 6
};





function Reel(reel, reelband){
    PIXI.Container.call(this);
    this.state = ReelState.IDLE;
    this.reelband = reelband;
    this.stopband = [];
    this.stopband.concat(reelband);
    this.index = 0;
    this.id = reel;
    this.speed = 60;
    this.liftSpeed=5;
    this.bounceSpeed = 4;
    this.bounceDistance = 0.3;
    this.blur = new PIXI.filters.BlurYFilter();
    this.blur.blur = 40;
    this.cueStop = false;
    this.reelsStopped = false;
    this.setNextSymbol = 0;

    this.setSymbols = 0;

   // console.log("Created Reel id " + this.id + " symbols " + this.reelband);


    this.position.x = reel*(160+2);
    this.position.y = 0;
    this.symbols = [];
    this.winSymbols = [];

    for(var i=0; i<5; ++i){
        var s = new Symbol(this.reelband[i]);
        s.position.x = 0;
        s.position.y = i * 200;
        this.addChild(s);
        this.symbols.push(s);
        //console.log("s at " + s.position.y)
    }
    for(var j=0; j<3; ++j){
        var ws = new WinSymbol(this.reelband[j]);
        ws.position.x = 0;
        ws.position.y = (j * 200)+200;
        this.addChild(ws);
        this.winSymbols.push(ws);
        //ws.alpha = .4;
        ws.hide();
        //console.log("s at " + s.position.y)
    }
    this.frameTop = this.symbols[1].position.y;

}

Reel.prototype = Object.create(PIXI.Container.prototype);
Reel.prototype.constructor = Reel;
//State machine
Reel.prototype.animate = function(time){
    switch (this.state){
        case ReelState.IDLE:
           // console.log("[STATE MACHINE: IDLE]");
            break;
        case ReelState.STARTING:
            //console.log("[STATE MACHINE: STARTING]");
            this.lift();
            break;
        case ReelState.SPINNING:
            this.spinReel();
            if(this.cueStop){
                this.state = ReelState.SETTING;
            }
            //console.log("[STATE MACHINE: SPINNING]");
            break;
        case ReelState.SETTING:
            //console.log("[STATE MACHINE: SETTING]");
            this.settingReel();
            break;
        case ReelState.STOPPING:
            //console.log("[STATE MACHINE: STOPPING]");
            this.stopReel();
            break;
        case ReelState.BOUNCING:
            //console.log("[STATE MACHINE: BOUNCING]");
            this.bouncing();
            break;
        case ReelState.SHOW_WIN:
           this.winLine()
            break;
    }
};

Reel.prototype.spin = function(){
    //console.log("Reel " + this.id + " spin.")
    this.cueStop = false;
    if(this.state == ReelState.IDLE){
        //console.log("SPINNING");
        this.setNextSymbol = 0;
        this.state = ReelState.STARTING;
    }
};

Reel.prototype.bouncing = function(){
    for(var s in this.symbols){
        this.symbols[s].position.y -= this.bounceSpeed;
    }
    if (this.symbols[0].position.y <=0){
        for (var s in this.symbols){
            this.symbols[s].position.y = s * 200;
        }

        this.state = ReelState.SHOW_WIN;
    }
};

Reel.prototype.winLine = function(){
    var ids = this.symbolsInView();
    for(var s in this.winSymbols){
        this.winSymbols[s].setId(ids[s],false);
        //console.log("Symbols in view: " + this.winSymbols[s].getId());
    }
    Events.Dispatcher.dispatchEvent(new Event("WIN_LINE",this.winSymbols));
   // console.log("Symbols in view: " + this.winSymbols);
    /*this.winSymbols[0].setId(this.symbols[0].getId(),true);
    this.winSymbols[1].setId(this.symbols[1].getId(),true);
    this.winSymbols[2].setId(this.symbols[2].getId(),true);
    this.winSymbols[3].setId(this.symbols[3].getId(),true);
    this.winSymbols[4].setId(this.symbols[4].getId(),true);*/

    this.state = ReelState.IDLE;
};

Reel.prototype.getWinSymbols = function(){
    return this.winSymbols;
};

Reel.prototype.lift = function(){
    for(var s in this.symbols){
        this.symbols[s].position.y -= this.liftSpeed;
    }
    if(this.symbols[1].position.y < this.frameTop/3*2){
        this.state = ReelState.SPINNING;
        Events.Dispatcher.dispatchEvent(new Event("REEL_SPINNING",this.id));
    }
}

Reel.prototype.spinReel = function(){

    for(var s in this.symbols){
        this.symbols[s].position.y += this.speed;
    }

    if(this.symbols[0].position.y >= this.frameTop){
        var offset = this.symbols[0].position.y;
        this.index = this.getSymbolIndex(this.index+1);
        var ids = this.symbolsOnReel();
        for(var s in this.symbols){
            this.symbols[s].position.y -= offset;
            this.symbols[s].setId(ids[s],this.blur);

        }
        for(var s in this.winSymbols){
            this.winSymbols[s].hide();
        }

    }

};

Reel.prototype.stopReel = function(){

    for(var s in this.symbols){
        this.symbols[s].position.y += this.speed;
    }

    if(this.symbols[0].position.y >= this.frameTop * this.bounceDistance) {
        this.index = this.getSymbolIndex(this.stopPosition);
        var ids = this.symbolsOnReel();
        for(var s in this.symbols){
            this.symbols[s].setId(ids[s],null);
        }
        this.state = ReelState.BOUNCING;

    }
    Events.Dispatcher.dispatchEvent(new Event("REEL_STOPPED"));

};

Reel.prototype.stop = function(stopPosition){
    this.stopPosition = stopPosition;
    this.cueStop = true;

}

Reel.prototype.settingReel = function(){
    for(var s in this.symbols){
        this.symbols[s].position.y += this.speed;
    }
    if(this.symbols[0].position.y >= this.frameTop){
        var offset = this.symbols[0].position.y;
        this.index = this.getSymbolIndex(this.index+1);
        var ids = this.symbolsOnReel();
        for(var s in this.symbols){
            this.symbols[s].position.y -= offset;
            this.symbols[s].setId(ids[s],this.blur);
        }
        ++this.setNextSymbol;
        switch (this.setNextSymbol){
            case 1:
                this.symbols[0].setId(this.reelband[this.getSymbolIndex(this.stopPosition-2)],this.blur);
                break;
            case 2:
                this.symbols[0].setId(this.reelband[this.getSymbolIndex(this.stopPosition-1)],this.blur);
                this.symbols[1].setId(this.reelband[this.getSymbolIndex(this.stopPosition-2)],this.blur);
                break;
            case 3:
                this.symbols[0].setId(this.reelband[this.getSymbolIndex(this.stopPosition)],this.blur);
                this.symbols[1].setId(this.reelband[this.getSymbolIndex(this.stopPosition-1)],this.blur);
                this.symbols[2].setId(this.reelband[this.getSymbolIndex(this.stopPosition-2)],this.blur);
                break;
            case 4:
                this.symbols[0].setId(this.reelband[this.getSymbolIndex(this.stopPosition+1)],this.blur);
                this.symbols[1].setId(this.reelband[this.getSymbolIndex(this.stopPosition)],this.blur);
                this.symbols[2].setId(this.reelband[this.getSymbolIndex(this.stopPosition-1)],this.blur);
                this.symbols[3].setId(this.reelband[this.getSymbolIndex(this.stopPosition-2)],this.blur);
                break;
            case 5:
                this.symbols[0].setId(this.reelband[this.getSymbolIndex(this.stopPosition+2)],this.blur);
                this.symbols[1].setId(this.reelband[this.getSymbolIndex(this.stopPosition+1)],this.blur);
                this.symbols[2].setId(this.reelband[this.getSymbolIndex(this.stopPosition)],this.blur);
                this.symbols[3].setId(this.reelband[this.getSymbolIndex(this.stopPosition-1)],this.blur);
                this.symbols[4].setId(this.reelband[this.getSymbolIndex(this.stopPosition-2)],this.blur);

                break;

        }

        this.state = ReelState.STOPPING;

    }

};

Reel.prototype.getSymbolIndex = function(newIndex){
    return (newIndex + this.reelband.length) % this.reelband.length;
};

Reel.prototype.symbolsOnReel = function(){
    var symbols = [];

    symbols.push(this.reelband[this.getSymbolIndex(this.index+2)]);
    symbols = symbols.concat(this.symbolsInView());
    symbols.push(this.reelband[this.getSymbolIndex(this.index-2)]);

    return symbols;
}

Reel.prototype.symbolsInView = function(){
    var symbols = [];

    symbols.push(this.reelband[this.getSymbolIndex(this.index+1)]);
    symbols.push(this.reelband[this.getSymbolIndex(this.index)]);
    symbols.push(this.reelband[this.getSymbolIndex(this.index-1)]);

    return symbols;
};
