import { Flex } from 'antd';
import * as Component from './component';
import { useGlobalStore } from './context';


export const Gif = () => {
  const { canvas, setCanvas } = useGlobalStore();
  return (
    <Flex vertical style={{ height: '100%' }}>
      <Flex
        style={{
          flex: '1',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            width: '300px',
            background: '#fff',
            flexShrink: 0,
          }}
        >
          {canvas && <Component.Left />}
        </div>
        <div
          style={{
            flex: '1',
            background: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow:'hidden',
            position:'relative'
          }}
        >
          <Component.Edit setCanvas={setCanvas} />
        </div>
        <div
          style={{
            width: '200px',
            background: '#fff',
            flexShrink: 0,
          }}
        >
          {canvas && <Component.Right />}
        </div>
      </Flex>
      <div
        style={{
          height: '100px',
          background: '#fff',
        }}
      >
        <Component.Bottom />
      </div>
    </Flex>
  );
};
