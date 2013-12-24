// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the energy skate park basics view (includes everything you see)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Rect = require( 'DOT/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Panel = require( 'SUN/Panel' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SkaterNode = require( 'ENERGY_SKATE_PARK_BASICS/view/SkaterNode' );
  var TrackNode = require( 'ENERGY_SKATE_PARK_BASICS/view/TrackNode' );
  var BackgroundNode = require( 'ENERGY_SKATE_PARK_BASICS/view/BackgroundNode' );
  var EnergySkateParkBasicsControlPanel = require( 'ENERGY_SKATE_PARK_BASICS/view/EnergySkateParkBasicsControlPanel' );
  var PlayPauseControlPanel = require( 'ENERGY_SKATE_PARK_BASICS/view/PlayPauseControlPanel' );
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
  var Skater = require( 'ENERGY_SKATE_PARK_BASICS/model/Skater' );
  var Path = require( 'SCENERY/nodes/Path' );
  var returnSkaterString = require( 'string!ENERGY_SKATE_PARK_BASICS/controls.reset-character' );
  var speedString = require( 'string!ENERGY_SKATE_PARK_BASICS/properties.speed' );

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

    var playPauseControl = new PlayPauseControlPanel( model, {x: 0, y: 0} );
    this.addChild( playPauseControl.mutate( {centerX: this.layoutBounds.centerX + playPauseControl.playButton.width / 2, bottom: this.layoutBounds.maxY - 10} ) );

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

    this.addChild( new PlaybackSpeedControl( model ).mutate( {right: playPauseControl.left, centerY: playPauseControl.centerY} ) );

    if ( !model.draggableTracks ) {
      this.sceneSelectionPanel = new SceneSelectionPanel( model, this, transform );//layout done in layout bounds
      this.addChild( this.sceneSelectionPanel );
    }

    //For debugging the visible bounds
    if ( showAvailableBounds ) {
      this.viewBoundsPath = new Path( null, {pickable: false, stroke: 'red', lineWidth: 10} );
      this.addChild( this.viewBoundsPath );
    }
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