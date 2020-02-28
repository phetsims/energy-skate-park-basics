// Copyright 2018-2020, University of Colorado Boulder

/**
 * The "Playground" screen of Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import iconPlaygroundHomescreen from '../../../../energy-skate-park/images/icon-playground-homescreen_png.js';
import iconPlaygroundNavbar from '../../../../energy-skate-park/images/icon-playground-navbar_png.js';
import Screen from '../../../../joist/js/Screen.js';
import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import energySkateParkBasicsStrings from '../../energy-skate-park-basics-strings.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';
import PlaygroundModel from './model/PlaygroundModel.js';
import PlaygroundScreenView from './view/PlaygroundScreenView.js';

const screenTrackPlaygroundString = energySkateParkBasicsStrings.screen.trackPlayground;

class PlaygroundScreen extends Screen {
  constructor( tandem, options ) {
    options = merge( {
      name: screenTrackPlaygroundString,
      homeScreenIcon: new Image( iconPlaygroundHomescreen ),
      navigationBarIcon: new Image( iconPlaygroundNavbar ),

      tandem: tandem
    }, options );

    super(
      () => new PlaygroundModel( tandem.createTandem( 'model' ) ),
      model => new PlaygroundScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

energySkateParkBasics.register( 'PlaygroundScreen', PlaygroundScreen );
export default PlaygroundScreen;