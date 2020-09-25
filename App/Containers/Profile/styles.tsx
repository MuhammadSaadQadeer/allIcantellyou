import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../Themes';
export const profileInformationStyles = StyleSheet.create({
  profileInfoTextField: {
    borderRightColor: Colors.transparent,
    borderLeftColor: Colors.transparent,
    borderTopColor: Colors.transparent,
    borderBottomColor: Colors.lightGray,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: Fonts.type.regular,
    lineHeight: 19,
  },
});
