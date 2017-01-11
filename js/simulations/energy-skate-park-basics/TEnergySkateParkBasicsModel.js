// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var TObject = require( 'PHET_IO/types/TObject' );

  var TEnergySkateParkBasicsModel = function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.energySkateParkBasics.EnergySkateParkBasicsModel );
  };


  phetioInherit( TObject, 'TEnergySkateParkBasicsModel', TEnergySkateParkBasicsModel, {}, {

    /**
     * Remove all instances of the model's dynamic children.
     * This will remove all of the tracks from the model.
     * The ControlPoints are contained in the tracks, and each track will remove its ControlPoints.
     *
     * @param {EnergySkateParkBasicsModel} energySkateParkBasicsModel
     */
    clearChildInstances: function( energySkateParkBasicsModel ) {
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
      var isControlPoint = tandem.id.indexOf( 'model.controlPoint' ) >= 0;
      // Control Points are already being created when the tracks are made, so if the tandem is a controlPoint it's a no-op
      if ( isControlPoint ) {
        return false;
      }
      // If it isn't a ControlPoint, then it is a Track
      return energySkateParkBasicsModel.addTrack( tandem, stateObject.interactive, stateObject.controlPointTandemIDs );
    }
  } );

  phetioNamespace.register( 'TEnergySkateParkBasicsModel', TEnergySkateParkBasicsModel );

  return TEnergySkateParkBasicsModel;
} );