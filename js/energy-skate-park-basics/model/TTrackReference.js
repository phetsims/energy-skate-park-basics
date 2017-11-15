// Copyright 2017, University of Colorado Boulder

/**
 * The skater stores a reference to the track it is on, or null if in the air or ground.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var phetio = require( 'ifphetio!PHET_IO/phetio' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TTrackReference( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.energySkateParkBasics.Track );
    ObjectIO.call( this, instance, phetioID );
  }

  /**
   * The wrapper type for a track.
   */
  phetioInherit( ObjectIO, 'TTrackReference', TTrackReference, {}, {

    fromStateObject: function( stateObject ) {
      if ( stateObject === null ) {
        return null;
      }
      if ( phetio.hasInstance( stateObject ) ) {
        return phetio.getInstance( stateObject );
      }
      else {
        throw new Error( 'fromStateObject failed' );
      }
    },
    toStateObject: function( instance ) {
      return instance ? instance.trackTandem.id : null;
    }
  } );

  energySkateParkBasics.register( 'TTrackReference', TTrackReference );

  return TTrackReference;
} );