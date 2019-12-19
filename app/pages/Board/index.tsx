import React, { useState } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import Title from 'components/Title';
import AppendLoading from 'components/AppendLoading';
import SearchBar from 'components/SearchBar';

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
  const {
    list, data, onRefresh, onEndReached, pushing, appending,
  } = useBoard(boardId, search || undefined);

  const renderItem = ({ item, separators }: ListRenderItemInfo<string>) => {
    if (!item) return null;

    const onPress = () => {
      const { navigate } = navigation;
      navigate('post', { url: item });
    };

    return (
      <BoardItem
        data={data[item]}
        onPress={onPress}
        onShowUnderlay={separators.highlight}
        onHideUnderlay={separators.unhighlight}
      />
    );
  };

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
