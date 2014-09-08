// Copyright 2002-2013, University of Colorado Boulder

/**
 * The Clear Thermal button that can be used to remove thermal energy from the system.
 * Looks like a trash can with an orange arrow going into it.
 * It appears in the bar chart and the pie chart legend,
 * and is disabled if there is no thermal energy in the system.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RectangularButtonView = require( 'SUN/buttons/RectangularButtonView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'SCENERY/nodes/Image' );
  var trashCanImage = require( 'image!ENERGY_SKATE_PARK_BASICS/trash-can.png' );
  var trashCanGrayImage = require( 'image!ENERGY_SKATE_PARK_BASICS/trash-can-disabled.png' );

  /**
   * @param {Function} callback function to be called when the user presses the clear thermal button.
   * @param {Skater} skater the model's skater model
   * @param {*}options
   * @constructor
   */
  function ClearThermalButton( callback, skater, options ) {
    var clearThermalButton = this;
    options = _.extend( { cursor: 'pointer' }, options );

    var icon = new Image( trashCanImage, {scale: 0.22} );

    skater.toDerivedProperty( ['thermalEnergy'], function( thermalEnergy ) {return thermalEnergy > 0;} ).link( function( hasThermalEnergy ) {
      icon.image = hasThermalEnergy ? trashCanImage : trashCanGrayImage;
      icon.opacity = hasThermalEnergy ? 1 : 0.3;
      clearThermalButton.pickable = hasThermalEnergy;
    } );

    RectangularPushButton.call( this, {
      content: icon,
      baseColor: new Color( 230, 230, 240 ),
      disabledBaseColor: 'white',
      cornerRadius: 6,
      listener: callback,
      buttonAppearanceStrategy: RectangularButtonView.flatAppearanceStrategy,
      xMargin: 7,
      yMargin: 3
    } );
    this.mouseArea = this.touchArea = Shape.rectangle( icon.bounds.minX, icon.bounds.minY, icon.bounds.width, icon.bounds.height );
    this.mutate( options );
  }

  return inherit( RectangularPushButton, ClearThermalButton );
} );