// Copyright 2002-2013, University of Colorado Boulder

/**
 * The Undo button that can be used to remove thermal energy from the system.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var RectanglePushButton = require( 'SUN/RectanglePushButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Color = require( 'SCENERY/util/Color' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Vector2 = require( 'DOT/Vector2' );
  var RoundShinyButton = require( 'SCENERY_PHET/RoundShinyButton' );

  function ClearThermalButton( callback, skater, options ) {
    options = _.extend( { cursor: 'pointer' }, options );

    var xTip = 24;
    var yTip = 3;
    var xControl = 12;
    var yControl = -9;

    var createArrowhead = function( angle, tail ) {
      var headWidth = 10;
      var headHeight = 10;
      var directionUnitVector = Vector2.createPolar( 1, angle );
      var orthogonalUnitVector = directionUnitVector.perpendicular();
      var tip = directionUnitVector.times( headHeight ).plus( tail );
      return new Path( new Shape().moveToPoint( tail ).
        lineToPoint( tail.plus( orthogonalUnitVector.times( headWidth / 2 ) ) ).
        lineToPoint( tip ).
        lineToPoint( tail.plus( orthogonalUnitVector.times( -headWidth / 2 ) ) ).
        lineToPoint( tail ).close(),
        {fill: 'black'} );
    };

    var arrowTail = new Path( new Shape().moveTo( 0, 0 ).quadraticCurveTo( xControl, yControl, xTip, yTip ), { stroke: 'black', lineWidth: 3 } );

    var arrowhead = createArrowhead( Math.PI / 3, new Vector2( xTip, yTip ) ).mutate( {x: -18, y: -16} );

    var lidVector = Vector2.createPolar( 20, -Math.PI / 4 );
    var lidStart = new Vector2( 22, 0 );
    var lidEnd = lidStart.plus( lidVector );
    var handleWidth = 8;
    var handleStart = lidStart.plus( lidVector.times( 0.5 ).minus( lidVector.normalized().times( -handleWidth / 2 ) ) );
    var handleEnd = lidStart.plus( lidVector.times( 0.5 ).minus( lidVector.normalized().times( handleWidth / 2 ) ) );

    var icon = new Node( {scale: 0.5, x: -0.125, children: [
      new Path( new Shape().moveTo( 0, 0 ).lineTo( 20, 0 ).lineTo( 20, 24 ).lineTo( 0, 24 ).close(), {stroke: 'black', lineWidth: 1} ),
      new Line( 4, 3, 4, 21, {lineWidth: 1, stroke: 'black'} ),
      new Line( 10, 3, 10, 21, {lineWidth: 1, stroke: 'black'} ),
      new Line( 16, 3, 16, 21, {lineWidth: 1, stroke: 'black'} ),
      //Lid
      new Line( lidStart.x, lidStart.y, lidEnd.x, lidEnd.y, {lineWidth: 2, stroke: 'black'} ),

      //Handle
      new Line( handleStart.x + 1, handleStart.y + 1, handleEnd.x + 1, handleEnd.y + 1, {lineWidth: 2, stroke: 'black'} ),
      arrowTail.mutate( {x: -18, y: -16} ),
      arrowhead
    ]} );

    //experiment with pixel perfect coordinates
//    var isRounded = function( x ) { return x === Math.floor( x ); };
//    setInterval( function() {
//      var sx = icon.getLocalToGlobalMatrix().entries[0];
//      var x = icon.getLocalToGlobalMatrix().entries[6];
//      if ( sx !== 1 || !isRounded( x ) ) {
//        icon.setScaleMagnitude( 1 );
//        icon.x = 0;
//        var scaling = icon.getLocalToGlobalMatrix().entries[0];
//        icon.setScaleMagnitude( 1.0 / scaling );
//
//        var currentX = icon.getLocalToGlobalMatrix().entries[6];
//        var newScaling = icon.getLocalToGlobalMatrix().entries[0];
//        var desiredX = Math.floor( currentX );
//        var distance = (desiredX - currentX) * newScaling;
//        console.log( x, desiredX, distance );
//        icon.x = icon.x + distance;
//
//        console.log( 'after update:', icon.getLocalToGlobalMatrix().entries[0], icon.getLocalToGlobalMatrix().entries[6] );
////        var currentX = icon.getLocalToGlobalMatrix().entries[6];
////        var newScaling = icon.getLocalToGlobalMatrix().entries[0];
//      }
//
////      var y = icon.getLocalToGlobalMatrix().entries[7];
////      var s2 = icon.getLocalToGlobalMatrix().entries[0];
//////      console.log( icon.getLocalToGlobalMatrix() );
////      console.log( sx, x, y, s2 );
////
//////      if ( x === 361.46145448047844 ) {
//////        clearThermalButton.translate( -0.46145448047844, -0.75 );
//////      }
////      260.90450849718746 82.75
//    }, 3000 );

    skater.toDerivedProperty( ['thermalEnergy'],function( thermalEnergy ) {return thermalEnergy > 0;} ).link( function( hasThermalEnergy ) {
      for ( var i = 0; i < icon.children.length; i++ ) {
        var child = icon.children[i];
        child.stroke = hasThermalEnergy ? 'black' : 'gray';
      }
      icon.children[0].fill = hasThermalEnergy ? 'lightgray' : null;
      arrowhead.fill = hasThermalEnergy ? new Color( 255, 85, 0 ) : 'gray';
      arrowTail.stroke = hasThermalEnergy ? new Color( 255, 85, 0 ) : 'gray';
      arrowhead.stroke = null;
    } );

    RectanglePushButton.call( this, icon, {
      listener: callback, rectangleFillUp: new Color( 230, 230, 240 ),
      rectangleFillDisabled: 'white',
      rectangleXMargin: 3,
      rectangleYMargin: 3 } );
    this.mouseArea = this.touchArea = Shape.rectangle( icon.bounds.minX, icon.bounds.minY, icon.bounds.width, icon.bounds.height );
    this.mutate( options );
  }

  return inherit( RoundShinyButton, ClearThermalButton );
} );