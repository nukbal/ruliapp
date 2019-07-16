import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components/native';
import { SectionList, SectionListData } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { NavigationScreenProp } from 'react-navigation';
import { transparentize } from 'polished';
import { bestList, communityList, hobbyList, newsList, gameList } from '../config/BoardList';

const List = styled(SectionList)`
  background-color: ${({ theme }) => theme.background};
`;

const Item = styled(TouchableHighlight)`
  height: 45;
  padding-left: 15;
  justify-content: center;
  border-bottom-color: ${({ theme }) => theme.border};
  border-bottom-width: 1;
`;

const Label = styled.View`
  height: 45;
  padding-left: 15;
  justify-content: center;
  background-color: ${({ theme }) => transparentize(0.725, theme.primary)};
`;

const Txt = styled.Text`
  color: ${({ theme }) => theme.text};
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

function renderHeader({ section: { title } }: { section: SectionListData<any> }) {
  return (
    <Label>
      <Txt style={{ fontWeight: '600' }}>{title}</Txt>
    </Label>
  );
}

export default function Drawer({ navigation }: Props) {
  useEffect(() => {
    navigation.setParams({ title: '루리웹' });
  }, []);

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
        <Txt>{item.title}</Txt>
      </Item>
    );
  }, [onPressItem]);

  return (
    <List
      sections={sections}
      renderSectionHeader={renderHeader}
      renderItem={renderItem}
    />
  );
}
