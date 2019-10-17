import React, { useContext, useEffect } from 'react';
import {
  StyleSheet, SectionList, SectionListData, Text, View, TouchableHighlight, Platform,
  BackHandler,
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

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    let back: ReturnType<typeof BackHandler.addEventListener> | undefined;
    const focusSub = navigation.addListener('didFocus', () => {
      back = BackHandler.addEventListener('hardwareBackPress', BackHandler.exitApp);
    });
    const blurSub = navigation.addListener('willBlur', () => {
      if (back) back.remove();
    });
    return () => {
      if (back) back.remove();
      focusSub.remove();
      blurSub.remove();
    };
  }, [navigation]);

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
        style={[styles.item, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.itemText, { color: theme.text }]}>{item.title}</Text>
      </TouchableHighlight>
    );
  };

  function renderHeader({ section: { title } }: { section: SectionListData<any> }) {
    return (
      <View style={styles.label}>
        <Text style={[styles.labelText, { color: theme.primaryLight }]}>{title}</Text>
      </View>
    );
  }

  function renderFooter() {
    return <View style={[styles.footer, { borderColor: theme.border }]} />;
  }

  return (
    <SectionList
      sections={sections}
      ListHeaderComponent={<Title label="루리웹" />}
      renderSectionHeader={renderHeader}
      renderSectionFooter={renderFooter}
      renderItem={renderItem}
      style={{ backgroundColor: theme.background }}
      stickySectionHeadersEnabled={false}
    />
  );
}
