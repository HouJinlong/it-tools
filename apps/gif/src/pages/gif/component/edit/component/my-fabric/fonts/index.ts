import { useEffect } from 'react';
import { fonts } from './downloads';
import FontFaceObserver from 'fontfaceobserver';

import * as fabric from 'fabric';

declare module 'fabric' {
  interface Canvas {
    loadFont: (data: { fontFamily?: string }) => Promise;
    MyLoadFromJSON: fabric.Canvas['loadFromJSON'];
    MyAdd: (...objects: FabricObject[]) => Promise;
  }
}

fabric.Canvas.prototype.MyLoadFromJSON = async function (...data) {
  const [json] = data;
  await Promise.all(
    json.objects.map((item) => {
      return this.loadFont(item);
    })
  );
  return this.loadFromJSON(...data);
};

fabric.Canvas.prototype.MyAdd = async function (...data) {
  await Promise.all(
    data.map((item) => {
      return this.loadFont(item);
    })
  );
  this.add(...data);
  this.setActiveObject(
    new fabric.ActiveSelection(data, { canvas: this })
  );
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
  return ['textbox'].includes(type.toLocaleLowerCase());
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
