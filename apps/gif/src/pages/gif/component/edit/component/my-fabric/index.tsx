import React, { useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import {  debounce} from "lodash-es";

import { useGlobalStore, GlobalStore } from '../../../../context';
import { initMyControls } from './my-controls';
import { useFonts } from './fonts';
export const MyFabric = (props: GlobalStore) => {
  const canvasRef = useRef(null);
  const { data, index, setCanvas, setActiveObjectIds,saveData } = useGlobalStore();
  useFonts();
  useEffect(() => {
    const temp = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      imageSmoothingEnabled: false,
      preserveObjectStacking: true,
      backgroundColor: '#fff',
    });
    setCanvas(temp);
    // temp.on("after:render",  debounce(saveData, 100));
    temp.on('object:added', (options) => {
      // fix：hiddenTextarea
      const obj = options.target;
      if (obj instanceof fabric.Textbox || obj instanceof fabric.IText) {
        obj.hiddenTextareaContainer = temp.lowerCanvasEl.parentNode;
        temp.loadFont(obj.fontFamily);
      }
      // 锁定
      const look = !obj.selectable;
      obj.set({
        lockMovementX: look,
        lockMovementY: look,
        lockScalingX: look,
        lockScalingY: look,
        lockRotation: look,
        selectable: !look,
        evented: !look,
      });
    });
    const selection = () => {
      const actives = temp.getActiveObjects();
      setActiveObjectIds(
        actives.map((v) => {
          return v.id;
        })
      );
    };
    temp.on('selection:created', selection);
    temp.on('selection:updated', selection);
    temp.on('selection:cleared', selection);

    initMyControls();
    temp.MyLoadFromJSON(data[index].json || {}).then(() => {
      temp.renderAll();
    });
    return () => {
      temp.dispose(); // 组件卸载时销毁画布
    };
  }, [index]);
  return <canvas ref={canvasRef} width={800} height={800} />;
};
