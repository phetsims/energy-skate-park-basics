// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node that shows the grid lines and labels, when enabled in the control panel.
 * Every other horizontal line is labeled and highlighted to make it easy to count.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var BackgroundNode = require( 'ENERGY_SKATE_PARK_BASICS/view/BackgroundNode' );
  var zeroMetersString = require( 'string!ENERGY_SKATE_PARK_BASICS/zeroMeters' );

  function GridNode( gridVisibleProperty, modelViewTransform ) {
    this.modelViewTransform = modelViewTransform;
    Node.call( this, {pickable: false} );

    gridVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Node, GridNode, {

    //Exactly fit the geometry to the screen so no matter what aspect ratio it will always show something.  Perhaps it will improve performance too?
    //Could performance optimize by using visible instead of add/remove child if necessary (would only change performance on screen size change)
    //For more performance improvements on screen size change, only update when the graph is visible, then again when it becomes visible
    layout: function( offsetX, offsetY, width, height, layoutScale ) {

      var lines = [];
      var texts = [];
      var lineHeight = height / layoutScale - BackgroundNode.earthHeight;
      for ( var x = 0; x < 100; x++ ) {
        var viewXPositive = this.modelViewTransform.modelToViewX( x );
        var viewXNegative = this.modelViewTransform.modelToViewX( -x );
        lines.push( new Line( viewXPositive, -offsetY, viewXPositive, lineHeight - offsetY, {stroke: 'gray'} ) );
        if ( x !== 0 ) {
          lines.push( new Line( viewXNegative, -offsetY, viewXNegative, lineHeight - offsetY, {stroke: 'gray'} ) );
        }
        if ( viewXNegative < -offsetX ) {
          break;
        }
      }

      var separation = width / layoutScale;
      for ( var y = 0; y < 100; y++ ) {
        var originX = this.modelViewTransform.modelToViewX( -4 );
        var viewY = this.modelViewTransform.modelToViewY( y );
        if ( viewY < -offsetY ) {
          break;
        }

        lines.push( new Line( -offsetX, viewY, separation - offsetX, viewY, {stroke: '#686868', lineWidth: y % 2 === 0 ? 1.8 : 0.8 } ) );
        if ( y % 2 === 0 ) {
          var text = new Text( '' + y, {font: new PhetFont( 18 ), top: viewY, right: originX - 2} );

          //For the "0 meters" readout, we still need the 0 to line up perfectly (while still using a single internationalizable string), so use the 0 text bounds
          //And shift it down a bit so it isn't touching the concrete, see #134
          if ( y === 0 ) {
            var replacementText = new Text( zeroMetersString, {font: new PhetFont( 18 ), top: viewY + 2, x: text.x} );
            texts.push( replacementText );
          }
          else {
            texts.push( text );
          }
        }
      }
      this.children = lines.concat( texts );
    }
  } );
} );