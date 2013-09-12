// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  var Skater = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/model/Skater' );
  var Track = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/model/Track' );
  var Vector2 = require( 'DOT/Vector2' );

  function EnergySkateParkBasicsModel() {
    var energySkateParkBasicsModel = this;
    PropertySet.call( this, {closestPoint: new Vector2( 1, 0 )} );
    this.skater = new Skater();
    var controlPoints = [ new Property( new Vector2( -2, 2 ) ), new Property( new Vector2( 0, 0 ) ), new Property( new Vector2( 2, 2 ) ) ];
    this.track = new Track( controlPoints );

    var updateClosestPoint = function() {
      energySkateParkBasicsModel.closestPoint = energySkateParkBasicsModel.track.getClosestPoint( energySkateParkBasicsModel.skater.position ).point;
    };
    this.skater.positionProperty.link( updateClosestPoint );
    for ( var i = 0; i < controlPoints.length; i++ ) {
      var controlPoint = controlPoints[i];
      controlPoint.link( updateClosestPoint );
    }
  }

  return inherit( PropertySet, EnergySkateParkBasicsModel, {
    step: function( dt ) {
      var skater = this.skater;
      if ( !skater.dragging ) {
        var netForce = new Vector2( 0, -9.8 * skater.mass );
        skater.acceleration = netForce.times( 1.0 / skater.mass );
        skater.velocity = skater.velocity.plus( skater.acceleration.times( dt ) );
        var proposedPosition = skater.position.plus( skater.velocity.times( dt ) );
        if ( proposedPosition.y < 0 ) {
          proposedPosition.y = 0;
        }
        if ( skater.position.x !== proposedPosition.x || skater.position.y !== proposedPosition.y ) {

          //see if it crossed the track

          //TODO: return t value so they can be averaged
          var t = this.track.getClosestPoint( this.skater.position ).t;
          var t1 = t - 1E-6;
          var t2 = t + 1E-6;
          var pt = this.track.getPoint( t );
          var pt1 = this.track.getPoint( t1 );
          var pt2 = this.track.getPoint( t2 );
          var segment = pt2.minus( pt1 );
          var normal = segment.rotated( Math.PI / 2 );

          var beforeSign = normal.dot( skater.position.minus( pt ) ) > 0;
          var afterSign = normal.dot( proposedPosition.minus( pt ) ) > 0;
          console.log( normal.dot( skater.position ), normal.dot( proposedPosition ), beforeSign, afterSign );
          if ( beforeSign !== afterSign ) {
            //reflect the velocity vector
            skater.velocity = skater.velocity.times( -1 );
          }
          else {
            skater.position = proposedPosition;
          }
        }
      }
    }} );
} );