// Copyright 2026, University of Colorado Boulder

/**
 * Dynamic icon for the Friction screen, dependent on the character preferences.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Matrix3 from '../../../../dot/js/Matrix3.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import SkaterImageSet from '../../../../energy-skate-park/js/common/view/SkaterImageSet.js';
import frictionScreenIcon_png from '../../../images/frictionScreenIcon_png.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';

export default class FrictionScreenIcon extends ScreenIcon {

  public constructor() {

    const background = new Image( frictionScreenIcon_png );

    const skaterImage = new Image( SkaterImageSet.SKATER_IMAGE_SETS[ 1 ].rightImageProperty );

    // Transform skaterImage to the desired position.
    skaterImage.localBoundsProperty.link( () => {
      skaterImage.setMatrix( Matrix3.identity() );
      const transformMatrix = Matrix3.translation( 150, 220 ); // point in frictionScreenIcon_png
      transformMatrix.multiplyMatrix( Matrix3.rotation2( 1 ) );
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

energySkateParkBasics.register( 'FrictionScreenIcon', FrictionScreenIcon );
