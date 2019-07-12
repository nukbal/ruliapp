import React, { useCallback } from 'react';
import styled from 'styled-components/native';
import { SectionList, Text, TouchableHighlight, View, SectionListData } from 'react-native';
import { NavigationScreenProp, SafeAreaView } from 'react-navigation';
import Header from './Header';
import { primary } from '../styles/color';

import { bestList, communityList, hobbyList, newsList, gameList } from '../config/BoardList';

const List = styled(SectionList)`
  padding-top: 45;
  background-color: ${({ theme }) => theme.background};
`;

const Item = styled(TouchableHighlight)`
  height: 45;
  padding-left: 15;
  justify-content: center;
  border-bottom-width: 1;
  border-color: #eee;
`;

const Label = styled.View`
  height: 45;
  padding-left: 15;
  justify-content: center;
  background-color: #eee;
`;

interface Props {
  navigation: NavigationScreenProp<any>;
}

const sections = [
  { title: '뉴스', data: newsList },
  { title: '베스트', data: bestList },
  { title: '취미', data: hobbyList },
  { title: '게임', data: gameList },
  { title: '커뮤니티', data: communityList },
];

export default function Drawer({ navigation }: Props) {
  const renderHeader = useCallback(({ section: { title } }: { section: SectionListData<any> }) => (
    <Label>
      <Text style={{ fontWeight: 'bold' }}>{title}</Text>
    </Label>
  ), []);

  const onPressItem = useCallback(({ key, title }: any) => {
    const { navigate } = navigation;
    navigate({ routeName: 'Board', params: { title, key }, key });
  }, [navigation]);

  const renderItem = useCallback(({ item, index }: any) => {
    const onPress = () => onPressItem(item);
    return (
      <Item
        onPress={onPress}
        key={index}
        underlayColor="#1A70DC"
      >
        <Text>{item.title}</Text>
      </Item>
    );
  }, [onPressItem]);

  return (
    <SafeAreaView>
      <Header label="루리웹" />
      <List
        sections={sections}
        renderSectionHeader={renderHeader}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}
