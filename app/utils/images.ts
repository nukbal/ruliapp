/** image controls  */

import fs from 'react-native-fs';
import Realm from 'realm';

const ImageSchema = {
  name: 'Image',
  primaryKey: 'url',
  properties: {
    url: 'string',
    path: 'string',
    width: 'int?',
    height: 'int?',
  }
}

const path = fs.CachesDirectoryPath;
const schemaList = [ImageSchema];

async function load(url: string) {
  return new Promise((res, rej) => {
    try {
      const realm = new Realm({ schema: schemaList });
      const data = realm.objects('Image').filtered('url == $0', url);
      if (data.length) {
        res(data[0]);
        return;
      }
      res();
    } catch (e) {
      rej(e);
    }
  });
}

export async function updateImage(url: string, params: any) {

}

export async function saveImage(url: string) {

}

export async function loadImage(url: string) {
  let data = await load(url);
  if (!data) {
    data = await saveImage(url);
  }

  return data;
}
