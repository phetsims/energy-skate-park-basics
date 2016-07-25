// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery node for the energy skate park basics view (includes everything you see)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var AttachDetachToggleButtons = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/AttachDetachToggleButtons' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var DotRectangle = require( 'DOT/Rectangle' ); // eslint-disable-line require-statement-match
  var Shape = require( 'KITE/Shape' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SkaterNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/SkaterNode' );
  var TrackNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/TrackNode' );
  var BackgroundNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/BackgroundNode' );
  var EnergySkateParkBasicsControlPanel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/EnergySkateParkBasicsControlPanel' );
  var PieChartWebGLNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/PieChartWebGLNode' );
  var PlaybackSpeedControl = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/PlaybackSpeedControl' );
  var BarGraphBackground = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/BarGraphBackground' );
  var BarGraphForeground = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/BarGraphForeground' );
  var PieChartNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/PieChartNode' );
  var PieChartLegend = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/PieChartLegend' );
  var GridNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/GridNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var SceneSelectionPanel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/SceneSelectionPanel' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var GaugeNode = require( 'SCENERY_PHET/GaugeNode' );
  var GaugeNeedleNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/GaugeNeedleNode' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/EnergySkateParkColorScheme' );
  var Util = require( 'SCENERY/util/Util' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );

  // strings
  var controlsRestartSkaterString = require( 'string!ENERGY_SKATE_PARK_BASICS/controls.restart-skater' );
  var propertiesSpeedString = require( 'string!ENERGY_SKATE_PARK_BASICS/properties.speed' );

  // images
  var skaterIconImage = require( 'image!ENERGY_SKATE_PARK_BASICS/skater-icon.png' );

  // Debug flag to show the view bounds, the region within which the skater can move
  var showAvailableBounds = false;

  /**
   * @param {EnergySkateParkBasicsModel} model
   * @param {Object} [options]
   * @constructor
   */
  function EnergySkateParkBasicsScreenView( model, tandem ) {

    var view = this;
    ScreenView.call( view, { layoutBounds: new Bounds2( 0, 0, 834, 504 ) } );

    var modelPoint = new Vector2( 0, 0 );
    // earth is 70px high in stage coordinates
    var viewPoint = new Vector2( this.layoutBounds.width / 2, this.layoutBounds.height - BackgroundNode.earthHeight );
    var scale = 50;
    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( modelPoint, viewPoint, scale );
    this.modelViewTransform = modelViewTransform;

    this.availableModelBoundsProperty = new Property();
    this.availableModelBoundsProperty.linkAttribute( model, 'availableModelBounds' );

    // The background
    this.backgroundNode = new BackgroundNode( this.layoutBounds );
    this.addChild( this.backgroundNode );

    this.gridNode = new GridNode( model.property( 'gridVisible' ), modelViewTransform );
    this.addChild( this.gridNode );

    var pieChartLegend = new PieChartLegend(
      model.skater,
      model.clearThermal.bind( model ),
      model.property( 'pieChartVisible' ),
      tandem
    );
    this.addChild( pieChartLegend );

    this.controlPanel = new EnergySkateParkBasicsControlPanel( model, tandem.createTandem( 'controlPanel' ) );
    this.addChild( this.controlPanel );
    this.controlPanel.right = this.layoutBounds.width - 5;
    this.controlPanel.top = 5;

    // For the playground screen, show attach/detach toggle buttons
    if ( model.draggableTracks ) {
      var property = model.draggableTracks ? new Property( true ) :
                     new DerivedProperty( [ model.sceneProperty ], function( scene ) { return scene === 2; } );
      this.attachDetachToggleButtons = new AttachDetachToggleButtons( model.detachableProperty, property, this.controlPanel.contentWidth, tandem.createTandem( 'attachDetachToggleButtons' ), {
        top: this.controlPanel.bottom + 5,
        centerX: this.controlPanel.centerX
      } );
      this.addChild( this.attachDetachToggleButtons );
    }

    var containsAbove = function( bounds, x, y ) {
      return bounds.minX <= x && x <= bounds.maxX && y <= bounds.maxY;
    };

    // Determine if the skater is onscreen or offscreen for purposes of highlighting the 'return skater' button.
    // Don't check whether the skater is underground since that is a rare case (only if the user is actively dragging a
    // control point near y=0 and the track curves below) and the skater will pop up again soon, see the related
    // flickering problem in #206
    var onscreenProperty = new DerivedProperty( [ model.skater.positionProperty ], function( position ) {
      if ( !view.availableModelBounds ) {
        return true;
      }
      return view.availableModelBounds && containsAbove( view.availableModelBounds, position.x, position.y );
    } );

    var barGraphBackground = new BarGraphBackground( model.skater, model.property( 'barGraphVisible' ),
      model.clearThermal.bind( model ), tandem.createTandem( 'barGraphBackground' ) );
    this.addChild( barGraphBackground );

    if ( !model.draggableTracks ) {

      // layout done in layout bounds
      this.sceneSelectionPanel = new SceneSelectionPanel( model, this, modelViewTransform, tandem.createTandem( 'sceneSelectionPanel' ) );
      this.addChild( this.sceneSelectionPanel );
    }

    // Put the pie chart legend to the right of the bar chart, see #60, #192
    pieChartLegend.mutate( { top: barGraphBackground.top, left: barGraphBackground.right + 8 } );

    var playingProperty = new Property( !model.property( 'paused' ).value, {
      tandem: tandem.createTandem( 'playingProperty' ),
      type: TBoolean
    } );
    model.property( 'paused' ).link( function( paused ) {
      playingProperty.set( !paused );
    } );
    playingProperty.link( function( playing ) {
      model.property( 'paused' ).set( !playing );
    } );
    var playPauseButton = new PlayPauseButton( playingProperty, {
      tandem: tandem.createTandem( 'playPauseButton' )
    } ).mutate( { scale: 0.6 } );

    // Make the Play/Pause button bigger when it is showing the pause button, see #298
    var pauseSizeIncreaseFactor = 1.35;
    playingProperty.lazyLink( function( isPlaying ) {
      playPauseButton.scale( isPlaying ? ( 1 / pauseSizeIncreaseFactor ) : pauseSizeIncreaseFactor );
    } );

    var stepButton = new StepForwardButton( {
      playingProperty: playingProperty,
      listener: function() { model.manualStep(); },
      phetioID: tandem.createTandem( 'stepButton' )
    } );

    // Make the step button the same size as the pause button.
    stepButton.mutate( { scale: playPauseButton.height / stepButton.height } );
    model.property( 'paused' ).linkAttribute( stepButton, 'enabled' );

    this.addChild( playPauseButton.mutate( {
      centerX: this.layoutBounds.centerX,
      bottom: this.layoutBounds.maxY - 15
    } ) );
    this.addChild( stepButton.mutate( { left: playPauseButton.right + 15, centerY: playPauseButton.centerY } ) );

    this.resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      scale: 0.85,
      centerX: this.controlPanel.centerX,

      // Align vertically with other controls, see #134
      centerY: (modelViewTransform.modelToViewY( 0 ) + this.layoutBounds.maxY) / 2 + 8,

      phetioID: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( this.resetAllButton );

    // The button to return the skater
    this.returnSkaterButton = new RectangularPushButton( {
      content: new Text( controlsRestartSkaterString, {
        maxWidth: 100
      } ),
      listener: model.returnSkater.bind( model ),
      centerY: this.resetAllButton.centerY,
      // X updated in layoutBounds since the reset all button can move horizontally
      phetioID: tandem.createTandem( 'returnSkaterButton' )
    } );

    // Disable the return skater button when the skater is already at his initial coordinates
    model.skater.linkAttribute( 'moved', view.returnSkaterButton, 'enabled' );
    this.addChild( this.returnSkaterButton );

    this.addChild( new PlaybackSpeedControl( model.property( 'speed' ), tandem.createTandem( 'playbackSpeedControl' ) ).mutate( {
      left: stepButton.right + 20,
      centerY: playPauseButton.centerY
    } ) );

    var speedometerNode = new GaugeNode(
      // Hide the needle in for the background of the GaugeNode
      new Property( null ), propertiesSpeedString,
      {
        min: 0,
        max: 20
      },
      {
        // enable/disable updates based on whether the speedometer is visible
        updateEnabledProperty: model.property( 'speedometerVisible' ),
        pickable: false
      } );
    model.property( 'speedometerVisible' ).linkAttribute( speedometerNode, 'visible' );
    speedometerNode.centerX = this.layoutBounds.centerX;
    speedometerNode.top = this.layoutBounds.minY + 5;
    this.addChild( speedometerNode );

    // Layer which will contain all of the tracks
    var trackLayer = new Node();

    // Switch between selectable tracks
    if ( !model.draggableTracks ) {

      var trackNodes = model.tracks.map( function( track ) {
        return new TrackNode( model, track, modelViewTransform, view.availableModelBoundsProperty );
      } ).getArray();

      trackNodes.forEach( function( trackNode ) {
        trackLayer.addChild( trackNode );
      } );

      model.property( 'scene' ).link( function( scene ) {
        trackNodes[ 0 ].visible = (scene === 0);
        trackNodes[ 1 ].visible = (scene === 1);
        trackNodes[ 2 ].visible = (scene === 2);
      } );
    }
    else {

      var addTrackNode = function( track ) {

        var trackNode = new TrackNode( model, track, modelViewTransform, view.availableModelBoundsProperty );
        trackLayer.addChild( trackNode );

        // When track removed, remove its view
        var itemRemovedListener = function( removed ) {
          if ( removed === track ) {
            trackLayer.removeChild( trackNode );
            model.tracks.removeItemRemovedListener( itemRemovedListener );// Clean up memory leak
          }
        };
        model.tracks.addItemRemovedListener( itemRemovedListener );

        return trackNode;
      };

      // Create the tracks for the track toolbox
      var interactiveTrackNodes = model.tracks.map( addTrackNode ).getArray();

      // Add a panel behind the tracks
      var padding = 10;

      var trackCreationPanel = new Rectangle(
        (interactiveTrackNodes[ 0 ].left - padding / 2),
        (interactiveTrackNodes[ 0 ].top - padding / 2),
        (interactiveTrackNodes[ 0 ].width + padding),
        (interactiveTrackNodes[ 0 ].height + padding),
        6,
        6, {
          fill: 'white',
          stroke: 'black'
        } );
      this.addChild( trackCreationPanel );

      model.tracks.addItemAddedListener( addTrackNode );

      var xTip = 20;
      var yTip = 8;
      var xControl = 12;
      var yControl = -5;

      var createArrowhead = function( angle, tail ) {
        var headWidth = 10;
        var headHeight = 10;
        var directionUnitVector = Vector2.createPolar( 1, angle );
        var orthogonalUnitVector = directionUnitVector.perpendicular();
        var tip = directionUnitVector.times( headHeight ).plus( tail );
        return new Path( new Shape().moveToPoint( tail ).lineToPoint( tail.plus( orthogonalUnitVector.times( headWidth / 2 ) ) ).lineToPoint( tip ).lineToPoint( tail.plus( orthogonalUnitVector.times( -headWidth / 2 ) ) ).lineToPoint( tail ).close(),
          { fill: 'black' } );
      };

      var rightCurve = new Path( new Shape().moveTo( 0, 0 ).quadraticCurveTo( -xControl, yControl, -xTip, yTip ),
        { stroke: 'black', lineWidth: 3 } );
      var arrowHead = createArrowhead( Math.PI - Math.PI / 3, new Vector2( -xTip, yTip ) );

      var clearButtonEnabledProperty = model.property( 'clearButtonEnabled' );
      clearButtonEnabledProperty.link( function( clearButtonEnabled ) {
        rightCurve.stroke = clearButtonEnabled ? 'black' : 'gray';
        arrowHead.fill = clearButtonEnabled ? 'black' : 'gray';
      } );

      var clearButton = new EraserButton( {
        iconWidth: 30,
        baseColor: new Color( 221, 210, 32 ),
        phetioID: 'playgroundScreen.clearTracksButton'
      } );
      clearButtonEnabledProperty.linkAttribute( clearButton, 'enabled' );
      clearButton.addListener( function() {model.clearTracks();} );

      this.addChild( clearButton.mutate( { left: 5, centerY: trackCreationPanel.centerY } ) );
    }

    this.addChild( trackLayer );

    // Check to see if WebGL was prevented by a query parameter
    var allowWebGL = phet.chipper.getQueryParameter( 'webgl' ) !== 'false';

    // Use WebGL where available, but not on IE, due to https://github.com/phetsims/energy-skate-park-basics/issues/277
    // and https://github.com/phetsims/scenery/issues/285
    var webGLSupported = Util.isWebGLSupported && allowWebGL;
    var renderer = webGLSupported ? 'webgl' : null;

    var skaterNode = new SkaterNode(
      model.skater,
      this,
      modelViewTransform,
      model.getClosestTrackAndPositionAndParameter.bind( model ),
      model.getPhysicalTracks.bind( model ),
      renderer
    );

    var gaugeNeedleNode = new GaugeNeedleNode( model.skater.property( 'speed' ), {
      min: 0,
      max: 20
    }, {
      renderer: renderer
    } );
    model.property( 'speedometerVisible' ).linkAttribute( gaugeNeedleNode, 'visible' );
    gaugeNeedleNode.x = speedometerNode.x;
    gaugeNeedleNode.y = speedometerNode.y;
    this.addChild( gaugeNeedleNode );
    this.addChild( new BarGraphForeground( model.skater, barGraphBackground, model.property( 'barGraphVisible' ), renderer ) );
    this.addChild( skaterNode );

    var pieChartNode = renderer === 'webgl' ?
                       new PieChartWebGLNode( model.skater, model.property( 'pieChartVisible' ), modelViewTransform ) :
                       new PieChartNode( model.skater, model.property( 'pieChartVisible' ), modelViewTransform );
    this.addChild( pieChartNode );

    // Buttons to return the skater when she is offscreen, see #219
    var iconScale = 0.4;
    var returnSkaterToStartingPointButton = new RectangularPushButton( {
      content: new Image( skaterIconImage, { scale: iconScale } ),

      // green means "go" since the skater will likely start moving at this point
      baseColor: EnergySkateParkColorScheme.kineticEnergy,
      listener: model.returnSkater.bind( model ),
      phetioID: tandem.createTandem( 'returnSkaterToPreviousStartingPositionButton' )
    } );

    var returnSkaterToGroundButton = new RectangularPushButton( {
      content: new Image( skaterIconImage, { scale: iconScale } ),
      centerBottom: modelViewTransform.modelToViewPosition( model.skater.startingPosition ),
      baseColor: '#f4514e', // red for stop, since the skater will be stopped on the ground.
      listener: function() { model.skater.resetPosition(); },
      phetioID: tandem.createTandem( 'returnSkaterToGroundButton' )
    } );

    this.addChild( returnSkaterToStartingPointButton );
    this.addChild( returnSkaterToGroundButton );

    // When the skater goes off screen, make the "return skater" button big
    onscreenProperty.link( function( skaterOnscreen ) {
      var buttonsVisible = !skaterOnscreen;
      returnSkaterToGroundButton.visible = buttonsVisible;
      returnSkaterToStartingPointButton.visible = buttonsVisible;

      if ( buttonsVisible ) {

        // Put the button where the skater will appear.  Nudge it up a bit so the mouse can hit it from the drop site,
        // without being moved at all (to simplify repeat runs).
        var viewPosition = modelViewTransform.modelToViewPosition( model.skater.startingPosition ).plusXY( 0, 5 );
        returnSkaterToStartingPointButton.centerBottom = viewPosition;

        // If the return skater button went offscreen, move it back on the screen, see #222
        if ( returnSkaterToStartingPointButton.top < 5 ) {
          returnSkaterToStartingPointButton.top = 5;
        }
      }
    } );

    // For debugging the visible bounds
    if ( showAvailableBounds ) {
      this.viewBoundsPath = new Path( null, { pickable: false, stroke: 'red', lineWidth: 10 } );
      this.addChild( this.viewBoundsPath );
    }
  }

  energySkateParkBasics.register( 'EnergySkateParkBasicsScreenView', EnergySkateParkBasicsScreenView );

  return inherit( ScreenView, EnergySkateParkBasicsScreenView, {

    // Layout the EnergySkateParkBasicsScreenView, scaling it up and down with the size of the screen to ensure a
    // minimially visible area, but keeping it centered at the bottom of the screen, so there is more area in the +y
    // direction to build tracks and move the skater
    layout: function( width, height ) {

      this.resetTransform();

      var scale = this.getLayoutScale( width, height );
      this.setScaleMagnitude( scale );

      var offsetX = 0;
      var offsetY = 0;

      // Move to bottom vertically
      if ( scale === width / this.layoutBounds.width ) {
        offsetY = (height / scale - this.layoutBounds.height);
      }

      // center horizontally
      else if ( scale === height / this.layoutBounds.height ) {
        offsetX = (width - this.layoutBounds.width * scale) / 2 / scale;
      }
      this.translate( offsetX, offsetY );

      this.backgroundNode.layout( offsetX, offsetY, width, height, scale );
      this.gridNode.layout( offsetX, offsetY, width, height, scale );

      this.availableViewBounds = new DotRectangle( -offsetX, -offsetY, width / scale, this.modelViewTransform.modelToViewY( 0 ) + Math.abs( offsetY ) );

      // Float the control panel to the right (but not arbitrarily far because it could get too far from the play area)
      this.controlPanel.right = Math.min( 890, this.availableViewBounds.maxX ) - 5;

      if ( this.attachDetachToggleButtons ) {
        this.attachDetachToggleButtons.centerX = this.controlPanel.centerX;
      }

      if ( this.sceneSelectionPanel ) {
        var panelAbove = this.attachDetachToggleButtons || this.controlPanel;
        this.sceneSelectionPanel.centerX = panelAbove.centerX;
        this.sceneSelectionPanel.top = panelAbove.bottom + 5;
      }
      this.resetAllButton.right = this.controlPanel.right;
      this.returnSkaterButton.right = this.resetAllButton.left - 10;

      // Compute the visible model bounds so we will know when a model object like the skater has gone offscreen
      this.availableModelBounds = this.modelViewTransform.viewToModelBounds( this.availableViewBounds );
      this.availableModelBoundsProperty.value = this.availableModelBounds;

      // Show it for debugging
      if ( showAvailableBounds ) {
        this.viewBoundsPath.shape = Shape.bounds( this.availableViewBounds );
      }
    }
  } );
} );