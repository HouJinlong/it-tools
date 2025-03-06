import { Divider, Row, Col, Button, Tooltip, Popover, Space } from 'antd';
import {
  UnlockOutlined,
  LockOutlined,
  DeleteOutlined,
  CopyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ApartmentOutlined,
  GroupOutlined,
  GoldOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import * as fabric from 'fabric';
import { useEffect, useState } from 'react';
import { useGlobalStore, useActiveObjects } from '../../../context';
import { v4 as uuid } from 'uuid';

import { useMemo } from 'react';
const useOperation = () => {
  const { canvas } = useGlobalStore();
  const activeObjects = useActiveObjects();
  const [_, setForceUpdate] = useState([]);
  return useMemo(() => {
    const isView = activeObjects.find((v) => v.visible);
    const isLock = activeObjects.find((v) => !v.selectable);
    const setActiveObject = () => {
      canvas.setActiveObject(
        new fabric.ActiveSelection(activeObjects, { canvas: canvas })
      );
    };
    return {
      canGroup: activeObjects.length > 1,
      group: () => {
        const group = new fabric.Group(activeObjects);
        group.id = uuid();
        canvas?.remove(...activeObjects);
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.requestRenderAll();
      },
      canUnGroup:
        activeObjects.length === 1 && activeObjects[0] instanceof fabric.Group,
      unGroup: () => {
        const group = activeObjects[0];
        const temp = group.removeAll();
        canvas?.remove(group);
        canvas?.add(...temp);
        canvas.setActiveObject(
          new fabric.ActiveSelection(temp, {
            canvas: canvas,
          })
        );
        canvas?.renderAll();
      },
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
        setActiveObject();
        canvas?.requestRenderAll();
        setForceUpdate([]);
      },
      del: () => {
        canvas.discardActiveObject();
        activeObjects.map((item) => canvas.remove(item));
        canvas.requestRenderAll();
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
              return cloned;
            })
          )
        ).then((res) => {
          canvas?.MyAdd(...res);
          canvas.requestRenderAll();
        });
      },
      isView,
      view: () => {
        canvas.discardActiveObject();
        activeObjects.forEach((v) => {
          v.set('visible', !isView);
        });
        canvas.requestRenderAll();
        setForceUpdate([]);
      },
      position: {
        centerX: () => {
          activeObjects.forEach((v) => {
            canvas?.centerObjectH(v);
          });
          canvas?.fire('object:modified');
        },
        centerY: () => {
          activeObjects.forEach((v) => {
            canvas?.centerObjectV(v);
          });
          canvas?.fire('object:modified');
        },
        center: () => {
          activeObjects.forEach((v) => {
            canvas?.centerObject(v);
          });
          canvas?.fire('object:modified');
        },
        left: () => {
          activeObjects.forEach((v) => {
            v.setX(0);
          });
          canvas?.fire('object:modified');
        },
        right: () => {
          activeObjects.forEach((v) => {
            v.setX(canvas.width - v.width);
          });
          canvas?.fire('object:modified');
        },
        top: () => {
          activeObjects.forEach((v) => {
            v.setY(0);
          });
          canvas?.fire('object:modified');
        },
        bottom: () => {
          activeObjects.forEach((v) => {
            v.setY(canvas?.height - v.height);
          });
          canvas?.fire('object:modified');
        },
      },
      canExport: activeObjects.length === 1,
      export: () => {
        const elementLink = document.createElement('a');
        elementLink.href = activeObjects[0].toDataURL({ format: 'jpeg' });
        elementLink.download = `${
          activeObjects[0].name || activeObjects[0].id
        }.jpeg`;
        elementLink.click();
      },
    };
  }, [activeObjects, _]);
};

