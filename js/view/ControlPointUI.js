// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the track, which can be translated by dragging the track, or manipulated by dragging its control points.
 * If the track's length is changed (by deleting a control point or linking two tracks together) a new TrackNode is created.
 * Keep track of whether the track is dragging, so performance can be optimized while dragging
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var RoundShinyButton = require( 'SCENERY_PHET/RoundShinyButton' );
  var Color = require( 'SCENERY/util/Color' );

  function ControlPointUI( model, track, i, controlPointNode ) {
    Node.call( this );
    var isEndPoint = i === 0 || i === track.controlPoints.length - 1;
    var alpha = new LinearFunction( 0, track.controlPoints.length - 1, track.minPoint, track.maxPoint )( i ); //a1, a2, b1, b2, clamp
    var angle = track.getViewAngleAt( alpha );
    var modelAngle = track.getModelAngleAt( alpha );

    if ( !isEndPoint ) {
      var scissorNode = new FontAwesomeNode( 'cut', {fill: 'black', scale: 0.6, rotation: Math.PI / 2 - angle} );
      var cutButton = new RoundShinyButton( function() { model.splitControlPoint( track, i, modelAngle ); }, scissorNode, {
        center: controlPointNode.center.plus( Vector2.createPolar( 40, angle + Math.PI / 2 ) ),
        radius: 20,
        touchAreaRadius: 20 * 1.3,

        //yellow color scheme
        upFill: new Color( '#fefd53' ),
        overFill: new Color( '#fffe08' ),
        downFill: new Color( '#e9e824' )
      } );
//                var cutButton = new RectanglePushButton( scissorNode, {center: controlPointNode.center.plus( Vector2.createPolar( 40, angle + Math.PI / 2 ) )} );
//                var disableDismissAction = { down: function() { enableClickToDismissListener = false; } };
//                cutButton.addInputListener( disableDismissAction );
      cutButton.addListener( function() { model.splitControlPoint( track, i, modelAngle ); } );
      this.addChild( cutButton );
    }

//Show the delete button.
    var deleteNode = new FontAwesomeNode( 'times_circle', {fill: 'red', scale: 0.6} );
    var deleteButton = new RoundShinyButton( function() { model.deleteControlPoint( track, i ); }, deleteNode, {
      center: controlPointNode.center.plus( Vector2.createPolar( 40, angle - Math.PI / 2 ) ),
      radius: 20,
      touchAreaRadius: 20 * 1.3,

      //yellow color scheme
      upFill: new Color( '#fefd53' ),
      overFill: new Color( '#fffe08' ),
      downFill: new Color( '#e9e824' )} );
//                deleteButton.addInputListener( disableDismissAction );
    this.addChild( deleteButton );
  }

  return inherit( Node, ControlPointUI );
} );