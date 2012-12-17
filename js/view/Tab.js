define( ['model/EnergySkateParkModel', 'underscore', 'view/EnergySkateParkCanvas', 'model/Physics', 'phetcommon/model/property/Property'], function ( EnergySkateParkModel, _, EnergySkateParkCanvas, Physics, Property ) {
    function Tab( $tab, Easel, Strings, analytics, tabID, activeTab ) {

        //Show stats
        var stats = new Stats();
        stats.setMode( 0 ); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.right = '0px';
        stats.domElement.style.top = '0px';

        document.body.appendChild( stats.domElement );
        var self = this;
        var $canvas = $tab.find( 'canvas' );

        var model = new EnergySkateParkModel();
        var energySkateParkCanvas = new EnergySkateParkCanvas( $canvas, Strings, analytics, model );

        Easel.Ticker.addListener( function () {
            stats.begin();
            if ( model.playing.get() && activeTab.get() == tabID ) {
                if ( model.playback.get() ) {
                    model.playbackTime += 1.0 / 60.0 / 1000.0;
                    //fire any events that happened, in the right order.

                }
                else {
                    var subdivisions = 1;
                    for ( var i = 0; i < subdivisions; i++ ) {
                        Physics.updatePhysics( model.skater, model.groundHeight, energySkateParkCanvas.root.splineLayer, model.slowMotion.get() ? 0.01 : 0.02 / subdivisions );
                    }
                }
                energySkateParkCanvas.root.tick();
            }
            energySkateParkCanvas.render();
            stats.end();
        } );
        $tab.find( '.' + tabID + "Button" ).toggleClass( "active" );

        $tab.find( '.introductionTabButton' ).click( function () {activeTab.set( "introductionTab" );} );
        $tab.find( '.frictionTabButton' ).click( function () {activeTab.set( "frictionTab" );} );
        $tab.find( '.trackPlaygroundTabButton' ).click( function () {activeTab.set( "trackPlaygroundTab" );} );

        //Copied from WidgetConnector
        var connectBoolean = function ( $component, booleanProperty ) {

            // sync model with check box
            $component.bind( 'change', function () {booleanProperty.set( $component.attr( "checked" ) );} );

            // sync check box with model
            booleanProperty.addObserver( function ( checked ) {$component.attr( "checked", checked ).checkboxradio( "refresh" );} );
        };

        var connectBooleanFlip = function ( $component, booleanProperty ) {

            // sync model with check box
            $component.bind( 'change', function () {booleanProperty.set( !$component.attr( "checked" ) );} );

            // sync check box with model
            booleanProperty.addObserver( function ( checked ) {$component.attr( "checked", !checked ).checkboxradio( "refresh" );} );
        };


        connectBoolean( $tab.find( '.barGraphButton' ), model.barChartVisible );
        connectBoolean( $tab.find( '.pieChartButton' ), model.pieChartVisible );
        connectBoolean( $tab.find( '.gridButton' ), model.gridVisible );
        connectBoolean( $tab.find( '.speedometerButton' ), model.speedometerVisible );

        $tab.find( '.reset-all-button' ).click( model.resetAll.bind( model ) );
        $tab.find( '.playback-button' ).click( function () {model.playback.toggle();} );
        $tab.find( '.return-skater-button' ).click( model.skater.returnSkater.bind( model.skater ) );
        connectBoolean( $tab.find( '#slow-motion-button' ), model.slowMotion );
        connectBooleanFlip( $tab.find( '#normal-button' ), model.slowMotion );

        $( '.play-pause-button' ).bind( 'click', function () {
            model.playing.toggle();
            $( '.play-pause-button > .ui-btn-inner > .ui-btn-text' ).html( !model.playing.get() ? "&#9654;" : "&#10074;&#10074;" );
        } );

        model.playing.addObserver( function () {
            $( '.play-pause-button > .ui-btn-inner > .ui-btn-text' ).html( !model.playing.get() ? "&#9654;" : "&#10074;&#10074;" );
        } );
    }

    Tab.prototype.$ = function ( selector ) {
    };

    Tab.prototype.render = function () {
    };

    Tab.prototype.getValue = function () {
    };

    return Tab;
} );
