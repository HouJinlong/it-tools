import { Flex } from 'antd';
import * as Component from './component';
import { useGlobalStore } from './context';


export const Gif = () => {
  const { canvas, setCanvas } = useGlobalStore();
  return (
    <Flex vertical style={{ height: 'calc(100vh - 20px)',  overflow:'hidden' }}>
      <Flex
        style={{
          flex: '1',
          overflow:'hidden'
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow:'hidden',
            position:'relative'
          }}
        >
          <Component.Edit setCanvas={setCanvas} />
          <div
            style={{
                position:'absolute',
                bottom:0,
                right:'10px',
            }}
          >
            <Component.Bottom />
          </div>
        </div>
        <div
          style={{
            width: '265px',
            height:'100%',
            background: '#fff',
            flexShrink: 0,
          }}
        >
          {canvas && <Component.Right />}
        </div>
      </Flex>
    </Flex>
  );
};
