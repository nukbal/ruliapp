import React, { useCallback } from 'react';
import styled from 'styled-components/native';
import { NavigationScreenProp } from 'react-navigation';
import {
  FlatList,
  StatusBar,
  ActivityIndicator,
  View,
  ListRenderItemInfo,
  Text,
  Platform,
} from 'react-native';

// import SearchBar from './SearchBar';
import BoardItem from './BoardItem';
import itemStyles from './BoardItem/styles';
import { darkBarkground } from '../../styles/color';
import Placeholder from './placeholder';
import useBoard from './useBoard';

const Container = styled.View`
  flex: 1;
  background-color: ${darkBarkground};
  align-items: stretch;
  justify-content: center;
`;

const AppendLoading = (
  <View style={[itemStyles.container, { alignItems: 'center' }]}>
    <ActivityIndicator />
  </View>
);

function extractKey(item: string) {
  return item;
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

  const getItemLayout = useCallback(
    (_: any, index: number) => ({ length: 75, offset: 75 * index, index }),
    [],
  );

  if (!boardId) {
    return (
      <Container style={{ alignItems: 'center' }}>
        <Text>Please select board</Text>
      </Container>
    );
  }

  return (
    <Container>
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
        removeClippedSubviews
      />
      {Platform.OS === 'ios' && (<StatusBar barStyle="light-content" />)}
    </Container>
  );
}

Board.navigationOptions = ({ navigation }: Props) => {
  const title = navigation.getParam('title', 'Ruliapp');
  return {
    title: title || '',
  };
};
