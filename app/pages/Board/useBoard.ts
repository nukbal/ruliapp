import { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { StatusBar, Platform } from 'react-native';
import qs from 'query-string';

import parseBoardList, { IParseBoard } from 'app/utils/parseBoard';
import { USER_AGENT, REQUEST_THROTTLE } from 'app/config/constants';
import { setPostList } from 'app/stores/post';

export default function useBoard(key: string, str?: string) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pushing, setPushing] = useState(false);
  const [appending, setAppending] = useState(false);
  const [list, setList] = useState<string[]>([]);
  const lastRan = useRef<number | null>(null);

  const request = useCallback(async (
    params: { page: number, search_key?: string, cate?: string } = { page: 1 },
  ) => {
    if (lastRan.current && (Date.now() - lastRan.current < REQUEST_THROTTLE)) return;
    lastRan.current = Date.now();
    let targetUrl = `https://m.ruliweb.com/${key}`;

    if (params) {
      const q = { ...params } as any;
      if (params.search_key) {
        q.search_type = 'subject';
      }
      const query = qs.stringify(q);
      targetUrl += `?${query}`;
    }

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
      if (params.page === 1 && params.search_key) setList([]);

      const response = await fetch(targetUrl, config);
      const htmlString = await response.text();
      const json: IParseBoard = parseBoardList(htmlString);

      const keys = json.rows.map((item: PostItemRecord) => item.url);
      dispatch(setPostList(json.rows));
      if (params.page === 1) {
        setList(keys);
      } else {
        setList((lst) => Array.from(new Set([...lst, ...keys])));
      }
    } catch (e) {
      // console.error(e);
    }
    if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(false);
  }, [dispatch, key]);

  useEffect(() => {
    if (key) request({ page: 1, search_key: str });
  }, [key, request, str]);

  const onRefresh = async () => {
    if (key && !pushing && list.length > 0) {
      setPushing(true);
      await request({ page: 1, search_key: str });
      setPushing(false);
    }
  };

  const onEndReached = async () => {
    if (key && !appending && list.length > 0) {
      setAppending(true);
      await request({ page: page + 1 });
      setPage(page + 1);
      setAppending(false);
    }
  };

  return { list, request, onRefresh, onEndReached, pushing, appending };
}
