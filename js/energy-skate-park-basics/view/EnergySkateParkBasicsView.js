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
  var BackgroundNode = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/BackgroundNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Vector2 = require( 'DOT/Vector2' );

  function EnergySkateParkBasicsView( model, mvt ) {

    var thisView = this;
    ScreenView.call( thisView, { renderer: 'svg' } );

    //The background
    this.backgroundNode = new BackgroundNode( model, this );
    this.addChild( this.backgroundNode );

    //The skater
    this.addChild( new SkaterNode( model ) );
  }

  inherit( ScreenView, EnergySkateParkBasicsView, {
    layout: function( width, height ) {

      var layoutScale = this.getLayoutScale( width, height );
      //convert the view bounds (0,0,width,height) to model bounds.

      //Model bounds should have same aspect ratio as layoutBounds (like iPad ratio), should have sx === sy so it doesn't stretch out
      //nominal bounds: 768 x 504                                                                                                                                        xk

      //extend the model
      var modelWidth = 7.68;//meters
      var modelHeight = 5.04;//meters TODO: choose this to keep a uniform aspect ratio and make sure everything fits on the screen
//      var groundHeight = 2;
//      var modelBounds = new Bounds2( -modelWidth / 2, 0, modelWidth / 2, modelHeight );
//      var viewBounds = new Bounds2( 0, 0, 768, 504 );
//      var scale = layoutScale * 6;
//      console.log( scale );
      var mapping = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, -2 ), new Vector2( width / 2, height ), layoutScale * 40 );
//      var visibleBounds = mapping.viewToModelX( 0 );
      this.backgroundNode.setMatrix( mapping.getMatrix() );

      //Find the visible model coordinates so that background can be fitted exactly.
      //Note that y is inverted so model max y is view min y
      var modelMinX = mapping.viewToModelX( 0 );
      var modelMinY = mapping.viewToModelY( height );
      var modelMaxX = mapping.viewToModelX( width );
      var modelMaxY = mapping.viewToModelY( 0 );

      var visibleModelBounds = new Bounds2( modelMinX, modelMinY, modelMaxX, modelMaxY );
      this.backgroundNode.setVisibleModelBounds( visibleModelBounds );
    }
  } );

  return EnergySkateParkBasicsView;
} );