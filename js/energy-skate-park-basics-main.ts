// Copyright 2013-2026, University of Colorado Boulder

/**
 * Entry point for PhET Interactive Simulation's Energy Skate Park: Basics simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import EnergySkateParkBasicsSim from './EnergySkateParkBasicsSim.js';

const tandem = Tandem.ROOT;

simLauncher.launch( () => {
  new EnergySkateParkBasicsSim( tandem ).start();
} );

// Test comment 1

// Test comment 2
// Test comment 3

// Test comment 4
// Test comment 5