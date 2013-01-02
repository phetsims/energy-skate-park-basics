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

    //Toggle a BooleanProperty
    EnergySkateParkModel.prototype.toggleSetting = function ( setting ) {this[setting].toggle();};

    //Apply a named function to this model.  Uses the command pattern for storing the call for playback.
    EnergySkateParkModel.prototype.update = function ( functionName /*other arguments here*/ ) {

        //Turn arguments into an array
        var args = Array.prototype.slice.call( arguments );

        //Store the JSON value for record/playback
        var argsJSON = JSON.stringify( args );

        //Convert back from JSON to make sure that playback will have the same behavior as live
        //TODO: This line can be omitted for runtime
        args = JSON.parse( argsJSON );

        //Drop the first arg for application
        args.splice( 0, 1 );

        //Lookup the specified function and apply to args with the model as the "this"
        this[functionName].apply( this, args );

        //Add the specified JSON arg to the command list (could also be pushed to the server)
        this.commands.push( argsJSON );

        console.log( argsJSON );
    };

    EnergySkateParkModel.prototype.toggleBarChartVisible = function () {this.barChartVisible.toggle();};
    EnergySkateParkModel.prototype.setBarChartVisible = function ( b ) {this.barChartVisible.set( b );};

    EnergySkateParkModel.prototype.resetAll = function () {
        //Find all resettable fields
        var resettable = _.filter( this, function ( element ) {return typeof element.reset == 'function'} );

        //Call reset on them
        _.each( resettable, function ( element ) {element.reset()} );
    };

    return EnergySkateParkModel;
} );