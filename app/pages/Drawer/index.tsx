import React, { useCallback } from 'react';
import { StyleSheet, SectionList, Text, TouchableHighlight, View, SectionListData } from 'react-native';
import { NavigationScreenProp, NavigationActions, StackActions, SafeAreaView } from 'react-navigation';
import { primary } from '../../styles/color';

import { bestList, communityList, hobbyList, newsList, gameList } from '../../config/BoardList';

const styles = StyleSheet.create({
  container: {
    height: 45,
    flex: 1,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'baseline',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    color: 'black',
  },
  header: {
    height: 45,
    backgroundColor: primary,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 15,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

interface Props {
  navigation: NavigationScreenProp<any>;
}

export default function Drawer({ navigation }: Props) {
  const sections = [
    { title: '뉴스', data: newsList },
    { title: '베스트', data: bestList },
    { title: '취미', data: hobbyList },
    { title: '게임', data: gameList },
    { title: '커뮤니티', data: communityList },
  ];

  const renderHeader = useCallback(({ section: { title } }: { section: SectionListData<any> }) => (
    <View style={[styles.container, { backgroundColor: '#eee' }]}>
      <Text style={{ fontWeight: 'bold' }}>{title}</Text>
    </View>
  ), []);

  const onPressItem = useCallback(({ key, title }: any) => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Board', params: { title, key }, key }),
      ],
    });
    navigation.dispatch(resetAction);
  }, [navigation]);

  const renderItem = useCallback(({ item, index }: any) => {
    const onPress = () => onPressItem(item);
    return (
      <TouchableHighlight
        style={styles.container}
        onPress={onPress}
        key={index}
        underlayColor="#1A70DC"
      >
        <Text style={styles.text}>{item.title}</Text>
      </TouchableHighlight>
    );
  }, [onPressItem]);

  return (
    <SafeAreaView style={[styles.wrapper, { backgroundColor: primary }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>게시판</Text>
      </View>
      <SectionList
        sections={sections}
        renderSectionHeader={renderHeader}
        renderItem={renderItem}
        style={{ backgroundColor: 'white' }}
      />
    </SafeAreaView>
  );
}