const LayerPosition = () => {
  const temp = useOperation();
  const { canvas } = useGlobalStore();
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Button
            color="default"
            size="middle"
            block
            onClick={temp.position.centerX}
          >
            水平居中
          </Button>
        </Col>
        <Col span={12}>
          <Button
            color="default"
            size="middle"
            block
            onClick={temp.position.centerY}
          >
            垂直居中
          </Button>
        </Col>
      </Row>
      <Row
        gutter={16}
        style={{
          width: '180px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          textAlign: 'center',
          margin: '10px 0 ',
        }}
      >
        <Col span={8} style={{ padding: '0' }}></Col>
        <Col span={8} style={{ padding: '0' }}>
          <Button
            color="default"
            variant="text"
            size="middle"
            onClick={temp.position.top}
          >
            贴顶
          </Button>
        </Col>
        <Col span={8} style={{ padding: '0' }}></Col>

        <Col span={8} style={{ padding: '0' }}>
          <Button
            color="default"
            variant="text"
            size="middle"
            onClick={temp.position.left}
          >
            贴左
          </Button>
        </Col>
        <Col span={8} style={{ padding: '0' }}>
          <Button
            color="default"
            variant="text"
            size="middle"
            onClick={temp.position.center}
          >
            居中
          </Button>
        </Col>
        <Col span={8} style={{ padding: '0' }}>
          <Button
            color="default"
            variant="text"
            size="middle"
            onClick={temp.position.right}
          >
            贴右
          </Button>
        </Col>

        <Col span={8} style={{ padding: '0' }}></Col>
        <Col span={8} style={{ padding: '0' }}>
          <Button
            color="default"
            variant="text"
            size="middle"
            onClick={temp.position.bottom}
          >
            贴底
          </Button>
        </Col>
        <Col span={8} style={{ padding: '0' }}></Col>
      </Row>
      <div className="ant-popover-title">图层顺序</div>
      <Button
        color="default"
        variant="text"
        size="middle"
        onClick={() => {
          console.log(canvas.getObjects().map((v) => v.text));
          const a = canvas.moveObjectTo(canvas.getObjects()[0], 1);
          console.log('a: ', a);
        }}
      >
        上移
      </Button>
    </>
  );
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
        <Col span={4}>
          <Popover
            content={<LayerPosition />}
            title="图层位置"
            trigger="click"
            placement="bottomRight"
          >
            <Tooltip title="图层位置">
              <Button
                color="default"
                variant="text"
                size="middle"
                icon={<ApartmentOutlined />}
              ></Button>
            </Tooltip>
          </Popover>
        </Col>
        <Col span={4}>
          <Tooltip title={temp.isLock ? '解锁' : '锁定'}>
            <Button
              color="default"
              variant="text"
              size="middle"
              onClick={temp.look}
              icon={temp.isLock ? <LockOutlined /> : <UnlockOutlined />}
            ></Button>
          </Tooltip>
        </Col>
        <Col span={4}>
          <Tooltip title="删除">
            <Button
              color="default"
              variant="text"
              icon={<DeleteOutlined />}
              onClick={temp.del}
            ></Button>
          </Tooltip>
        </Col>
        <Col span={4}>
          <Tooltip title="复制">
            <Button
              color="default"
              variant="text"
              onClick={temp.copy}
              icon={<CopyOutlined />}
            ></Button>
          </Tooltip>
        </Col>
        <Col span={4}>
          <Tooltip title="隐藏">
            <Button
              color="default"
              variant="text"
              onClick={temp.view}
              icon={temp.isView ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            ></Button>
          </Tooltip>
        </Col>
        {temp.canGroup && (
          <Col span={4}>
            <Tooltip title="成组">
              <Button
                color="default"
                variant="text"
                onClick={temp.group}
                icon={<GroupOutlined />}
              ></Button>
            </Tooltip>
          </Col>
        )}
        {temp.canUnGroup && (
          <Col span={4}>
            <Tooltip title="取消成组">
              <Button
                color="default"
                variant="text"
                onClick={temp.unGroup}
                icon={<GoldOutlined />}
              ></Button>
            </Tooltip>
          </Col>
        )}
        {temp.canExport && (
          <Col span={4}>
            <Tooltip title="导出">
              <Button
                color="default"
                variant="text"
                onClick={temp.export}
                icon={<DownloadOutlined />}
              ></Button>
            </Tooltip>
          </Col>
        )}
      </Row>
    </>
  );
};
