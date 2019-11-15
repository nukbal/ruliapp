import React, { useState, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  StyleSheet, SectionList, SectionListData, Text, View, TouchableHighlight,
} from 'react-native';

import { bestList, communityList, hobbyList, newsList, gameList } from 'app/config/BoardList';
import Title from 'app/components/Title';
import SearchBar from 'app/components/SearchBar';
import Divider from 'app/components/Divider';
import { getTheme } from 'app/stores/theme';

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
});

interface Props {
  navigation: any;
}

export default function BoardList({ navigation }: Props) {
  const theme = useSelector(getTheme);
  const [search, setSearch] = useState('');

  const onPressItem = ({ key, title }: any) => {
    const { navigate } = navigation;
    navigate('board', { title, key });
  };

  const renderItem = ({ item, index }: any) => {
    const onPress = () => onPressItem(item);
    return (
      <TouchableHighlight
        onPress={onPress}
        key={index}
        underlayColor={theme.gray[100]}
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

  const sections = useMemo(() => {
    function filter(item: { key: string; title: string }) {
      return item.title.indexOf(search) > -1;
    }
    return [
      { title: '뉴스', data: newsList.filter(filter) },
      { title: '베스트', data: bestList.filter(filter) },
      { title: '취미', data: hobbyList.filter(filter) },
      { title: '게임', data: gameList.filter(filter) },
      { title: '커뮤니티', data: communityList.filter(filter) },
    ];
  }, [search]);

  return (
    <SectionList
      sections={sections}
      ListHeaderComponent={(
        <>
          <Title label="루리웹" />
          <SearchBar onChange={setSearch} />
        </>
      )}
      renderSectionHeader={renderHeader}
      renderSectionFooter={() => <Divider />}
      renderItem={renderItem}
      stickySectionHeadersEnabled={false}
    />
  );
}
