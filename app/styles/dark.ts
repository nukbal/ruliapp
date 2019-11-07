import { transparentize, tint } from 'polished';

export default {
  primary: '#b3d6fc',
  primaryHover: transparentize(0.65, '#b3d6fc'),
  primaryLight: tint(0.25, '#b3d6fc'),
  background: '#000',
  backgroundLight: '#191919',
  backgroundSub: '#919496',
  text: '#d3d4d5',
  label: '#65696c',
  border: '#393e42',
};
