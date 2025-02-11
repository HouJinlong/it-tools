// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { useEffect } from 'react';
import NxWelcome from './nx-welcome';
import GIF from 'gif.js';
console.log('GIF: ', GIF);

export function App() {
  return (
    <div onClick={()=>{
      const gif = new GIF({
        workers: 2,
        workerScript:new URL('../assets/gif.worker.js', import.meta.url).href,
        quality: 10,
        width:800,
        height:800,

      });
      document.querySelectorAll('img').forEach(v=>{
        gif.addFrame(v);
      })
      console.time('11');
      gif.on('finished', function(blob) {
        const gifUrl = URL.createObjectURL(blob);
        const img = document.createElement('img');
        img.src = gifUrl;
        document.body.appendChild(img);
      console.timeEnd('11');

      });
      gif.render();
    }}>
      <img
        style={{
          width: '200px',
        }}
        src={new URL('../assets/frame_0_delay-0.45s.gif', import.meta.url).href}
        alt=""
      />
      <img
        style={{
          width: '200px',
        }}
        src={new URL('../assets/frame_1_delay-0.45s.gif', import.meta.url).href}
        alt=""
      />
      <img
        style={{
          width: '200px',
        }}
        src={new URL('../assets/frame_2_delay-0.45s.gif', import.meta.url).href}
        alt=""
      />
      <img
        style={{
          width: '200px',
        }}
        src={new URL('../assets/frame_3_delay-0.45s.gif', import.meta.url).href}
        alt=""
      />
    </div>
  );
}

export default App;
