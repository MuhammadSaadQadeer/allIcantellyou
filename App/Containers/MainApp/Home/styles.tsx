import { StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from '../../../Constants';
import { Colors, Fonts } from '../../../Themes';

export const articleStyles = StyleSheet.create({
  articleItemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  avatarTitleSection: {
    flexDirection: 'row',
  },
  badgeContainerStyle: {
    position: 'absolute',
    bottom: -2,
    left: 4,
  },
  articleThumbnail: {
    width: 340,
    height: 218,
    alignSelf: 'center',
    borderRadius: 7,
  },
  articleDescription: { paddingVertical: 12, paddingHorizontal: 2 },
});

export const diaryFeedStyles = StyleSheet.create({
  ntfBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ntfText: {
    fontSize: 10,
    color: Colors.white,
    alignSelf: 'center',
    fontFamily: Fonts.type.bold,
  },
  heartLikesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  heartLikeText: {
    color: Colors.background,
    marginLeft: 5,
    alignSelf: 'center',
  },
  emoticonsContainer: {
    paddingVertical: 13,
    flexDirection: 'row',
    borderTopColor: '#F7F7F7',
    borderBottomColor: '#F7F7F7',
    borderRightColor: Colors.transparent,
    borderLeftColor: Colors.transparent,
    borderWidth: 1,
    width: SCREEN_WIDTH / 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.transparent,
  },
  diaryFeedContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  avatarBadgeStyle: {
    backgroundColor: '#8E77D8',
  },
  avatarTextStyle: {
    color: Colors.white,
  },
  avatarContainerStyle: {
    position: 'absolute',
    bottom: -2,
    left: 4,
  },
  emoticonsParentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const homeStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 23,
  },
  filterSection: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  filterViews: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  quotesSection: {
    marginVertical: 15,
    backgroundColor: '#00BCFF',
    borderRadius: 7,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  quoteView: { justifyContent: 'space-between', flexDirection: 'row' },
  homeNavigation: { flexDirection: 'row', alignItems: 'center' },
  homeNavigationContainer: {
    borderTopColor: Colors.transparent,
    width: '100%',
    alignSelf: 'center',
  },
  homeNavInnerBorder: { color: Colors.transparent },
  homeNavButtonStyle: {
    backgroundColor: Colors.transparent,
  },
  homeNavSelectedBtnStyle: {
    backgroundColor: Colors.transparent,
    color: Colors.background,
  },
});
