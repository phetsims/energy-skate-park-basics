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
  const inherit = require( 'PHET_CORE/inherit' );
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
  function FrictionScreen( tandem ) {

    var options = _.extend( {
      name: screenFrictionString,
      homeScreenIcon: new Image( iconFrictionHomescreen ),
      navigationBarIcon: new Image( iconFrictionNavbar ),

      tandem: tandem
    }, options );

    Screen.call( this,
      function() { return new FrictionModel( tandem.createTandem( 'model' ) ); },
      function( model ) { return new FrictionScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }

  energySkateParkBasics.register( 'FrictionScreen', FrictionScreen );

  return inherit( Screen, FrictionScreen );
} );