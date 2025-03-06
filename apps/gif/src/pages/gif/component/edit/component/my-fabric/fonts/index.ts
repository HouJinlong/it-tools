import { useEffect } from 'react';
import { fonts } from './downloads';
import FontFaceObserver from 'fontfaceobserver';

import * as fabric from 'fabric';

declare module 'fabric' {
  interface Canvas {
    loadFont: (data: { fontFamily?: string }) => Promise;
    MyLoadFromJSON: fabric.Canvas['loadFromJSON'];
    MyAdd: (...objects: FabricObject[]) => Promise;
    MyGetObjects:fabric.Canvas['getObjects'];
  }
}

fabric.Canvas.prototype.MyGetObjects =function (...ids) {
  const allObjects = [];
  function traverseObjects(objects) {
    objects.forEach(obj => {
      if(ids.includes(obj.id)){
        allObjects.push(obj);
      }
      if (obj instanceof fabric.Group) {
        traverseObjects(obj.getObjects());
      }
    });
  }
  traverseObjects(this.getObjects());
  return allObjects;
};

fabric.Canvas.prototype.MyLoadFromJSON = async function (...data) {
  return this.loadFromJSON(...data).then(()=>{
    return Promise.all(
      this.MyGetObjects().map((item) => {
        return this.loadFont(item);
      })
    );
  });
};

fabric.Canvas.prototype.MyAdd = async function (...data) {
  await Promise.all(
    data.map((item) => {
      return this.loadFont(item);
    })
  );
  this.add(...data);
  this.setActiveObject(data[0])
  // this.setActiveObject(
  //   new fabric.ActiveSelection(data, { canvas: this })
  // );
  return data;
};

// 加载字体
const skipFonts = ['arial'];
fabric.Canvas.prototype.loadFont = function ({ fontFamily }) {
  if (fontFamily && !skipFonts.includes(fontFamily)) {
    return new FontFaceObserver(fontFamily).load(null, 150000);
  } else {
    return Promise.resolve();
  }
};

export const isText = (type: string) => {
  return ['textbox','i-text'].includes(type.toLocaleLowerCase());
};
export const createFontCSS = (
  arr: Array<{
    name: string;
    file: string;
  }>
) => {
  let code = '';
  arr.forEach((item) => {
    code =
      code +
      `
    @font-face {
      font-family: ${item.name};
      src: url('${item.file}');
    }
    `;
  });
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(code));
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(style);
  return () => {
    head.removeChild(style);
  };
};

export const useFonts = () => {
  useEffect(() => {
    return createFontCSS(fonts);
  }, []);
};
