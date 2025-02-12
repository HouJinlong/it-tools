import { Button } from 'antd';
import { useGlobalStore } from '../../context';
const SaveCanvas = () => {
  const { canvas, updateCur } = useGlobalStore();
  return (
    <Button
      type="primary"
      size="small"
      onClick={() => {
        updateCur({
          src: canvas?.toDataURL(),
          json:canvas?.toDatalessJSON(),
        });
      }}
    >
      保存
    </Button>
  );
};

export const Right = () => {
  return <div>
    <SaveCanvas />
  </div>;
};
