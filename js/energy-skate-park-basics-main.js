// Copyright 2002-2013, University of Colorado Boulder

/**
 * Entry point for PhET Interactive Simulation's Energy Skate Park: Basics application.
 *
 * @author Sam Reid
 */
require( [
  'SCENERY/nodes/Image',
  'JOIST/Sim',
  'JOIST/SimLauncher',
  'ENERGY_SKATE_PARK/energy-skate-park-basics-images',
  'ENERGY_SKATE_PARK/energy-skate-park-basics-strings',
  'ENERGY_SKATE_PARK/energy-skate-park-basics/EnergySkateParkBasicsScreen'
], function( Image, Sim, SimLauncher, images, strings, EnergySkateParkBasicsScreen ) {
  'use strict';

  var simOptions = {
    credits: 'PhET Development Team -\n' +
             'Lead Design: Sam Reid (Energy Skate Park) & Noah Podolefsky (Energy Skate Park: Basics)\n' +
             'Software Development: Sam Reid\n' +
             'Design Team: Wendy Adams, Michael Dubson, Trish Loeblein, Emily Moore, Ariel Paul, Kathy Perkins, Carl Wieman\n' +
             'Interviews: Danielle Harlow, Noah Podolefsky & Ariel Paul'
  };

  SimLauncher.launch( images, function() {

    //Create and start the sim
    new Sim( 'Energy Skate Park: Basics', [
      new EnergySkateParkBasicsScreen( 'Intro', false, false ),
      new EnergySkateParkBasicsScreen( 'Friction', false, true ),
      new EnergySkateParkBasicsScreen( 'Playground', true, true ) ], simOptions ).start();
  } );
} );