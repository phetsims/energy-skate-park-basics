// Copyright 2018-2019, University of Colorado Boulder

/**
 * The "Playground" screen of Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const PlaygroundModel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/playground/model/PlaygroundModel' );
  const PlaygroundScreenView = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/playground/view/PlaygroundScreenView' );
  const Screen = require( 'JOIST/Screen' );

  // images
  const iconPlaygroundHomescreen = require( 'image!ENERGY_SKATE_PARK/icon-playground-homescreen.png' );
  const iconPlaygroundNavbar = require( 'image!ENERGY_SKATE_PARK/icon-playground-navbar.png' );

  // strings
  const screenTrackPlaygroundString = require( 'string!ENERGY_SKATE_PARK_BASICS/screen.trackPlayground' );

  class PlaygroundScreen extends Screen {
    constructor( tandem, options ) {
      options = merge( {
        name: screenTrackPlaygroundString,
        homeScreenIcon: new Image( iconPlaygroundHomescreen ),
        navigationBarIcon: new Image( iconPlaygroundNavbar ),

        tandem: tandem
      }, options );

      super(
        () => new PlaygroundModel( tandem.createTandem( 'model' ) ),
        model => new PlaygroundScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return energySkateParkBasics.register( 'PlaygroundScreen', PlaygroundScreen );
} );