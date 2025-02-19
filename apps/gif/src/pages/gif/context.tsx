import { create } from 'zustand';
import type * as fabric from 'fabric';

interface IDataItem {
  src?: string;
  json?: any;
}

export type GlobalStore = {
  data: IDataItem[];
  index: number;
  addData: (img?: IDataItem) => void;
  updateIndex: (i: number) => void;
  canvas?: fabric.Canvas;
  setCanvas: (canvas: fabric.Canvas) => void;
  activeObjects: fabric.FabricObject[];
  setActiveObjects: (activeObjects: fabric.FabricObject[]) => void;
};

const SaveData = (state: GlobalStore) => {
  const temp = [...state.data];
  temp[state.index] = {
    ...temp[state.index],
    src: state.canvas?.getObjects().length ? state.canvas?.toDataURL() : null,
    json: state.canvas?.toDatalessJSON(['id', 'name','selectable']),
  };
  return temp;
};
export const useGlobalStore = create<GlobalStore>()((set) => ({
  // 画布切换
  data: [{
    "json": {"version":"6.5.4","objects":[{"fontSize":80,"fontWeight":"normal","fontFamily":"包图小白体","fontStyle":"normal","lineHeight":1.16,"text":"标题文字","charSpacing":0,"textAlign":"left","styles":[],"path":null,"pathStartOffset":0,"pathSide":"left","pathAlign":"baseline","underline":false,"overline":false,"linethrough":false,"textBackgroundColor":"","direction":"ltr","minWidth":20,"splitByGrapheme":true,"id":"4d63b037-02ff-4843-acb9-d77443d79ebb","selectable":true,"type":"Textbox","version":"6.5.4","originX":"left","originY":"top","left":116.8401,"top":166.9305,"width":400,"height":90.4,"fill":"#000000FF","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":"","visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"stroke","globalCompositeOperation":"source-over","skewX":0,"skewY":0}]}
}],
  index: 0,
  addCloneData: () => {
    set((state) => {
      const temp = SaveData(state);
      return { data: [...temp, temp[temp.length - 1]], index: temp.length };
    });
  },
  updateIndex: (i) => {
    set((state) => {
      return { data: SaveData(state), index: i };
    });
  },
  // 画布
  setCanvas: (canvas) => set((state) => ({ canvas })),
  activeObjects: [],
  setActiveObjects: (activeObjects) =>
    set((state) => ({ activeObjects: activeObjects || [] })),
}));
