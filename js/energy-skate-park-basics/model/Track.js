// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Vector2 = require( 'DOT/Vector2' );

  //points is Array of Property of Vector2
  function Track( points ) {
    ObservableArray.call( this, points );
    this.t = [];
    this.x = [];
    this.y = [];

    //Store for performance
    //TODO: recompute linSpace if length of track changes
    var lastPt = (this.length - 1) / this.length;
    this.linSpace = numeric.linspace( 0, lastPt, 70 );
  }

  return inherit( ObservableArray, Track, {
    getClosestPoint: function( point ) {
      var track = this;

      //clear arrays, reusing them to save on garbage
      this.t.length = 0;
      this.x.length = 0;
      this.y.length = 0;

      for ( var i = 0; i < track.length; i++ ) {
        this.t.push( i / track.length );
        this.x.push( track.get( i ).value.x );
        this.y.push( track.get( i ).value.y );
      }

      var xPoints = numeric.spline( this.t, this.x ).at( this.linSpace ); //TODO: number of samples could depend on the total length of the track
      var yPoints = numeric.spline( this.t, this.y ).at( this.linSpace );

      var best = 9999999999;
      var bestPt = new Vector2( 0, 0 );
      for ( i = 0; i < xPoints.length; i++ ) {
        var dist = point.distanceXY( xPoints[i], yPoints[i] );
        if ( dist < best ) {
          best = dist;
          bestPt.x = xPoints[i];
          bestPt.y = yPoints[i];
        }
      }
      return bestPt;
    }
  } );
} );