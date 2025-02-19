import * as fabric from 'fabric';

const deleteIcon = new URL('./lock.svg', import.meta.url).href;
console.log('deleteIcon: ', deleteIcon);

const deleteImg = document.createElement('img');
deleteImg.src = deleteIcon;
function renderIcon(ctx, left, top, _styleOverride, fabricObject) {
  const size = this.cornerSize;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(deleteImg, -size / 2, -size / 2, size, size);
  ctx.restore();
}

export const initMyControls = () => {
  fabric.InteractiveFabricObject.ownDefaults = {
    ...fabric.InteractiveFabricObject.ownDefaults,
    cornerStrokeColor: 'blue',
    cornerColor: 'lightblue',
    cornerStyle: 'circle',
    padding: 0,
    transparentCorners: false,
    cornerDashArray: [2, 2],
    borderColor: 'orange',
    borderDashArray: [3, 1, 3],
    borderScaleFactor: 2,
  };
//   fabric.InteractiveFabricObject.createControls = () => {
//     return {};
// }
//   const controls = fabric.controlsUtils.createObjectDefaultControls();
//     delete controls.ml;
//   fabric.InteractiveFabricObject.createControls = () => {
//     const controls = fabric.controlsUtils.createObjectDefaultControls();
//         return {
//            ...controls,
//            lock:new fabric.Control(
//             {
//               x: 0.5,
//               y: 0.5,
//               offsetY: 0,
//               cursorStyle: 'pointer',
//             //   mouseUpHandler: unLockObject,
//               render: renderIcon,
//             }
//           )
//         };
//     }
};
