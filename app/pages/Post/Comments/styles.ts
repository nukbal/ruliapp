
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 1,
    justifyContent: 'center',
    borderBottomWidth: 1,
    position: 'relative',
  },
  UserContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  UserText: {
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    paddingRight: 6,
  },
  infoContainer: {
    flex: 1,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  replyContainer: {
    position: 'absolute',
    top: 3,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.85,
  },
  replyText: {
    fontSize: 12,
    paddingLeft: 6,
  },
  iconText: {
    paddingHorizontal: 6,
  },
});
