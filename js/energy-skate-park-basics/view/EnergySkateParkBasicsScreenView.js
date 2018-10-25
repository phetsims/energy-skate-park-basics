// Copyright 2013-2017, University of Colorado Boulder

/**
 * Scenery node for the energy skate park basics view (includes everything you see)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var AttachDetachToggleButtons = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/AttachDetachToggleButtons' );
  var BackgroundNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/BackgroundNode' );
  var BarGraphBackground = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/BarGraphBackground' );
  var BarGraphForeground = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/BarGraphForeground' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Constants = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/Constants' );
  var Color = require( 'SCENERY/util/Color' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DotRectangle = require( 'DOT/Rectangle' ); // eslint-disable-line require-statement-match
  var DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var EnergySkateParkBasicsControlPanel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/EnergySkateParkBasicsControlPanel' );
  var EnergySkateParkBasicsQueryParameters = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/EnergySkateParkBasicsQueryParameters' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/EnergySkateParkColorScheme' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var GaugeNeedleNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/GaugeNeedleNode' );
  var GaugeNode = require( 'SCENERY_PHET/GaugeNode' );
  var GridNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/GridNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PieChartLegend = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/PieChartLegend' );
  var PieChartNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/PieChartNode' );
  var PieChartWebGLNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/PieChartWebGLNode' );
  var PlaybackSpeedControl = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/PlaybackSpeedControl' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var platform = require( 'PHET_CORE/platform' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Range = require( 'DOT/Range' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var SceneSelectionPanel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/SceneSelectionPanel' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Shape = require( 'KITE/Shape' );
  var SkaterNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/SkaterNode' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TrackNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/TrackNode' );
  var Util = require( 'SCENERY/util/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var BooleanIO = require( 'TANDEM/types/BooleanIO' );

  // strings
  var controlsRestartSkaterString = require( 'string!ENERGY_SKATE_PARK_BASICS/controls.restart-skater' );
  var propertiesSpeedString = require( 'string!ENERGY_SKATE_PARK_BASICS/properties.speed' );

  // images
  var skaterIconImage = require( 'image!ENERGY_SKATE_PARK_BASICS/skater-icon.png' );

  // Debug flag to show the view bounds, the region within which the skater can move
  var showAvailableBounds = false;

  /**
   * @param {EnergySkateParkBasicsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function EnergySkateParkBasicsScreenView( model, tandem ) {

    var trackNodeGroupTandem = tandem.createGroupTandem( 'trackNode' );

    var self = this;
    ScreenView.call( self, {
      layoutBounds: new Bounds2( 0, 0, 834, 504 ),
      tandem: tandem
    } );

    var modelPoint = new Vector2( 0, 0 );
    // earth is 70px high in stage coordinates
    var viewPoint = new Vector2( this.layoutBounds.width / 2, this.layoutBounds.height - BackgroundNode.earthHeight );
    var scale = 50;
    var modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( modelPoint, viewPoint, scale );
    this.modelViewTransform = modelViewTransform;

    // @public {NumberProperty} - scale applied to physical values to scale bar graphs correctly
    this.graphScaleProperty = new NumberProperty( 1 / 30, {
      tandem: tandem.createTandem( 'graphScaleProperty' )
    } );

    // @public - Enable the "Clear Thermal" buttons but only if the thermal energy exceeds a tiny threshold, so there
    // aren't visual "false positives", see #306
    this.allowClearingThermalEnergyProperty = new DerivedProperty( [ model.skater.thermalEnergyProperty ],
      function( thermalEnergy ) {
        return thermalEnergy > ( Constants.ALLOW_THERMAL_CLEAR_BASIS / self.graphScaleProperty.value );
      }, {
        tandem: tandem.createTandem( 'allowClearingThermalEnergyProperty' ),
        phetioType: DerivedPropertyIO( BooleanIO )
      } );

    this.availableModelBoundsProperty = new Property( new Bounds2( 0, 0, 0, 0 ) );
    this.availableModelBoundsProperty.link( function( bounds ) {
      model.availableModelBoundsProperty.set( bounds );
    } );

    // The background
    this.backgroundNode = new BackgroundNode( this.layoutBounds, tandem.createTandem( 'backgroundNode' ) );
    this.addChild( this.backgroundNode );

    this.gridNode = new GridNode( model.gridVisibleProperty, modelViewTransform, tandem.createTandem( 'gridNode' ) );
    this.addChild( this.gridNode );

    // @private - node that shows the energy legend for the pie chart
    this.pieChartLegend = new PieChartLegend(
      this.allowClearingThermalEnergyProperty,
      model.clearThermal.bind( model ),
      model.pieChartVisibleProperty,
      tandem.createTandem( 'pieChartLegend' )
    );
    this.addChild( this.pieChartLegend );

    this.controlPanel = new EnergySkateParkBasicsControlPanel( model, tandem.createTandem( 'controlPanel' ) );
    this.addChild( this.controlPanel );
    this.controlPanel.right = this.layoutBounds.width - 5;
    this.controlPanel.top = 5;

    // If we are on Edge, render the control panel with SVG so that the rest of the canvas block isn't redrawn every
    // time we drag a slider thumb, since rootRenderer is canvas in Edge. See
    // https://github.com/phetsims/energy-skate-park-basics/issues/423
    platform.edge && this.controlPanel.setRenderer( 'svg' );

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
      if ( !self.availableModelBounds ) {
        return true;
      }
      return self.availableModelBounds && containsAbove( self.availableModelBounds, position.x, position.y );
    } );

    // @private - background for the bar graph (split up to use WebGL for the foreground)
    this.barGraphBackground = new BarGraphBackground( this.allowClearingThermalEnergyProperty, model.barGraphVisibleProperty,
      model.clearThermal.bind( model ), tandem.createTandem( 'barGraphBackground' ) );
    this.addChild( this.barGraphBackground );

    if ( !model.draggableTracks ) {

      // layout done in layout bounds
      this.sceneSelectionPanel = new SceneSelectionPanel( model, this, modelViewTransform, tandem.createTandem( 'sceneSelectionPanel' ) );
      this.addChild( this.sceneSelectionPanel );
    }

    var playingProperty = new Property( !model.pausedProperty.value, {
      tandem: tandem.createTandem( 'playingProperty' ),
      phetioType: PropertyIO( BooleanIO )
    } );
    model.pausedProperty.link( function( paused ) {
      playingProperty.set( !paused );
    } );
    playingProperty.link( function( playing ) {
      model.pausedProperty.set( !playing );
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
      isPlayingProperty: playingProperty,
      listener: function() { model.manualStep(); },
      tandem: tandem.createTandem( 'stepButton' )
    } );

    // Make the step button the same size as the pause button.
    stepButton.mutate( { scale: playPauseButton.height / stepButton.height } );
    model.pausedProperty.linkAttribute( stepButton, 'enabled' );

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
      centerY: ( modelViewTransform.modelToViewY( 0 ) + this.layoutBounds.maxY ) / 2 + 8,

      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( this.resetAllButton );

    // The button to return the skater
    this.returnSkaterButton = new RectangularPushButton( {
      content: new Text( controlsRestartSkaterString, {
        tandem: tandem.createTandem( 'restartSkaterTextNode' ),
        maxWidth: 100
      } ),
      listener: model.returnSkater.bind( model ),
      centerY: this.resetAllButton.centerY,
      // X updated in layoutBounds since the reset all button can move horizontally
      tandem: tandem.createTandem( 'returnSkaterButton' )
    } );

    // Disable the return skater button when the skater is already at his initial coordinates
    model.skater.movedProperty.linkAttribute( self.returnSkaterButton, 'enabled' );
    this.addChild( this.returnSkaterButton );

    this.addChild( new PlaybackSpeedControl( model.speedProperty, tandem.createTandem( 'playbackSpeedControl' ) ).mutate( {
      left: stepButton.right + 20,
      centerY: playPauseButton.centerY
    } ) );

    var speedometerNode = new GaugeNode(
      // Hide the needle in for the background of the GaugeNode
      new Property( null ), propertiesSpeedString, new Range( 0, 20 ), {
        // enable/disable updates based on whether the speedometer is visible
        updateEnabledProperty: model.speedometerVisibleProperty,
        pickable: false,
        tandem: tandem.createTandem( 'speedometerNode' )
      } );
    model.speedometerVisibleProperty.linkAttribute( speedometerNode, 'visible' );
    speedometerNode.centerX = this.layoutBounds.centerX;
    speedometerNode.top = this.layoutBounds.minY + 5;
    this.addChild( speedometerNode );

    // Layer which will contain all of the tracks
    var trackLayer = new Node( {
      tandem: tandem.createTandem( 'trackLayer' )
    } );

    // Switch between selectable tracks
    if ( !model.draggableTracks ) {

      var trackNodes = model.tracks.getArray().map( function( track ) {
        return new TrackNode( model, track, modelViewTransform, self.availableModelBoundsProperty, trackNodeGroupTandem.createNextTandem() );
      } );

      trackNodes.forEach( function( trackNode ) {
        trackLayer.addChild( trackNode );
      } );

      model.sceneProperty.link( function( scene ) {
        trackNodes[ 0 ].visible = ( scene === 0 );
        trackNodes[ 1 ].visible = ( scene === 1 );
        trackNodes[ 2 ].visible = ( scene === 2 );
      } );
    }
    else {

      var addTrackNode = function( track ) {

        var trackNode = new TrackNode( model, track, modelViewTransform, self.availableModelBoundsProperty, trackNodeGroupTandem.createTandem( track.tandem.tail ) );
        trackLayer.addChild( trackNode );

        // When track removed, remove its view
        var itemRemovedListener = function( removed ) {
          if ( removed === track ) {
            trackLayer.removeChild( trackNode );

            // Clean up memory leak
            model.tracks.removeItemRemovedListener( itemRemovedListener );
            trackNode.dispose();
          }
        };
        model.tracks.addItemRemovedListener( itemRemovedListener );

        return trackNode;
      };

      // Create the tracks for the track toolbox
      var interactiveTrackNodes = model.tracks.getArray().map( addTrackNode );

      // Add a panel behind the tracks
      var padding = 10;

      var trackCreationPanel = new Rectangle(
        ( interactiveTrackNodes[ 0 ].left - padding / 2 ),
        ( interactiveTrackNodes[ 0 ].top - padding / 2 ),
        ( interactiveTrackNodes[ 0 ].width + padding ),
        ( interactiveTrackNodes[ 0 ].height + padding ),
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
        return new Path( new Shape().moveToPoint( tail ).lineToPoint( tail.plus( orthogonalUnitVector.times( headWidth / 2 ) ) ).lineToPoint( tip ).lineToPoint( tail.plus( orthogonalUnitVector.times( -headWidth / 2 ) ) ).lineToPoint( tail ).close(), {
          fill: 'black',
          tandem: tandem.createTandem( 'arrowHead' )
        } );
      };

      var rightCurve = new Path( new Shape().moveTo( 0, 0 ).quadraticCurveTo( -xControl, yControl, -xTip, yTip ), {
        stroke: 'black',
        lineWidth: 3,
        tandem: tandem.createTandem( 'rightCurve' )
      } );
      var arrowHead = createArrowhead( Math.PI - Math.PI / 3, new Vector2( -xTip, yTip ) );

      var clearButtonEnabledProperty = model.clearButtonEnabledProperty;
      clearButtonEnabledProperty.link( function( clearButtonEnabled ) {
        rightCurve.stroke = clearButtonEnabled ? 'black' : 'gray';
        arrowHead.fill = clearButtonEnabled ? 'black' : 'gray';
      } );

      var clearButton = new EraserButton( {
        iconWidth: 30,
        baseColor: new Color( 221, 210, 32 ),
        tandem: tandem.createTandem( 'clearButton' )
      } );
      clearButtonEnabledProperty.linkAttribute( clearButton, 'enabled' );
      clearButton.addListener( function() {model.clearTracks();} );

      this.addChild( clearButton.mutate( { left: 5, centerY: trackCreationPanel.centerY } ) );
    }

    this.addChild( trackLayer );

    //--------------------------------------------------------------------------
    // Begin WebGL layer. Children between this and the following WebGL comment
    // block use WebGL if possible. This layering is done so that Scenery can
    // place all WebGL content into a single canvas for memory optimization. This
    // results in a case where the trackLayer is in between the background and 
    // foreground of the energy bar graph, see #211.
    // 
    // Use WebGL where available, but not on IE, due to
    // https://github.com/phetsims/energy-skate-park-basics/issues/277 and
    // https://github.com/phetsims/scenery/issues/285 
    //--------------------------------------------------------------------------
    var webGLSupported = Util.isWebGLSupported && phet.chipper.queryParameters.webgl;
    var renderer = webGLSupported ? 'webgl' : null;

    var skaterNode = new SkaterNode(
      model.skater,
      this,
      modelViewTransform,
      model.getClosestTrackAndPositionAndParameter.bind( model ),
      model.getPhysicalTracks.bind( model ),
      renderer,
      tandem.createTandem( 'skaterNode' )
    );

    var gaugeNeedleNode = new GaugeNeedleNode( model.skater.speedProperty, new Range( 0, 20 ), {
      renderer: renderer
    } );
    model.speedometerVisibleProperty.linkAttribute( gaugeNeedleNode, 'visible' );
    gaugeNeedleNode.x = speedometerNode.x;
    gaugeNeedleNode.y = speedometerNode.y;
    this.addChild( gaugeNeedleNode );

    // @private - the foreground of the bar graph (split up to use WebGL)
    this.barGraphForeground = new BarGraphForeground( model.skater, this.graphScaleProperty, this.barGraphBackground, model.barGraphVisibleProperty, renderer,
      tandem.createTandem( 'barGraphForeground' )
    );
    this.addChild( this.barGraphForeground );

    this.addChild( skaterNode );

    var pieChartNode = renderer === 'webgl' ?
                       new PieChartWebGLNode( model.skater, model.pieChartVisibleProperty, this.graphScaleProperty, modelViewTransform, tandem.createTandem( 'pieChartNode' ) ) :
                       new PieChartNode( model.skater, model.pieChartVisibleProperty, this.graphScaleProperty, modelViewTransform, tandem.createTandem( 'pieChartNode' ) );
    this.addChild( pieChartNode );

    //--------------------------------------------------------------------------
    // End WebGL layer
    //--------------------------------------------------------------------------

    // Buttons to return the skater when she is offscreen, see #219
    var iconScale = 0.4;
    var returnSkaterToPreviousStartingPositionButton = new RectangularPushButton( {
      content: new Image( skaterIconImage, {
        scale: iconScale,
        tandem: tandem.createTandem( 'skaterIconImage1' )
      } ),

      // green means "go" since the skater will likely start moving at this point
      baseColor: EnergySkateParkColorScheme.kineticEnergy,
      listener: model.returnSkater.bind( model ),
      tandem: tandem.createTandem( 'returnSkaterToPreviousStartingPositionButton' )
    } );

    var returnSkaterToGroundButton = new RectangularPushButton( {
      content: new Image( skaterIconImage, {
        scale: iconScale,
        tandem: tandem.createTandem( 'skaterIconImage2' )
      } ),
      centerBottom: modelViewTransform.modelToViewPosition( model.skater.startingPositionProperty.value ),
      baseColor: '#f4514e', // red for stop, since the skater will be stopped on the ground.
      listener: function() { model.skater.resetPosition(); },
      tandem: tandem.createTandem( 'returnSkaterToGroundButton' )
    } );

    this.addChild( returnSkaterToPreviousStartingPositionButton );
    this.addChild( returnSkaterToGroundButton );

    // When the skater goes off screen, make the "return skater" button big
    onscreenProperty.link( function( skaterOnscreen ) {
      var buttonsVisible = !skaterOnscreen;
      returnSkaterToGroundButton.visible = buttonsVisible;
      returnSkaterToPreviousStartingPositionButton.visible = buttonsVisible;

      if ( buttonsVisible ) {

        // Put the button where the skater will appear.  Nudge it up a bit so the mouse can hit it from the drop site,
        // without being moved at all (to simplify repeat runs).
        var viewPosition = modelViewTransform.modelToViewPosition( model.skater.startingPositionProperty.value ).plusXY( 0, 5 );
        returnSkaterToPreviousStartingPositionButton.centerBottom = viewPosition;

        // If the return skater button went offscreen, move it back on the screen, see #222
        if ( returnSkaterToPreviousStartingPositionButton.top < 5 ) {
          returnSkaterToPreviousStartingPositionButton.top = 5;
        }
      }
    } );

    // For debugging the visible bounds
    if ( showAvailableBounds ) {
      this.viewBoundsPath = new Path( null, {
        pickable: false,
        stroke: 'red',
        lineWidth: 10,
        tandem: tandem.createTandem( 'viewBoundsPath' )
      } );
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
        offsetY = ( height / scale - this.layoutBounds.height );
      }

      // center horizontally
      else if ( scale === height / this.layoutBounds.height ) {
        offsetX = ( width - this.layoutBounds.width * scale ) / 2 / scale;
      }
      this.translate( offsetX, offsetY );

      this.backgroundNode.layout( offsetX, offsetY, width, height, scale );
      this.gridNode.layout( offsetX, offsetY, width, height, scale );

      this.availableViewBounds = new DotRectangle( -offsetX, -offsetY, width / scale, this.modelViewTransform.modelToViewY( 0 ) + Math.abs( offsetY ) );

      // Float the control panel to the right (but not arbitrarily far because it could get too far from the play area)
      var maxFloatAmount = EnergySkateParkBasicsQueryParameters.controlPanelLocation === 'fixed' ? 890 : Number.MAX_VALUE;
      this.controlPanel.right = Math.min( maxFloatAmount, this.availableViewBounds.maxX ) - 5;

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

      if ( EnergySkateParkBasicsQueryParameters.controlPanelLocation === 'floating' ) {
        this.barGraphBackground.x = this.availableViewBounds.minX + 5;
        this.barGraphForeground.x = this.availableViewBounds.minX + 19;
      }

      // Put the pie chart legend to the right of the bar chart, see #60, #192
      this.pieChartLegend.mutate( { top: this.barGraphBackground.top, left: this.barGraphBackground.right + 8 } );

      // Show it for debugging
      if ( showAvailableBounds ) {
        this.viewBoundsPath.shape = Shape.bounds( this.availableViewBounds );
      }
    }
  } );
} );