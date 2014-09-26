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
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var BackgroundNode = require( 'ENERGY_SKATE_PARK_BASICS/view/BackgroundNode' );
  var zeroMetersString = require( 'string!ENERGY_SKATE_PARK_BASICS/zeroMeters' );

  /**
   * @param {Property<Boolean>} gridVisibleProperty the axon property indicating whether the grid should be visible
   * @param {ModelViewTransform2} modelViewTransform the main model-view transform
   * @constructor
   */
  function GridNode( gridVisibleProperty, modelViewTransform ) {
    this.modelViewTransform = modelViewTransform;
    Node.call( this, {pickable: false} );

    gridVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Node, GridNode, {

    //Exactly fit the geometry to the screen so no matter what aspect ratio it will always show something.  Perhaps it
    //will improve performance too? Could performance optimize by using visible instead of add/remove child if necessary
    //(would only change performance on screen size change). For more performance improvements on screen size change,
    //only update when the graph is visible, then again when it becomes visible.
    layout: function( offsetX, offsetY, width, height, layoutScale ) {

      var thickLines = [];
      var thinLines = [];
      var texts = [];
      var lineHeight = height / layoutScale - BackgroundNode.earthHeight;
      for ( var x = 0; x < 100; x++ ) {
        var viewXPositive = this.modelViewTransform.modelToViewX( x );
        var viewXNegative = this.modelViewTransform.modelToViewX( -x );
        thinLines.push( {x1: viewXPositive, y1: -offsetY, x2: viewXPositive, y2: lineHeight - offsetY} );
        if ( x !== 0 ) {
          thinLines.push( { x1: viewXNegative, y1: -offsetY, x2: viewXNegative, y2: lineHeight - offsetY} );
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

        if ( y % 2 === 0 ) {
          thickLines.push( {x1: -offsetX, y1: viewY, x2: separation - offsetX, y2: viewY} );
        }
        else {
          thinLines.push( {x1: -offsetX, y1: viewY, x2: separation - offsetX, y2: viewY} );
        }

        if ( y % 2 === 0 ) {
          var text = new Text( '' + y, {font: new PhetFont( 18 ), top: viewY, right: originX - 2} );

          //For the "0 meters" readout, we still need the 0 to line up perfectly (while still using a single
          //internationalizable string), so use the 0 text bounds
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

      var thinLineShape = new Shape();
      var thickLineShape = new Shape();
      for ( var i = 0; i < thinLines.length; i++ ) {
        var thinLine = thinLines[i];
        thinLineShape.moveTo( thinLine.x1, thinLine.y1 );
        thinLineShape.lineTo( thinLine.x2, thinLine.y2 );
      }
      for ( var k = 0; k < thickLines.length; k++ ) {
        var thickLine = thickLines[k];
        thickLineShape.moveTo( thickLine.x1, thickLine.y1 );
        thickLineShape.lineTo( thickLine.x2, thickLine.y2 );
      }
      this.children = [
        new Path( thinLineShape, {stroke: '#686868', lineWidth: 0.8} ),
        new Path( thickLineShape, {stroke: '#686868', lineWidth: 1.8} )
      ].concat( texts );
    }
  } );
} );