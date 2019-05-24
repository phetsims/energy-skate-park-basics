// Copyright 2018-2019, University of Colorado Boulder

/**
 * ScreenView for the Friction screen in Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var EnergySkateParkScreenView = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/EnergySkateParkScreenView' );
  var FrictionSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/FrictionSlider' );
  var MassSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/MassSlider' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {FrictionModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function FrictionScreenView( model, tandem ) {

    var frictionControls = [
      new MassSlider( model.skater.massProperty, model.skater.massRange, tandem.createTandem( 'massSlider' ) ),
      new FrictionSlider( model.frictionProperty, tandem.createTandem( 'frictionSlider' ) )
    ]
    ;
    EnergySkateParkScreenView.call( this, model, frictionControls, tandem.createTandem( 'introScreenView' ), {
      includeMeasuringTapePanel: false,
      showReferenceHeight: false,
      showBarGraphZoomButtons: true
    } );
  }

  energySkateParkBasics.register( 'FrictionScreenView', FrictionScreenView );

  return inherit( EnergySkateParkScreenView, FrictionScreenView );
} );