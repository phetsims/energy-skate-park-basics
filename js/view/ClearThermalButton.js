// Copyright 2002-2013, University of Colorado Boulder

/**
 * The Undo button that can be used to remove thermal energy from the system.
 *
 * TODO: This button should be using the new sun buttons, but there is a long delay on iPad3 that should be solved.
 * See https://github.com/phetsims/energy-skate-park-basics/issues/137
 * Once that is resolved, check the history of this file for an implementation that uses the sun buttons (so you don't have to start from scratch).
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var RectanglePushButtonDeprecated = require( 'SUN/RectanglePushButtonDeprecated' );
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
      icon.opacity = hasThermalEnergy ? 1 : 0.3;
    } );

    RectanglePushButtonDeprecated.call( this, icon, {
      rectangleCornerRadius: 6,
      listener: callback, rectangleFillUp: new Color( 230, 230, 240 ),
      rectangleFillDisabled: 'white',
      rectangleXMargin: 7,
      rectangleYMargin: 3 } );
    this.mouseArea = this.touchArea = Shape.rectangle( icon.bounds.minX, icon.bounds.minY, icon.bounds.width, icon.bounds.height );
    this.mutate( options );
  }

  return inherit( RectanglePushButtonDeprecated, ClearThermalButton );
} );