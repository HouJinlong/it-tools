import { useEffect } from 'react';
import { useGlobalStore } from '../../../context';
export const useSelection = () => {
  const { canvas, setActiveObjects } = useGlobalStore();
  useEffect(() => {
    if (canvas) {
      const fn = () => {
        const actives = canvas.getActiveObjects();
        // if (actives[0]) {
        // //   actives[0].set({ text: '111' });
        //   canvas.renderAll();
        // }
      };
      canvas.on('selection:created', fn);
      canvas.on('selection:updated', fn);
      canvas.on('selection:cleared', fn);
    }
  }, [canvas]);
};
