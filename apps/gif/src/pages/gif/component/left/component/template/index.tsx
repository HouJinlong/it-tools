import * as fabric from 'fabric';
import { Divider, Row, Col, Image } from 'antd';
import { useGlobalStore } from '../../../../context';
import './index.css';
import * as Json from './json';
import { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';


import { forOwn } from 'lodash-es';

const baseUrl = `${window.location.origin}/template/董小姐模版/`
const modifyJson = (obj) => {
  forOwn(obj, (value, key) => {
    if (key === 'img' || key === 'src') {
      obj[key] = `${baseUrl}${value}`;
    } else if (typeof value === 'object' && value !== null) {
      modifyJson(value);
    }
  });
};


export const Template = () => {
  const ctx = useGlobalStore().canvas!;
  const fun = useMemo(() => {
    const add = (info: (typeof Json)['base']['list'][0]) => {
      ctx.loadFromJSON(info.json).then(() => {
        ctx.renderAll();
      });
    };
    return {
      click: add,
    };
  }, [ctx]);

  const [List, setList] = useState(Object.values(Json));

  useEffect(() => {
    fetch(`${baseUrl}index.json`)
      .then((res) => res.json())
      .then((data) => {
        modifyJson(data);
        setList((v) => {
          return [
            ...v,
            {
              name: '董小姐模版',
              list: [data],
            },
          ];
        });
      });
  }, []);

  return (
    <div>
      {List.map((v) => {
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

