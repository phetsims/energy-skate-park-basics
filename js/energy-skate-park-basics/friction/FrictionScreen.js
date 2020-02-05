// Copyright 2018-2019, University of Colorado Boulder

/**
 * The "Friction" screen of Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const FrictionModel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/friction/model/FrictionModel' );
  const FrictionScreenView = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/friction/view/FrictionScreenView' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const Screen = require( 'JOIST/Screen' );

  // images
  const iconFrictionHomescreen = require( 'image!ENERGY_SKATE_PARK/icon-friction-homescreen.png' );
  const iconFrictionNavbar = require( 'image!ENERGY_SKATE_PARK/icon-friction-navbar.png' );

  // strings
  const screenFrictionString = require( 'string!ENERGY_SKATE_PARK_BASICS/screen.friction' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  class FrictionScreen extends Screen {

    /**
     * @param {Tandem} tandem
     * @param {Object} [options]
     */
    constructor( tandem, options ) {
      options = merge( {
        name: screenFrictionString,
        homeScreenIcon: new Image( iconFrictionHomescreen ),
        navigationBarIcon: new Image( iconFrictionNavbar ),

        tandem: tandem
      }, options );

      super(
        () => new FrictionModel( tandem.createTandem( 'model' ) ),
        model => new FrictionScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return energySkateParkBasics.register( 'FrictionScreen', FrictionScreen );
} );