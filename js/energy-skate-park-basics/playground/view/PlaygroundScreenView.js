// Copyright 2018, University of Colorado Boulder

/**
 * ScreenView for the Playground screen of Energy Skate Park: Basics.
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
   * @param {PlaygroundModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function PlaygroundScreenView( model, tandem ) {
    EnergySkateParkScreenView.call( this, model, tandem.createTandem( 'graphsScreenView' ), {
      includeReferenceHeightCheckbox: false,

      includeMassSlider: true,
      includeGravitySlider: false
    } );
  }

  energySkateParkBasics.register( 'PlaygroundScreenView', PlaygroundScreenView );

  return inherit( EnergySkateParkScreenView, PlaygroundScreenView, {} );
} );