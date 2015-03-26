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
  var EnergySkateParkBasicsScreen = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/EnergySkateParkBasicsScreen' );
  var Sim = require( 'JOIST/Sim' );
  var ComponentIDContext = require( 'TANDEM/ComponentIDContext' );

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

      showSaveAndLoad: phet.chipper.getQueryParameter( 'showSaveAndLoad' ),
      screenDisplayStrategy: 'setChildren'
    };

    Sim.call( this, title, [
      new EnergySkateParkBasicsScreen( intro, iconIntroHomescreen, iconIntroNavbar, false, false, {
        componentIDContext: new ComponentIDContext( 'introScreen' ),
        speedometerCheckBoxComponentID: 'introScreen.speedometerCheckBox',
        clearThermalButtonComponentID: 'introScreen.pieChartLegend.clearThermalButton',
        massSliderComponentID: 'introScreen.massSlider',
        barGraphClearThermalButtonComponentID: 'introScreen.barGraph.clearThermalButton',
        scene1RadioButtonComponentID: 'introScreen.scene1RadioButton',
        scene2RadioButtonComponentID: 'introScreen.scene2RadioButton',
        scene3RadioButtonComponentID: 'introScreen.scene3RadioButton',
        stepButtonComponentID: 'introScreen.stepButton',
        resetAllButtonComponentID: 'introScreen.resetAllButton',
        returnSkaterButtonComponentID: 'introScreen.returnSkaterButton',
        slowSpeedRadioButtonComponentID: 'introScreen.slowSpeedRadioButton',
        normalSpeedRadioButtonComponentID: 'introScreen.normalSpeedRadioButton',
        returnSkaterToPreviousStartingPositionButtonComponentID: 'introScreen.returnSkaterToPreviousStartingPositionButton',
        returnSkaterToGroundButtonComponentID: 'introScreen.returnSkaterToGroundButton',
        homeScreenButtonComponentID: 'homeScreen.introScreenButton',
        navigationBarScreenButtonComponentID: 'navigationBar.introScreenButton'
      } ),
      new EnergySkateParkBasicsScreen( friction, iconFrictionHomescreen, iconFrictionNavbar, false, true, {
        componentIDContext: new ComponentIDContext( 'frictionScreen' ),
        speedometerCheckBoxComponentID: 'frictionScreen.speedometerCheckBox',
        clearThermalButtonComponentID: 'frictionScreen.pieChartLegend.clearThermalButton',
        massSliderComponentID: 'frictionScreen.massSlider',
        barGraphClearThermalButtonComponentID: 'frictionScreen.barGraph.clearThermalButton',
        scene1RadioButtonComponentID: 'frictionScreen.scene1RadioButton',
        scene2RadioButtonComponentID: 'frictionScreen.scene2RadioButton',
        scene3RadioButtonComponentID: 'frictionScreen.scene3RadioButton',
        stepButtonComponentID: 'frictionScreen.stepButton',
        resetAllButtonComponentID: 'frictionScreen.resetAllButton',
        returnSkaterButtonComponentID: 'frictionScreen.returnSkaterButton',
        slowSpeedRadioButtonComponentID: 'frictionScreen.slowSpeedRadioButton',
        normalSpeedRadioButtonComponentID: 'frictionScreen.normalSpeedRadioButton',
        returnSkaterToPreviousStartingPositionButtonComponentID: 'frictionScreen.returnSkaterToPreviousStartingPositionButton',
        returnSkaterToGroundButtonComponentID: 'frictionScreen.returnSkaterToGroundButton',
        homeScreenButtonComponentID: 'homeScreen.frictionScreenButton',
        navigationBarScreenButtonComponentID: 'navigationBar.frictionScreenButton',

        frictionControlComponentID: 'frictionScreen.frictionSlider'
      } ),
      new EnergySkateParkBasicsScreen( playground, iconPlaygroundHomescreen, iconPlaygroundNavbar, true, true, {
        componentIDContext: new ComponentIDContext( 'playgroundScreen' ),
        speedometerCheckBoxComponentID: 'playgroundScreen.speedometerCheckBox',
        clearThermalButtonComponentID: 'playgroundScreen.pieChartLegend.clearThermalButton',
        massSliderComponentID: 'playgroundScreen.massSlider',
        barGraphClearThermalButtonComponentID: 'playgroundScreen.barGraph.clearThermalButton',
        scene1RadioButtonComponentID: 'playgroundScreen.scene1RadioButton',
        scene2RadioButtonComponentID: 'playgroundScreen.scene2RadioButton',
        scene3RadioButtonComponentID: 'playgroundScreen.scene3RadioButton',
        stepButtonComponentID: 'playgroundScreen.stepButton',
        resetAllButtonComponentID: 'playgroundScreen.resetAllButton',
        returnSkaterButtonComponentID: 'playgroundScreen.returnSkaterButton',
        slowSpeedRadioButtonComponentID: 'playgroundScreen.slowSpeedRadioButton',
        normalSpeedRadioButtonComponentID: 'playgroundScreen.normalSpeedRadioButton',
        returnSkaterToPreviousStartingPositionButtonComponentID: 'playgroundScreen.returnSkaterToPreviousStartingPositionButton',
        returnSkaterToGroundButtonComponentID: 'playgroundScreen.returnSkaterToGroundButton',
        homeScreenButtonComponentID: 'homeScreen.playgroundScreenButton',
        navigationBarScreenButtonComponentID: 'navigationBar.playgroundScreenButton',

        frictionControlComponentID: 'playgroundScreen.frictionSlider'
      } )
    ], options );
  }

  return inherit( Sim, EnergySkateParkBasicsSim, {} );
} );