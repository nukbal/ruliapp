import { useState, useCallback, useEffect, useRef } from 'react';
import { StatusBar, Platform } from 'react-native';
import qs from 'query-string';
import parseBoardList, { IParseBoard } from '../../utils/parseBoard';

export default function useBoard(key: string) {
  const [page, setPage] = useState(1);
  const [pushing, setPushing] = useState(false);
  const [appending, setAppending] = useState(false);
  const [list, setList] = useState<PostRecord[]>([]);
  const lastRan = useRef<number | null>(null);

  const request = useCallback(async (
    params: { page: number, keyword?: string, cate?: string } = { page: 1 },
    callback?: () => void,
  ) => {
    if (lastRan.current && (Date.now() - lastRan.current < 1000)) return;
    lastRan.current = Date.now();
    let targetUrl = `https://m.ruliweb.com/${key}`;

    if (params) {
      const query = qs.stringify(params);
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
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1',
        Referer: targetUrl,
      },
    };
    if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(true);

    try {
      const response = await fetch(targetUrl, config);
      const htmlString = await response.text();
      const json: IParseBoard = parseBoardList(htmlString, key);

      if (params.page === 1) setList(json.rows);
      else {
        const firstId = json.rows[0].key;
        const idx = list.findIndex(item => item.key === firstId);
        const newList = list.slice(0, idx);
        setList([...newList, ...json.rows]);
      }
    } catch (e) {
      // console.error(e);
    }
    if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(false);

    if (callback) callback();
  }, [key, list, lastRan]);

  useEffect(() => {
    if (key) request();
  }, [key, request]);

  const onRefresh = useCallback(() => {
    if (key && !pushing && list.length > 0) {
      setPushing(true);
      request({ page: 1 }, () => setPushing(false));
    }
  }, [key, pushing, list.length, request]);

  const onEndReached = useCallback(() => {
    if (key && !appending && list.length > 0) {
      setAppending(true);
      request({ page: page + 1 }, () => {
        setPage(page + 1);
        setAppending(false);
      });
    }
  }, [key, appending, list.length, page, request]);

  return { list, request, onRefresh, onEndReached, pushing, appending };
}
