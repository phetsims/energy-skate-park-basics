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

  var TTrack = function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.energySkateParkBasics.Track );
  };

  /**
   * The wrapper type for a track.
   */
  phetioInherit( TObject, 'TTrack', TTrack, {}, {

    fromStateObject: function( stateObject ) {
      return stateObject;
      // if ( stateObject === null ) {
      //   return null;
      // }
      // // function Track( events, modelTracks, controlPoints, interactive, parents, availableModelBoundsProperty, tandem ) {
      // var controlPoints = stateObject.controlPointTandemIDs.map( function( id, index ) {
      //   return new phet.energySkateParkBasics.ControlPoint( index, 0, new phet.tandem.Tandem( id ) ); // TODO: create with correct initial x & y values.
      // } );
      // var newTrack = new phet.energySkateParkBasics.Track( this, this.tracks, controlPoints, interactive, [], this.availableModelBoundsProperty, tandem );
      // return newTrack;
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
        return instance; /// TODO: Major hack to support data stream, which for unknown reasons was already calling this method with a state object
      }

    },
    setValue: function() {
      // nothing to do here
    }
  } );

  phetioNamespace.register( 'TTrack', TTrack );

  return TTrack;
} );