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
  var Image = require( 'SCENERY/nodes/Image' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Vector2 = require( 'DOT/Vector2' );
  var RoundShinyButton = require( 'SCENERY_PHET/RoundShinyButton' );
  var trashCanImage = require( 'image!ENERGY_SKATE_PARK_BASICS/trash-can-open.png' );
  var trashCanGrayImage = require( 'image!ENERGY_SKATE_PARK_BASICS/trash-can-open-gray.png' );

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

    var arrowhead = createArrowhead( Math.PI / 3, new Vector2( xTip, yTip ) );

    var offset = {x: -18, y: 2};
    var image = new Image( trashCanImage, {scale: 0.3} );
    var icon = new Node( {scale: 0.5, x: -0.125, children: [
      image,
      arrowTail.mutate( offset ),
      arrowhead.mutate( offset )
    ]} );

    skater.toDerivedProperty( ['thermalEnergy'],function( thermalEnergy ) {return thermalEnergy > 0;} ).link( function( hasThermalEnergy ) {
      image.image = hasThermalEnergy ? trashCanImage : trashCanGrayImage;
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