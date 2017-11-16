// Copyright 2017, University of Colorado Boulder

/**
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
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TrackIO( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.energySkateParkBasics.Track );
    ObjectIO.call( this, instance, phetioID );
  }

  /**
   * The wrapper type for a track.
   */
  phetioInherit( ObjectIO, 'TrackIO', TrackIO, {}, {
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
            return controlPoint.controlPointTandem.id;
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

  energySkateParkBasics.register( 'TrackIO', TrackIO );

  return TrackIO;
} );