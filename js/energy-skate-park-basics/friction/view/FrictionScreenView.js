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
  var EnergySkateParkControlPanel = require( 'ENERGY_SKATE_PARK/energy-skate-park/view/EnergySkateParkControlPanel' );
  var FrictionSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/FrictionSlider' );
  var MassSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/MassSlider' );
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

    var frictionControls = [
      new MassSlider( model.skater.massProperty, model.skater.massRange, tandem.createTandem( 'massSlider' ) ),
      new FrictionSlider( model.frictionProperty, tandem.createTandem( 'frictionSlider' ) )
    ];
    this.controlPanel = new EnergySkateParkControlPanel( model, this, frictionControls, tandem.createTandem( 'controlPanel' ), {
      includeTrackSelection: true
    } );
    this.addToBottomLayer( this.controlPanel );
  }

  energySkateParkBasics.register( 'FrictionScreenView', FrictionScreenView );

  return inherit( EnergySkateParkScreenView, FrictionScreenView );
} );