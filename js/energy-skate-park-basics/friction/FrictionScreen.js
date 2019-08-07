// Copyright 2018, University of Colorado Boulder

/**
 * The "Friction" screen of Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var FrictionModel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/friction/model/FrictionModel' );
  var FrictionScreenView = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/friction/view/FrictionScreenView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // images
  var iconFrictionHomescreen = require( 'image!ENERGY_SKATE_PARK/icon-friction-homescreen.png' );
  var iconFrictionNavbar = require( 'image!ENERGY_SKATE_PARK/icon-friction-navbar.png' );

  // strings
  var screenFrictionString = require( 'string!ENERGY_SKATE_PARK_BASICS/screen.friction' );

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