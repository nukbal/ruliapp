import { transparentize, tint } from 'polished';

export default {
  primary: '#b3d6fc',
  primaryHover: transparentize(0.65, '#b3d6fc'),
  primaryLight: tint(0.25, '#b3d6fc'),
  background: '#ffffff',
  backgroundLight: '#dfdfdf',
  backgroundSub: '#efefef',
  text: '#0a0c0d',
  label: '#919496',
  border: '#bdbec0',
};
