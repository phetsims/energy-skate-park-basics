// Copyright 2002-2013, University of Colorado Boulder

/**
 * Entry point for PhET Interactive Simulation's Energy Skate Park: Basics application.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  require( 'TOGETHER/SimIFrameAPI' );

  var SimLauncher = require( 'JOIST/SimLauncher' );
  var EnergySkateParkBasicsSim = require( 'ENERGY_SKATE_PARK_BASICS/EnergySkateParkBasicsSim' );

  // Fix a circular loading problem when using this in EnergySkateParkColorScheme
  require( 'SCENERY/util/Color' );

  SimLauncher.launch( function() {
    new EnergySkateParkBasicsSim().start();
  } );
} );