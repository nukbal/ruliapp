import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { useSelector } from 'react-redux';

import { getBookmarkIds } from 'app/stores/bookmark';
import Title from 'app/components/Title';
// import SearchBar from 'app/components/SearchBar';
import BoardItem from './Board/BoardItem';

function extractKey(item: string) {
  return item;
}

export default function Bookmark({ navigation }: any) {
  // const [search, setSearch] = useState('');
  const data = useSelector(getBookmarkIds);

  const renderItem = useCallback(({ item, separators }: ListRenderItemInfo<string>) => {
    if (!item) return null;

    const onPress = () => {
      const { navigate } = navigation;
      navigate('post', { url: item, bookmark: true });
    };

    return (
      <BoardItem
        id={item}
        onPress={onPress}
        onShowUnderlay={separators.highlight}
        onHideUnderlay={separators.unhighlight}
        bookmark
      />
    );
  }, [navigation]);

  return (
    <FlatList
      data={data}
      keyExtractor={extractKey}
      renderItem={renderItem}
      ListHeaderComponent={(
        <>
          <Title label="북마크" />
        </>
      )}
      initialNumToRender={8}
    />
  );
}
