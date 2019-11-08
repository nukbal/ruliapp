import React, { useContext } from 'react';
import {
  StyleSheet, SectionList, SectionListData, Text, View, TouchableHighlight,
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { bestList, communityList, hobbyList, newsList, gameList } from 'app/config/BoardList';
import ThemeContext from 'app/ThemeContext';
import Title from 'app/components/Title';

const styles = StyleSheet.create({
  item: {
    height: 48,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 16,
  },
  label: {
    paddingLeft: 8,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    borderBottomWidth: 1,
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
    navigate('Board', { title, key });
  };

  const renderItem = ({ item, index }: any) => {
    const onPress = () => onPressItem(item);
    return (
      <TouchableHighlight
        onPress={onPress}
        key={index}
        underlayColor={theme.gray[200]}
        style={styles.item}
      >
        <Text style={[styles.itemText, { color: theme.gray[800] }]}>{item.title}</Text>
      </TouchableHighlight>
    );
  };

  function renderHeader({ section: { title } }: { section: SectionListData<any> }) {
    return (
      <View style={styles.label}>
        <Text style={[styles.labelText, { color: theme.gray[800] }]}>{title}</Text>
      </View>
    );
  }

  function renderFooter() {
    return <View style={[styles.footer, { borderColor: theme.gray[300] }]} />;
  }

  return (
    <SectionList
      sections={sections}
      ListHeaderComponent={<Title label="루리웹" />}
      renderSectionHeader={renderHeader}
      renderSectionFooter={renderFooter}
      renderItem={renderItem}
      stickySectionHeadersEnabled={false}
    />
  );
}
