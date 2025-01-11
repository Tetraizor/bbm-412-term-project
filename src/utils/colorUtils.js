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

export function rgbToHex(r, g, b, isNormalized = false) {
  if (isNormalized) {
    r *= 255;
    g *= 255;
    b *= 255;
  }

  return ((r << 16) | (g << 8) | b).toString(16);
}
