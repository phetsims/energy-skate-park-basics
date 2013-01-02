//Complete model for Energy Skate Park
define( ['underscore', 'model/vector2d', 'model/Skater', 'phetcommon/model/property/Property', 'phetcommon/model/property/BooleanProperty'], function ( _, Vector2D, Skater, Property, BooleanProperty ) {

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

        //Pixels
        this.groundHeight = 116;
        this.groundY = 768 - this.groundHeight;
    }

    //Apply a named function to this model.  Uses the command pattern for storing the call for playback.
    EnergySkateParkModel.prototype.update = function ( /*function name*/ /*function parameters*/ ) {
        var time = new Date().getTime();

        //Turn arguments into an array
        var argumentsAsArray = Array.prototype.slice.call( arguments );

        var storedObject = {command: argumentsAsArray, time: time};

        //Store the JSON value for record/playback
        var storedJSON = JSON.stringify( storedObject );

        //Convert back from JSON to make sure that playback will have the same behavior as live
        //TODO: This parsing can be omitted for runtime
        var parsedJSON = JSON.parse( storedJSON ).command;

        var targetFunction = parsedJSON[0];

        //Drop the first arg for application
        parsedJSON.splice( 0, 1 );

        //Lookup the specified function and apply to args with the model as the "this"
        this[targetFunction].apply( this, parsedJSON );

        //Add the specified JSON arg to the command list (could also be pushed to the server)
        this.commands.push( storedJSON );

        console.log( storedJSON );
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

    return EnergySkateParkModel;
} );