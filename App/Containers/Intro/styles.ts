import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../Themes';

export const introductionStyles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  introText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.type.semi_bold,
    marginVertical: 26,
  },
});
