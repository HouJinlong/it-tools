import { Tabs } from 'antd';
import * as Component from './component';

export const Left = (props: GlobalStore) => {
  return (
    <Tabs
      defaultActiveKey="1"
      tabPosition={'left'}
      style={{ height: '100%' }}
      size="small"
      items={[
        {
          key: '1',
          label: '模版',
          children: (
            <div
              style={{ marginLeft: '-12px', padding: '10px', paddingLeft: 0 }}
            >
              <Component.Template />
            </div>
          ),
        },
        {
          key: '2',
          label: '元素',
          children: (
            <div
              style={{ marginLeft: '-12px', padding: '10px', paddingLeft: 0 }}
            >
              <Component.Elements />
            </div>
          ),
        },
        {
          key: '3',
          label: '层级',
          children: (
            <div
              style={{ marginLeft: '-12px', padding: '10px', paddingLeft: 0 }}
            >
              <Component.Layer />
            </div>
          ),
        },
      ]}
    />
  );
};
