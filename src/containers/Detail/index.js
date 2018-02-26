import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import { getDetailContent, getDetailTitle, requestDetail } from '../../store/ducks/detail';
import { darkBarkground, border, listItem } from '../../styles/color';

export class Detail extends PureComponent {
  static defaultProps = {
    content: [],
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const { prefix, boardId } = params.board;
    this.props.request(prefix, boardId, params.id);
  }

  renderContentRow = (item) => {
    switch(item.type) {
      case 'embeded':
        return (<Text style={styles.TextContent} key={item.key}>{item.content}</Text>);
      case 'image':
        return (
          <Image
            key={item.key}
            resizeMode="cover"
            style={styles.ImageContent}
            source={{ uri: item.content }}
          />
        );
      default:
        return (<Text style={styles.TextContent} key={item.key}>{item.content}</Text>);
        break;
    }
  }

  render() {
    const { content, title } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.content}>
          {content.length > 0 && content.map(this.renderContentRow)}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkBarkground,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 6,
    borderRadius: 3,
    backgroundColor: listItem,
    borderBottomColor: border,
    borderBottomWidth: 1,
  },
  titleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 8,
    borderRadius: 3,
    backgroundColor: listItem,
    justifyContent: 'flex-start',
  },
  TextContent: {
    marginBottom: 6,
    color: 'white',
  },
  ImageContent: {
    marginBottom: 8,
    flex: 1,
    width: null,
    height: null,
  }
});

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(requestDetail, dispatch),
  };
}

function mapStateToProps(state) {
  return {
    title: getDetailTitle(state),
    content: getDetailContent(state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
