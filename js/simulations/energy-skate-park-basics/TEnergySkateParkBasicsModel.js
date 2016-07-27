// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare
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

  /**
   * Control point or null
   */
  phetioInherit( TObject, 'TEnergySkateParkBasicsModel', TEnergySkateParkBasicsModel, {}, {

    // Support null
    fromStateObject: function( arrayOfArrayOfVector ) {
      // // TODO: Ensure the right number of tracks, each with the right number of points.
      //
      // for ( var i = 0; i < arrayOfArrayOfVector.length; i++ ) {
      //   var track = arrayOfArrayOfVector[ i ];
      //   for ( var j = 0; j < track.length; j++ ) {
      //     var controlPoint = model.tracks.get( i ).controlPoints[ j ];
      //
      //     // Making sure it is different here significantly improves performance in mirror.html
      //     if ( controlPoint.sourcePosition.x !== track[ j ].x ||
      //          controlPoint.sourcePosition.y !== track[ j ].y ) {
      //       controlPoint.sourcePosition = track[ j ];
      //       model.tracks.get( i ).updateSplines();
      //       model.tracks.get( i ).trigger( 'update' );
      //     }
      //   }
      // }
    },
    toStateObject: function( instance ) {
      // return instance.tracks.map( function( track ) {
      //   return {
      //     getArray: function() {
      //       return track.controlPoints.map( function( controlPoint ) {
      //         return controlPoint.sourcePosition;
      //       } );
      //     }
      //   };
      // } ).getArray(); // This line returns a JS Array, not ObservableArray, required by phetio.js
    }
  } );

  phetioNamespace.register( 'TEnergySkateParkBasicsModel', TEnergySkateParkBasicsModel );

  return TEnergySkateParkBasicsModel;
} );