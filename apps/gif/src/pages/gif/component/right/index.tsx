import { useGlobalStore } from '../../context';
import * as Component from './component';
export const Right = () => {
  const { activeObjects } = useGlobalStore();
  const temp = {
    active: activeObjects.length !== 0,
    one: activeObjects.length === 1,
  };
  return (
    <div>
      {temp.active ? <Component.Operation />:<Component.FabricSetting />}
      {temp.one && <Component.Setting />}
    </div>
  );
};
