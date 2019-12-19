import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useStore } from 'react-redux';

import { getPostKeys, getPost, setPosts } from 'stores/post';
import Title from 'components/Title';
// import SearchBar from 'components/SearchBar';
import BoardItem from './Board/BoardItem';
import Placeholder from './Board/placeholder';

function extractKey(item: string) {
  return item;
}

export default function Bookmark({ navigation }: any) {
  const [list, setList] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const store = useStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    AsyncStorage
      .getAllKeys()
      .then((keys) => {
        const keylist = keys.filter((key) => key.indexOf('ward:') === 0);
        setList(keylist);

        const cachedKeys = getPostKeys(store.getState());
        const targetList = keylist.filter((key) => cachedKeys.indexOf(key) === -1);
        if (targetList.length > 0) {
          AsyncStorage
            .multiGet(keylist)
            .then((res) => {
              const data = res.map((r) => r[1] && JSON.parse(r[1])).filter(Boolean);
              store.dispatch(setPosts(data as PostDetailRecord[]));
              setReady(true);
            });
        } else {
          setReady(true);
        }
      });
  }, [store]);

  if (!ready) return <Placeholder />;

  return (
    <FlatList
      data={list}
      keyExtractor={extractKey}
      renderItem={({ item, separators }) => {
        if (!item) return null;
        const url = item.replace('ward:', '');
        const data = getPost(url)(store.getState());

        const onPress = () => {
          const { navigate } = navigation;
          navigate('post', { url, ward: true });
        };

        return (
          <BoardItem
            data={data}
            onPress={onPress}
            onShowUnderlay={separators.highlight}
            onHideUnderlay={separators.unhighlight}
          />
        );
      }}
      ListHeaderComponent={(
        <>
          <Title label="와드" />
        </>
      )}
      initialNumToRender={8}
    />
  );
}
