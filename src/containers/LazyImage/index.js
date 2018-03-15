import React, { PureComponent } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import SHA1 from "crypto-js/sha1";
import hoistNonReactStatics from 'hoist-non-react-statics';

import { getImageUrl, getImageProgress, getImageSize, addImageCache, isImageReady } from '../../store/ducks/cache';
import LazyImage from '../../components/LazyImage';

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(addImageCache, dispatch),
  };
}

function mapStateToProps(state, props) {
  const { id } = props;
  return {
    path: getImageUrl(id)(state),
    progress: getImageProgress(id)(state),
    isReady: isImageReady(id)(state),
    ...getImageSize(id)(state),
  };
}

const withShaId = (WrappedComponent) => {
  function ConnectWithSha(props) {
    const id = SHA1(props.source.uri) + '';
    return (<WrappedComponent id={id} {...props} />);
  }

  return hoistNonReactStatics(ConnectWithSha, WrappedComponent);
}

export default compose(
  withShaId,
  connect(mapStateToProps, mapDispatchToProps),
)(LazyImage);
