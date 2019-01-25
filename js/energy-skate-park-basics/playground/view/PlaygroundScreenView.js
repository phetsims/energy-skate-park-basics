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
  var FrictionSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/FrictionSlider' );
  var MassSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/MassSlider' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {PlaygroundModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function PlaygroundScreenView( model, tandem ) {
    var playgroundControls = [
      new MassSlider( model.skater.massProperty, model.skater.massRange, tandem.createTandem( 'massSlider' ) ),
      new FrictionSlider( model.frictionProperty, tandem.createTandem( 'frictionSlider' ) )
    ];
    EnergySkateParkScreenView.call( this, model, playgroundControls, tandem.createTandem( 'graphsScreenView' ), {
      controlPanelOptions: {
        visibilityControlsOptions: {
          includeReferenceHeightCheckbox: false
        }
      },
      barGraphOptions: {
        includeZoomButtons: false
      }
    } );
  }

  energySkateParkBasics.register( 'PlaygroundScreenView', PlaygroundScreenView );

  return inherit( EnergySkateParkScreenView, PlaygroundScreenView, {} );
} );