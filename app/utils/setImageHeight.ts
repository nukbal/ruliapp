import { DEFAULT_IMAGE_SIZE } from '../config/constants';

export default function setImageHeight(image: { width: number, height: number }, screenWidth: number) {
  const ratio = image.height / image.width;
  const height = screenWidth * ratio;
  return height || DEFAULT_IMAGE_SIZE;
}
