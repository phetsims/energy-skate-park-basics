// Copyright 2018-2020, University of Colorado Boulder

/**
 * ScreenView for the Playground screen of Energy Skate Park: Basics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const EnergySkateParkPlaygroundScreenView = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/EnergySkateParkPlaygroundScreenView' );
  const EnergyBarGraphPanel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/common/view/EnergyBarGraphPanel' );
  const Range = require( 'DOT/Range' );
  const Vector2 = require( 'DOT/Vector2' );

  class PlaygroundScreenView extends EnergySkateParkPlaygroundScreenView {

    /**
     * @param   {EnergySkateParkPlaygroundModel} model
     * @param   {Tandem} tandem
     */
    constructor( model, tandem ) {
      super( model, tandem.createTandem( 'graphsScreenView' ), {
        showReferenceHeight: false,
        showToolbox: false,
        showBarGraphZoomButtons: false,
        showAttachDetachRadioButtons: true,
        showSeparateVisibilityControlsPanel: false,
        controlPanelOptions: {
          showTrackButtons: false,
          showGravityControls: false,
          visibilityControlsOptions: {
            showGridCheckbox: true,
            showBarGraphCheckbox: true
          }
        },

        // energy-skate-park-basics uses its own bar graph in a panel
        showBarGraph: false
      } );

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
     */
    floatInterface() {
      super.floatInterface();
      this.barGraphPanel.leftTop = new Vector2( this.fixedLeft, 5 );
    }
  }

  return energySkateParkBasics.register( 'PlaygroundScreenView', PlaygroundScreenView );

} );