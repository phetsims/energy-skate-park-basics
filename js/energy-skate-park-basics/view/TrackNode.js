// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Scene = require( 'SCENERY/Scene' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var images = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics-images' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );

  function TrackNode( model, modelViewTransform ) {
    var trackNode = this;
    var track = model.track;
    Node.call( this, { renderer: 'svg' } );
    var roadLayer = new Node();
    this.addChild( roadLayer );

    var updateTrack = function() {
      var children = [];
      var t = [];
      var x = [];
      var y = [];

      for ( var i = 0; i < track.length; i++ ) {
        t.push( i / track.length );
        x.push( track.get( i ).value.x );
        y.push( track.get( i ).value.y );
      }

      var lastPt = (track.length - 1) / track.length;
      var xPoints = numeric.spline( t, x ).at( numeric.linspace( 0, lastPt, 25 ) ); //TODO: number of samples could depend on the total length of the track
      var yPoints = numeric.spline( t, y ).at( numeric.linspace( 0, lastPt, 25 ) );

      var shape = new Shape().
        moveTo( modelViewTransform.modelToViewX( xPoints[0] ), modelViewTransform.modelToViewY( yPoints[0] ) );
      for ( i = 1; i < xPoints.length; i++ ) {
        shape.lineTo( modelViewTransform.modelToViewX( xPoints[i] ), modelViewTransform.modelToViewY( yPoints[i] ) );
      }
      roadLayer.children = [new Path( shape, {lineWidth: 10, stroke: 'black'} )];
    };

    for ( var i = 0; i < track.length; i++ ) {
      (function() {
        var property = track.get( i );
        var controlPoint = new Circle( 14, {opacity: 0.7, stroke: 'black', lineWidth: 2, fill: 'red', cursor: 'pointer', translation: modelViewTransform.modelToViewPosition( property.value )} );
        property.link( function( value ) {
          controlPoint.translation = modelViewTransform.modelToViewPosition( value );
        } );
        controlPoint.addInputListener( new SimpleDragHandler(
          {
            start: function( event ) {
            },
            drag: function( event ) {
              var t = controlPoint.globalToParentPoint( event.pointer.point );
              var modelX = modelViewTransform.viewToModelX( t.x );
              var modelY = modelViewTransform.viewToModelY( t.y );
              property.value = new Vector2( modelX, modelY );
            },
            translate: function() {

            },
            end: function( event ) {
            }
          } ) );
        trackNode.addChild( controlPoint );
      })();
    }

    for ( i = 0; i < track.length; i++ ) {
      track.get( i ).link( function() {
        updateTrack();
      } );
    }
  }

  return inherit( Node, TrackNode );
} );