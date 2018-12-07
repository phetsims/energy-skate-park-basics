// Copyright 2018, University of Colorado Boulder

/**
 * The "Playground" screen of Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlaygroundModel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/playground/model/PlaygroundModel' );
  var PlaygroundScreenView = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/playground/view/PlaygroundScreenView' );
  var Screen = require( 'JOIST/Screen' );

  // images
  var iconPlaygroundHomescreen = require( 'image!ENERGY_SKATE_PARK/icon-playground-homescreen.png' );
  var iconPlaygroundNavbar = require( 'image!ENERGY_SKATE_PARK/icon-playground-navbar.png' );

  // strings
  var screenTrackPlaygroundString = require( 'string!ENERGY_SKATE_PARK_BASICS/screen.trackPlayground' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function PlaygroundScreen( tandem ) {

    var options = _.extend( {
      name: screenTrackPlaygroundString,
      homeScreenIcon: new Image( iconPlaygroundHomescreen ),
      navigationBarIcon: new Image( iconPlaygroundNavbar ),

      tandem: tandem
    }, options );

    Screen.call( this,
      function() { return new PlaygroundModel( tandem.createTandem( 'introModel' ) ); },
      function( model ) { return new PlaygroundScreenView( model, tandem.createTandem( 'introScreenView' ) ); },
      options
    );
  }

  energySkateParkBasics.register( 'PlaygroundScreen', PlaygroundScreen );

  return inherit( Screen, PlaygroundScreen );
} );