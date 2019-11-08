// Copyright 2018-2019, University of Colorado Boulder

/**
 * The "Intro" screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const Image = require( 'SCENERY/nodes/Image' );
  const IntroModel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/intro/model/IntroModel' );
  const IntroScreenView = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/intro/view/IntroScreenView' );
  const merge = require( 'PHET_CORE/merge' );
  const Screen = require( 'JOIST/Screen' );

  // images
  const iconIntroHomescreen = require( 'image!ENERGY_SKATE_PARK/icon-intro-homescreen.png' );
  const iconIntroNavbar = require( 'image!ENERGY_SKATE_PARK/icon-intro-navbar.png' );

  // strings
  const screenIntroductionString = require( 'string!ENERGY_SKATE_PARK_BASICS/screen.introduction' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  class IntroScreen extends Screen {
    constructor( tandem, options ) {
      options = merge( {
        name: screenIntroductionString,
        tandem: tandem,
        homeScreenIcon: new Image( iconIntroHomescreen ),
        navigationBarIcon: new Image( iconIntroNavbar )
      }, options );

      super(
        () => new IntroModel( tandem.createTandem( 'model' ) ),
        model => new IntroScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return energySkateParkBasics.register( 'IntroScreen', IntroScreen );
} );