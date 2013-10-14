// Copyright 2002-2013, University of Colorado Boulder

//See http://www.dtcenter.org/met/users/docs/write_ups/circle_fit.pdf
define( function( require ) {
  'use strict';

  var Vector2 = require( 'DOT/Vector2' );

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
    for ( var i = 0; i < points.length; i++ ) {
      total += term( points[i] );
    }
    return total;
  };

  var circularRegression = function( points ) {
    var average = centroid( points );
    //console.log( 'average', average );
    var uv = points.map( function( point ) {
      return point.minus( average );
    } );

//    uv.forEach( function( pt ) {//console.log( pt.x, pt.y )} );

    //TODO: performance
    var suu = sum( uv, function( point ) { return point.x * point.x; } );
    var suv = sum( uv, function( point ) { return point.x * point.y; } );
    var svv = sum( uv, function( point ) { return point.y * point.y; } );
    var suuu = sum( uv, function( point ) { return point.x * point.x * point.x; } );
    var svvv = sum( uv, function( point ) { return point.y * point.y * point.y; } );
    var suvv = sum( uv, function( point ) { return point.x * point.y * point.y; } );
    var svuu = sum( uv, function( point ) { return point.y * point.x * point.x; } );

    //console.log( suu, suv, svv, suuu, svvv, suvv, svuu );

    var a = (suuu + suvv) / 2;
    var b = (svvv + svuu) / 2;
    var q = svv - suv * suv / suu;
    var vc = (b - a * suv / suu) / q;
    var uc = (a - vc * suv) / suu;

    //console.log( 'a', a );
    //console.log( 'b', b );
    //console.log( 'uc', uc );
    //console.log( 'vc', vc );
    var center = new Vector2( uc, vc ).plus( average );
    //2x2 linear system
    //console.log( 'center', center );

    var alpha = uc * uc + vc * vc + (suu + svv) / points.length;
    var r = Math.sqrt( alpha );
    //console.log( r );

    //convert u,v back to x,y
    return {r: r, x: uc + average.x, y: vc + average.y};
  };

  //Test case
//  var result = circularRegression( [
//    new Vector2( 0, 0 ),
//    new Vector2( 0.5, 0.25 ),
//    new Vector2( 1.0, 1.0 ),
//    new Vector2( 1.5, 2.25 ),
//    new Vector2( 2.0, 4.0 ),
//    new Vector2( 2.5, 6.25 ),
//    new Vector2( 3, 9 )
//  ] );

  return circularRegression;
} );