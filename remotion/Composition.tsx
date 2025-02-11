import {
  AbsoluteFill,
  Sequence,
  useVideoConfig,
  useCurrentFrame,
} from 'remotion';

import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';


import React, { useState } from 'react';

const MyComponent = () => {
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64Image = e.target.result;

      const byteCharacters = atob(base64Image.split(',')[1]);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, {
        type: 'image/png', // 根据实际图片类型修改
      });

      const imageUrl = URL.createObjectURL(blob);
      setImageUrl(imageUrl);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {imageUrl && <img src={imageUrl} />}
    </div>
  );
};

const Title: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ opacity, textAlign: 'center', fontSize: '40px' }} onClick={()=>{
      alert(1)
    }}>
      {title}
    </div>
  );
};

type Props = {
  propOne: string;
  propTwo: number;
}
 
export const MyComposition: React.FC<Props> = ({propOne, propTwo}) => {
  console.log('propOne, propTwo: ', propOne, propTwo);
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        fontSize: 80,
      }}
    >
      <MyComponent />
    </AbsoluteFill>
  );
};
