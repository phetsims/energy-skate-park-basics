// Copyright 2016, University of Colorado Boulder

/**
 * The skater stores a reference to the track it is on, or null if in the air or ground.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );
  var phetio = require( 'ifphetio!PHET_IO/phetio' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TTrackReference( instance, phetioID ) {
    assertInstanceOf( instance, phet.energySkateParkBasics.Track );
    TObject.call( this, instance, phetioID );
  }

  /**
   * The wrapper type for a track.
   */
  phetioInherit( TObject, 'TTrackReference', TTrackReference, {}, {

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
      return instance ? instance.tandem.id : null;
    }
  } );

  energySkateParkBasics.register( 'TTrackReference', TTrackReference );

  return TTrackReference;
} );