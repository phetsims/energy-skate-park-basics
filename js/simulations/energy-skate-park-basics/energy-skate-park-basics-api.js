// Copyright 2015-2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
(function() {
  'use strict';

  var TVector2 = require( 'PHET_IO/types/dot/TVector2' );

  var PhETIOCommon = phetio.PhETIOCommon;
  var TArray = require( 'PHET_IO/types/TArray' );
  var TNumber = require( 'PHET_IO/types/TNumber' );
  var TProperty = require( 'PHET_IO/types/axon/TProperty' );

  phetio.api = PhETIOCommon.createAPI( {
    energySkateParkBasics: PhETIOCommon.createSim( {
        introScreen: {
          scene: TProperty( TNumber )
        },
        frictionScreen: {
          scene: TProperty( TNumber )
        },
        playgroundScreen: {
          tracks: TArray( TArray( TVector2 ) )
          // New components in the playground screen
          //'playgroundScreen.frictionSlider': THSlider,
          //'playgroundScreen.attachRadioButton': TRadioButton,
          //'playgroundScreen.detachRadioButton': TRadioButton,
          //'playgroundScreen.clearTracksButton': TButton,
          //'playgroundScreen.tracks': TArray( TArray( TVector2 ) )
        }
      }
    )
  } );
})();