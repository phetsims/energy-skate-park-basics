// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the energy skate park basics view (includes everything you see)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var AttachDetachToggleButtons = require( 'ENERGY_SKATE_PARK_BASICS/view/AttachDetachToggleButtons' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Rect = require( 'DOT/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Panel = require( 'SUN/Panel' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SkaterNode = require( 'ENERGY_SKATE_PARK_BASICS/view/SkaterNode' );
  var TrackNode = require( 'ENERGY_SKATE_PARK_BASICS/view/TrackNode' );
  var BackgroundNode = require( 'ENERGY_SKATE_PARK_BASICS/view/BackgroundNode' );
  var EnergySkateParkBasicsControlPanel = require( 'ENERGY_SKATE_PARK_BASICS/view/EnergySkateParkBasicsControlPanel' );
  var PlaybackSpeedControl = require( 'ENERGY_SKATE_PARK_BASICS/view/PlaybackSpeedControl' );
  var BarGraphNode = require( 'ENERGY_SKATE_PARK_BASICS/view/BarGraphNode' );
  var PieChartNode = require( 'ENERGY_SKATE_PARK_BASICS/view/PieChartNode' );
  var PieChartLegend = require( 'ENERGY_SKATE_PARK_BASICS/view/PieChartLegend' );
  var GridNode = require( 'ENERGY_SKATE_PARK_BASICS/view/GridNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var SceneSelectionPanel = require( 'ENERGY_SKATE_PARK_BASICS/view/SceneSelectionPanel' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var GaugeNode = require( 'SCENERY_PHET/GaugeNode' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Path = require( 'SCENERY/nodes/Path' );
  var returnSkaterString = require( 'string!ENERGY_SKATE_PARK_BASICS/controls.reset-character' );
  var speedString = require( 'string!ENERGY_SKATE_PARK_BASICS/properties.speed' );
  var PlayPauseButton = require( 'SCENERY_PHET/PlayPauseButton' );
  var StepButton = require( 'SCENERY_PHET/StepButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var eraser = require( 'image!ENERGY_SKATE_PARK_BASICS/eraser.png' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Bounds2 = require( 'DOT/Bounds2' );

  //Debug flag to show the view bounds, the region within which the skater can move
  var showAvailableBounds = false;

  function EnergySkateParkBasicsScreenView( model ) {

    var view = this;
    ScreenView.call( view, { renderer: 'svg' } );

    var modelPoint = new Vector2( 0, 0 );
    var viewPoint = new Vector2( this.layoutBounds.width / 2, this.layoutBounds.height - BackgroundNode.earthHeight );//earth is 70px high in stage coordinates
    var scale = 50;
    var transform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( modelPoint, viewPoint, scale );
    this.modelViewTransform = transform;

    this.availableModelBoundsProperty = new Property();

    //The background
    this.backgroundNode = new BackgroundNode( this.layoutBounds );
    this.addChild( this.backgroundNode );

    this.gridNode = new GridNode( model.property( 'gridVisible' ), transform );
    this.addChild( this.gridNode );

    var pieChartLegend = new PieChartLegend( model.skater, model.clearThermal.bind( model ), model.property( 'pieChartVisible' ) );
    this.addChild( pieChartLegend );

    var speedometerNode = new GaugeNode( model.skater.property( 'speed' ), speedString, {min: 0, max: 20}, {updateEnabledProperty: model.property( 'speedometerVisible' ), pickable: false} );
    model.property( 'speedometerVisible' ).linkAttribute( speedometerNode, 'visible' );
    speedometerNode.centerX = this.layoutBounds.centerX;
    speedometerNode.top = this.layoutBounds.minY + 5;
    this.addChild( speedometerNode );

    this.controlPanel = new EnergySkateParkBasicsControlPanel( model );
    this.addChild( this.controlPanel );
    this.controlPanel.right = this.layoutBounds.width - 5;
    this.controlPanel.top = 5;

    // For the playground screen, show attach/detach toggle buttons
    if ( model.draggableTracks ) {
      var property = model.draggableTracks ? new Property( true ) : model.property( 'scene' ).valueEquals( 2 );
      this.attachDetachToggleButtons = new AttachDetachToggleButtons( model.property( 'detachable' ), property, this.controlPanel.contentWidth, {top: this.controlPanel.bottom + 5, centerX: this.controlPanel.centerX} );
      this.addChild( this.attachDetachToggleButtons );
    }

    //Determine if the skater is onscreen or offscreen for purposes of highlighting the 'return skater' button.
    var onscreenProperty = new DerivedProperty( [model.skater.positionProperty], function( position ) {
      return view.availableModelBounds && view.availableModelBounds.containsPoint( position );
    } );

    var barGraphNode = new BarGraphNode( model.skater, model.property( 'barGraphVisible' ), model.clearThermal.bind( model ) );
    this.addChild( barGraphNode );

    if ( !model.draggableTracks ) {
      this.sceneSelectionPanel = new SceneSelectionPanel( model, this, transform );//layout done in layout bounds
      this.addChild( this.sceneSelectionPanel );
    }

    //Put the pie chart legend to the right of the bar chart, see #60, #192
    pieChartLegend.mutate( {top: barGraphNode.top, left: barGraphNode.right + 8} );

    var playProperty = model.property( 'paused' ).not();
    var playPauseButton = new PlayPauseButton( playProperty ).mutate( {scale: 0.75} );
    var stepButton = new StepButton( function() { model.manualStep(); }, playProperty ).mutate( {scale: 0.75} );
    model.property( 'paused' ).linkAttribute( stepButton, 'enabled' );

    this.addChild( playPauseButton.mutate( {centerX: this.layoutBounds.centerX, bottom: this.layoutBounds.maxY - 7} ) );
    this.addChild( stepButton.mutate( {left: playPauseButton.right + 5, centerY: playPauseButton.centerY} ) );

    this.resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      scale: 0.85,
      centerX: this.controlPanel.centerX,

      //Align vertically with other controls, see https://github.com/phetsims/energy-skate-park-basics/issues/134
      centerY: (transform.modelToViewY( 0 ) + this.layoutBounds.maxY) / 2 + 8
    } );
    this.addChild( this.resetAllButton );

    //The button to return the skater
    this.returnSkaterButton = new RectangularPushButton( {
      content: new Text( returnSkaterString ),
      listener: model.returnSkater.bind( model ),
      centerY: this.resetAllButton.centerY
      //X updated in layoutBounds since the reset all button can move horizontally
    } );

    //Disable the return skater button when the skater is already at his initial coordinates
    model.skater.linkAttribute( 'moved', view.returnSkaterButton, 'enabled' );
    this.addChild( this.returnSkaterButton );

    //When the skater goes off screen, make the "return skater" button big
    onscreenProperty.lazyLink( function( onscreen ) {
      view.returnSkaterButton.setScaleMagnitude( onscreen ? 1 : 1.5 );
      view.returnSkaterButton.centerY = view.resetAllButton.centerY;
      view.returnSkaterButton.right = view.resetAllButton.left - 10;
    } );

    this.addChild( new PlaybackSpeedControl( model.property( 'speed' ) ).mutate( {right: playPauseButton.left - 10, bottom: playPauseButton.bottom} ) );

    //Switch between selectable tracks
    if ( !model.draggableTracks ) {

      var trackNodes = model.tracks.map( function( track ) { return new TrackNode( model, track, transform, view.availableModelBoundsProperty ); } ).getArray();
      trackNodes.forEach( function( trackNode ) {
        view.addChild( trackNode );
      } );

      model.property( 'scene' ).link( function( scene ) {
        trackNodes[0].visible = (scene === 0);
        trackNodes[1].visible = (scene === 1);
        trackNodes[2].visible = (scene === 2);
      } );
    }
    else {

      var addTrackNode = function( track ) {

        var trackNode = new TrackNode( model, track, transform, view.availableModelBoundsProperty );
        view.addChild( trackNode );

        //Make sure the skater stays in front of the tracks when tracks are joined
        if ( skaterNode ) {
          skaterNode.moveToFront();
          pieChartNode.moveToFront();
        }

        //When track removed, remove its view
        var itemRemovedListener = function( removed ) {
          if ( removed === track ) {
            view.removeChild( trackNode );
            model.tracks.removeItemRemovedListener( itemRemovedListener );//Clean up memory leak
          }
        };
        model.tracks.addItemRemovedListener( itemRemovedListener );

        return trackNode;
      };

      //Create the tracks for the track toolbox
      var interactiveTrackNodes = model.tracks.map( addTrackNode ).getArray();

      //Add a panel behind the tracks
      var margin = 5;
      this.trackCreationPanel = new Panel( new Rectangle( 0, 0, interactiveTrackNodes[0].width, interactiveTrackNodes[0].height ), {xMargin: margin, yMargin: margin, x: interactiveTrackNodes[0].left - margin, y: interactiveTrackNodes[0].top - margin} );
      this.addChild( this.trackCreationPanel );

      interactiveTrackNodes.forEach( function( trackNode ) { trackNode.moveToFront(); } );

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
        return new Path( new Shape().moveToPoint( tail ).
            lineToPoint( tail.plus( orthogonalUnitVector.times( headWidth / 2 ) ) ).
            lineToPoint( tip ).
            lineToPoint( tail.plus( orthogonalUnitVector.times( -headWidth / 2 ) ) ).
            lineToPoint( tail ).close(),
          {fill: 'black'} );
      };

      var rightCurve = new Path( new Shape().moveTo( 0, 0 ).quadraticCurveTo( -xControl, yControl, -xTip, yTip ), { stroke: 'black', lineWidth: 3 } );
      var arrowHead = createArrowhead( Math.PI - Math.PI / 3, new Vector2( -xTip, yTip ) );

      //Create the clear button, and match the size to the size of the track toolbox
      var clearNode = new Image( eraser, {scale: 0.4475} );

      var clearButtonEnabledProperty = model.property( 'clearButtonEnabled' );
      clearButtonEnabledProperty.link( function( clearButtonEnabled ) {
        rightCurve.stroke = clearButtonEnabled ? 'black' : 'gray';
        arrowHead.fill = clearButtonEnabled ? 'black' : 'gray';
      } );

      var clearButton = new RectangularPushButton( {content: clearNode, baseColor: new Color( 221, 210, 32 )} );
      clearButtonEnabledProperty.linkAttribute( clearButton, 'enabled' );
      clearButton.addListener( function() {model.clearTracks();} );

      var buttons = new VBox( {children: [clearButton], spacing: 2, left: 5, centerY: this.trackCreationPanel.centerY} );
      this.addChild( buttons );
    }

    var skaterNode = new SkaterNode( model.skater, this, transform, model.getClosestTrackAndPositionAndParameter.bind( model ), model.getPhysicalTracks.bind( model ) );
    this.addChild( skaterNode );
    var pieChartNode = new PieChartNode( model.skater, model.property( 'pieChartVisible' ), transform );
    this.addChild( pieChartNode );

    //For debugging the visible bounds
    if ( showAvailableBounds ) {
      this.viewBoundsPath = new Path( null, {pickable: false, stroke: 'red', lineWidth: 10} );
      this.addChild( this.viewBoundsPath );
    }
  }

  return inherit( ScreenView, EnergySkateParkBasicsScreenView, {

    layoutBounds: ScreenView.UPDATED_LAYOUT_BOUNDS.copy(),

    //No state that is specific to the view, in this case
    getState: function() {},
    setState: function() {},

    //Layout the EnergySkateParkBasicsScreenView, scaling it up and down with the size of the screen to ensure a minimially visible area,
    //But keeping it centered at the bottom of the screen, so there is more area in the +y direction to build tracks and move the skater
    layout: function( width, height ) {

      this.resetTransform();

      var scale = this.getLayoutScale( width, height );
      this.setScaleMagnitude( scale );

      var offsetX = 0;
      var offsetY = 0;

      //Move to bottom vertically
      if ( scale === width / this.layoutBounds.width ) {
        offsetY = (height / scale - this.layoutBounds.height);
      }

      //center horizontally
      else if ( scale === height / this.layoutBounds.height ) {
        offsetX = (width - this.layoutBounds.width * scale) / 2 / scale;
      }
      this.translate( offsetX, offsetY );

      this.backgroundNode.layout( offsetX, offsetY, width, height, scale );
      this.gridNode.layout( offsetX, offsetY, width, height, scale );

      this.availableViewBounds = new Rect( -offsetX, -offsetY, width / scale, this.modelViewTransform.modelToViewY( 0 ) + Math.abs( offsetY ) );

      //Float the control panel to the right (but not arbitrarily far because it could get too far from the play area)
      this.controlPanel.right = Math.min( 890, this.availableViewBounds.maxX ) - 5;

      if ( this.attachDetachToggleButtons ) {
        this.attachDetachToggleButtons.centerX = this.controlPanel.centerX;
      }

      if ( this.sceneSelectionPanel ) {
        var panelAbove = this.attachDetachToggleButtons || this.controlPanel;
        this.sceneSelectionPanel.centerX = panelAbove.centerX;
        this.sceneSelectionPanel.top = panelAbove.bottom + 5;
      }
      this.resetAllButton.centerX = this.controlPanel.centerX;
      this.returnSkaterButton.right = this.resetAllButton.left - 10;

      //Compute the visible model bounds so we will know when a model object like the skater has gone offscreen
      this.availableModelBounds = this.modelViewTransform.viewToModelBounds( this.availableViewBounds );
      this.availableModelBoundsProperty.value = this.availableModelBounds;

      //Show it for debugging
      if ( showAvailableBounds ) {
        this.viewBoundsPath.shape = Shape.bounds( this.availableViewBounds );
      }
    }
  } );
} );