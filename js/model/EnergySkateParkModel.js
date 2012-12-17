//Complete model for Energy Skate Park
define( ['underscore', 'model/vector2d', 'model/Skater', 'phetcommon/model/property/Property', 'phetcommon/model/property/BooleanProperty'], function ( _, Vector2D, Skater, Property, BooleanProperty ) {

    function EnergySkateParkModel() {
        var self = this;
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

        var playbackLog = [];

        function record( propertyArray ) {
            for ( var i = 0; i < propertyArray.length; i++ ) {
                var property = propertyArray[i];
                self[property].addObserver( function ( newValue ) {
                    playbackLog.push( {property: self.barChartVisible, newValue: newValue} );
                    console.log( "property: " + property + ", value = " + newValue );
                } );
            }
        }

        record( ["barChartVisible", "pieChartVisible", "gridVisible", "speedometerVisible", "playing"] );
    }

    EnergySkateParkModel.prototype.resetAll = function () {
        //Find all resettable fields
        var resettable = _.filter( this, function ( element ) {return typeof element.reset == 'function'} );

        //Call reset on them
        _.each( resettable, function ( element ) {element.reset()} );
    };

    return EnergySkateParkModel;
} );