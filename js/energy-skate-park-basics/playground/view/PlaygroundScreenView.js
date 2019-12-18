// Copyright 2018-2019, University of Colorado Boulder

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
  const FrictionSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/FrictionSlider' );
  const EnergyBarGraphPanel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/common/view/EnergyBarGraphPanel' );
  const MassSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/MassSlider' );
  const Range = require( 'DOT/Range' );
  const Vector2 = require( 'DOT/Vector2' );

  class PlaygroundScreenView extends EnergySkateParkPlaygroundScreenView {

    /**
     * @param   {EnergySkateParkPlaygroundModel} model
     * @param   {Tandem} tandem
     */
    constructor( model, tandem ) {
      const playgroundControls = [
        new MassSlider( model.skater.massProperty, model.skater.massRange, tandem.createTandem( 'massSlider' ) ),
        new FrictionSlider( model.frictionProperty, tandem.createTandem( 'frictionSlider' ) )
      ];
      super( model, playgroundControls, tandem.createTandem( 'graphsScreenView' ), {
        showTrackButtons: false,
        showReferenceHeight: false,
        showToolbox: false,
        showBarGraphZoomButtons: false,
        showAttachDetachRadioButtons: true,
        showSeparateVisibilityControlsPanel: false,
        visibilityControlsOptions: {
          showGridCheckbox: true,
          showBarGraphCheckbox: true
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
     * @param {number} width
     * @param {number} height
     */
    layout( width, height ) {
      super.layout( width, height );
      this.barGraphPanel.leftTop = new Vector2( this.fixedLeft, 5 );
    }
  }

  return energySkateParkBasics.register( 'PlaygroundScreenView', PlaygroundScreenView );

} );