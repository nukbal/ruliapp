import { View, Text, StyleSheet } from 'react-native';
import { primary } from '../../styles/color';

export default StyleSheet.create({
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
    backgroundColor: '#fff',
  },
  wrapper: {
    flex: 1,
    backgroundColor: primary,
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
  }
});
