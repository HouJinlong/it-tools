import { useRequest } from 'ahooks';
import { Image, Space, Typography, Popover, Flex } from 'antd';
import { forOwn, pick } from 'lodash-es';
import { useForm } from '@formily/react';

import * as FabricFill from '@src/utils/fabric-fill';

export const baseUrl = `${window.location.origin}/template/fontStyle/`;
export const modifyJson = (obj) => {
  forOwn(obj, (value, key) => {
    if (key === 'img' || key === 'src') {
      obj[key] = `${baseUrl}${value}`;
    } else if (typeof value === 'object' && value !== null) {
      modifyJson(value);
    }
  });
};

const cacheKey = baseUrl;
export const FontStyle = (props) => {
  const from = useForm();
  const { data, loading } = useRequest<
    Array<{
      name: string;
      json: any;
      img: string;
    }>
  >(
    () =>
      fetch(`${baseUrl}index.json`)
        .then((res) => res.json())
        .then((data) => {
          modifyJson(data);
          return data;
        }),
    {
      cacheKey,
      setCache: (data) => localStorage.setItem(cacheKey, JSON.stringify(data)),
      getCache: () => JSON.parse(localStorage.getItem(cacheKey) || '{}'),
    }
  );
  if (!data && loading) {
    return <p>Loading</p>;
  }
  return (
    <Popover
      title="一键设置文字特效"
      placement="left"
      content={
        <Flex
          wrap
          gap={5}
          style={{
            width: '215px',
          }}
        >
          {data?.map((v) => {
            return (
              <Flex
                align="center"
                vertical
                justify="center"
                style={{
                  background: '#f8f8f8',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  width: '50px',
                  height: '50px',
                }}
                onClick={() => {
                  from.setValues(
                    {
                      ...pick(v.json, [
                        'stroke',
                        'strokeWidth',
                        'shadow',
                        'strokeLineCap',
                      ]),
                      fill: FabricFill.fabricFillToCssFill(
                        pick(v.json, ['fill', 'fill_data', 'gradientAngle'])
                      ),
                    },
                    'merge'
                  );
                }}
              >
                <Image
                  width={'30px'}
                  height={'30px'}
                  style={{
                    objectFit: 'contain',
                  }}
                  preview={false}
                  src={v.img}
                />
                <div
                  style={{
                    fontSize: '10px',
                  }}
                >
                  {v.name}
                </div>
              </Flex>
            );
          })}
        </Flex>
      }
    >
      <Space
        style={{
          padding: '0 10px',
          background: '#f8f8f8',
          borderRadius: '5px',
          width: '100%',
          cursor: 'pointer',
        }}
      >
        <Image width={'30px'} preview={false} src={data[0].img} />
        <Typography.Title
          level={5}
          style={{
            margin: 0,
          }}
        >
          一键设置文字特效
        </Typography.Title>
      </Space>
    </Popover>
  );
};
