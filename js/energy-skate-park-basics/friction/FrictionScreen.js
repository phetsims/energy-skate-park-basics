// Copyright 2018-2020, University of Colorado Boulder

/**
 * The "Friction" screen of Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import iconFrictionHomescreen from '../../../../energy-skate-park/images/icon-friction-homescreen_png.js';
import iconFrictionNavbar from '../../../../energy-skate-park/images/icon-friction-navbar_png.js';
import Screen from '../../../../joist/js/Screen.js';
import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import energySkateParkBasicsStrings from '../../energySkateParkBasicsStrings.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';
import FrictionModel from './model/FrictionModel.js';
import FrictionScreenView from './view/FrictionScreenView.js';

const screenFrictionString = energySkateParkBasicsStrings.screen.friction;

/**
 * @param {Tandem} tandem
 * @constructor
 */
class FrictionScreen extends Screen {

  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( tandem, options ) {
    options = merge( {
      name: screenFrictionString,
      homeScreenIcon: new Image( iconFrictionHomescreen ),
      navigationBarIcon: new Image( iconFrictionNavbar ),

      tandem: tandem
    }, options );

    super(
      () => new FrictionModel( tandem.createTandem( 'model' ) ),
      model => new FrictionScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

energySkateParkBasics.register( 'FrictionScreen', FrictionScreen );
export default FrictionScreen;