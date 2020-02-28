// Copyright 2013-2020, University of Colorado Boulder

/**
 * Entry point for PhET Interactive Simulation's Energy Skate Park: Basics application.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import SimLauncher from '../../joist/js/SimLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import EnergySkateParkBasicsSim from './energy-skate-park-basics/EnergySkateParkBasicsSim.js';

// constants
const tandem = Tandem.ROOT;

SimLauncher.launch( () => {
  new EnergySkateParkBasicsSim( tandem ).start();
} );