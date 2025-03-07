import { parseGIF, decompressFrames,ParsedFrame} from 'gifuct-js';

const tempCanvas = document.createElement('canvas');
const tempCtx = tempCanvas.getContext('2d');
const gifCanvas = document.createElement('canvas');

const gifCtx = gifCanvas.getContext('2d');
let frameImageData;
function getFrameUrl(frame) {
  const dims = frame.dims;
  if (
    !frameImageData ||
    dims.width != frameImageData.width ||
    dims.height != frameImageData.height
  ) {
    tempCanvas.width = dims.width;
    tempCanvas.height = dims.height;
    frameImageData = tempCtx.createImageData(dims.width, dims.height);
  }

  frameImageData.data.set(frame.patch);
  tempCtx.putImageData(frameImageData, 0, 0);
  gifCtx.drawImage(tempCanvas, dims.left, dims.top);
  return gifCanvas.toDataURL('image/png');
}

export const parse = (url: string) => {
  return new Promise<{
    size: {
      width: number;
      height: number;
    };
    frames: Array<ParsedFrame&{
        src:string
    }>;
  }>((resolve) => {
    const oReq = new XMLHttpRequest();
    oReq.open('GET', url.trim(), true);
    oReq.responseType = 'arraybuffer';
    oReq.onload = function (oEvent) {
      const arrayBuffer = oReq.response;
      if (arrayBuffer) {
        const gif = parseGIF(arrayBuffer);
       
        const frames = decompressFrames(gif, true);
        gifCanvas.width = gif.lsd.width;
        gifCanvas.height = gif.lsd.height;

        const temp = frames.map((v) => {
          return {
            ...v,
            src:getFrameUrl(v),
          };
        });
        resolve({
          size: {
            width: gif.lsd.width,
            height: gif.lsd.height,
          },
          frames: temp,
        });
      }
    };
    oReq.send(null);
  });
};
