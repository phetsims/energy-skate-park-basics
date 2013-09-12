// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Scene = require( 'SCENERY/Scene' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var images = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics-images' );
  var Vector2 = require( 'DOT/Vector2' );

  function TrackNode( model, modelViewTransform ) {

    var track = model.track;
    Node.call( this, { renderer: 'svg' } );

    var t = [];
    var x = [];
    var y = [];

    for ( var i = 0; i < track.length; i++ ) {
      t.push( i / track.length );
      x.push( track.get( i ).x );
      y.push( track.get( i ).y );
    }

//    for ( var i = 0; i < track.length - 1; i++ ) {
//      console.log( modelViewTransform.modelToViewPosition( track.get( i ) ), '-->', modelViewTransform.modelToViewPosition( track.get( i + 1 ) ) );
//      var line = new Line( modelViewTransform.modelToViewPosition( track.get( i ) ), modelViewTransform.modelToViewPosition( track.get( i + 1 ) ), {lineWidth: 10, stroke: 'gray'} );
//      this.addChild( line );
//    }

    var lastPt = (track.length - 1) / track.length;
    console.log( t );
    console.log( x );
    console.log( y );
    console.log( 'console' );
    var xPoints = numeric.spline( t, x ).at( numeric.linspace( 0, lastPt, 100 ) );
    var yPoints = numeric.spline( t, y ).at( numeric.linspace( 0, lastPt, 100 ) );

    console.log( xPoints );
    console.log( yPoints );

    for ( i = 0; i < xPoints.length - 1; i++ ) {
      var line = new Line(
        modelViewTransform.modelToViewPosition( new Vector2( xPoints[i], yPoints[i] ) ),
        modelViewTransform.modelToViewPosition( new Vector2( xPoints[i + 1], yPoints[i + 1] ) ), {lineWidth: 10, stroke: 'black'} );
      this.addChild( line );
    }
  }

  return inherit( Node, TrackNode );
} );