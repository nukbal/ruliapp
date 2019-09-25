import { useCallback, useState, useEffect } from 'react';
import { StatusBar, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import parsePost from '../../utils/parsePost';
import parseComment from '../../utils/parseComment';
import { USER_AGENT } from '../../config/constants';

interface DataType {
  contents: Array<ContentRecord | ContentRecord[]>;
  source?: string | undefined;
  views: number;
  likes?: number;
  dislikes?: number;
  date: Date | null;
  userName: string;
}

export default function usePost(url: string, key: string) {
  const [data, setData] = useState<DataType>({
    contents: [],
    views: 0,
    date: null,
    userName: '',
  });
  const [comment, setComments] = useState<CommentRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [isCommentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    let isDone = false;
    async function loadPost() {
      setReady(false);
      const cache = await AsyncStorage.getItem(`@Posts:${url}`);
      if (isDone) return;
      if (cache) {
        // @ts-ignore
        const { comments, ...rest } = JSON.parse(cache);
        setData(rest);
        setComments(comments);
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

        const { comments, ...rest } = json;

        await AsyncStorage.setItem(`@Posts:${url}`, JSON.stringify(json));
        if (isDone) return;
        // @ts-ignore
        setData({
          contents: rest.contents,
          source: rest.source,
          userName: rest.user.name,
        });
        setComments(comments);
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
  }, [url]);

  const loadComment = useCallback(async () => {
    setCommentLoading(true);

    const boardId = url.substring(url.indexOf('board/') + 6, url.indexOf('/read'));

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
        const cache = await AsyncStorage.getItem(`@Posts:${url}`);
        if (cache) {
          const post = JSON.parse(cache);
          AsyncStorage.setItem(`@Posts:${url}`, JSON.stringify({ ...post, comments }));
        }
        setComments(comments);
      }
    } catch (e) {
      // console.warn(e.message);
    }
    setCommentLoading(false);
    if (Platform.OS === 'ios') StatusBar.setNetworkActivityIndicatorVisible(false);
  }, [url, key]);

  return { ...data, comment, ready, loadComment, isCommentLoading };
}
