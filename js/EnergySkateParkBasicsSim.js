//  Copyright 2002-2014, University of Colorado Boulder

/**
 * A single screen for the Energy Skate Park: Basics sim.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var EnergySkateParkBasicsScreen = require( 'ENERGY_SKATE_PARK_BASICS/EnergySkateParkBasicsScreen' );
  var Sim = require( 'JOIST/Sim' );
  var icon1 = require( 'image!ENERGY_SKATE_PARK_BASICS/ESP_icon_one_big.png' );
  var icon2 = require( 'image!ENERGY_SKATE_PARK_BASICS/ESP_icon_two_big.png' );
  var icon3 = require( 'image!ENERGY_SKATE_PARK_BASICS/ESP_icon_three_big.png' );
  var intro = require( 'string!ENERGY_SKATE_PARK_BASICS/tab.introduction' );
  var friction = require( 'string!ENERGY_SKATE_PARK_BASICS/tab.friction' );
  var playground = require( 'string!ENERGY_SKATE_PARK_BASICS/tab.trackPlayground' );
  var title = require( 'string!ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics.name' );

  function EnergySkateParkBasicsSim() {

    var options = {
      credits: {
        leadDesign: 'Sam Reid (Energy Skate Park), Noah Podolefsky (Energy Skate Park: Basics)',
        softwareDevelopment: 'Sam Reid',
        designTeam: 'Wendy Adams, Michael Dubson, Trish Loeblein, Emily Moore, Ariel Paul, Kathy Perkins, Carl Wieman',
        interviews: 'Danielle Harlow, Noah Podolefsky, Ariel Paul'
      },
      showSaveAndLoad: true
    };

    Sim.call( this, title, [
//      new EnergySkateParkBasicsScreen( intro, icon1, false, false ),
//      new EnergySkateParkBasicsScreen( friction, icon2, false, true ),
      new EnergySkateParkBasicsScreen( playground, icon3, true, true ) ], options );
  }

  return inherit( Sim, EnergySkateParkBasicsSim, {
  } );
} );