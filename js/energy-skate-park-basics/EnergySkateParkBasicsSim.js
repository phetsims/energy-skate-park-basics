// Copyright 2013-2018, University of Colorado Boulder

/**
 * A single screen for the Energy Skate Park: Basics sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var EnergySkateParkSim = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/EnergySkateParkSim' );
  var FrictionScreen = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/friction/FrictionScreen' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroScreen = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/intro/IntroScreen' );
  var PlaygroundScreen = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/playground/PlaygroundScreen' );

  // strings
  var energySkateParkBasicsTitleString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics.title' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function EnergySkateParkBasicsSim( tandem ) {

    var options = {
      credits: {
        leadDesign: 'Ariel Paul, Noah Podolefsky, Sam Reid',
        softwareDevelopment: 'Sam Reid, Jesse Greenberg',
        team: 'Michael Dubson, Bryce Gruneich, Trish Loeblein, Emily B. Moore, Kathy Perkins',
        graphicArts: 'Sharon Siman-Tov, Amanda McGarry',
        qualityAssurance: 'Steele Dalton, Oliver Orejola, Arnab Purkayastha, Bryan Yoelin'
      }
    };

    var screens = [
      new IntroScreen( tandem.createTandem( 'introScreen' ) ),
      new FrictionScreen( tandem.createTandem( 'frictionScreen' ) ),
      new PlaygroundScreen( tandem.createTandem( 'playgroundScreen' ) )
    ];

    EnergySkateParkSim.call( this, energySkateParkBasicsTitleString, screens, tandem, options );
  }

  energySkateParkBasics.register( 'EnergySkateParkBasicsSim', EnergySkateParkBasicsSim );

  return inherit( EnergySkateParkSim, EnergySkateParkBasicsSim );
} );