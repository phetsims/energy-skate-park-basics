// Copyright 2002-2013, University of Colorado Boulder

/**
 * Mock up the Particle1D Interface to make it easier to port the Java code
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var circularRegression = require( 'ENERGY_SKATE_PARK_BASICS/model/circularRegression' );

  function Particle1D( skaterState ) {
    this.skaterState = skaterState;
  }

  return inherit( Object, Particle1D, {
    getSideVector: function() {
      var track = this.skaterState.track;
      var up = this.skaterState.up;

      //TODO: could reduce allocations here 1/2 the time
      return track.getUnitNormalVector( this.skaterState.u ).timesScalar( up ? 1 : -1 );
    },
    getCurvatureDirection: function() {

      var track = this.skaterState.track;
      var skaterState = this.skaterState;
      var curvature = circularRegression( [
        new Vector2( track.getX( skaterState.u ), track.getY( skaterState.u ) ),
        new Vector2( track.getX( skaterState.u - 1E-6 ), track.getY( skaterState.u - 1E-6 ) ),
        new Vector2( track.getX( skaterState.u + 1E-6 ), track.getY( skaterState.u + 1E-6 ) )] );

      //compare a to v/r^2 to see if it leaves the track
      var v = new Vector2( curvature.x - skaterState.position.x, curvature.y - skaterState.position.y );
      return v.x !== 0 || v.y !== 0 ? v.normalized() : v;
    },
    getRadiusOfCurvature: function() {
      var track = this.skaterState.track;
      var skaterState = this.skaterState;
      var curvature = circularRegression( [
        new Vector2( track.getX( skaterState.u ), track.getY( skaterState.u ) ),
        new Vector2( track.getX( skaterState.u - 1E-6 ), track.getY( skaterState.u - 1E-6 ) ),
        new Vector2( track.getX( skaterState.u + 1E-6 ), track.getY( skaterState.u + 1E-6 ) )] );
      return curvature.r;
    },

    //TODO: Make sure direction not used by callers
    getSpeed: function() {
      return Math.abs( this.skaterState.uD );
    }
  } );
} );