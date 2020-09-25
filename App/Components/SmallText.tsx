import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Colors, Fonts } from '../Themes';

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.type.regular,
    color: Colors.text,
    lineHeight: 13,
    textAlign: 'left',
  },
});

interface ISmallTextProps {
  text: string;
  fontFamily?: string;
  color?: string;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: any;
  flex?: number;
  flexWrap?: any;
  marginBottom?: number;
  marginTop?: number;
  marginLeft?: number;
  fontSize?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  marginRight?: number;
}

export function SmallText({
  text,
  fontFamily,
  color,
  lineHeight,
  letterSpacing,
  textAlign,
  flex,
  flexWrap,
  marginTop,
  marginBottom,
  marginLeft,
  fontSize,
  paddingHorizontal,
  paddingVertical,
  marginRight,
}: ISmallTextProps) {
  return (
    <Text
      style={[
        styles.text,
        {
          fontFamily,
          color,
          lineHeight,
          letterSpacing,
          textAlign,
          flex: flex ? flex : undefined,
          flexWrap: flexWrap ? flexWrap : undefined,
          marginTop,
          marginBottom,
          marginLeft,
          fontSize: fontSize ? fontSize : 13,
          paddingHorizontal: paddingHorizontal ? paddingHorizontal : undefined,
          paddingVertical: paddingVertical ? paddingVertical : undefined,
          marginRight: marginRight ? marginRight : undefined,
        },
      ]}
    >
      {text}
    </Text>
  );
}

SmallText.defaultProps = {
  fontFamily: Fonts.type.regular,
  color: Colors.text,
  lineHeight: 19,
  letterSpacing: undefined,
  textAlign: 'left',
  marginBottom: 0,
  marginTop: 0,
  marginLeft: 0,
};
