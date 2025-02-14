import React, { useRef, useEffect, useState } from 'react';
import * as fabric from 'fabric';
import { useGlobalStore, GlobalStore } from '../../../../context';
export const MyFabric = (props: GlobalStore) => {
  const canvasRef = useRef(null);
  const { data, index, setCanvas, setActiveObjects } = useGlobalStore();
  useEffect(() => {
    const temp = new fabric.Canvas(canvasRef.current, {
      // fireRightClick: true,
      // stopContextMenu: true,
      controlsAboveOverlay: true,
      imageSmoothingEnabled: false,
      preserveObjectStacking: true,
      backgroundColor:'#fff'
    });
    setCanvas(temp);
    // fix：hiddenTextarea
    temp.on('object:added', (options) => {
      const obj = options.target;
      if (obj instanceof fabric.Textbox || obj instanceof fabric.IText) {
        obj.hiddenTextareaContainer = temp.lowerCanvasEl.parentNode;
      }
    });
    const selection = () => {
      const actives = temp.getActiveObjects();
      setActiveObjects(actives);
    };
    temp.on('selection:created', selection);
    temp.on('selection:updated', selection);
    temp.on('selection:cleared', selection);

    temp.loadFromJSON(data[index].json || {}).then(() => {
      temp.renderAll();
    });
    return () => {
      temp.dispose(); // 组件卸载时销毁画布
    };
  }, [index]);
  return <canvas ref={canvasRef} width={800} height={800} />;
};
