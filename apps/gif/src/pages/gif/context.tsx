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
    json: state.canvas?.toDatalessJSON(['id', 'name']),
  };
  return temp;
};
export const useGlobalStore = create<GlobalStore>()((set) => ({
  // 画布切换
  data: [{}],
  index: 0,
  addData: (data) => {
    set((state) => {
      const temp = [...SaveData(state), data || {}];
      return { data: temp, index: temp.length - 1 };
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
    set((state) => ({ activeObjects: activeObjects|| [] })),
}));
