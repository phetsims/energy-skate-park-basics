// Copyright 2017, University of Colorado Boulder

/**
 * IO type for Track
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * @param {Track} track
   * @param {string} phetioID
   * @constructor
   */
  function TrackIO( track, phetioID ) {
    assert && assertInstanceOf( track, phet.energySkateParkBasics.Track );
    ObjectIO.call( this, track, phetioID );
  }

  /**
   * The IO type for a track.
   */
  phetioInherit( ObjectIO, 'TrackIO', TrackIO, {}, {
    documentation: 'A skate track.',

    fromStateObject: function( stateObject ) {

      // TODO: This is sketchy, see // See https://github.com/phetsims/energy-skate-park-basics/issues/366
      return stateObject;
    },
    toStateObject: function( track ) {
      assert && assertInstanceOf( track, phet.energySkateParkBasics.Track );
      if ( track instanceof phet.energySkateParkBasics.Track || track === null ) {

        // Since skater.trackProperty is of type Property.<Track|null>, we must support null here.
        if ( !track ) {
          return null;
        }
        assert && assert( track.controlPoints, 'control points should be defined' );
        return {
          interactive: track.interactive,
          controlPointTandemIDs: track.controlPoints.map( function( controlPoint ) {
            return controlPoint.controlPointTandem.phetioID;
          } )
        };
      }
      else {
        /// TODO: Major hack to support data stream, which for unknown reasons was already calling this method with a state object
        // See https://github.com/phetsims/energy-skate-park-basics/issues/366
        return track;
      }
    }
  } );

  energySkateParkBasics.register( 'TrackIO', TrackIO );

  return TrackIO;
} );