import { useGlobalStore } from '../../context';
import * as Component from './component';
export const Right = () => {
  const { activeObjects,data } = useGlobalStore();
  console.log('data: ', data);
  const temp = {
    active: activeObjects.length !== 0,
    one: activeObjects.length === 1,
  };
  return (
    <div style={{
        'padding':'0 4px'
    }}>
      {temp.active ? <Component.Operation />:<Component.FabricSetting />}
      {temp.one && <Component.Setting />}
    </div>
  );
};
