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
  var iconIntroHomescreen = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-intro-homescreen.png' );
  var iconFrictionHomescreen = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-friction-homescreen.png' );
  var iconPlaygroundHomescreen = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-playground-homescreen.png' );
  var iconIntroNavbar = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-intro-navbar.png' );
  var iconFrictionNavbar = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-friction-navbar.png' );
  var iconPlaygroundNavbar = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-playground-navbar.png' );
  var intro = require( 'string!ENERGY_SKATE_PARK_BASICS/tab.introduction' );
  var friction = require( 'string!ENERGY_SKATE_PARK_BASICS/tab.friction' );
  var playground = require( 'string!ENERGY_SKATE_PARK_BASICS/tab.trackPlayground' );
  var title = require( 'string!ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics.name' );

  function EnergySkateParkBasicsSim() {

    var options = {
      credits: {
        leadDesign: 'Noah Podolefsky & Sam Reid',
        softwareDevelopment: 'Sam Reid',
        designTeam: 'Wendy Adams, Michael Dubson, Trish Loeblein, Emily Moore, Ariel Paul, Kathy Perkins, Carl Wieman',
        interviews: 'Danielle Harlow, Noah Podolefsky, Ariel Paul'
      },

      //TODO: Remove before publication
      showSaveAndLoad: true
    };

    Sim.call( this, title, [
      new EnergySkateParkBasicsScreen( intro, iconIntroHomescreen, iconIntroNavbar, false, false ),
      new EnergySkateParkBasicsScreen( friction, iconFrictionHomescreen, iconFrictionNavbar, false, true ),
      new EnergySkateParkBasicsScreen( playground, iconPlaygroundHomescreen, iconPlaygroundNavbar, true, true ) ], options );
  }

  return inherit( Sim, EnergySkateParkBasicsSim, {
  } );
} );