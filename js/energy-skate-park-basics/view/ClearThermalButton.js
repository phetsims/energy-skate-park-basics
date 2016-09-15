// Copyright 2013-2015, University of Colorado Boulder

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

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RectangularButtonView = require( 'SUN/buttons/RectangularButtonView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Color = require( 'SCENERY/util/Color' );
  var TandemImage = require( 'TANDEM/scenery/nodes/TandemImage' );

  // images
  var trashCanImage = require( 'image!ENERGY_SKATE_PARK_BASICS/trash-can.png' );
  var trashCanGrayImage = require( 'image!ENERGY_SKATE_PARK_BASICS/trash-can-disabled.png' );

  /**
   * @param {Function} callback function to be called when the user presses the clear thermal button.
   * @param {Skater} skater the model's skater model
   * @param {Tandem} tandem
   * @param {*} options
   * @constructor
   */
  function ClearThermalButton( callback, skater, tandem, options ) {
    var self = this;
    options = _.extend( {
      cursor: 'pointer'
    }, options );

    var iconImage = new TandemImage( trashCanImage, { scale: 0.22, tandem: tandem.createTandem( 'iconImage' ) } );

    RectangularPushButton.call( this, {
      content: iconImage,
      baseColor: new Color( 230, 230, 240 ),
      disabledBaseColor: 'white',
      cornerRadius: 6,
      listener: callback,
      buttonAppearanceStrategy: RectangularButtonView.flatAppearanceStrategy,
      xMargin: 7,
      yMargin: 3,
      tandem: tandem
    } );
    skater.allowClearingThermalEnergyProperty.link(
      function( allowClearingThermalEnergy ) {
        iconImage.image = allowClearingThermalEnergy ? trashCanImage : trashCanGrayImage;
        iconImage.opacity = allowClearingThermalEnergy ? 1 : 0.3;
        self.pickable = allowClearingThermalEnergy;
      } );
    this.mouseArea = this.touchArea = Shape.rectangle( iconImage.bounds.minX, iconImage.bounds.minY, iconImage.bounds.width, iconImage.bounds.height );
    this.mutate( options );
  }

  energySkateParkBasics.register( 'ClearThermalButton', ClearThermalButton );

  return inherit( RectangularPushButton, ClearThermalButton );
} );