// Copyright 2018-2020, University of Colorado Boulder

/**
 * The "Intro" screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import iconIntroHomescreen from '../../../../energy-skate-park/images/icon-intro-homescreen_png.js';
import iconIntroNavbar from '../../../../energy-skate-park/images/icon-intro-navbar_png.js';
import Screen from '../../../../joist/js/Screen.js';
import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import energySkateParkBasicsStrings from '../../energySkateParkBasicsStrings.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

const screenIntroductionString = energySkateParkBasicsStrings.screen.introduction;

/**
 * @param {Tandem} tandem
 * @constructor
 */
class IntroScreen extends Screen {
  constructor( tandem, options ) {
    options = merge( {
      name: screenIntroductionString,
      tandem: tandem,
      homeScreenIcon: new Image( iconIntroHomescreen ),
      navigationBarIcon: new Image( iconIntroNavbar )
    }, options );

    super(
      () => new IntroModel( tandem.createTandem( 'model' ) ),
      model => new IntroScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

energySkateParkBasics.register( 'IntroScreen', IntroScreen );
export default IntroScreen;