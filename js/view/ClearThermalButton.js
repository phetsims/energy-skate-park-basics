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
  var trashCanImage = require( 'image!ENERGY_SKATE_PARK_BASICS/trash-can.png' );
  var trashCanGrayImage = require( 'image!ENERGY_SKATE_PARK_BASICS/trash-can.png' );

  function ClearThermalButton( callback, skater, options ) {
    options = _.extend( { cursor: 'pointer' }, options );

    var icon = new Image( trashCanImage, {scale: 0.22} );

    skater.toDerivedProperty( ['thermalEnergy'],function( thermalEnergy ) {return thermalEnergy > 0;} ).link( function( hasThermalEnergy ) {
      icon.image = hasThermalEnergy ? trashCanImage : trashCanGrayImage;
    } );

    RectanglePushButton.call( this, icon, {
      listener: callback, rectangleFillUp: new Color( 230, 230, 240 ),
      rectangleFillDisabled: 'white',
      rectangleXMargin: 7,
      rectangleYMargin: 3 } );
    this.mouseArea = this.touchArea = Shape.rectangle( icon.bounds.minX, icon.bounds.minY, icon.bounds.width, icon.bounds.height );
    this.mutate( options );
  }

  return inherit( RoundShinyButton, ClearThermalButton );
} );