//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Scenery node that shows the legend for the pie chart, and a reset button for thermal energy.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Plane = require( 'SCENERY/nodes/Plane' );
  var Vector2 = require( 'DOT/Vector2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectanglePushButton = require( 'SUN/RectanglePushButton' );
  var scissorsImage = require( 'image!ENERGY_SKATE_PARK_BASICS/scissors.png' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );

  function TrackEditingNode( parentNode, model, transform ) {

    //See ComboxBox.js
    var enableClickToDismissListener = true;
    var sceneListenerAdded = false;

    // listener for 'click outside to dismiss'
    var clickToDismissListener = {
      down: function() {
        console.log( 'clickToDismissListener.down, enableClickToDismiss = ', enableClickToDismissListener );
        if ( enableClickToDismissListener ) {
          sceneNode.removeInputListener( clickToDismissListener );
          sceneListenerAdded = false;
          model.editing = false;
        }
        else {
          enableClickToDismissListener = true;
        }
      }
    };

    var sceneNode = parentNode.getUniqueTrail().rootNode();
    sceneNode.addInputListener( clickToDismissListener );
    sceneListenerAdded = true;

    var children = [ ];

    var tracks = model.getPhysicalTracks();
    for ( var i = 0; i < tracks.length; i++ ) {
      var track = tracks[i];
      for ( var k = 1; k < track.controlPoints.length - 1; k++ ) {
        (function( track, k ) {
          var alpha = new LinearFunction( 0, track.controlPoints.length - 1, track.minPoint, track.maxPoint )( k ); //a1, a2, b1, b2, clamp
          var position = track.getPoint( alpha );
          var angle = track.getViewAngleAt( alpha );
          var modelAngle = track.getModelAngleAt( alpha );
          var image = new Image( scissorsImage );
          image.rotate( Math.PI / 2 + angle );

          var cutButton = new RectanglePushButton( image, {center: transform.modelToViewPosition( position ).plus( Vector2.createPolar( 40, angle - Math.PI / 2 ) )} );
          var disableDismissAction = { down: function() { enableClickToDismissListener = false; } };
          cutButton.addInputListener( disableDismissAction );
          cutButton.addListener( function() { model.splitControlPoint( track, k, modelAngle ); } );
          children.push( cutButton );

          var deleteButton = new RectanglePushButton( new FontAwesomeNode( 'times_circle', {fill: 'red', scale: 0.6} ), {center: transform.modelToViewPosition( position ).plus( Vector2.createPolar( 40, angle + Math.PI / 2 ) )} );
          deleteButton.addInputListener( disableDismissAction );
          deleteButton.addListener( function() { model.deleteControlPoint( track, k ); } );
          children.push( deleteButton );
        })( track, k );
      }
    }
    Node.call( this, {children: children} );

    this.cleanup = function() {
      sceneNode.removeInputListener( clickToDismissListener );
      sceneListenerAdded = false;
    };
  }

  return inherit( Node, TrackEditingNode );
} );