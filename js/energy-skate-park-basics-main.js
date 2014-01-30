// Copyright 2002-2013, University of Colorado Boulder

/**
 * Entry point for PhET Interactive Simulation's Energy Skate Park: Basics application.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var SimLauncher = require( 'JOIST/SimLauncher' );
  var EnergySkateParkBasicsSim = require( 'ENERGY_SKATE_PARK_BASICS/EnergySkateParkBasicsSim' );

  SimLauncher.launch( function() {
    new EnergySkateParkBasicsSim().start();
  } );
} );