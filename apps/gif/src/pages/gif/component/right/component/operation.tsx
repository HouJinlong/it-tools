import { Divider, Row, Col, Button } from 'antd';
import {
  UnlockOutlined,
  LockOutlined,
  DeleteOutlined,
  CopyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import * as fabric from 'fabric';
import { useState } from 'react';
import { useGlobalStore } from '../../../context';
import { v4 as uuid } from 'uuid';

import { useMemo } from 'react';
const useOperation = () => {
  const { canvas, activeObjects, setActiveObjects } = useGlobalStore();

  const [_, setForceUpdate] = useState([]);
  return useMemo(() => {
    const isView = activeObjects.find((v) => v.visible);
    return {
      del: () => {
        activeObjects.map((item) => canvas.remove(item));
        canvas.requestRenderAll();
        canvas.discardActiveObject();
      },
      copy: () => {
        const grid = 10;
        canvas.discardActiveObject();
        Promise.all(
          activeObjects.map((item) =>
            item.clone().then((cloned) => {
              console.log('cloned.left: ', cloned.left, cloned);
              cloned.set({
                left: item.left + grid,
                top: item.top + grid,
                evented: true,
                id: uuid(),
              });
              canvas.add(cloned);
              return cloned;
            })
          )
        ).then((res) => {
          canvas.setActiveObject(
            new fabric.ActiveSelection(res, { canvas: canvas })
          );
          canvas.requestRenderAll();
        });
      },
      isView,
      view: () => {
        activeObjects.forEach((v) => {
          v.set('visible', !isView);
        });
        canvas.requestRenderAll();
        setForceUpdate([]);
      },
    };
  }, [activeObjects, _]);
};

export const Operation = () => {
  const temp = useOperation();
  return (
    <>
      <Divider orientation="left">快捷操作</Divider>
      <Row
        gutter={16}
        style={{
          background: '#f6f7f9',
          borderRadius: '4px',
          margin: '4px',
          padding: '4px 0',
        }}
      >
        <Col className="gutter-row" span={6}>
          {/* <Button
            color="default"
            variant="text"
            icon={<UnlockOutlined />}
          ></Button>
        </Col>
        <Col className="gutter-row" span={6}>
          <Button
            color="default"
            variant="text"
            icon={<LockOutlined />}
          ></Button> */}
        </Col>
        <Col className="gutter-row" span={6}>
          <Button
            color="default"
            variant="text"
            icon={<DeleteOutlined />}
            onClick={temp.del}
          ></Button>
        </Col>
        <Col className="gutter-row" span={6}>
          <Button
            color="default"
            variant="text"
            onClick={temp.copy}
            icon={<CopyOutlined />}
          ></Button>
        </Col>
        <Col className="gutter-row" span={6}>
          <Button
            color="default"
            variant="text"
            onClick={temp.view}
            icon={temp.isView ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          ></Button>
        </Col>
      </Row>
    </>
  );
};
