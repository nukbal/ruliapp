import React, { PureComponent } from 'react';

export default class List extends PureComponent {
  state = {
    visible: true,
  }

  getElement = () => {
    const { type, content } = this.props;
    if (type === 'embeded') {
      return <Text style={styles.text}>{content}</Text>;
    } else if (type === 'image') {
      return <LazyImage source={{ uri: content }} fitScreen />
    } else {
      return <Text style={styles.text}>{content}</Text>;
    }
  }

  setVisible = (visible) => {
    if (this.state.visible !== visible) {
      console.log(this.props.content);
      this.setState({ visible });
    }
  }

  render() {
    const { visible } = this.state;
    if (!visible) return <View style={styles.container} />;
    return (
      <View style={styles.container}>
        {this.getElement()}
      </View>
    );
  }
}
