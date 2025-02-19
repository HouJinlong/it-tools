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
import { useEffect, useState } from 'react';
import { useGlobalStore } from '../../../context';
import { v4 as uuid } from 'uuid';

import { useMemo } from 'react';
const useOperation = () => {
  const { canvas, activeObjects } = useGlobalStore();

  const [_, setForceUpdate] = useState([]);
  return useMemo(() => {
    const isView = activeObjects.find((v) => v.visible);
    const isLock = activeObjects.find((v) => v.lockMovementX);
    return {
      isLock,
      look: () => {
        const temp = !isLock;
        canvas.discardActiveObject();
        activeObjects.forEach((v) => {
          v.set({
            lockMovementX: temp,
            lockMovementY: temp,
            lockScalingX: temp,
            lockScalingY: temp,
            lockRotation: temp,
            selectable: !temp,
            evented: !temp,
          });
        });
        canvas.setActiveObject(
          new fabric.ActiveSelection(activeObjects, { canvas: canvas })
        );
        canvas?.renderAll();
        setForceUpdate([]);
      },
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
              cloned.set({
                left: item.left + grid,
                top: item.top + grid,
                evented: true,
                id: uuid(),
              });
              return cloned ;
            })
          )
        ).then((res) => {
          canvas?.MyAdd(...res)
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
          padding: '4px 0',
          margin: 0,
        }}
      >
        <Col className="gutter-row" span={6}>
          <Button
            color="default"
            variant="text"
            size="middle"
            onClick={temp.look}
            icon={temp.isLock ? <LockOutlined /> : <UnlockOutlined />}
          ></Button>
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
