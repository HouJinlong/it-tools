import {
  Input,
  Button,
  Row,
  Col,
  Card,
  Image,
  Space,
  Typography,
  Flex,
  Empty,
  Spin,
} from 'antd';
import { useEventTarget, useSetState, useBoolean } from 'ahooks';
import * as GifUtils from './gif';
import { useNotification } from '@refinedev/core';

export const GifPaser = () => {
  const { open } = useNotification();
  const [value, { onChange }] = useEventTarget({
    initialValue:
      'https://p1.meituan.net/scproduct/38eb492cef77e06f42494a02dfd9801e656095.gif',
  });
  const [data, setData] = useSetState<
    Awaited<ReturnType<(typeof GifUtils)['parse']>> & {
      src: Awaited<ReturnType<(typeof GifUtils)['stringify']>>;
    }
  >();
  const [loading, { setTrue, setFalse }] = useBoolean(false);
  return (
    <Row style={{ height: '100%' }} gutter={10}>
      <Spin spinning={loading} fullscreen />
      <Col
        flex="1"
        style={{
          height: '100%',
        }}
      >
        <Flex
          vertical
          style={{
            height: '100%',
          }}
        >
          <Card size="small" title="解析区">
            <Space.Compact block>
              <Input value={value} onChange={onChange}></Input>
              <Button
                type="primary"
                onClick={async () => {
                  setTrue();
                  try {
                    const temp = await GifUtils.parse(value);
                    setData(temp);
                    await GifUtils.sleep(0);
                    const imgEL =
                      document.querySelectorAll<HTMLDivElement>('.frame');
                    setData({
                      src: await GifUtils.stringify({
                        frame: temp.frames.map((v, i) => {
                          return [imgEL[i], { delay: v.delay }];
                        }),
                      }),
                    });
                    open?.({
                      type: 'success',
                      description: '解析成功',
                    });
                  } catch (error) {
                    console.log('error: ', error);
                    open?.({
                      type: 'error',
                      description: error.message || error.toString(),
                    });
                  }
                  setFalse();
                }}
              >
                解析
              </Button>
            </Space.Compact>
          </Card>
          <Card
            size="small"
            title="动图内容"
            style={{
              flex: 1,
              marginTop: '10px',
            }}
          >
            {data ? (
              <Image.PreviewGroup>
                <Space>
                  {data.frames.map((v) => {
                    return (
                      <Space
                        direction="vertical"
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        <Image
                          className="frame"
                          width={'200px'}
                          height={'200px'}
                          src={v.src}
                          alt=""
                        />
                        <div> 延时：{v.delay}</div>
                      </Space>
                    );
                  })}
                </Space>
              </Image.PreviewGroup>
            ) : (
              <Empty description="暂无解析结果" />
            )}
          </Card>
        </Flex>
      </Col>
      <Col
        flex="400px"
        style={{
          height: '100%',
          flexShrink: 0,
        }}
      >
        <Card
          size="small"
          title="动图展示"
          style={{
            height: '100%',
          }}
        >
          {data ? (
            <Space direction="vertical">
              <Typography.Title level={5}>
                尺寸：{data?.size.width}x{data?.size.height}
              </Typography.Title>
              <Typography.Title level={5}>解析重组图</Typography.Title>
              <Image src={data.src} alt="" />
              <Typography.Title level={5}>原图</Typography.Title>
              <Image src={value} alt="" />
            </Space>
          ) : (
            <Empty description="暂无解析结果" />
          )}
        </Card>
      </Col>
    </Row>
  );
};
