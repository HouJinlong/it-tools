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
  addCloneData: () => void;
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
      json: {
        version: '6.5.4',
        objects: [
          {
            rx: 0,
            ry: 0,
            id: '95237aa7-03a7-4528-8074-dc8d6de1e8e9',
            selectable: true,
            fill_data:
              'linear-gradient(90deg, RGBA(255,235,60,1) 0%, rgba(142,36,170,1) 100%)',
            type: 'Rect',
            version: '6.5.4',
            originX: 'left',
            originY: 'top',
            left: 100.8113,
            top: 200.226,
            width: 400,
            height: 400,
            fill: {
              type: 'linear',
              coords: { x1: 0, y1: 200, x2: 400, y2: 200 },
              colorStops: [
                { color: 'RGBA(255,235,60,1)', offset: 0 },
                { color: 'rgba(142,36,170,1)', offset: 1 },
              ],
              offsetX: 0,
              offsetY: 0,
              gradientUnits: 'pixels',
            },
            stroke: null,
            strokeWidth: 1,
            strokeDashArray: null,
            strokeLineCap: 'butt',
            strokeDashOffset: 0,
            strokeLineJoin: 'miter',
            strokeUniform: false,
            strokeMiterLimit: 4,
            scaleX: 1,
            scaleY: 1,
            angle: 0,
            flipX: false,
            flipY: false,
            opacity: 1,
            shadow: '',
            visible: true,
            backgroundColor: '',
            fillRule: 'nonzero',
            paintFirst: 'fill',
            globalCompositeOperation: 'source-over',
            skewX: 0,
            skewY: 0,
          },
        ],
      },
    },
  ],
  index: 0,
  saveData: () => set((state) => ({ data: SaveData(state) })),
  addCloneData: () =>
    set((state) => {
      const temp = updateDataAndIndex(state, state.data.length);
      return {
        ...temp,
        data: [...temp.data, temp.data[temp.data.length - 1]],
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
