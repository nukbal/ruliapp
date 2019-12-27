import { useEffect, useRef, useReducer, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { StatusBar, Platform } from 'react-native';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import qs from 'query-string';

import parseBoardList, { IParseBoard } from 'utils/parseBoard';
import { USER_AGENT, REQUEST_THROTTLE } from 'config/constants';
import { updatePostFromBoard } from 'stores/post';

const initialState = {
  page: 1,
  pushing: false,
  appending: false,
  list: [] as string[],
  data: {} as { [url: string]: PostItemRecord },
};
const { reducer, actions } = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setPostList(state, action: PayloadAction<PostItemRecord[]>) {
      const heads = [];
      for (let i = 0; i < action.payload.length; i += 1) {
        const target = action.payload[i];
        state.data[target.url] = target;
        if (state.list.indexOf(target.url) === -1) {
          if (state.pushing) {
            heads.push(target.url);
          } else {
            state.list.push(target.url);
          }
        }
      }
      if (heads.length) {
        state.list = Array.from(new Set([...heads, ...state.list]));
      }
      state.pushing = false;
      state.appending = false;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
      state.appending = false;
      state.pushing = false;
    },
    append(state) {
      if (!state.appending) {
        state.appending = true;
        state.page += 1;
      }
    },
    refresh(state) {
      if (!state.pushing) {
        state.pushing = true;
      }
    },
    clearList(state) {
      state.list = [];
    },
    done(state) {
      state.appending = false;
      state.pushing = false;
    },
  },
});

interface BoardSearchParam {
  page: number;
  search_type: 'subject' | 'subject_content';
  search_key?: string;
}

export default function useBoard(key: string, str?: string) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const update = useDispatch();
  const { page } = state;
  const lastRan = useRef<number | null>(null);

  const request = useCallback(async (isRefresh?: boolean) => {
    if (lastRan.current && (Date.now() - lastRan.current < REQUEST_THROTTLE)) {
      dispatch(actions.done());
      return;
    }
    lastRan.current = Date.now();
    let targetUrl = `https://m.ruliweb.com/${key}`;
    const params = { search_type: 'subject', page } as BoardSearchParam;
    if (str) params.search_key = str;
    if (isRefresh) params.page = 1;

    const query = qs.stringify(params);
    targetUrl += `?${query}`;

    const config: RequestInit = {
      method: 'GET',
      // @ts-ignore
      headers: {
        Accept: 'text/html',
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store',
        Pragma: 'no-cache',
        'Accept-Encoding': 'gzip, deflate',
        'User-Agent': USER_AGENT,
        Referer: targetUrl,
      },
    };
    if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(true);

    try {
      if (page === 1 && !isRefresh) dispatch(actions.clearList());

      const response = await fetch(targetUrl, config);
      const htmlString = await response.text();
      const json: IParseBoard = parseBoardList(htmlString);
      dispatch(actions.setPostList(json.rows));
      update(updatePostFromBoard(json.rows));
    } catch (e) {
      console.error(e);
    }
    if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(false);
  }, [key, page, str, update]);

  useEffect(() => {
    request();
  }, [request]);

  const onRefresh = useCallback(async () => {
    dispatch(actions.refresh());
    request(true);
  }, [request]);
  const onEndReached = useCallback(async () => dispatch(actions.append()), []);

  return { ...state, onEndReached, onRefresh };
}
