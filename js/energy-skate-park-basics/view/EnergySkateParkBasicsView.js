// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the energy skate park basics view (includes everything you see)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SkaterNode = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/SkaterNode' );
  var ClosestPointNode = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/ClosestPointNode' );
  var TrackNode = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/TrackNode' );
  var BackgroundNode = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/BackgroundNode' );
  var EnergySkateParkBasicsControlPanel = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/EnergySkateParkBasicsControlPanel' );
  var PlayPauseControlPanel = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/PlayPauseControlPanel' );
  var PlaybackSpeedControl = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/PlaybackSpeedControl' );
  var BarGraphNode = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/BarGraphNode' );
  var PieChartNode = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/PieChartNode' );
  var PieChartLegend = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/PieChartLegend' );
  var GridNode = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/GridNode' );
  var ResetAllButton = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/ResetAllButton' );
  var SceneSelectionPanel = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/SceneSelectionPanel' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var SpeedometerNode = require( 'SCENERY_PHET/SpeedometerNode' );
  var TextButton = require( 'SUN/TextButton' );

  function EnergySkateParkBasicsView( model ) {

    var thisView = this;
    ScreenView.call( thisView, { renderer: 'svg' } );

    var modelPoint = new Vector2( 0, 0 );
    var viewPoint = new Vector2( this.layoutBounds.width / 2, this.layoutBounds.height - BackgroundNode.grassHeight );//grass is 70px high in stage coordinates
    var scale = 50;
    var transform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( modelPoint, viewPoint, scale );

    //The background
    this.backgroundNode = new BackgroundNode( model, this );
    this.addChild( this.backgroundNode );

    this.gridNode = new GridNode( model, this, transform );
    this.addChild( this.gridNode );

    //Switch between selectable tracks
    if ( !model.draggableTracks ) {

      var trackNodes = [
        new TrackNode( model, model.sceneTracks[0], transform ),
        new TrackNode( model, model.sceneTracks[1], transform ),
        new TrackNode( model, model.sceneTracks[2], transform )];
      for ( var i = 0; i < trackNodes.length; i++ ) {
        this.addChild( trackNodes[i] );
      }

      model.sceneProperty.link( function( scene ) {
        trackNodes[0].visible = (scene === 0);
        trackNodes[1].visible = (scene === 1);
        trackNodes[2].visible = (scene === 2);
      } );
    }
    else {
      this.addChild( new TrackNode( model, model.track, transform ) );
    }

    this.addChild( new SkaterNode( model, transform ) );
    this.addChild( new PieChartNode( model, this, transform ) );
    var pieChartLegend = new PieChartLegend( model );
    this.addChild( pieChartLegend );
//    this.addChild( new ClosestPointNode( model, transform ) );

    var speedometerNode = new SpeedometerNode( model.skater.speedProperty, 'Speed', 20 );
    model.speedometerVisibleProperty.linkAttribute( speedometerNode, 'visible' );
    speedometerNode.centerX = this.layoutBounds.centerX;
    speedometerNode.top = this.layoutBounds.minY + 5;
    this.addChild( speedometerNode );

    this.controlPanel = new EnergySkateParkBasicsControlPanel( model, this );
    this.addChild( this.controlPanel );
    this.controlPanel.right = this.layoutBounds.width - 5;
    this.controlPanel.top = 5;

    //center the pie chart legend between the control panel and speedometer
    pieChartLegend.mutate( {top: this.controlPanel.top, right: this.controlPanel.left - 9} );

    var returnSkaterButton = new TextButton( 'Return Skater', model.returnSkater.bind( model ), {centerX: this.controlPanel.centerX, top: this.controlPanel.bottom + 10} );
    this.addChild( returnSkaterButton );

    this.addChild( new BarGraphNode( model, this ) );

    var playPauseControl = new PlayPauseControlPanel( model, this );
    this.addChild( playPauseControl.mutate( {centerX: this.layoutBounds.centerX + playPauseControl.playButton.width / 2, bottom: this.layoutBounds.maxY - 10} ) );

    this.addChild( new ResetAllButton( model.reset.bind( model ) ).mutate( {scale: 0.7, centerY: (transform.modelToViewY( 0 ) + this.layoutBounds.maxY) / 2, centerX: this.controlPanel.centerX} ) );

    this.addChild( new PlaybackSpeedControl( model ).mutate( {right: playPauseControl.left, centerY: playPauseControl.centerY} ) );

    if ( !model.draggableTracks ) {
      this.addChild( new SceneSelectionPanel( model, this, transform ).mutate( {left: 0, centerY: playPauseControl.centerY} ) );
    }
  }

  return inherit( ScreenView, EnergySkateParkBasicsView, {

    //TODO: integrate this layout code with ScreenView?  Seems like it could be generally useful
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
    }
  } );
} );