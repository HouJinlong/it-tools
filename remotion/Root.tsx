import React from 'react';
import {Composition} from 'remotion';
import {MyComposition} from './Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyComposition"
      durationInFrames={10}
      fps={30}
      width={800}
      height={800}
      component={MyComposition}
      defaultProps={{
        propOne: 'Hi',
        propTwo: 10,
      }}
    />
  );
};