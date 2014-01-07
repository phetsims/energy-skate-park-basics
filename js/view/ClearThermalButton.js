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
  var Image = require( 'SCENERY/nodes/Image' );
  var Shape = require( 'KITE/Shape' );
  var Color = require( 'SCENERY/util/Color' );
  var resetArrowImage = require( 'image!ENERGY_SKATE_PARK_BASICS/reset_arrow.svg' );

  function ClearThermalButton( callback, skater, options ) {

    options = _.extend( { cursor: 'pointer' }, options );
    var icon = new Image( resetArrowImage );
    skater.toDerivedProperty( ['thermalEnergy'],function( thermalEnergy ) {return thermalEnergy > 0;} ).link( function( hasThermalEnergy ) {
      icon.fill = hasThermalEnergy ? 'white' : 'lightGray';
    } );

    RectanglePushButton.call( this, icon, {listener: callback, rectangleFillUp: new Color( 255, 85, 0 )} );
    this.mouseArea = this.touchArea = Shape.rectangle( icon.bounds.minX, icon.bounds.minY, icon.bounds.width, icon.bounds.height );
    this.addChild( icon );
    this.mutate( options );
  }

  return inherit( RectanglePushButton, ClearThermalButton );
} );