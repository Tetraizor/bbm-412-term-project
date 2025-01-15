import { Vector3 } from "three";

export function getRandomHexColor(int = true) {
  const color = Math.floor(Math.random() * 16777215).toString(16);

  if (int) {
    return parseInt(color, 16);
  }

  return color;
}

export function hexToRgb(hex, normalize = false) {
  const bigint = parseInt(hex, 16);
  const color = {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };

  if (normalize) {
    color.r /= 255;
    color.g /= 255;
    color.b /= 255;
  }

  return color;
}

export function hexToVec3(hex, normalize = false) {
  const bigint = parseInt(hex, 16);
  const color = {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };

  if (normalize) {
    color.r /= 255;
    color.g /= 255;
    color.b /= 255;
  }

  return new Vector3(color.r, color.g, color.b);
}

export function rgbToHex(r, g, b, isNormalized = false) {
  if (isNormalized) {
    r *= 255;
    g *= 255;
    b *= 255;
  }

  return ((r << 16) | (g << 8) | b).toString(16);
}

export function lerpColors(color1, color2, amount) {
  const result = {
    x: color1.x + (color2.x - color1.x) * amount,
    y: color1.y + (color2.y - color1.y) * amount,
    z: color1.z + (color2.z - color1.z) * amount,
  };

  return result;
}

export function lerp3Colors(color1, color2, color3, amount) {
  if (amount < 0.5) {
    return lerpColors(color1, color2, amount * 2);
  } else {
    return lerpColors(color2, color3, (amount - 0.5) * 2);
  }
}
