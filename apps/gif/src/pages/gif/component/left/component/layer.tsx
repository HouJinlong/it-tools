import { List, Tag } from 'antd';
import { useGlobalStore } from '../../../context';
import { useEffect, useState } from 'react';
export const Layer = () => {
  const ctx = useGlobalStore().canvas!;
  const [list, setList] = useState<{
    id: string;
    type: string;
    text: string;
    isLock: boolean;
  }>([]);
  useEffect(() => {
    const fn = () => {
      const data = ctx
        .getObjects()
        .reverse()
        .map((v) => {
          return {
            id: v.id,
            type: v.type,
            name: v.name,
            text: v.text,
            isLock: !v.selectable,
          };
        });
      setList(data);
    };
    fn();
    ctx.on('after:render', fn);
  }, [ctx]);

  return (
    <List
      header={<div>图层</div>}
      footer={<div></div>}
      size="small"
      dataSource={list}
      renderItem={(item) => (
        <List.Item
          key={item.id}
          style={{
            fontSize: '10px',
            cursor: 'pointer',
            paddingLeft:'4px'
          }}
          onClick={() => {
            const temp = ctx.getObjects().filter((v) => v.id === item.id);
            console.log('temp: ', temp);
            ctx.setActiveObject(temp[0])
            ctx.requestRenderAll()
          }}
        >
          <Tag
            color="#108ee9"
            style={{
              fontSize: '10px',
              lineHeight: 1,
              padding: '2px',
              marginRight: '2px',
            }}
            size="small"
          >
            {item.type}
          </Tag>{' '}
          {item.text || item.name}
        </List.Item>
      )}
    />
  );
};
