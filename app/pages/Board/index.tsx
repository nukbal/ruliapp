import React, { useCallback, useContext } from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { View, FlatList } from 'react-native';
import { ActivityIndicator, ListRenderItemInfo } from 'react-native';

// import SearchBar from './SearchBar';
import BoardItem from './BoardItem';
import Placeholder from './placeholder';
import useBoard from './useBoard';
import ThemeContext from '../../ThemeContext';

const AppendLoading = (
  <View style={{ height: 75, alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator />
  </View>
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
  const { theme } = useContext(ThemeContext);

  const renderItem = useCallback(({ item, separators }: ListRenderItemInfo<string>) => {
    if (!item) return null;

    const target = data[item];
    const onPress = () => {
      const { navigate } = navigation;
      const { url, parent, key, subject } = target;
      navigate({ routeName: 'Post', params: { url, parent, key, title: subject } });
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

  return (
    <FlatList
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
      style={{ backgroundColor: theme.background }}
    />
  );
}
