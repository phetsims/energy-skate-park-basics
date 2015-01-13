// Copyright 2002-2014, University of Colorado Boulder

/**
 * A single screen for the Energy Skate Park: Basics sim.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var EnergySkateParkBasicsScreen = require( 'ENERGY_SKATE_PARK_BASICS/EnergySkateParkBasicsScreen' );
  var Sim = require( 'JOIST/Sim' );

  // images
  var iconIntroHomescreen = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-intro-homescreen.png' );
  var iconFrictionHomescreen = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-friction-homescreen.png' );
  var iconPlaygroundHomescreen = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-playground-homescreen.png' );
  var iconIntroNavbar = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-intro-navbar.png' );
  var iconFrictionNavbar = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-friction-navbar.png' );
  var iconPlaygroundNavbar = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-playground-navbar.png' );

  // strings
  var intro = require( 'string!ENERGY_SKATE_PARK_BASICS/tab.introduction' );
  var friction = require( 'string!ENERGY_SKATE_PARK_BASICS/tab.friction' );
  var playground = require( 'string!ENERGY_SKATE_PARK_BASICS/tab.trackPlayground' );
  var title = require( 'string!ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics.name' );

  function EnergySkateParkBasicsSim() {

    var indent = '\n        ';
    var options = {
      credits: {
        leadDesign: 'Ariel Paul, Noah Podolefsky, Sam Reid',
        softwareDevelopment: 'Sam Reid',
        team: 'Michael Dubson, Bryce Gruneich, Trish Loeblein' + indent + 'Emily B. Moore, Kathy Perkins',
        graphicArts: 'Sharon Siman-Tov, Amanda McGarry',
        qualityAssurance: 'Steele Dalton, Oliver Orejola' + indent + 'Arnab Purkayastha, Bryan Yoelin'
      },

      showSaveAndLoad: window.phetcommon.getQueryParameter( 'showSaveAndLoad' ),
      screenDisplayStrategy: 'setChildren'
    };

    Sim.call( this, title, [
      new EnergySkateParkBasicsScreen( intro, iconIntroHomescreen, iconIntroNavbar, false, false ),
      new EnergySkateParkBasicsScreen( friction, iconFrictionHomescreen, iconFrictionNavbar, false, true ),
      new EnergySkateParkBasicsScreen( playground, iconPlaygroundHomescreen, iconPlaygroundNavbar, true, true )
    ], options );
  }

  return inherit( Sim, EnergySkateParkBasicsSim, {} );
} );