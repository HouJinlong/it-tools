import * as fabric from 'fabric';
import { gradientParser } from 'react-best-gradient-color-picker/gradientParser';

export function cssFillToFabricFill(cssFill, element) {
  if (!cssFill) return null;
  if (cssFill.indexOf('gradient') !== -1) {
    const temp = gradientParser(cssFill);
    if (temp.type === 'linear-gradient') {
      const gradient = parseLinearGradient(temp, element);
      if (gradient) {
        console.log('gradient: ', gradient);
        return new fabric.Gradient(gradient);
      }
    }
    if (temp.type === 'radial-gradient') {
      const gradient = parseRadialGradient(temp, element);
      if (gradient) {
        return new fabric.Gradient(gradient);
      }
    }
  } else {
    return cssFill;
  }
}

const gradAngleToCoords = (paramsAngle) => {
  const anglePI = -parseInt(paramsAngle, 10) * (Math.PI / 180);
  return {
    x1: Math.round(50 + Math.sin(anglePI) * 50) / 100,
    y1: Math.round(50 + Math.cos(anglePI) * 50) / 100,
    x2: Math.round(50 + Math.sin(anglePI + Math.PI) * 50) / 100,
    y2: Math.round(50 + Math.cos(anglePI + Math.PI) * 50) / 100,
  };
};
function parseLinearGradient(data, element) {
  const angleCoords = gradAngleToCoords(data.orientation.value);
  return {
    type: 'linear',
    coords: {
      x1: angleCoords.x1 * element.width,
      y1: angleCoords.y1 * element.height,
      x2: angleCoords.x2 * element.width,
      y2: angleCoords.y2 * element.height,
    },
    colorStops: data.colorStops.map((v) => {
      return {
        color: v.value,
        offset: v.left / 100,
      };
    }),
  };
}

function parseRadialGradient(data, element) {
  return {
    type: 'radial',
    coords: {
      x1: element.width / 2,
      y1: element.height / 2,
      r1: 0,
      x2: element.width / 2,
      y2: element.height / 2,
      r2: Math.max(element.width, element.height) / 2,
    },
    colorStops: data.colorStops.map((v) => {
      return {
        color: v.value,
        offset: v.left / 100,
      };
    }),
  };
}

export function fabricFillToCssFill(fill, fill_data) {
  if (fill_data) {
    return fill_data;
  }
  if (typeof fill === 'string') {
    return fill;
  } else {
    const colorStops = fill.colorStops
      .map((stop) => `${stop.color} ${stop.offset * 100}%`)
      .join(', ');
    // 线性渐变
    if (fill.type === 'linear') {
      return `linear-gradient(0deg, ${colorStops})`;
    }
    // 径向渐变
    if (fill.type === 'radial') {
      return `radial-gradient(circle, ${colorStops})`;
    }
  }
  return null;
}
