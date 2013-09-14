// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Scene = require( 'SCENERY/Scene' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var SkaterNode = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/SkaterNode' );
  var ClosestPointNode = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/ClosestPointNode' );
  var TrackNode = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/TrackNode' );
  var BackgroundNode = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/BackgroundNode' );
  var EnergySkateParkBasicsControlPanel = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/EnergySkateParkBasicsControlPanel' );
  var PlayPauseControlPanel = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/PlayPauseControlPanel' );
  var BarGraphNode = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/BarGraphNode' );
  var ResetAllButton = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/ResetAllButton' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Vector2 = require( 'DOT/Vector2' );

  function EnergySkateParkBasicsView( model, mvt ) {

    var thisView = this;
    ScreenView.call( thisView, { renderer: 'svg' } );

    //The background
    this.backgroundNode = new BackgroundNode( model, this );
    this.addChild( this.backgroundNode );

    var modelPoint = new Vector2( 0, 0 );
    var viewPoint = new Vector2( this.layoutBounds.width / 2, this.layoutBounds.height - 100 );//grass is 100px high in stage coordinates
    var scale = 100;
    var transform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( modelPoint, viewPoint, scale );
    this.addChild( new TrackNode( model, transform ) );
    this.addChild( new SkaterNode( model, transform ) );
//    this.addChild( new ClosestPointNode( model, transform ) );

    this.controlPanel = new EnergySkateParkBasicsControlPanel( model, this );
    this.addChild( this.controlPanel );
    this.controlPanel.right = this.layoutBounds.width;

    this.addChild( new BarGraphNode( model, this ) );
    var playPauseControl = new PlayPauseControlPanel( model, this );
    this.addChild( playPauseControl.mutate( {centerX: this.layoutBounds.centerX + playPauseControl.playButton.width / 2, bottom: this.layoutBounds.maxY} ) );

    this.addChild( new ResetAllButton( model.reset.bind( model ) ).mutate( {top: this.controlPanel.bottom, centerX: this.controlPanel.centerX} ) );
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
    }
  } );
} );