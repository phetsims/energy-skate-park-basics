// Copyright 2017-2018, University of Colorado Boulder

/**
 * IO type for EnergySkateParkBasicsModel
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * @param {EnergySkateParkBasicsModel} energySkateParkBasicsModel
   * @param {string} phetioID
   * @constructor
   */
  function EnergySkateParkBasicsModelIO( energySkateParkBasicsModel, phetioID ) {
    assert && assertInstanceOf( energySkateParkBasicsModel, phet.energySkateParkBasics.EnergySkateParkBasicsModel );
    ObjectIO.call( this, energySkateParkBasicsModel, phetioID );
  }

  phetioInherit( ObjectIO, 'EnergySkateParkBasicsModelIO', EnergySkateParkBasicsModelIO, {}, {
    documentation: 'The model for the Skate Park.',

    /**
     * Remove all instances of the model's dynamic children.
     * This will remove all of the tracks from the model.
     * The ControlPoints are contained in the tracks, and each track will remove its ControlPoints.
     *
     * @param {EnergySkateParkBasicsModel} energySkateParkBasicsModel
     */
    clearChildInstances: function( energySkateParkBasicsModel ) {
      assert && assertInstanceOf( energySkateParkBasicsModel, phet.energySkateParkBasics.EnergySkateParkBasicsModel );
      energySkateParkBasicsModel.removeAllTracks();
    },

    /**
     * Adds a Track as specified by the phetioID and state.
     * A Track will create its own ControlPoints
     * @param {EnergySkateParkBasicsModel} energySkateParkBasicsModel
     * @param {Tandem} tandem
     * @param {Object} stateObject
     */
    addChildInstance: function( energySkateParkBasicsModel, tandem, stateObject ) {
      assert && assertInstanceOf( energySkateParkBasicsModel, phet.energySkateParkBasics.EnergySkateParkBasicsModel );
      var isControlPoint = tandem.phetioID.indexOf( 'model.controlPoint' ) >= 0;

      // Control Points are already being created when the tracks are made, so if the tandem is a controlPoint it's a no-op
      if ( isControlPoint ) {
        return false;
      }
      
      // If it isn't a ControlPoint, then it is a Track
      return energySkateParkBasicsModel.addTrack( tandem, stateObject.interactive, stateObject.controlPointTandemIDs );
    }
  } );

  energySkateParkBasics.register( 'EnergySkateParkBasicsModelIO', EnergySkateParkBasicsModelIO );

  return EnergySkateParkBasicsModelIO;
} );