import {
  Flex,
  Image,
  Divider,
  Button,
  Empty,
  Space,
  Typography,
  Popover,
  InputNumber,
} from 'antd';
import { useGlobalStore } from '../../context';
import './index.css';
import { useCallback, useEffect, useState } from 'react';
import GIF from 'gif.js';
import { useNotification } from '@refinedev/core';

export const RenderGIf = () => {
  const { open } = useNotification();
  const { canvas, index, updateIndex } = useGlobalStore();
  const [delay, setDelay] = useState(100);
  const renderGif = useCallback(
    (delay: number) => {
      return new Promise((res) => {
        const img = document.querySelectorAll('.Bottom .frame img');
        if (!img.length) {
          open?.({
            type: 'error',
            description: '暂无图片数据，请先编辑图片',
          });
        }
        const gif = new GIF({
          workers: 2,
          quality: 10,
          workerScript: new URL(
            '../../../../../node_modules/gif.js/dist/gif.worker.js',
            import.meta.url
          ).href,
          debug: true,
          width: 800,
          height: 800,
        });
        img.forEach((v) => {
          gif.addFrame(v, { delay });
        });
        gif.on('finished', function (blob) {
          res(URL.createObjectURL(blob));
        });
        gif.render();
      });
    },
    [canvas]
  );
  const [gif, setGif] = useState('');
  useEffect(() => {
    if (gif) {
      document.querySelector('.renderGif').click();
    }
  }, [gif]);
  return (
    <Space>
      <div>延迟：</div>
      <InputNumber
        min={0}
        value={delay}
        onChange={(value) => {
          setDelay(value);
        }}
      />
      <Button
        type="primary"
        onClick={() => {
          updateIndex(index);
          setTimeout(() => {
            renderGif().then(setGif);
          }, 0);
        }}
      >
        生成动图
      </Button>
      {gif && (
        <div style={{ display: 'none' }}>
          <Image
            className="renderGif"
            preview={true}
            width={45}
            style={{
              objectFit: 'contain',
              display: 'none',
              position: 'absolute',
            }}
            height={45}
            src={gif}
          />
        </div>
      )}
    </Space>
  );
};
export const Bottom = () => {
  const { canvas, data, index, addData, updateIndex } = useGlobalStore();
  return (
    <Flex
      className="Bottom"
      justify="flex-start"
      align="center"
      style={{
        height: '100%',
      }}
      gap="small"
    >
      {data.map((v, i) => {
        return (
          <div
            className={`img frame ${i === index && 'active'}`}
            onClick={() => {
              updateIndex(i);
            }}
          >
            {v.src && (
              <Image
                preview={false}
                width={45}
                style={{ objectFit: 'contain' }}
                height={45}
                src={v.src}
              />
            )}
          </div>
        );
      })}
      <Divider
        type="vertical"
        style={{
          height: '40px',
        }}
      ></Divider>
      <Space direction="vertical">
        <Popover
          content={
            <Space>
              <Button
                onClick={() => {
                  addData(false);
                }}
              >
                空白画布
              </Button>
              <Button
                onClick={() => {
                  addData(true);
                }}
              >
                复制当前
              </Button>
            </Space>
          }
          title="新建画布"
        >
          <Button
            type="primary"
            size="small"
          >
            新建画布
          </Button>
        </Popover>
        <Popover content={<RenderGIf />} title="生成动图">
          <Button
            type="primary"
            size="small"
            onClick={() => {
              updateIndex(index);
              setTimeout(() => {
                renderGif().then(setGif);
              }, 0);
            }}
          >
            生成动图
          </Button>
        </Popover>
      </Space>
      <Space direction="vertical">
        <Typography.Text
          copyable={{
            text: JSON.stringify(
              canvas?.toDatalessJSON(['id', 'name', 'selectable','fill_data'])
            ),
            icon: [
              <Button type="primary" size="small">
                拷贝
              </Button>,
            ],
          }}
        />
      </Space>
    </Flex>
  );
};
