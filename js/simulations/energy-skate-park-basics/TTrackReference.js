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
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var TObject = require( 'PHET_IO/types/TObject' );
  var phetio = require( 'PHET_IO/phetio' );

  var TTrackReference = function( instance, phetioID ) {
    assertInstanceOf( instance, phet.energySkateParkBasics.Track );
    TObject.call( this, instance, phetioID );
  };

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

  phetioNamespace.register( 'TTrackReference', TTrackReference );

  return TTrackReference;
} );