// Copyright 2002-2013, University of Colorado Boulder

/**
 * The clear thermal button that can be used to remove thermal energy from the system.
 * Looks like a trash can with an orange arrow pointing into it.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'SCENERY/nodes/Image' );
  var trashCanImage = require( 'image!ENERGY_SKATE_PARK_BASICS/trash-can.png' );
  var trashCanGrayImage = require( 'image!ENERGY_SKATE_PARK_BASICS/trash-can-disabled.png' );

  function ClearThermalButton( callback, skater, options ) {
    options = _.extend( { cursor: 'pointer' }, options );

    var icon = new Image( trashCanImage, {scale: 0.22} );

    skater.toDerivedProperty( ['thermalEnergy'], function( thermalEnergy ) {return thermalEnergy > 0;} ).link( function( hasThermalEnergy ) {
      icon.image = hasThermalEnergy ? trashCanImage : trashCanGrayImage;
    } );

    RectangularPushButton.call( this, {
      content: icon,
      listener: callback,
      baseColor: new Color( 230, 230, 240 ),
      disabledBaseColor: new Color( 255, 255, 255 ),
      xMargin: 7,
      yMargin: 3,
      stroke: new Color( 0, 0, 0 ),
      lineWidth: 0.3
    } );
    this.mouseArea = this.touchArea = Shape.rectangle( icon.bounds.minX, icon.bounds.minY, icon.bounds.width, icon.bounds.height );
    this.mutate( options );
  }

  return inherit( RectangularPushButton, ClearThermalButton );
} );