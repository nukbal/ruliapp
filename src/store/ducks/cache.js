import { createSelector } from 'reselect';
import { select, put, takeEvery, call, take } from 'redux-saga/effects';
import { eventChannel, buffers, END } from 'redux-saga';
import { Image } from 'react-native';
import fs from 'react-native-fs';
import SHA1 from "crypto-js/sha1";

const CACHE_DIR = fs.CachesDirectoryPath + '/';

export const actionType = {
  REQUEST_IMAGE_CACHE: 'REQUEST_IMAGE_CACHE',
  ADD_IMAGE_CACHE: 'ADD_IMAGE_CACHE',
  UPDATE_IMAGE_CACHE: 'UPDATE_IMAGE_CACHE',
  REMOVE_IMAGE_CACHE: 'REMOVE_IMAGE_CACHE',
}

export function addImageCache(url, sha) {
  return {
    type: actionType.REQUEST_IMAGE_CACHE,
    payload: {
      url,
      sha,
    },
  };
}

export const getCache = state => state.cache;

export const getImageConfig = (sha) => createSelector(
  [getCache],
  cache => cache[sha] || null
);

export const getImageUrl = (sha) => createSelector(
  [getImageConfig(sha)],
  config => config ? config.path : null,
);

export const getImageProgress = (sha) => createSelector(
  [getImageConfig(sha)],
  config => config ? config.progress : 0,
);

export const getImageSize = (sha) => createSelector(
  [getImageConfig(sha)],
  config => config ?
    { width: config.width, height: config.height } : { width: null, height: null },
);

export const isImageReady = (sha) => createSelector(
  [getImageConfig(sha)],
  config => config ? config.isReady : false,
);

export const getImageConfigByUrl = (url) => createSelector(
  [getCache],
  (cache) => {
    let target;
    const keyList = Object.keys(cache || {});
    for (let i = 0, len = keyList.length; i < len; i++) {
      const item = cache[keyList[i]];
      if (item.url === url) {
        target = item;
        break;
      }
    }
    return target || {};
  },
);


function createDownloadChannel(url, path) {
  return eventChannel((emitter) => {

    const onProgress = ({ contentLength, bytesWritten }) => {
      if (contentLength !== bytesWritten) {
        const progress = Math.round((bytesWritten / contentLength) * 100);
        emitter({ progress });
      } else {
        emitter({ progress: 100 });
      }
    };

    const { jobId, promise } = fs.downloadFile({
      fromUrl: url,
      toFile: path,
      progress: onProgress,
      discretionary: true,
    });
    emitter({ jobId });

    promise.then(({ statusCode }) => {
      if (statusCode === 200) {
        Image.getSize(path, (width, height) => {
          emitter({ width, height, path, isReady: true });
          emitter(END);
        });
      } else {
        emitter(END);
      }
    });

    return () => {
      emitter({ isReady: true });
    };
  });
}


export function* cacheImage({ payload }) {
  const { url, sha } = payload;
  const config = yield select(getImageConfig(sha));

  if (!config) {
    const filename =
    url.substring(url.lastIndexOf("/"), url.indexOf("?") === -1 ? url.length : url.indexOf("?"));
    const ext = filename.indexOf(".") === -1 ? ".jpg" : filename.substring(filename.lastIndexOf("."));
    const path = CACHE_DIR + sha + ext;

    const channel = yield call(createDownloadChannel, url, path);
    yield put({
      type: actionType.ADD_IMAGE_CACHE,
      payload: {
        sha,
        path,
        url,
      },
    });

    while (true) {
      const emit = yield take(channel);

      yield put({
        type: actionType.UPDATE_IMAGE_CACHE,
        payload: {
          sha,
          ...emit
        },
      });

      if (emit.isReady) return;
    }
  } else if (!config.isReady && config.jobId) {
    const isResumable = yield call(fs.isResumable, config.jobId);
  }
}

export const cacheSaga = [
  takeEvery(actionType.REQUEST_IMAGE_CACHE, cacheImage),
];

const initState = {};

const actionHandler = {
  [actionType.ADD_IMAGE_CACHE]: (state, { payload }) => {
    const { sha, url, path } = payload;
    return { [sha]: { url, path, isReady: false }, ...state };
  },
  [actionType.UPDATE_IMAGE_CACHE]: (state, { payload }) => {
    const { sha, ...rest } = payload;
    const mergedObj = Object.assign(state[sha], rest);
    return { [sha]: mergedObj, ...state };
  },
};

export default function reducer(state = initState, action = {}) {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
}
