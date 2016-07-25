// Copyright 2013-2015, University of Colorado Boulder

/**
 * A single screen for the Energy Skate Park: Basics sim.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var EnergySkateParkBasicsModel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/model/EnergySkateParkBasicsModel' );
  var EnergySkateParkBasicsScreenView = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/EnergySkateParkBasicsScreenView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  function EnergySkateParkBasicsScreen( name, homescreenIcon, navbarIcon, draggableTracks, friction, tandem ) {
    Screen.call( this, name, new Image( homescreenIcon ),
      function() { return new EnergySkateParkBasicsModel( draggableTracks, friction, tandem ); },
      function( model ) {
        return new EnergySkateParkBasicsScreenView( model, tandem );
      }, {
        navigationBarIcon: new Image( navbarIcon ),
        tandem: tandem
      } );
  }

  energySkateParkBasics.register( 'EnergySkateParkBasicsScreen', EnergySkateParkBasicsScreen );

  return inherit( Screen, EnergySkateParkBasicsScreen );
} );