// Copyright 2013-2017, University of Colorado Boulder

/**
 * A single screen for the Energy Skate Park: Basics sim.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var EnergySkateParkBasicsQueryParameters = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/EnergySkateParkBasicsQueryParameters' );
  var EnergySkateParkBasicsScreen = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/EnergySkateParkBasicsScreen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Sim = require( 'JOIST/Sim' );

  // images
  var iconFrictionHomescreen = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-friction-homescreen.png' );
  var iconFrictionNavbar = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-friction-navbar.png' );
  var iconIntroHomescreen = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-intro-homescreen.png' );
  var iconIntroNavbar = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-intro-navbar.png' );
  var iconPlaygroundHomescreen = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-playground-homescreen.png' );
  var iconPlaygroundNavbar = require( 'image!ENERGY_SKATE_PARK_BASICS/icon-playground-navbar.png' );

  // strings
  var energySkateParkBasicsTitleString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics.title' );
  var screenFrictionString = require( 'string!ENERGY_SKATE_PARK_BASICS/screen.friction' );
  var screenIntroductionString = require( 'string!ENERGY_SKATE_PARK_BASICS/screen.introduction' );
  var screenTrackPlaygroundString = require( 'string!ENERGY_SKATE_PARK_BASICS/screen.trackPlayground' );

  /**
   * @constructor
   * @param {Tandem} tandem
   */
  function EnergySkateParkBasicsSim( tandem ) {
    var options = {
      credits: {
        leadDesign: 'Ariel Paul, Noah Podolefsky, Sam Reid',
        softwareDevelopment: 'Sam Reid',
        team: 'Michael Dubson, Bryce Gruneich, Trish Loeblein, Emily B. Moore, Kathy Perkins',
        graphicArts: 'Sharon Siman-Tov, Amanda McGarry',
        qualityAssurance: 'Steele Dalton, Oliver Orejola, Arnab Purkayastha, Bryan Yoelin'
      },

      showSaveAndLoad: EnergySkateParkBasicsQueryParameters.showSaveAndLoad
    };

    Sim.call( this, energySkateParkBasicsTitleString, [
      new EnergySkateParkBasicsScreen( screenIntroductionString, iconIntroHomescreen, iconIntroNavbar, false, false, tandem.createTandem( 'introScreen' ) ),
      new EnergySkateParkBasicsScreen( screenFrictionString, iconFrictionHomescreen, iconFrictionNavbar, false, true, tandem.createTandem( 'frictionScreen' ) ),
      new EnergySkateParkBasicsScreen( screenTrackPlaygroundString, iconPlaygroundHomescreen, iconPlaygroundNavbar, true, true, tandem.createTandem( 'playgroundScreen' ) )
    ], options );
  }

  energySkateParkBasics.register( 'EnergySkateParkBasicsSim', EnergySkateParkBasicsSim );

  return inherit( Sim, EnergySkateParkBasicsSim );
} );