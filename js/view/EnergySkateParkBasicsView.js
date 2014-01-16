// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the energy skate park basics view (includes everything you see)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var RectanglePushButton = require( 'SUN/RectanglePushButton' );
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
  var TextPushButton = require( 'SUN/TextPushButton' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Path = require( 'SCENERY/nodes/Path' );
  var returnSkaterString = require( 'string!ENERGY_SKATE_PARK_BASICS/controls.reset-character' );
  var speedString = require( 'string!ENERGY_SKATE_PARK_BASICS/properties.speed' );
  var PlayPauseButton = require( 'SCENERY_PHET/PlayPauseButton' );
  var StepButton = require( 'SCENERY_PHET/StepButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var scissorsImage = require( 'image!ENERGY_SKATE_PARK_BASICS/scissors.png' );
  var scissorsClosedImage = require( 'image!ENERGY_SKATE_PARK_BASICS/scissors-closed.png' );
  var scissorsGrayImage = require( 'image!ENERGY_SKATE_PARK_BASICS/scissors-gray.png' );
  var TrackEditingNode = require( 'ENERGY_SKATE_PARK_BASICS/view/TrackEditingNode' );

  //Debug flag to show the view bounds, the region within which the skater can move
  var showAvailableBounds = false;

  function EnergySkateParkBasicsView( model ) {

    var view = this;
    ScreenView.call( view, { renderer: 'svg' } );

    var modelPoint = new Vector2( 0, 0 );
    var viewPoint = new Vector2( this.layoutBounds.width / 2, this.layoutBounds.height - BackgroundNode.grassHeight );//grass is 70px high in stage coordinates
    var scale = 50;
    var transform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( modelPoint, viewPoint, scale );
    this.modelViewTransform = transform;

    //The background
    this.backgroundNode = new BackgroundNode( model, this );
    this.addChild( this.backgroundNode );

    this.gridNode = new GridNode( model, transform );
    this.addChild( this.gridNode );

    //Switch between selectable tracks
    if ( !model.draggableTracks ) {

      var trackNodes = model.tracks.map(function( track ) { return new TrackNode( model, track, transform ); } ).getArray();
      trackNodes.forEach( function( trackNode ) {
        view.addChild( trackNode );
      } );

      model.sceneProperty.link( function( scene ) {
        trackNodes[0].visible = (scene === 0);
        trackNodes[1].visible = (scene === 1);
        trackNodes[2].visible = (scene === 2);
      } );
    }
    else {

      var addTrackNode = function( track ) {

        var trackNode = new TrackNode( model, track, transform, function( point ) {
          var globalBounds = view.trackCreationPanel.parentToGlobalBounds( view.trackCreationPanel.bounds );
          return globalBounds.containsPoint( point );
        } );
        view.addChild( trackNode );

        //Make sure the skater stays in front of the tracks when tracks are joined
        if ( skaterNode ) {
          skaterNode.moveToFront();
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

      var editNode = new Image( scissorsImage );

      var editButtonEnabledProperty = model.property( 'editButtonEnabled' );
      model.multilink( ['editButtonEnabled', 'editing'], function( editButtonEnabled, editing ) {
        editNode.image = editButtonEnabled ? (editing ? scissorsClosedImage : scissorsImage) : scissorsGrayImage;
        editNode.y = editNode.image === scissorsClosedImage ? 2.5 : 0;
      } );

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

      var clearNode = new Node( {children: [rightCurve, arrowHead], scale: 0.8} );
      var doneNode = new FontAwesomeNode( 'cut', {scale: 0.45, fill: 'white'} );

      var clearButtonEnabledProperty = model.property( 'clearButtonEnabled' );
      clearButtonEnabledProperty.link( function( clearButtonEnabled ) {
        rightCurve.stroke = clearButtonEnabled ? 'black' : 'gray';
        arrowHead.fill = clearButtonEnabled ? 'black' : 'gray';
      } );

      var nodes = [editNode, clearNode, doneNode];

      //Make all buttons the same dimension
      var pad = function( node, nodes ) {
        var maxWidth = _.max( nodes,function( node ) {return node.width;} ).width;
        var maxHeight = _.max( nodes,function( node ) {return node.height;} ).height;
        node.centerX = maxWidth / 2;
        node.centerY = maxHeight / 2;
        return new Rectangle( 0, 0, maxWidth, maxHeight, {children: [node]} );
      };

      var editButton = new RectanglePushButton( pad( editNode, nodes ) );
      editButton.addListener( function() {model.editing = !model.editing;} );
      editButtonEnabledProperty.linkAttribute( editButton, 'enabled' );

      var clearButton = new RectanglePushButton( pad( clearNode, nodes ) );
      clearButtonEnabledProperty.linkAttribute( clearButton, 'enabled' );
      clearButton.addListener( function() {model.clearTracks();} );

      var editClearButtons = new VBox( {children: [editButton, clearButton], spacing: 2, right: this.trackCreationPanel.left - 5, centerY: this.trackCreationPanel.centerY} );
      this.addChild( editClearButtons );
    }

    var skaterNode = new SkaterNode( model, model.skater, this, transform );
    this.addChild( skaterNode );
    this.addChild( new PieChartNode( model, transform ) );
    var pieChartLegend = new PieChartLegend( model );
    this.addChild( pieChartLegend );

    var speedometerNode = new GaugeNode( model.skater.speedProperty, speedString, {min: 0, max: 20}, {updateEnabledProperty: model.speedometerVisibleProperty, pickable: false} );
    model.speedometerVisibleProperty.linkAttribute( speedometerNode, 'visible' );
    speedometerNode.centerX = this.layoutBounds.centerX;
    speedometerNode.top = this.layoutBounds.minY + 5;
    this.addChild( speedometerNode );

    this.controlPanel = new EnergySkateParkBasicsControlPanel( model );
    this.addChild( this.controlPanel );
    this.controlPanel.right = this.layoutBounds.width - 5;
    this.controlPanel.top = 5;

    //Determine if the skater is onscreen or offscreen for purposes of highlighting the 'return skater' button.
    var onscreenProperty = new DerivedProperty( [model.skater.positionProperty], function( position ) {
      return view.availableModelBounds && view.availableModelBounds.containsPoint( position );
    } );

    var barGraphNode = new BarGraphNode( model );
    this.addChild( barGraphNode );

    //Center the pie chart legend between the bar chart and speedometer, see #60
    pieChartLegend.mutate( {top: barGraphNode.top, centerX: (barGraphNode.right + speedometerNode.left) / 2} );

    var playProperty = model.property( 'paused' ).not();
    var playPauseButton = new PlayPauseButton( playProperty, {elementScale: 0.73} );
    var stepButton = new StepButton( function() { model.manualStep(); }, playProperty );
    model.property( 'paused' ).linkAttribute( stepButton, 'enabled' );

    this.addChild( playPauseButton.mutate( {centerX: this.layoutBounds.centerX, bottom: this.layoutBounds.maxY - 6} ) );
    this.addChild( stepButton.mutate( {left: playPauseButton.right + 5, centerY: playPauseButton.centerY} ) );

    this.resetAllButton = new ResetAllButton( model.reset.bind( model ) ).mutate( {scale: 0.7, centerY: (transform.modelToViewY( 0 ) + this.layoutBounds.maxY) / 2, centerX: this.controlPanel.centerX} );
    this.addChild( this.resetAllButton );

    //The button to return the skater
    this.returnSkaterButton = new TextPushButton( returnSkaterString, {
      listener: model.returnSkater.bind( model ),
      centerY: this.resetAllButton.centerY
      //X updated in layoutBounds since the reset all button can move horizontally
    } );

    //Disable the return skater button when the skater is already at his initial coordinates
    model.skater.movedProperty.link( function( moved ) {view.returnSkaterButton.enabled = moved;} );
    this.addChild( this.returnSkaterButton );

    //When the skater goes off screen, make the "return skater" button big
    onscreenProperty.lazyLink( function( onscreen ) {
      view.returnSkaterButton.setScaleMagnitude( onscreen ? 1 : 1.5 );
      view.returnSkaterButton.centerY = view.resetAllButton.centerY;
      view.returnSkaterButton.right = view.resetAllButton.left - 10;
    } );

    this.addChild( new PlaybackSpeedControl( model ).mutate( {right: playPauseButton.left - 10, centerY: playPauseButton.centerY} ) );

    if ( !model.draggableTracks ) {
      this.sceneSelectionPanel = new SceneSelectionPanel( model, this, transform );//layout done in layout bounds
      this.addChild( this.sceneSelectionPanel );
    }

    //For debugging the visible bounds
    if ( showAvailableBounds ) {
      this.viewBoundsPath = new Path( null, {pickable: false, stroke: 'red', lineWidth: 10} );
      this.addChild( this.viewBoundsPath );
    }

    var trackEditingNode = null;
    model.property( 'editing' ).link( function( editing ) {
      if ( editing ) {
        trackEditingNode = new TrackEditingNode( model, transform );
        view.addChild( trackEditingNode );
      }
      else {
        if ( trackEditingNode ) {
          view.removeChild( trackEditingNode );
        }
      }
    } );
  }

  return inherit( ScreenView, EnergySkateParkBasicsView, {

    //Layout the EnergySkateParkBasicsView, scaling it up and down with the size of the screen to ensure a minimially visible area,
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

      if ( this.sceneSelectionPanel ) {
        this.sceneSelectionPanel.centerX = this.controlPanel.centerX;
        this.sceneSelectionPanel.top = this.controlPanel.bottom + 10;
      }
      this.resetAllButton.centerX = this.controlPanel.centerX;
      this.returnSkaterButton.right = this.resetAllButton.left - 10;
      //Compute the visible model bounds so we will know when a model object like the skater has gone offscreen
      this.availableModelBounds = this.modelViewTransform.viewToModelBounds( this.availableViewBounds );

      //Show it for debugging
      if ( showAvailableBounds ) {
//        this.viewBoundsPath.shape = Shape.bounds( this.modelViewTransform.modelToViewBounds( this.availableModelBounds ) );
        this.viewBoundsPath.shape = Shape.bounds( this.availableViewBounds );
      }
    }
  } );
} );