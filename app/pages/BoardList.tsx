import React, { useContext } from 'react';
import { StyleSheet, SectionList, SectionListData, Text, View, TouchableHighlight } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { bestList, communityList, hobbyList, newsList, gameList } from '../config/BoardList';
import ThemeContext from '../ThemeContext';

const styles = StyleSheet.create({
  item: {
    height: 50,
    paddingLeft: 15,
    justifyContent: 'center',
    marginBottom: 1,
  },
  label: {
    height: 40,
    paddingLeft: 15,
    justifyContent: 'center',
  },
  boldText: {
    fontWeight: '900',
    fontSize: 16,
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
        underlayColor={theme.primaryHover}
        style={[styles.item, { backgroundColor: theme.backgroundLight }]}
      >
        <Text style={{ color: theme.text }}>{item.title}</Text>
      </TouchableHighlight>
    );
  };

  function renderHeader({ section: { title } }: { section: SectionListData<any> }) {
    return (
      <View style={styles.label}>
        <Text style={[styles.boldText, { color: theme.text }]}>{title}</Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      renderSectionHeader={renderHeader}
      renderItem={renderItem}
      style={{ backgroundColor: theme.background }}
      stickySectionHeadersEnabled={false}
    />
  );
}
