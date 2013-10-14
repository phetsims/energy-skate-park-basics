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
  'ENERGY_SKATE_PARK_BASICS/EnergySkateParkBasicsScreen',
  'image!ENERGY_SKATE_PARK_BASICS/ESP_icon_one_big.png',
  'image!ENERGY_SKATE_PARK_BASICS/ESP_icon_two_big.png',
  'image!ENERGY_SKATE_PARK_BASICS/ESP_icon_three_big.png',
  'string!ENERGY_SKATE_PARK_BASICS/tab.introduction',
  'string!ENERGY_SKATE_PARK_BASICS/tab.friction',
  'string!ENERGY_SKATE_PARK_BASICS/tab.trackPlayground',
  'string!ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics.name'
], function( Image, Sim, SimLauncher, EnergySkateParkBasicsScreen, icon1, icon2, icon3, intro, friction, playground, title ) {
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
    new Sim( title, [
      new EnergySkateParkBasicsScreen( intro, icon1, false, false ),
      new EnergySkateParkBasicsScreen( friction, icon2, false, true ),
      new EnergySkateParkBasicsScreen( playground, icon3, true, true ) ], simOptions ).start();
  } );
} );