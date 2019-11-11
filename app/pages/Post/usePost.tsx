import { useCallback, useState, useEffect } from 'react';
import { StatusBar, Alert, Platform } from 'react-native';

import parsePost from 'app/utils/parsePost';
import parseComment from 'app/utils/parseComment';
import { USER_AGENT } from 'app/config/constants';
import { useSelector, useDispatch } from 'react-redux';
import { getPost, Actions } from 'app/stores/post';

interface DataType {
  contents: Array<ContentRecord | ContentRecord[]>;
  source?: string | undefined;
  views: number;
  likes?: number;
  dislikes?: number;
  date: Date | null;
  userName: string;
}

export default function usePost(url: string) {
  const dispatch = useDispatch();
  const { hasDetail, ...data } = useSelector(getPost(url));
  const [ready, setReady] = useState(false);
  const [isCommentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    let isDone = false;
    async function loadPost() {
      setReady(false);
      if (isDone) return;
      if (hasDetail) {
        setReady(true);
        return;
      }

      if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(true);
      try {
        const targetUrl = `https://m.ruliweb.com/${url}?search_type=name&search_key=%2F%2F%2F`;
        const config = {
          method: 'GET',
          credentials: 'include',
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

        if (Platform.OS === 'android') {
          delete config.headers['Accept-Encoding'];
        }

        // @ts-ignore
        const response = await fetch(targetUrl, config);
        if (isDone) return;
        if (!response.ok) throw new Error('request failed');

        const htmlString = await response.text();
        if (isDone) return;

        const json = parsePost(htmlString, '');
        if (!json) throw new Error('parse failed');
        dispatch(Actions.set(url, json));
      } catch (e) {
        if (isDone) return;
        // console.warn(e);
        Alert.alert('error', '해당 글이 존재하지 않습니다.');
      }
      setReady(true);
      if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(false);
    }
    loadPost();
    return () => {
      isDone = true;
      if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const loadComment = useCallback(async () => {
    setCommentLoading(true);

    const boardId = url.substring(url.indexOf('board/') + 6, url.indexOf('/read'));
    const key = url.substring(url.indexOf('read/') + 5, url.length);

    const config = {
      method: 'POST',
      body: `page=1&article_id=${key}&board_id=${boardId}&cmtimg=1`,
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept-Encoding': 'gzip, deflate',
        origin: 'https://m.ruliweb.com',
        referer: `http://m.ruliweb.com/${url}`,
        'User-Agent': USER_AGENT,
      },
    };

    if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(true);
    try {
      // @ts-ignore
      const response = await fetch('https://api.ruliweb.com/commentView', config);
      const json = await response.json();
      if (json.success) {
        const comments = parseComment(json.view);
        dispatch(Actions.setComment(key, comments));
      }
    } catch (e) {
      // console.warn(e.message);
    }
    setCommentLoading(false);
    if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(false);
  }, [url, dispatch]);

  return { ...data, ready, loadComment, isCommentLoading };
}
