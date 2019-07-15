import React, { useCallback } from 'react';
import styled from 'styled-components/native';
import { SectionList, SectionListData } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { NavigationScreenProp } from 'react-navigation';
import AnimatedContent from './AnimatedContent';
import { bestList, communityList, hobbyList, newsList, gameList } from '../config/BoardList';

const Item = styled(TouchableHighlight)`
  height: 45;
  padding-left: 15;
  justify-content: center;
  border-bottom-width: 1;
  border-color: #444;
`;

const Label = styled.View`
  height: 45;
  padding-left: 15;
  justify-content: center;
  background-color: #444;
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

export default function Drawer({ navigation }: Props) {
  const renderHeader = useCallback(({ section: { title } }: { section: SectionListData<any> }) => (
    <Label>
      <Txt style={{ fontWeight: '600' }}>{title}</Txt>
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
        <Txt>{item.title}</Txt>
      </Item>
    );
  }, [onPressItem]);

  return (
    <AnimatedContent title="루리웹">
      <SectionList
        sections={sections}
        renderSectionHeader={renderHeader}
        renderItem={renderItem}
      />
    </AnimatedContent>
  );
}
