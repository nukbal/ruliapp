import React, { useCallback, useMemo } from 'react';
import { NavigationScreenProp } from 'react-navigation';
import styled from 'styled-components/native';
import { ActivityIndicator, ListRenderItemInfo } from 'react-native';

// import SearchBar from './SearchBar';
import BoardItem from './BoardItem';
import Placeholder from './placeholder';
import useBoard from './useBoard';

import AnimatedContent from '../AnimatedContent';

const Loading = styled.View`
  height: 75;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  justify-content: center;
`;

const AppendLoading = (
  <Loading>
    <ActivityIndicator />
  </Loading>
);

function extractKey(item: string) {
  return item;
}

function getItemLayout(_: any, index: number) {
  return { length: 75, offset: 75 * index, index };
}

interface Props {
  navigation: NavigationScreenProp<any, { title: string, key: string }>;
}

export default function Board({ navigation }: Props) {
  const boardId = navigation.state.params ? navigation.state.params.key : '';
  const { list, data, onRefresh, onEndReached, pushing, appending } = useBoard(boardId);

  const renderItem = useCallback(({ item, separators }: ListRenderItemInfo<string>) => {
    if (!item) return null;

    const target = data[item];
    const onPress = () => {
      const { navigate } = navigation;
      const { url, parent, key, subject } = target;
      navigate({ routeName: 'Post', params: { url, parent, key, subject } });
    };

    return (
      <BoardItem
        onPress={onPress}
        onShowUnderlay={separators.highlight}
        onHideUnderlay={separators.unhighlight}
        {...target}
      />
    );
  }, [navigation, data]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const title = useMemo(() => navigation.getParam('title'), [boardId]);

  return (
    <AnimatedContent
      title={title}
      data={list}
      keyExtractor={extractKey}
      renderItem={renderItem}
      ListEmptyComponent={<Placeholder />}
      refreshing={pushing}
      onRefresh={onRefresh}
      ListFooterComponent={appending ? AppendLoading : undefined}
      getItemLayout={getItemLayout}
      initialNumToRender={8}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      removeClippedSubviews
      flat
    />
  );
}
