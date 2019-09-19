// Copyright 2013-2018, University of Colorado Boulder

/**
 * Entry point for PhET Interactive Simulation's Energy Skate Park: Basics application.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  const EnergySkateParkBasicsSim = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/EnergySkateParkBasicsSim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const Tandem = require( 'TANDEM/Tandem' );

  // constants
  var tandem = Tandem.rootTandem;

  SimLauncher.launch( function() {
    new EnergySkateParkBasicsSim( tandem ).start();
  } );
} );