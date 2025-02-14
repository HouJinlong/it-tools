import React from 'react';
import {
  Geometry2d,
  HTMLContainer,
  RecordProps,
  Rectangle2d,
  ShapeUtil,
  T,
  TLBaseShape,
} from 'tldraw';
import { MyFabric } from '../';

type ICustomShape = TLBaseShape<
  'fabric-shape-shape',
  {
    w: number;
    h: number;
  }
>;
export class FabricShapeUtil extends ShapeUtil<ICustomShape> {
  static override type = 'fabric-shape-shape' as const;
  static override props: RecordProps<ICustomShape> = {
    w: T.number,
    h: T.number,
  };

  getDefaultProps(): ICustomShape['props'] {
    return {
      w: 800,
      h: 800,
    };
  }
  
  override canEdit() {
    return false;
  }
  override canResize() {
    return false;
  }
  override isAspectRatioLocked() {
    return false;
  }

  getGeometry(shape: ICustomShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }
  component(shape: ICustomShape) {
    return (
      <HTMLContainer
        style={{ backgroundColor: '#efefef', pointerEvents: 'all',"position":'relative' }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <MyFabric />
      </HTMLContainer>
    );
  }

  // [g]
  indicator(shape: ICustomShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
