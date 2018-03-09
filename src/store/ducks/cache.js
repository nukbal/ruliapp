import { createSelector } from 'reselect';
import { select, put, takeEvery, call, take } from 'redux-saga/effects';
import { eventChannel, buffers, END } from 'redux-saga';
import fs from 'react-native-fs';
import SHA1 from "crypto-js/sha1";

const CACHE_DIR = fs.CachesDirectoryPath + '/';

export const actionType = {
  REQUEST_IMAGE_CACHE: 'REQUEST_IMAGE_CACHE',
  ADD_IMAGE_CACHE: 'ADD_IMAGE_CACHE',
  UPDATE_IMAGE_CACHE: 'UPDATE_IMAGE_CACHE',
  REMOVE_IMAGE_CACHE: 'REMOVE_IMAGE_CACHE',
}

export function addImageCache(url) {
  return {
    type: actionType.REQUEST_IMAGE_CACHE,
    payload: url,
  };
}

export const getCache = state => state.cache;

export const getImageConfig = (sha) => createSelector(
  [getCache],
  cache => cache[sha] || null
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
    }

    const { jobId, promise } = fs.downloadFile({
      fromUrl: url,
      toFile: path,
      progress: onProgress,
      discretionary: true,
    });
    emitter({ jobId });

    promise.then((result) => {
      emitter({ path, isReady: true });
      emitter(END);
    });

    return () => {};
  }, buffers.sliding(2));
}


export function* cacheImage({ payload }) {
  const sha = SHA1(payload) + "";
  const config = yield select(getImageConfig(sha));

  if (!config) {
    const filename =
      payload.substring(payload.lastIndexOf("/"), payload.indexOf("?") === -1 ? payload.length : uri.indexOf("?"));
    const ext = filename.indexOf(".") === -1 ? ".jpg" : filename.substring(filename.lastIndexOf("."));
    const path = CACHE_DIR + sha + ext;

    const channel = yield call(createDownloadChannel, payload, path);
    yield put({
      type: actionType.ADD_IMAGE_CACHE,
      payload: {
        sha,
        path,
        url: payload,
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
    const isResumable = yield call(fs.isResumable(config.jobId));
  }
}

export const cacheSaga = [
  takeEvery(actionType.REQUEST_IMAGE_CACHE, cacheImage),
];

const initState = {};

const actionHandler = {
  [actionType.ADD_IMAGE_CACHE]: (state, { payload }) => {
    const { sha, url, path } = payload;
    return { [sha]: { url, path, width: 0, height: 0, isReady: false }, ...state };
  },
  [actionType.UPDATE_IMAGE_CACHE]: (state, { payload }) => {
    const { sha, ...rest } = payload;
    console.log(state[sha]);
    console.log(payload);
    const mergedObj = Object.assign(state[sha], rest);
    return { [sha]: mergedObj, ...state };
  },
};

export default function reducer(state = initState, action = {}) {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
}
