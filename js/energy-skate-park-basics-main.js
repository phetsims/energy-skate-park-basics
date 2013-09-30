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
  'ENERGY_SKATE_PARK/energy-skate-park-basics-strings',
  'ENERGY_SKATE_PARK/energy-skate-park-basics/EnergySkateParkBasicsScreen',
  'image!ENERGY_SKATE_PARK/../images/ESP_icon_one_big.png',
  'image!ENERGY_SKATE_PARK/../images/ESP_icon_two_big.png',
  'image!ENERGY_SKATE_PARK/../images/ESP_icon_three_big.png'
], function( Image, Sim, SimLauncher, strings, EnergySkateParkBasicsScreen, icon1, icon2, icon3 ) {
  'use strict';

  var simOptions = {
    credits: 'PhET Development Team -\n' +
             'Lead Design: Sam Reid (Energy Skate Park) & Noah Podolefsky (Energy Skate Park: Basics)\n' +
             'Software Development: Sam Reid\n' +
             'Design Team: Wendy Adams, Michael Dubson, Trish Loeblein, Emily Moore, Ariel Paul, Kathy Perkins, Carl Wieman\n' +
             'Interviews: Danielle Harlow, Noah Podolefsky & Ariel Paul'
  };

  SimLauncher.launch( function() {

    //Create and start the sim
    new Sim( 'Energy Skate Park: Basics', [
      new EnergySkateParkBasicsScreen( 'Intro', icon1, false, false ),
      new EnergySkateParkBasicsScreen( 'Friction', icon2, false, true ),
      new EnergySkateParkBasicsScreen( 'Playground', icon3, true, true ) ], simOptions ).start();
  } );
} );