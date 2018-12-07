// Copyright 2013-2018, University of Colorado Boulder

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
  var IntroScreen = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/intro/IntroScreen' );
  var FrictionScreen = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/friction/FrictionScreen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var platform = require( 'PHET_CORE/platform' );
  var Sim = require( 'JOIST/Sim' );

  // strings
  var energySkateParkBasicsTitleString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics.title' );
  // var screenFrictionString = require( 'string!ENERGY_SKATE_PARK_BASICS/screen.friction' );
  // var screenIntroductionString = require( 'string!ENERGY_SKATE_PARK_BASICS/screen.introduction' );
  // var screenTrackPlaygroundString = require( 'string!ENERGY_SKATE_PARK_BASICS/screen.trackPlayground' );

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

      showSaveAndLoad: EnergySkateParkBasicsQueryParameters.showSaveAndLoad,

      // if running the sim on an ipad, do not use the "backing scale" technique
      // for antialiasing because this method takes up too much memory, see
      // https://github.com/phetsims/scenery/issues/859 and
      // https://github.com/phetsims/energy-skate-park-basics/issues/435
      allowBackingScaleAntialiasing: !platform.mobileSafari
    };

    Sim.call( this, energySkateParkBasicsTitleString, [

      // TODO: These will need custom nav bar icons
      new IntroScreen( tandem.createTandem( 'introScreen' ) ),
      new FrictionScreen( tandem.createTandem( 'frictionScreen' ) )
      // new EnergySkateParkScreen( screenTrackPlaygroundString, iconPlaygroundHomescreen, true, true, tandem.createTandem( 'playgroundScreen' ) )
    ], options );
  }

  energySkateParkBasics.register( 'EnergySkateParkBasicsSim', EnergySkateParkBasicsSim );

  return inherit( Sim, EnergySkateParkBasicsSim );
} );