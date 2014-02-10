// Copyright 2002-2013, University of Colorado Boulder

/**
 * Node that shows the delete and cut buttons for track control points.  Created each time a control point is dragged.
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

  function ControlPointUI( model, track, controlPointIndex, transform, parentNode ) {

    var controlPointUI = this;

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
          controlPointUI.detach();
        }
        else {
          enableClickToDismissListener = true;
        }
      }
    };

    var sceneNode = parentNode.getUniqueTrail().rootNode();
    sceneNode.addInputListener( clickToDismissListener );
    sceneListenerAdded = true;

    Node.call( this );

    var isEndPoint = controlPointIndex === 0 || controlPointIndex === track.controlPoints.length - 1;
    var alpha = new LinearFunction( 0, track.controlPoints.length - 1, track.minPoint, track.maxPoint )( controlPointIndex ); //a1, a2, b1, b2, clamp
    var position = track.getPoint( alpha );
    var angle = track.getViewAngleAt( alpha );
    var modelAngle = track.getModelAngleAt( alpha );

    var disableDismissAction = { down: function() { enableClickToDismissListener = false; } };
    if ( !isEndPoint ) {
      var scissorNode = new FontAwesomeNode( 'cut', {fill: 'black', scale: 0.6, rotation: Math.PI / 2 - angle} );
      var cutButton = new RoundShinyButton( function() { model.splitControlPoint( track, controlPointIndex, modelAngle ); }, scissorNode, {
        center: transform.modelToViewPosition( position ).plus( Vector2.createPolar( 40, angle + Math.PI / 2 ) ),
        radius: 20,
        touchAreaRadius: 20 * 1.3,

        //yellow color scheme
        upFill: new Color( '#fefd53' ),
        overFill: new Color( '#fffe08' ),
        downFill: new Color( '#e9e824' )
      } );
      cutButton.addInputListener( disableDismissAction );
      this.addChild( cutButton );
    }

//Show the delete button.
    var deleteNode = new FontAwesomeNode( 'times_circle', {fill: 'red', scale: 0.6} );
    var deleteButton = new RoundShinyButton( function() { model.deleteControlPoint( track, controlPointIndex ); }, deleteNode, {
      center: transform.modelToViewPosition( position ).plus( Vector2.createPolar( 40, angle - Math.PI / 2 ) ),
      radius: 20,
      touchAreaRadius: 20 * 1.3,

      //yellow color scheme
      upFill: new Color( '#fefd53' ),
      overFill: new Color( '#fffe08' ),
      downFill: new Color( '#e9e824' )} );
    deleteButton.addInputListener( disableDismissAction );
    this.addChild( deleteButton );
  }

  return inherit( Node, ControlPointUI );
} );