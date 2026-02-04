// Copyright 2026, University of Colorado Boulder

/**
 * Dynamic icon for the Playground screen, dependent on the character preferences.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Matrix3 from '../../../../dot/js/Matrix3.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import SkaterImageSet from '../../../../energy-skate-park/js/common/view/SkaterImageSet.js';
import playgroundScreenIcon_png from '../../../images/playgroundScreenIcon_png.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';

export default class PlaygroundScreenIcon extends ScreenIcon {

  public constructor() {

    const background = new Image( playgroundScreenIcon_png );

    const skaterImage = new Image( SkaterImageSet.SKATER_IMAGE_SETS[ 6 ].rightImageProperty );

    // Transform skaterImage to the desired position.
    skaterImage.localBoundsProperty.link( () => {
      skaterImage.setMatrix( Matrix3.identity() );
      const transformMatrix = Matrix3.translation( 375, 110 ); // point in playgroundScreenIcon_png
      transformMatrix.multiplyMatrix( Matrix3.rotation2( -2 * Math.PI / 3 ) );
      transformMatrix.multiplyMatrix( Matrix3.scaling( 0.5 ) );
      transformMatrix.multiplyMatrix( Matrix3.translation( -skaterImage.width / 2, -skaterImage.height ) );
      skaterImage.setMatrix( transformMatrix );
    } );

    const iconNode = new Node( {
      children: [ background, skaterImage ]
    } );

    super( iconNode, {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1
    } );
  }
}

energySkateParkBasics.register( 'PlaygroundScreenIcon', PlaygroundScreenIcon );
