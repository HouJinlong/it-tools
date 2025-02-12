import * as fabric from 'fabric';
import { Divider, Row, Col, Image } from 'antd';
import { useGlobalStore } from '../../../../context';
import './index.css';
import * as Json from './json';
import { useMemo } from 'react';
import { v4 as uuid } from 'uuid';

export const Elements = () => {
  const ctx = useGlobalStore().canvas!;
  const fun = useMemo(() => {
    const add = (info: (typeof Json)['base']['list'][0]) => {
      fabric.util
        .enlivenObjects([
          {
            ...info.json,
            id: uuid(),
          },
        ])
        .then((objects) => {
          objects.forEach((object) => {
            ctx.add(object);
          });
          ctx.renderAll();
        });
    };
    return {
      click: add,
    };
  }, [ctx]);
  return (
    <div>
      {Object.values(Json).map((v) => {
        return (
          <>
            <Divider key={v.name} orientation="left">
              {v.name}
            </Divider>
            <Row>
              {v.list.map((v) => {
                return (
                  <Col
                    span={12}
                    className="Elements-Col"
                    onClick={() => {
                      fun.click(v);
                    }}
                  >
                    <Image
                      preview={false}
                      width={90}
                      style={{ objectFit: 'contain' }}
                      height={90}
                      src={v.info.img}
                    />
                  </Col>
                );
              })}
            </Row>
          </>
        );
      })}
    </div>
  );
};
