import { useGlobalStore } from '../../context';
import * as Component from './component';
export const Right = () => {
  const { activeObjectIds,data } = useGlobalStore();
  const temp = {
    active: activeObjectIds.length !== 0,
    one: activeObjectIds.length === 1,
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
