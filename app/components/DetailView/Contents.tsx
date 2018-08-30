import React, { Component } from 'react';
import { View, Text, StyleSheet, WebView } from 'react-native';

import { listItem } from '../../styles/color';

import LazyImage from '../LazyImage';

import realm from '../../store/realm';

async function loadItem(key: string) {
  return new Promise((res, rej) => {
    try {
      const data: ContentRecord | undefined = realm.objectForPrimaryKey('Content', key);
      let response;
      if (data) response = data;
      res(response);
    } catch (e) {
      rej(e);
    }
  });
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: listItem,
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 4,
    paddingBottom: 4,
    margin: 0,
  },
  text: {
    marginBottom: 6,
    color: 'black',
    lineHeight: 21,
    justifyContent: 'flex-start',
  },
});

function renderContent({ type, content }: ContentRecord) {
  if (!type || !content) return null;

  switch (type) {
    case 'reference': {
      return <Text style={[styles.container, styles.text]}>출처: {content}</Text>;
    }
    case 'object': {
      return (
        <WebView
          style={[styles.container]}
          // @ts-ignore
          source={{ uri: content }}
          javaScriptEnabled
        />
      );
    }
    case 'image': {
      // @ts-ignore
      return <LazyImage source={{ uri: content }} />;
    }
    default: {
      return <Text style={styles.text}>{content}</Text>;
    }
  }
}


export default class ContentItem extends Component<{ id: string }, { loading: boolean }> {
  state = { loading: true };


  async componentDidMount() {
    const record = await loadItem(this.props.id);
    if (record) {
      // @ts-ignore
      this.record = record;
      this.setState({ loading: false });
    }
  }

  shouldComponentUpdate(_: any, state: { loading: boolean }) {
    return state.loading !== this.state.loading;
  }

  record: ContentRecord | undefined;

  render() {
    if (!this.record || this.state.loading) {
      return <View style={styles.container} />;
    }
    console.log(this.record);
    return renderContent(this.record);
  }
}

