import { useCallback, useState, useEffect } from 'react';
import { AsyncStorage, StatusBar, Alert, Platform } from 'react-native';
import parsePost from '../../utils/parsePost';
import parseComment from '../../utils/parseComment';

interface DataType {
  contents: ContentRecord[];
  source?: string | undefined;
  views: number;
  likes: number;
  dislikes: number;
  date: Date | null;
  userName: string;
}

export default function usePost(url: string, key: string) {
  const [data, setData] = useState<DataType>({
    contents: [],
    views: 0,
    likes: 0,
    dislikes: 0,
    date: null,
    userName: '',
  });
  const [comment, setComments] = useState<CommentRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [isCommentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    async function loadPost() {
      setReady(false);
      const cache = await AsyncStorage.getItem(`@Posts:${url}`);
      if (cache) {
        // @ts-ignore
        const { comments, ...rest } = JSON.parse(cache);
        setData(rest);
        setComments(comments);
        setReady(true);
        return;
      }

      StatusBar.setNetworkActivityIndicatorVisible(true);
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
            'User-Agent':
              'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1',
            Referer: targetUrl,
          },
        };

        if (Platform.OS === 'android') {
          delete config.headers['Accept-Encoding'];
        }

        // @ts-ignore
        const response = await fetch(targetUrl, config);
        if (!response.ok) throw new Error('request failed');

        const htmlString = await response.text();
        const json = parsePost(htmlString, '');
        if (!json) throw new Error('parse failed');

        const { comments, ...rest } = json;

        await AsyncStorage.setItem(`@Posts:${url}`, JSON.stringify(json));
        // @ts-ignore
        setData({
          contents: rest.contents,
          source: rest.source,
          userName: rest.user.name,
        });
        setComments(comments);
      } catch (e) {
        // console.warn(e);
        Alert.alert('error', '해당 글이 존재하지 않습니다.');
      }
      setReady(true);
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }
    loadPost();
  }, [url]);

  const loadComment = useCallback(async () => {
    setCommentLoading(true);

    const boardId = url.substring(url.indexOf('board/') + 6, url.indexOf('/read'));
    const form = new FormData();
    form.append('page', 1);
    form.append('article_id', key);
    form.append('board_id', boardId);
    form.append('cmtimg', 1);

    const config = {
      method: 'POST',
      body: form,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'gzip, deflate',
        referer: `http://m.ruliweb.com/${url}`,
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
      },
    };

    StatusBar.setNetworkActivityIndicatorVisible(true);
    try {
      // @ts-ignore
      const response = await fetch('http://api.ruliweb.com/commentView', config);
      const json = await response.json();
      if (json.success) {
        const comments = parseComment(json.view);
        const cache = await AsyncStorage.getItem(`@Posts:${url}`);
        if (cache) {
          const post = JSON.parse(cache);
          AsyncStorage.setItem(`@Posts:${url}`, JSON.stringify({ ...post, comments }));
        }
      }
    } catch (e) {
      //
    }
    setCommentLoading(false);
    StatusBar.setNetworkActivityIndicatorVisible(false);
  }, [url, key]);

  return { ...data, comment, ready, loadComment, isCommentLoading };
}
