import React, { useEffect, useContext } from 'react';
import { StyleSheet, SectionList, SectionListData, Text, View } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { NavigationScreenProp } from 'react-navigation';
import { transparentize } from 'polished';
import { bestList, communityList, hobbyList, newsList, gameList } from '../config/BoardList';
import ThemeContext from '../ThemeContext';

const styles = StyleSheet.create({
  item: {
    height: 45,
    paddingLeft: 15,
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  label: {
    height: 45,
    paddingLeft: 15,
    justifyContent: 'center',
  },
});

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

export default function BoardList({ navigation }: Props) {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    navigation.setParams({ title: '루리웹' });
  }, []);

  const onPressItem = ({ key, title }: any) => {
    const { navigate } = navigation;
    navigate({ routeName: 'Board', params: { title, key }, key });
  };

  const renderItem = ({ item, index }: any) => {
    const onPress = () => onPressItem(item);
    return (
      <TouchableHighlight
        onPress={onPress}
        key={index}
        underlayColor={transparentize(0.65, theme.primary)}
        style={[styles.item, { borderBottomColor: theme.border }]}
      >
        <Text style={{ color: theme.text }}>{item.title}</Text>
      </TouchableHighlight>
    );
  };

  function renderHeader({ section: { title } }: { section: SectionListData<any> }) {
    return (
      <View style={[styles.label, { backgroundColor: theme.backgroundSub }]}>
        <Text style={{ fontWeight: '600' }}>{title}</Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      renderSectionHeader={renderHeader}
      renderItem={renderItem}
      style={{ backgroundColor: theme.background }}
    />
  );
}
