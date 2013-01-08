//Complete model for Energy Skate Park
define( ['underscore', 'model/vector2d', 'model/Skater', 'phetcommon/model/property/Property', 'phetcommon/model/property/BooleanProperty', 'model/Physics'], function ( _, Vector2D, Skater, Property, BooleanProperty, Physics ) {

    function EnergySkateParkModel() {
        var self = this;
        this.commands = [];
        this.skater = new Skater();
        this.barChartVisible = new BooleanProperty( false );
        this.pieChartVisible = new BooleanProperty( false );
        this.gridVisible = new BooleanProperty( false );
        this.speedometerVisible = new BooleanProperty( false );
        this.playing = new BooleanProperty( true );
        this.slowMotion = new BooleanProperty( false );

        this.time = new Date().getTime();
        this.playback = new BooleanProperty( false );
        this.startTime = this.time;
        this.playbackTime = this.startTime;
        this.commandIndex = 0;

        this.spline = {controlPoints: [
            {x: 100, y: 200},
            {x: 200, y: 300},
            {x: 300, y: 250}
        ]};

        //Pixels
        this.groundHeight = 116;
        this.groundY = 768 - this.groundHeight;
        this.mouseX = 0;
        this.mouseY = 0;
    }

    EnergySkateParkModel.prototype.stepPlayback = function () {
        this.playbackTime += 17;//ms between frames at 60fps
        if ( this.commandIndex >= this.commands.length ) {
            this.playback.set( false );
        }
        else {
            while ( this.commandIndex < this.commands.length ) {
                //find any events that passed in this time frame
                var time = JSON.parse( this.commands[this.commandIndex] ).time;
                if ( time < this.playbackTime ) {
                    this.invokeJSON( this.commands[this.commandIndex] );
                    this.commandIndex++;
                }
                else {
                    break;
                }
            }
        }
    };

    EnergySkateParkModel.prototype.stepPhysics = function () {
        var subdivisions = 1;
        for ( var i = 0; i < subdivisions; i++ ) {
            Physics.updatePhysics( this.skater, this.groundHeight, this.spline, this.slowMotion.get() ? 0.01 : 0.02 / subdivisions );
        }
    };

    EnergySkateParkModel.prototype.stopSkater = function () {
        this.skater.dragging = false;
        this.skater.velocity = new Vector2D();
    };

    EnergySkateParkModel.prototype.startPlayback = function () {
        this.resetAll();
        this.playback.set( true );
        this.playbackTime = this.startTime;
        this.commandIndex = 0;
    };

    //Apply a named function to this model.  Uses the command pattern for storing the call for playback.
    EnergySkateParkModel.prototype.update = function ( /*function name*/ /*function parameters*/ ) {
        var time = new Date().getTime();

        //Turn arguments into an array
        var argumentsAsArray = Array.prototype.slice.call( arguments );

        //Convert the call to JSON and use that for function application.
        var storedObject = {command: argumentsAsArray, time: time};
        var storedJSON = JSON.stringify( storedObject );
        this.invokeJSON( storedJSON );

        //Store the JSON value for record/playback
        //Add the specified JSON arg to the command list (could also be pushed to the server)
        this.commands.push( storedJSON );
    };

    EnergySkateParkModel.prototype.invokeJSON = function ( storedJSON ) {

        //Convert back from JSON to make sure that playback will have the same behavior as live
        var parsedJSON = JSON.parse( storedJSON ).command;

        var targetFunction = parsedJSON[0];

        //Drop the first arg for application
        parsedJSON.splice( 0, 1 );

        //Lookup the specified function and apply to args with the model as the "this"
        this[targetFunction].apply( this, parsedJSON );

//        console.log( storedJSON );
    };

    EnergySkateParkModel.prototype.toggleBarChartVisible = function () {this.barChartVisible.toggle();};
    EnergySkateParkModel.prototype.setBarChartVisible = function ( b ) {this.barChartVisible.set( b );};

    //Toggle a BooleanProperty
    EnergySkateParkModel.prototype.toggleSetting = function ( property ) {this[property].toggle();};
    EnergySkateParkModel.prototype.setBooleanProperty = function ( property, value ) {this[property].set( value );};

    EnergySkateParkModel.prototype.setSkaterPosition = function ( x, y ) {
        this.skater.position.x = x;
        this.skater.position.y = y;
    };

    EnergySkateParkModel.prototype.resetAll = function () {
        //Find all resettable fields
        var resettable = _.filter( this, function ( element ) {return typeof element.reset == 'function'} );

        //Call reset on them
        _.each( resettable, function ( element ) {element.reset()} );
    };

    EnergySkateParkModel.prototype.mouseMove = function ( x, y ) {
        this.mouseX = x;
        this.mouseY = y;
    };

    return EnergySkateParkModel;
} );