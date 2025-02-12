import React, { useRef, useEffect, useState } from 'react';
import * as fabric from 'fabric';

import { useGlobalStore, GlobalStore } from '../../context';
import { useSelection } from './hooks';
import demo from './demo.json';
export const Edit = (props: GlobalStore) => {
  const canvasRef = useRef(null);
  const { data,index,updateCur, canvas, setCanvas } = useGlobalStore();
  useSelection();

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      // backgroundColor
      // 设置画布背景色
    });

    setCanvas(newCanvas);
    newCanvas.setZoom(0.5)
    newCanvas.loadFromJSON(data[index].json||{}).then(() => {
      newCanvas.renderAll();
    });
    return () => {
      newCanvas.dispose(); // 组件卸载时销毁画布
    };
  }, [index]);
  return (
    <div
      style={{
        width: '400px',
        height: '400px',
        // backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='19' height='19'%3E%3Cpath d='M0 0h19v19' fill='none' stroke='rgba(0,0,0,0.1)' stroke-width='1'/%3E%3C/svg%3E")`,
      }}
    >
      <canvas ref={canvasRef} width={800} height={800} />
    </div>
  );
};
