import React, { useCallback, useState } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import Title from 'app/components/Title';
import AppendLoading from 'app/components/AppendLoading';
import SearchBar from 'app/components/SearchBar';

import BoardItem from './BoardItem';
import Placeholder from './placeholder';
import useBoard from './useBoard';

function extractKey(item: string) {
  return item;
}

function getItemLayout(_: any, index: number) {
  return { length: 75, offset: 75 * index, index };
}

interface Props {
  route: any;
  navigation: any;
}

export default function Board({ route, navigation }: Props) {
  const boardId = route.params ? route.params.key : '';
  const [search, setSearch] = useState('');
  const { list, onRefresh, onEndReached, pushing, appending } = useBoard(boardId, search || undefined);

  const renderItem = useCallback(({ item, separators }: ListRenderItemInfo<string>) => {
    if (!item) return null;

    const onPress = () => {
      const { navigate } = navigation;
      navigate('post', { url: item });
    };

    return (
      <BoardItem
        id={item}
        onPress={onPress}
        onShowUnderlay={separators.highlight}
        onHideUnderlay={separators.unhighlight}
      />
    );
  }, [navigation]);

  return (
    <FlatList
      data={list}
      keyExtractor={extractKey}
      renderItem={renderItem}
      ListHeaderComponent={(
        <>
          <Title label={route.params.title} />
          <SearchBar onSubmit={setSearch} onCancel={() => setSearch('')} />
        </>
      )}
      ListEmptyComponent={<Placeholder />}
      refreshing={pushing}
      onRefresh={onRefresh}
      ListFooterComponent={appending ? <AppendLoading /> : undefined}
      getItemLayout={getItemLayout}
      initialNumToRender={8}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
    />
  );
}
