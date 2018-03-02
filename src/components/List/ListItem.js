import React, { PureComponent } from 'react';

export default class ListItem extends PureComponent {
  state = {
    visible: true,
  }

  setVisible = (visible) => {
    if (this.state.visible !== visible) {
      this.setState({ visible });
    }
  }
}
