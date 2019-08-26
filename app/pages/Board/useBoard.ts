import { useState, useCallback, useEffect, useRef } from 'react';
import { StatusBar, Platform } from 'react-native';
import qs from 'query-string';
import arrayToObject from '../../utils/arrayToObject';
import parseBoardList, { IParseBoard } from '../../utils/parseBoard';

export default function useBoard(key: string) {
  const [page, setPage] = useState(1);
  const [pushing, setPushing] = useState(false);
  const [appending, setAppending] = useState(false);
  const [data, setData] = useState<{ [key: string]: PostRecord }>({});
  const [list, setList] = useState<string[]>([]);
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
      const json: IParseBoard = parseBoardList(htmlString);

      if (params.page === 1) {
        const keys = json.rows.map((item: PostRecord) => item.key);
        setData(arrayToObject(json.rows));
        setList(keys);
      } else {
        const keys = json.rows.map((item: PostRecord) => item.key);
        setData((d) => ({ ...d, ...arrayToObject(json.rows) }));
        setList((lst) => Array.from(new Set([...lst, ...keys])));
      }
    } catch (e) {
      // console.error(e);
    }
    if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(false);

    if (callback) callback();
  }, [key]);

  useEffect(() => {
    if (key) request();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const onRefresh = () => {
    if (key && !pushing && list.length > 0) {
      setPushing(true);
      request({ page: 1 }, () => setPushing(false));
    }
  };

  const onEndReached = () => {
    if (key && !appending && list.length > 0) {
      setAppending(true);
      request({ page: page + 1 }, () => {
        setPage(page + 1);
        setAppending(false);
      });
    }
  };

  return { data, list, request, onRefresh, onEndReached, pushing, appending };
}
