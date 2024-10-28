// utils/colorUtils.js


import {hexToHSL} from "../../../../lib/hexToHSL";
import {hslToHex} from "../../../../lib/HSLToHex";

export const getShadesFromHex = (hex, lightnessFactor = 0.9, darknessFactor = 0.6) => {
  const [h, s, l] = hexToHSL(hex);
  const lightShade = hslToHex(h, s, l + (100 - l) * lightnessFactor);
  const darkShade = hslToHex(h, s, l * darknessFactor);

  return { lightShade, darkShade };
};

export const getCellStyle = (value, min, max, baseColorHex) => {
  if (value == null) return {};

  const ratio = (value - min) / (max - min);
  const { lightShade, darkShade } = getShadesFromHex(baseColorHex);

  const hexToRGB = (hex) => hex.match(/\w\w/g).map(x => parseInt(x, 16));

  const darkColor = hexToRGB(darkShade);
  const lightColor = hexToRGB(lightShade);

  const interpolatedColor = lightColor.map((c, i) => Math.round(c + (darkColor[i] - c) * ratio));

  return {
    fontSize: 16,
    backgroundColor: `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`,
    color: ratio < 0.5 ? 'black' : 'white',
  };
};
