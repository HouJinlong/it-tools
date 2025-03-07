import GIF from 'gif.js';
export const stringify = (data: {
  frame: Array<
    [
      HTMLImageElement,
      {
        delay: number;
      }
    ]
  >;
  option: {
    width: number;
    height: number;
  };
}) => {
  return new Promise<string>((resolve) => {
    const temp = new GIF({
      workers: 2,
      quality: 10,
      workerScript: new URL(
        '../../../../node_modules/gif.js/dist/gif.worker.js',
        import.meta.url
      ).href,
      ...data.option,
    });
    data.frame.forEach((v) => {
      temp.addFrame(...v);
    });
    temp.on('finished', function (blob) {
      resolve(URL.createObjectURL(blob));
    });
    temp.render();
  });
};
