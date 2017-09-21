// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TTrack( instance, phetioID ) {
    assertInstanceOf( instance, phet.energySkateParkBasics.Track );
    TObject.call( this, instance, phetioID );
  }

  /**
   * The wrapper type for a track.
   */
  phetioInherit( TObject, 'TTrack', TTrack, {}, {
    documentation: 'A skate track.',

    fromStateObject: function( stateObject ) {

      // TODO: This is sketchy, see // See https://github.com/phetsims/energy-skate-park-basics/issues/366
      return stateObject;
    },
    toStateObject: function( instance ) {
      if ( instance instanceof phet.energySkateParkBasics.Track || instance === null ) {

        // Since skater.trackProperty is of type Property.<Track|null>, we must support null here.
        if ( !instance ) {
          return null;
        }
        assert && assert( instance.controlPoints, 'control points should be defined' );
        return {
          interactive: instance.interactive,
          controlPointTandemIDs: instance.controlPoints.map( function( controlPoint ) {
            return controlPoint.tandem.id;
          } )
        };
      }
      else {
        /// TODO: Major hack to support data stream, which for unknown reasons was already calling this method with a state object
        // See https://github.com/phetsims/energy-skate-park-basics/issues/366
        return instance;
      }
    }
  } );

  energySkateParkBasics.register( 'TTrack', TTrack );

  return TTrack;
} );