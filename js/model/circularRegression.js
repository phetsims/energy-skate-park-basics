// Copyright 2002-2013, University of Colorado Boulder

/**
 * Determine the radius of curvature at a point in the track, so we can see if the skater would fly off or not.
 * Also used to compute the normal force.
 * See http://www.dtcenter.org/met/users/docs/write_ups/circle_fit.pdf (or our copy on Unfuddle)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Vector2 = require( 'DOT/Vector2' );

  var test = false;

  //PERFORMANCE/ALLOCATION: could pass in the Vector2 as an arg, to avoid allocation
  var centroid = function( points ) {
    var sumX = 0;
    var sumY = 0;
    for ( var i = 0; i < points.length; i++ ) {
      var point = points[i];
      sumX += point.x;
      sumY += point.y;
    }
    return new Vector2( sumX / points.length, sumY / points.length );
  };

  var sum = function( points, term ) {
    var total = 0;
    var length = points.length;
    for ( var i = 0; i < length; i++ ) {
      total += term( points[i] );
    }
    return total;
  };

  var fuu = function( point ) { return point.x * point.x; };
  var fuv = function( point ) { return point.x * point.y; };
  var fvv = function( point ) { return point.y * point.y; };
  var fuuu = function( point ) { return point.x * point.x * point.x; };
  var fvvv = function( point ) { return point.y * point.y * point.y; };
  var fuvv = function( point ) { return point.x * point.y * point.y; };
  var fvuu = function( point ) { return point.y * point.x * point.x; };

  /**
   * Returns a circular regression result, with the radius and center
   * @param points
   * @returns {{r: number, x: number, y: number}}
   */
  var circularRegression = function( points ) {
    var average = centroid( points );
    var uv = points.map( function( point ) {
      return point.minus( average );
    } );

    var suu = sum( uv, fuu );
    var suv = sum( uv, fuv );
    var svv = sum( uv, fvv );
    var suuu = sum( uv, fuuu );
    var svvv = sum( uv, fvvv );
    var suvv = sum( uv, fuvv );
    var svuu = sum( uv, fvuu );

    var a = (suuu + suvv) / 2;
    var b = (svvv + svuu) / 2;
    var q = svv - suv * suv / suu;
    var vc = (b - a * suv / suu) / q;
    var uc = (a - vc * suv) / suu;

    //2x2 linear system, solve by gaussian elimination
    var alpha = uc * uc + vc * vc + (suu + svv) / points.length;
    var r = Math.sqrt( alpha );
    return {r: r, x: uc + average.x, y: vc + average.y};
  };

  if ( test ) {
    //Test case, see the paper linked above for answers
    var result = circularRegression( [
      new Vector2( 0, 0 ),
      new Vector2( 0.5, 0.25 ),
      new Vector2( 1.0, 1.0 ),
      new Vector2( 1.5, 2.25 ),
      new Vector2( 2.0, 4.0 ),
      new Vector2( 2.5, 6.25 ),
      new Vector2( 3, 9 )
    ] );
  }

  return circularRegression;
} );