// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model for the skater in Energy Skate Park: Basics, including position, velocity, energy, etc..
 * All units are in meters.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanIO = require( 'TANDEM/types/BooleanIO' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Constants = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/Constants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  var Emitter = require( 'AXON/Emitter' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NullableIO = require( 'TANDEM/types/NullableIO' );
  var NumberIO = require( 'TANDEM/types/NumberIO' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Range = require( 'DOT/Range' );
  var StringIO = require( 'TANDEM/types/StringIO' );
  var TrackReferenceIO = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/model/TrackReferenceIO' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector2IO = require( 'DOT/Vector2IO' );

  // Compare two arrays, whose elements have 'equals' methods for comparison
  var arrayEquals = function( a, b ) {
    if ( a.length !== b.length ) {
      return false;
    }
    for ( var i = 0; i < a.length; i++ ) {
      var elm1 = a[ i ];
      var elm2 = b[ i ];
      if ( !elm1.equals( elm2 ) ) {
        return false;
      }
    }
    return true;
  };

  /**
   * @constructor
   * @param {Tandem} tandem
   */
  function Skater( tandem ) {
    var self = this;

    // @public - The track the skater is on, or null if free-falling
    this.trackProperty = new Property( null, {
      tandem: tandem.createTandem( 'trackProperty' ),
      phetioType: PropertyIO( NullableIO( TrackReferenceIO ) )
    } );

    // @public {number} - Parameter along the parametric spline, unitless since it is in parametric space
    this.parametricPositionProperty = new Property( 0, {
      tandem: tandem.createTandem( 'parametricPositionProperty' ),
      phetioType: PropertyIO( NullableIO( NumberIO ) )
    } );

    // @public {number} - Speed along the parametric spline dimension, formally 'u dot', indicating speed and direction
    // (+/-) along the track spline in meters per second.  Not technically the derivative of 'u' since it is the
    // euclidean speed.
    this.parametricSpeedProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'parametricSpeedProperty' ),
      phetioReadOnly: true
    } );

    // @public - True if the skater is pointing up on the track, false if attached to underside of track
    this.onTopSideOfTrackProperty = new Property( true, {
      tandem: tandem.createTandem( 'onTopSideOfTrackProperty' ),
      phetioType: PropertyIO( BooleanIO )
    } );

    // @public {number} - Gravity magnitude and direction
    this.gravityProperty = new NumberProperty( -9.8, {
      tandem: tandem.createTandem( 'gravityProperty' ),
      units: 'meters/second/second',
      range: new Range( -100, 1E-6 )
    } );

    // @public {Vector2} - the position of the skater
    this.positionProperty = new Property( new Vector2( 3.5, 0 ), {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioType: PropertyIO( Vector2IO )
    } );

    // @private {number} - Start in the middle of the MassControlPanel range
    this.massProperty = new NumberProperty( Constants.DEFAULT_MASS, {
      range: new Range( Constants.MIN_MASS, Constants.MAX_MASS ),
      tandem: tandem.createTandem( 'massProperty' ),
      units: 'kilograms'
    } );

    // @public {string} - Which way the skater is facing, right or left.  Coded as strings instead of boolean in case
    // we add other states later like 'forward'
    this.directionProperty = new Property( 'left', {
      tandem: tandem.createTandem( 'directionProperty' ),
      phetioType: PropertyIO( StringIO )
    } );

    // @public {vector2}
    this.velocityProperty = new Property( new Vector2( 0, 0 ), {
      tandem: tandem.createTandem( 'velocityProperty' ),
      phetioType: PropertyIO( Vector2IO )
    } );

    // @public {boolean} - True if the user is dragging the skater with a pointer
    this.draggingProperty = new Property( false, {
      tandem: tandem.createTandem( 'draggingProperty' ),
      phetioType: PropertyIO( BooleanIO )
    } );

    // @public {numbere} - Energies are in Joules
    this.kineticEnergyProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'kineticEnergyProperty' ),
      units: 'joules',
      phetioReadOnly: true
    } );

    // @public {number}
    this.potentialEnergyProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'potentialEnergyProperty' ),
      units: 'joules',
      phetioReadOnly: true
    } );

    // @public {number}
    this.thermalEnergyProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'thermalEnergyProperty' ),
      units: 'joules',
      phetioReadOnly: true
    } );

    // @public {number}
    this.totalEnergyProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'totalEnergyProperty' ),
      units: 'joules',
      phetioReadOnly: true
    } );

    // @public {number} - The skater's angle (about the pivot point at the bottom center), in radians
    this.angleProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'angleProperty' ),
      units: 'radians',
      phetioReadOnly: true
    } );

    // @public {Vector2} - Returns to this point when pressing "return skater"
    this.startingPositionProperty = new Property( new Vector2( 3.5, 0 ), {
      tandem: tandem.createTandem( 'startingPositionProperty' ),
      phetioType: PropertyIO( Vector2IO )
    } );

    // @public {number} - Returns to this parametric position along the track when pressing "return skater"
    this.startingUProperty = new Property( 0, {
      tandem: tandem.createTandem( 'startingUProperty' ),
      phetioType: PropertyIO( NullableIO( NumberIO ) )
    } );

    // @private {boolean} - Tracks whether or not the skater is above or below the track when it is released
    this.startingUpProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'startingUpProperty' )
    } );

    // @public {Track} - Returns to this track when pressing "return skater"
    this.startingTrackProperty = new Property( null );

    // @public {Vector2} - Position of the skater's head, for positioning the pie chart.
    // TODO: Could this be a derived Property?
    this.headPositionProperty = new Property( new Vector2( 0, 0 ), {
      tandem: tandem.createTandem( 'headPositionProperty' ),
      phetioType: PropertyIO( Vector2IO ),
      phetioReadOnly: true
    } );

    // @public
    this.updatedEmitter = new Emitter();
    this.energyChangedEmitter = new Emitter();
    this.resetEmitter = new Emitter();

    // @public {number}
    this.speedProperty = new DerivedProperty( [ this.velocityProperty ], function( velocity ) {
      return velocity.magnitude();
    }, {
      tandem: tandem.createTandem( 'speedProperty' ),
      units: 'meters/second',
      phetioType: DerivedPropertyIO( NumberIO )
    } );

    // Derived - Zero the kinetic energy when draggingDerived, see #22
    this.draggingProperty.link( function( dragging ) {
      if ( dragging ) {
        self.velocityProperty.value = new Vector2( 0, 0 );
      }
    } );

    this.parametricSpeedProperty.link( function( parametricSpeed ) {

      // Require the skater to overcome a speed threshold so he won't toggle back and forth rapidly at the bottom of a
      // well with friction, see #51
      var speedThreshold = 0.01;

      if ( parametricSpeed > speedThreshold ) {
        self.directionProperty.value = self.onTopSideOfTrackProperty.value ? 'right' : 'left';
      }
      else if ( parametricSpeed < -speedThreshold ) {
        self.directionProperty.value = self.onTopSideOfTrackProperty.value ? 'left' : 'right';
      }
      else {
        // Keep the same direction
      }
    } );

    // @public - Boolean flag that indicates whether the skater has moved from his initial position, and hence can be 'returned',
    // For making the 'return skater' button enabled/disabled
    // If this is a performance concern, perhaps it could just be dropped as a feature
    this.movedProperty = new DerivedProperty( [ this.positionProperty, this.startingPositionProperty, this.draggingProperty ],
      function( x, x0, dragging ) {
        return !dragging && ( x.x !== x0.x || x.y !== x0.y );
      }, {
        tandem: tandem.createTandem( 'movedProperty' ),
        phetioType: DerivedPropertyIO( BooleanIO )
      } );

    this.massProperty.link( function() { self.updateEnergy(); } );

    this.updateEnergy();

    this.updatedEmitter.addListener( function() {
      self.updateHeadPosition();
    } );

    // In the state wrapper, when the state changes, we must update the skater node
    phet.phetIo && phet.phetIo.phetioEngine.setStateEmitter && phet.phetIo.phetioEngine.setStateEmitter.addListener( function() {
      self.updatedEmitter.emit();
    } );
  }

  energySkateParkBasics.register( 'Skater', Skater );

  return inherit( Object, Skater, {

    // Get the vector from feet to head, so that when tracks are joined we can make sure he is still pointing up
    get upVector() { return this.headPositionProperty.value.minus( this.positionProperty.value ); },

    /**
     * Zero the thermal energy, and update energy distribution accordingly.
     * @public
     */
    clearThermal: function() {
      this.thermalEnergyProperty.value = 0.0;
      this.updateEnergy();
    },

    /**
     * Fully reset this skater.
     * @public
     */
    reset: function() {

      // set the angle to zero first so that the optimization for SkaterNode.updatePosition is maintained,
      // without showing the skater at the wrong angle
      this.angleProperty.value = 0;
      this.trackProperty.reset();
      this.parametricPositionProperty.reset();
      this.parametricSpeedProperty.reset();
      this.onTopSideOfTrackProperty.reset();
      this.gravityProperty.reset();
      this.positionProperty.reset();
      this.massProperty.reset();
      this.directionProperty.reset();
      this.velocityProperty.reset();
      this.draggingProperty.reset();
      this.kineticEnergyProperty.reset();
      this.potentialEnergyProperty.reset();
      this.thermalEnergyProperty.reset();
      this.totalEnergyProperty.reset();
      this.angleProperty.reset();
      this.startingPositionProperty.reset();
      this.startingUProperty.reset();
      this.startingUpProperty.reset();
      this.startingTrackProperty.reset();
      this.headPositionProperty.reset();
      this.updateEnergy();

      // Notify the graphics to re-render.  See #223
      this.updatedEmitter.emit();

      // emit reset has completed so we can interrupt input handlers, see #429
      this.resetEmitter.emit();
    },

    /**
     * Move the skater to her initial position, but leave the friction and mass the same, see #237
     * @public
     */
    resetPosition: function() {
      // set the angle to zero first so that the optimization for SkaterNode.updatePosition is maintained, without
      // showing the skater at the wrong angle
      this.angleProperty.value = 0;
      var mass = this.massProperty.value;

      // TODO: avoid duplication
      this.trackProperty.reset();
      this.parametricPositionProperty.reset();
      this.parametricSpeedProperty.reset();
      this.onTopSideOfTrackProperty.reset();
      this.gravityProperty.reset();
      this.positionProperty.reset();
      this.massProperty.reset();
      this.directionProperty.reset();
      this.velocityProperty.reset();
      this.draggingProperty.reset();
      this.kineticEnergyProperty.reset();
      this.potentialEnergyProperty.reset();
      this.thermalEnergyProperty.reset();
      this.totalEnergyProperty.reset();
      this.angleProperty.reset();
      this.startingPositionProperty.reset();
      this.startingUProperty.reset();
      this.startingUpProperty.reset();
      this.startingTrackProperty.reset();
      this.headPositionProperty.reset();
      this.massProperty.value = mass;
      this.updateEnergy();

      // Notify the graphics to re-render.  See #223
      this.updatedEmitter.emit();
    },

    /**
     * When the scene (track) is changed, the skater's position & velocity reset, but the mass and other properties
     * do not reset, see #179
     * @public
     */
    returnToInitialPosition: function() {

      // Everything needs to be reset except the mass, see #188
      var mass = this.massProperty.value;
      this.reset();
      this.massProperty.value = mass;
    },

    /**
     * Return the skater to the last location it was released by the user (or its starting location), including the
     * position on a track (if any).
     * @public
     */
    returnSkater: function() {

      // If the user is on the same track as where he began (and the track hasn't changed), remain on the track,
      // see #143 and #144
      if ( this.startingTrackProperty.value && this.trackProperty.value === this.startingTrackProperty.value && arrayEquals( this.trackProperty.value.copyControlPointSources(), this.startingTrackControlPointSources ) ) {
        this.parametricPositionProperty.value = this.startingUProperty.value;
        this.angleProperty.value = this.startingAngle;
        this.onTopSideOfTrackProperty.value = this.startingUpProperty.value;
        this.parametricSpeedProperty.value = 0;
      }
      else {
        this.trackProperty.value = null;
        this.angleProperty.value = this.startingAngle;
      }
      this.positionProperty.set( this.startingPositionProperty.value.copy() );
      this.velocityProperty.value = new Vector2( 0, 0 );
      this.clearThermal();
      this.updateEnergy();
      this.updatedEmitter.emit();
    },

    /**
     * Update the energies as a batch. This is an explicit method instead of linked to all dependencies so that it can
     * be called in a controlled fashion when multiple dependencies have changed, for performance.
     * @public
     */
    updateEnergy: function() {
      this.kineticEnergyProperty.value = 0.5 * this.massProperty.value * this.velocityProperty.value.magnitudeSquared();
      this.potentialEnergyProperty.value = -this.massProperty.value * this.positionProperty.value.y * this.gravityProperty.value;
      this.totalEnergyProperty.value = this.kineticEnergyProperty.value + this.potentialEnergyProperty.value + this.thermalEnergyProperty.value;

      // Signal that energies have changed for coarse-grained listeners like PieChartNode that should not get updated
      // 3-4 times per times step
      this.energyChangedEmitter.emit();
    },

    /**
     * Update the head position for showing the pie chart. Doesn't depend on "up" because it already depends on the
     * angle of the skater. Would be better if headPosition were a derived property, but created too many allocations,
     * see #50
     *
     * @private
     */
    updateHeadPosition: function() {

      // Center pie chart over skater's head not his feet so it doesn't look awkward when skating in a parabola
      // Note this has been tuned independently of SkaterNode.massToScale, which also accounts for the image dimensions
      var skaterHeight = Util.linear( Constants.MIN_MASS, Constants.MAX_MASS, 1.65, 2.4, this.massProperty.value );

      var vectorX = skaterHeight * Math.cos( this.angleProperty.value - Math.PI / 2 );
      var vectorY = skaterHeight * Math.sin( this.angleProperty.value - Math.PI / 2 );

      // Manually trigger notifications to avoid allocations, see #50
      this.headPositionProperty.value.x = this.positionProperty.value.x + vectorX;
      this.headPositionProperty.value.y = this.positionProperty.value.y - vectorY;
      this.headPositionProperty.notifyListenersStatic();
    },

    /**
     * If the skater is released, store the initial conditions for when the skater is returned.
     * @param targetTrack The track to start on (if any)
     * @param targetU The parametric location along the track to start on (if any)
     */
    released: function( targetTrack, targetU ) {
      this.draggingProperty.value = false;
      this.velocityProperty.value = new Vector2( 0, 0 );
      this.parametricSpeedProperty.value = 0;
      this.trackProperty.value = targetTrack;
      this.parametricPositionProperty.value = targetU;
      if ( targetTrack ) {
        this.positionProperty.value = targetTrack.getPoint( this.parametricPositionProperty.value );
      }
      this.startingPositionProperty.value = this.positionProperty.value.copy();
      this.startingUProperty.value = targetU;
      this.startingUpProperty.value = this.onTopSideOfTrackProperty.value;
      this.startingTrackProperty.value = targetTrack;

      // Record the starting track control points to make sure the track hasn't changed during return this.
      this.startingTrackControlPointSources = targetTrack ? targetTrack.copyControlPointSources() : [];
      this.startingAngle = this.angleProperty.value;

      // Update the energy on skater release so it won't try to move to a different height to make up for the delta
      this.updateEnergy();
      this.updatedEmitter.emit();
    }
  } );
} );
