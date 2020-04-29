import React, { useState, useEffect, useMemo } from 'react';
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useStore } from 'react-redux';

import { setCurrent, setPosts } from 'stores/post';
import Title from 'components/Title';
import SearchBar from 'components/SearchBar';
import BoardItem from './Board/BoardItem';
import Placeholder from './Board/placeholder';

function extractKey(item: PostDetailRecord) {
  return item.url;
}

export default function Bookmark() {
  const store = useStore();
  const [list, setList] = useState<PostDetailRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    AsyncStorage
      .getAllKeys()
      .then((keys) => {
        const keylist = keys.filter((key) => key.indexOf('ward:') === 0);
        if (keylist.length > 0) {
          AsyncStorage
            .multiGet(keylist)
            .then((res) => {
              const data = res.map((r) => r[1] && JSON.parse(r[1])).filter(Boolean);
              store.dispatch(setPosts(data as PostDetailRecord[]));
              setList(data);
              setReady(true);
            });
        } else {
          setReady(true);
        }
      });
  }, [store]);

  const listData = useMemo(() => {
    return list.filter(item => item.subject.indexOf(search) > -1);
  }, [list, search]);

  if (!ready) return <Placeholder />;

  return (
    <FlatList
      data={listData}
      keyExtractor={extractKey}
      renderItem={({ item, separators }) => {
        if (!item) return null;

        const onPress = () => {
          store.dispatch(setCurrent({ url: item.url, ward: true }));
        };

        return (
          <BoardItem
            data={item}
            onPress={onPress}
            onShowUnderlay={separators.highlight}
            onHideUnderlay={separators.unhighlight}
          />
        );
      }}
      ListHeaderComponent={(
        <>
          <Title label="와드" />
          <SearchBar onChange={setSearch} />
        </>
      )}
      initialNumToRender={8}
    />
  );
}
