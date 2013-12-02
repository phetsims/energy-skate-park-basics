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

      return this.skaterState.up ? track.getUnitNormalVector( this.skaterState.u ) :
             track.getUnitNormalVector( this.skaterState.u ).timesScalar( -1 );
    },

    getCurvature: function() {
      var track = this.skaterState.track;
      var skaterState = this.skaterState;
      return circularRegression( [
        new Vector2( track.getX( skaterState.u ), track.getY( skaterState.u ) ),
        new Vector2( track.getX( skaterState.u - 1E-6 ), track.getY( skaterState.u - 1E-6 ) ),
        new Vector2( track.getX( skaterState.u + 1E-6 ), track.getY( skaterState.u + 1E-6 ) )] );
    },

    getCurvatureDirection: function() {

      var curvature = this.getCurvature();

      //compare a to v/r^2 to see if it leaves the track
      var v = new Vector2( curvature.x - this.skaterState.position.x, curvature.y - this.skaterState.position.y );
      return v.x !== 0 || v.y !== 0 ? v.normalized() : v;
    },

    getRadiusOfCurvature: function() {
      return this.getCurvature().r;
    },

    //TODO: Make sure direction not used by callers
    getSpeed: function() {
      return Math.abs( this.skaterState.uD );
    }
  } );
} );