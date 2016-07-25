// Copyright 2013-2015, University of Colorado Boulder

/**
 * Entry point for PhET Interactive Simulation's Energy Skate Park: Basics application.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var SimLauncher = require( 'JOIST/SimLauncher' );
  var EnergySkateParkBasicsSim = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/EnergySkateParkBasicsSim' );
  var Tandem = require( 'TANDEM/Tandem' );

  // Fix a circular loading problem when using this in EnergySkateParkColorScheme
  require( 'SCENERY/util/Color' );

  // constants
  var tandem = Tandem.createRootTandem();

  SimLauncher.launch( function() {
    new EnergySkateParkBasicsSim( tandem ).start();
  } );
} );