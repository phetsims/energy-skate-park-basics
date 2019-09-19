// Copyright 2018-2019, University of Colorado Boulder

/**
 * ScreenView for the Playground screen of Energy Skate Park: Basics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const EnergySkateParkPlaygroundScreenView = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/EnergySkateParkPlaygroundScreenView' );
  const FrictionSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/FrictionSlider' );
  const MassSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/MassSlider' );
  const inherit = require( 'PHET_CORE/inherit' );

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
    EnergySkateParkPlaygroundScreenView.call( this, model, playgroundControls, tandem.createTandem( 'graphsScreenView' ), {
      showTrackButtons: false,
      showReferenceHeight: false,
      showBarGraphZoomButtons: false,
      showAttachDetachRadioButtons: true
    } );
  }

  energySkateParkBasics.register( 'PlaygroundScreenView', PlaygroundScreenView );

  return inherit( EnergySkateParkPlaygroundScreenView, PlaygroundScreenView );
} );