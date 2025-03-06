import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { FabricShapeUtil } from './fabric-shape';
import './index.css';
export const MyTldraw = () => {
  return (
    <div
      className='MyTldraw'
      style={{
        position: 'absolute',
        inset: 0,
      }}
      // onMouseDown={()=>{
      //   console.log('11')
      // }}
    >
      <Tldraw
        options={{ maxPages:1}}
        shapeUtils={[FabricShapeUtil]}
        onMount={(editor) => {
          editor.createShape({ type: FabricShapeUtil.type, x: 100, y: 100 });
          editor.updateInstanceState({ isReadonly: true });
          editor.zoomToFit();
        }}
        components={
          {
            ContextMenu:null,
            Toolbar:null,
            MenuPanel:null,
          }
        }
      />
    </div>
  );
};

