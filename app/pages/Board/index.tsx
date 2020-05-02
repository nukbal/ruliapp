import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { DrawerActions } from '@react-navigation/core';

import { setCurrent } from 'stores/post';

import Title from 'components/Title';
import AppendLoading from 'components/AppendLoading';
import SearchBar from 'components/SearchBar';
// import RefreshControl from 'components/RefreshControl';

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
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const {
    list, data, onRefresh, onEndReached, pushing, appending,
  } = useBoard(boardId, search || undefined);

  const renderItem = ({ item, separators }: ListRenderItemInfo<string>) => {
    if (!item) return null;

    const onPress = () => {
      dispatch(setCurrent({ url: item }));
      navigation.dispatch(DrawerActions.openDrawer());
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
      refreshing={pushing}
      onRefresh={onRefresh}
      ListEmptyComponent={<Placeholder />}
      ListFooterComponent={appending ? <AppendLoading /> : undefined}
      getItemLayout={getItemLayout}
      initialNumToRender={8}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
    />
  );
}
