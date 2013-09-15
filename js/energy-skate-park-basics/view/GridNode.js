// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node that shows the grid lines and labels, when enabled in the control panel.
 * Every other horizontal line is labeled and highlighted to make it easy to count.
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var BackgroundNode = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/BackgroundNode' );

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
      var lineHeight = height / layoutScale - BackgroundNode.grassHeight;
      for ( var x = 0; x < 100; x++ ) {
        var viewXPositive = this.modelViewTransform.modelToViewX( x / 2 );
        var viewXNegative = this.modelViewTransform.modelToViewX( -x / 2 );
        var yOrigin = this.modelViewTransform.modelToViewY( 0 );
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