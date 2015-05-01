// Copyright 2002-2013, University of Colorado Boulder

/**
 * A single screen for the Energy Skate Park: Basics sim.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var EnergySkateParkBasicsModel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/model/EnergySkateParkBasicsModel' );
  var EnergySkateParkBasicsScreenView = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/EnergySkateParkBasicsScreenView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  function EnergySkateParkBasicsScreen( name, homescreenIcon, navbarIcon, draggableTracks, friction, options ) {
    Screen.call( this, name, new Image( homescreenIcon ),
      function() { return new EnergySkateParkBasicsModel( draggableTracks, friction, { tandem: options.tandem } ); },
      function( model ) {
        return new EnergySkateParkBasicsScreenView( model, options );
      },
      {
        navigationBarIcon: new Image( navbarIcon ),
        tandemScreenName: options.tandemScreenName
      } );
  }

  return inherit( Screen, EnergySkateParkBasicsScreen, {

    getState: function() {
      return {
        model: this.model.getState(),
        view: this.view.getState()
      };
    },
    setState: function( state ) {
      this.model.setState( state.model );
      this.view.setState( state.view );
    }
  } );
} );