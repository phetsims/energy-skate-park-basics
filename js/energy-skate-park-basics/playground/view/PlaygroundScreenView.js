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
  var EnergySkateParkControlPanel = require( 'ENERGY_SKATE_PARK/energy-skate-park/view/EnergySkateParkControlPanel' );
  var FrictionSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/FrictionSlider' );
  var MassSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/MassSlider' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {PlaygroundModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function PlaygroundScreenView( model, tandem ) {
    EnergySkateParkScreenView.call( this, model, tandem.createTandem( 'graphsScreenView' ), {
      barGraphOptions: {
        includeZoomButtons: false
      }
    } );

    var playgroundControls = [
      new MassSlider( model.skater.massProperty, model.skater.massRange, tandem.createTandem( 'massSlider' ) ),
      new FrictionSlider( model.frictionProperty, tandem.createTandem( 'frictionSlider' ) )
    ];
    this.controlPanel = new EnergySkateParkControlPanel( model, this, playgroundControls, tandem.createTandem( 'controlPanel' ), {
      includeTrackSelection: false
    } );
    this.addToBottomLayer( this.controlPanel );
  }

  energySkateParkBasics.register( 'PlaygroundScreenView', PlaygroundScreenView );

  return inherit( EnergySkateParkScreenView, PlaygroundScreenView, {} );
} );