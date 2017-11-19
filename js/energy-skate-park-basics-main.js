// Copyright 2013-2017, University of Colorado Boulder

/**
 * Entry point for PhET Interactive Simulation's Energy Skate Park: Basics application.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var EnergySkateParkBasicsSim = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/EnergySkateParkBasicsSim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var Tandem = require( 'TANDEM/Tandem' );

  // Fix a circular loading problem when using this in EnergySkateParkColorScheme
  require( 'SCENERY/util/Color' );

  // constants
  var tandem = Tandem.rootTandem;

  SimLauncher.launch( function() {
    new EnergySkateParkBasicsSim( tandem ).start();
  } );
} );