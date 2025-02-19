import { Flex, Image, Divider, Button, Empty, Space, Typography } from 'antd';
import { useGlobalStore } from '../../context';
import './index.css';
import { useCallback, useState } from 'react';
import GIF from 'gif.js';
import { useNotification } from '@refinedev/core';
export const Bottom = () => {
  const { open } = useNotification();
  const { canvas, data, index, addCloneData, updateIndex } = useGlobalStore();
  const [gif, setGif] = useState('');

  const renderGif = useCallback(() => {
    return new Promise((res) => {
      const img = document.querySelectorAll('.Bottom .frame img');
      console.log('img: ', img);
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
        gif.addFrame(v);
      });
      gif.on('finished', function (blob) {
        res(URL.createObjectURL(blob));
      });
      gif.render();
    });
  }, [canvas]);
  return (
    <Flex
      className="Bottom"
      justify="flex-start"
      align="center"
      style={{
        height: '100%',
        padding: '0 10px',
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
                width={90}
                style={{ objectFit: 'contain' }}
                height={90}
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
        <Button
          type="primary"
          size="small"
          onClick={() => {
            addCloneData();
          }}
        >
          新建
        </Button>
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
          生成
        </Button>
      </Space>
      <Space direction="vertical">
        <Typography.Text
          copyable={{
            text: JSON.stringify(canvas?.toDatalessJSON(['id', 'name','selectable'])),
            icon: [
              <Button
                type="primary"
                size="small"
              >
                拷贝
              </Button>,
            ],
          }}
        />
      </Space>
      <div className={`img`}>
        {gif ? (
          <Image
            preview={true}
            width={90}
            style={{ objectFit: 'contain' }}
            height={90}
            src={gif}
          />
        ) : (
          <div
            style={{
              width: '200%',
              transform: 'scale(0.5)  translate(-100%,-100%)',
              position: 'absolute',
              left: '50%',
              top: '50%',
            }}
          >
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未生成" />
          </div>
        )}
      </div>
    </Flex>
  );
};
