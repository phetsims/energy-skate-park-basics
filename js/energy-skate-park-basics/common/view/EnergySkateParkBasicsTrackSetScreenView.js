// Copyright 2019, University of Colorado Boulder

/**
 * TODO: Type Documentation
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const EnergyBarGraphPanel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/common/view/EnergyBarGraphPanel' );
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const EnergySkateParkTrackSetScreenView = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/EnergySkateParkTrackSetScreenView' );
  const merge = require( 'PHET_CORE/merge' );
  const Range = require( 'DOT/Range' );
  const Vector2 = require( 'DOT/Vector2' );

  class EnergySkateParkBasicsTrackSetScreenView extends EnergySkateParkTrackSetScreenView {

    /**
     * @param {EnergySkateParkTrackSetModel} model
     * @param {Array.<PhysicalNumberControl|PhysicalComboBox} controls
     * @param {Tandem} tandem
     * @param {Object} options
     */
    constructor( model, controls, tandem, options ) {
      options = merge( {
        showToolbox: false,
        showReferenceHeight: false,
        showSeparateVisibilityControlsPanel: false,
        visibilityControlsOptions: {
          showGridCheckbox: true,
          showBarGraphCheckbox: true
        },

        // energy-skate-park-basics uses its own panel for the graph
        showBarGraph: false
      }, options );

      super( model, controls, tandem, options );

      this.barGraphPanel = new EnergyBarGraphPanel( model, tandem.createTandem( 'barGraphPanel' ), {
        barGraphOptions: {
          showBarGraphZoomButtons: false,
          graphRange: new Range( 0, 265 )
        }
      } );
      this.addChild( this.barGraphPanel );
      model.barGraphVisibleProperty.linkAttribute( this.barGraphPanel, 'visible' );
    }

    /**
     * Special layout for the basics screen view, positions the bar graph panel.
     * @override
     */
    floatInterface() {
      super.floatInterface();
      this.barGraphPanel.leftTop = new Vector2( this.fixedLeft, 5 );
    }
  }

  return energySkateParkBasics.register( 'EnergySkateParkBasicsTrackSetScreenView', EnergySkateParkBasicsTrackSetScreenView );
} );
