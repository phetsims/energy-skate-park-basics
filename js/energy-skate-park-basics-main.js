// Copyright 2002-2013, University of Colorado Boulder

/**
 * Entry point for PhET Interactive Simulation's Energy Skate Park: Basics application.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Image = require( 'SCENERY/nodes/Image' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var EnergySkateParkBasicsScreen = require( 'ENERGY_SKATE_PARK_BASICS/EnergySkateParkBasicsScreen' );
  var icon1 = require( 'image!ENERGY_SKATE_PARK_BASICS/ESP_icon_one_big.png' );
  var icon2 = require( 'image!ENERGY_SKATE_PARK_BASICS/ESP_icon_two_big.png' );
  var icon3 = require( 'image!ENERGY_SKATE_PARK_BASICS/ESP_icon_three_big.png' );
  var intro = require( 'string!ENERGY_SKATE_PARK_BASICS/tab.introduction' );
  var friction = require( 'string!ENERGY_SKATE_PARK_BASICS/tab.friction' );
  var playground = require( 'string!ENERGY_SKATE_PARK_BASICS/tab.trackPlayground' );
  var title = require( 'string!ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics.name' );

  var simOptions = {
    credits: {
      leadDesign: 'Sam Reid (Energy Skate Park), Noah Podolefsky (Energy Skate Park: Basics)',
      softwareDevelopment: 'Sam Reid',
      designTeam: 'Wendy Adams, Michael Dubson, Trish Loeblein, Emily Moore, Ariel Paul, Kathy Perkins, Carl Wieman',
      interviews: 'Danielle Harlow, Noah Podolefsky, Ariel Paul'
    }
  };

  SimLauncher.launch( function() {

    //Create and start the sim
    new Sim( title, [
      new EnergySkateParkBasicsScreen( intro, icon1, false, false ),
      new EnergySkateParkBasicsScreen( friction, icon2, false, true ),
      new EnergySkateParkBasicsScreen( playground, icon3, true, true ) ], simOptions ).start();
  } );
} );