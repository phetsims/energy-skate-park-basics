// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Shape = require( 'KITE/Shape' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Scene = require( 'SCENERY/Scene' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var images = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics-images' );
  var Panel = require( 'SUN/Panel' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/EnergySkateParkColorScheme' );

  function GridNode( model, energySkateParkBasicsView, modelViewTransform ) {
    var gridNode = this;
    this.modelViewTransform = modelViewTransform;
    Node.call( this, {pickable: false} );

    //TODO: update when the graph becomes visible
    model.gridVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Node, GridNode, {

    //Exactly fit the geometry to the screen so no matter what aspect ratio it will always show something.  Perhaps it will improve performance too?
    //TODO: Could performance optimize by using visible instead of add/remove child if necessary (would only change performance on screen size change)
    layout: function( offsetX, offsetY, width, height, layoutScale ) {

      var lines = [];
      var texts = [];
      var lineHeight = height / layoutScale - 100;//TODO: factor out magic number '100'
      for ( var x = 0; x < 100; x++ ) {
        var viewXPositive = this.modelViewTransform.modelToViewX( x / 2 );
        var viewXNegative = this.modelViewTransform.modelToViewX( -x / 2 );
        lines.push( new Line( viewXPositive, -offsetY, viewXPositive, lineHeight - offsetY, {stroke: '#686868'} ) );
        if ( x !== 0 ) {
          lines.push( new Line( viewXNegative, -offsetY, viewXNegative, lineHeight - offsetY, {stroke: '#686868'} ) );
        }
        if ( viewXNegative < -offsetX ) {
          break;
        }
      }

      var lineWidth = width / layoutScale;
      for ( var y = 0; y < 100; y++ ) {
        var originX = this.modelViewTransform.modelToViewX( -2.5 );
        var viewY = this.modelViewTransform.modelToViewY( y / 2 );
        if ( viewY < -offsetY ) {
          break;
        }

        lines.push( new Line( -offsetX, viewY, lineWidth - offsetX, viewY, {stroke: '#686868', lineWidth: y % 2 === 0 ? 3 : 1 } ) );
        if ( y % 2 === 0 ) {
          var text = new Text( y === 0 ? '0' : y, {font: new PhetFont( 18 ), top: viewY, right: originX - 2} );

          //For the "0 meters" readout, we still need the 0 to line up perfectly (while still using a single internationalizable string), so use the 0 text bounds
          if ( y === 0 ) {
            var replacementText = new Text( '0 meters', {font: new PhetFont( 18 ), top: viewY, x: text.x} );
            texts.push( replacementText );
          }
          else {
            texts.push( text );
          }
        }
      }
      this.children = lines.concat( texts );
//      console.log( lines.length, 'lines' );
    }
  } );
} );