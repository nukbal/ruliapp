import { useEffect, useRef, useReducer, useCallback } from 'react';
import { StatusBar, Platform } from 'react-native';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import qs from 'query-string';

import parseBoardList, { IParseBoard } from 'utils/parseBoard';
import { USER_AGENT, REQUEST_THROTTLE } from 'config/constants';

const initialState = {
  page: 1,
  maxPage: 1,
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
      for (let i = 0; i < action.payload.length; i += 1) {
        const target = action.payload[i];
        state.data[target.url] = target;
        if (state.list.indexOf(target.url) === -1) state.list.push(target.url);
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
        state.page = state.maxPage + 1;
        state.maxPage = state.page;
      }
    },
    refresh(state) {
      if (!state.pushing) {
        state.page = 1;
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

export default function useBoard(key: string, str: string = 'subject') {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { page, pushing } = state;
  const lastRan = useRef<number | null>(null);

  useEffect(() => {
    if (lastRan.current && (Date.now() - lastRan.current < REQUEST_THROTTLE)) {
      dispatch(actions.done());
      return;
    }
    lastRan.current = Date.now();
    let targetUrl = `https://m.ruliweb.com/${key}`;

    const query = qs.stringify({ page, search_key: str });
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
    async function request() {
      if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(true);

      try {
        if (page === 1 && str !== 'subject') dispatch(actions.clearList());

        const response = await fetch(targetUrl, config);
        const htmlString = await response.text();
        const json: IParseBoard = parseBoardList(htmlString);
        dispatch(actions.setPostList(json.rows));
      } catch (e) {
        console.error(e);
      }
      if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(false);
    }
    request();
  }, [key, page, str, pushing]);

  const onRefresh = useCallback(async () => dispatch(actions.refresh()), []);
  const onEndReached = useCallback(async () => dispatch(actions.append()), []);

  return { ...state, onEndReached, onRefresh };
}
