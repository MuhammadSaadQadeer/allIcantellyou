import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../Themes';

export const eventsStyle = StyleSheet.create({
  thumbnailContainer: {
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    alignSelf: 'stretch',
  },
  imageStyles: {
    justifyContent: 'center',
    width: '100%',
    height: 185,
  },
  suitableButtonContainer: {
    flexDirection: 'row',
    right: 15,
    bottom: 2,
    position: 'absolute',
  },
  suitableForBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: Colors.background,
    borderRadius: 7,
    marginRight: 15,
  },
  timingBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    borderRadius: 7,
  },
  dateTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  eventDay: {
    padding: 2,
    fontSize: 29,
    fontFamily: Fonts.type.regular,
  },
  eventTitle: {
    flex: 1,
    flexWrap: 'wrap',
    color: Colors.black,
    fontFamily: Fonts.type.regular,
    fontSize: 16,
  },
  descriptionContainer: {
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
  },
  ticketsBtn: {
    borderColor: Colors.background,
    borderRadius: 7,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  commentsBtn: {
    flexWrap: 'wrap',
    width: 'auto',
    height: 'auto',
    position: 'absolute',
    right: 10,
    marginBottom: 10,
  },
  hashTagContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
  },
  searchBarContainer: {
    backgroundColor: Colors.transparent,
    borderTopColor: Colors.transparent,
    borderBottomColor: Colors.transparent,
    paddingHorizontal: 18,
  },
});
