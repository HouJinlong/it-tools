import { create } from 'zustand';
import * as fabric from 'fabric';
import { useMemo } from 'react';
interface IDataItem {
  src?: string;
  delay: number;
  json?: any;
}

export type GlobalStore = {
  data: IDataItem[];
  index: number;
  saveData: () => void;
  addData: (clone:boolean) => void;
  updateIndex: (i: number) => void;
  canvas: fabric.Canvas;
  setCanvas: (canvas: fabric.Canvas) => void;
  activeObjectIds: fabric.FabricObject[];
  setActiveObjectIds: (activeObjectIds: string[]) => void;
};

const SaveData = (state: GlobalStore) => {
  const temp = [...state.data];
  temp[state.index] = {
    ...temp[state.index],
    src: state.canvas?.getObjects().length
      ? state.canvas?.toDataURL({ format: 'jpeg' })
      : null,
    json: state.canvas?.toDatalessJSON([
      'id',
      'name',
      'selectable',
      'fill_data',
      'gradientAngle'
    ]),
  };
  return temp;
};

const updateDataAndIndex = (state: GlobalStore, newIndex: number) => {
  const temp = SaveData(state);
  return { data: temp, index: newIndex, activeObjectIds: [] };
};

export const useGlobalStore = create<GlobalStore>()((set) => ({
  // 画布切换
  data: [
    {
      json: {"version":"6.5.4","objects":[{"fontSize":80,"fontWeight":"normal","fontFamily":"arial","fontStyle":"normal","lineHeight":1.16,"text":"标题文字","charSpacing":0,"textAlign":"left","styles":[],"path":null,"pathStartOffset":0,"pathSide":"left","pathAlign":"baseline","underline":false,"overline":false,"linethrough":false,"textBackgroundColor":"","direction":"ltr","minWidth":20,"splitByGrapheme":true,"id":"7a6e5e96-13f3-4c66-9ee8-c595bfe8faff","selectable":true,"type":"Textbox","version":"6.5.4","originX":"left","originY":"top","left":49.5,"top":80.3504,"width":400,"height":90.4,"fill":"#000000FF","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":"","visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"stroke","globalCompositeOperation":"source-over","skewX":0,"skewY":0}]},
    },
  ],
  index: 0,
  saveData: () => set((state) => ({ data: SaveData(state) })),
  addData: (clone=true) =>
    set((state) => {
      const temp = updateDataAndIndex(state, state.data.length);
      return {
        ...temp,
        data: [...temp.data, 
          clone?temp.data[state.index]:{}
        ],
      };
    }),
  updateIndex: (i) => set((state) => updateDataAndIndex(state, i)),
  // 画布
  setCanvas: (canvas) => set(() => ({ canvas })),
  activeObjectIds: [],
  setActiveObjectIds: (activeObjectIds) =>
    set(() => ({ activeObjectIds: activeObjectIds || [] })),
}));

export const useActiveObjects = () => {
  const { canvas, activeObjectIds } = useGlobalStore();
  return useMemo(() => {
    return canvas.MyGetObjects(...activeObjectIds);
  }, [activeObjectIds]);
};
