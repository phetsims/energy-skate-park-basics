// Copyright 2018, University of Colorado Boulder

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
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {FrictionModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function FrictionScreenView( model, tandem ) {
    EnergySkateParkScreenView.call( this, model, tandem.createTandem( 'introScreenView' ), {
      includeMeasuringTapePanel: false,
      includeReferenceHeightCheckbox: false,

      includeGravitySlider: false,
      includeMassSlider: true,

      barGraphOptions: {
        includeZoomButtons: true
      }
    } );
  }

  energySkateParkBasics.register( 'FrictionScreenView', FrictionScreenView );

  return inherit( EnergySkateParkScreenView, FrictionScreenView );
} );