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
  removeData:() => void;
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
      json: {},
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
  removeData:()=>{
    set((state) => {
      return {
        data:state.data.filter((v,i)=>{
          return i!==state.index
        }),
        index:0,
      };
    })
  },
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
