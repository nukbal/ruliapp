import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import { styles } from './index';
import { styles as ContentStyle } from './Contents';

const style = StyleSheet.create({
  placeholder: {
    backgroundColor: '#dedede',
    marginBottom: 8,
    height: 16,
  },
});

const inlineStyle = [ContentStyle.container, style.placeholder];

export default function PostPlaceholder() {
  return (
    <ScrollView>
      <View style={styles.title}>
        <View style={[style.placeholder, { width: '65%', height: 20 }]} />
        <View style={[style.placeholder, { width: '45%' }]} />
      </View>
      <View style={[ContentStyle.container, { paddingTop: 16, paddingBottom: 16 }]}>
        <View style={[...inlineStyle, { width: '100%', height: 200 }]} />
        <View style={[...inlineStyle, { width: '100%' }]} />
        <View style={[...inlineStyle, { width: '100%' }]} />
        <View style={[...inlineStyle, { width: '75%' }]} />
      </View>
    </ScrollView>
  );
}
