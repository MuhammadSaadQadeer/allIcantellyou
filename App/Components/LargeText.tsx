import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Colors, Fonts } from '../Themes';

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.type.light,
    color: Colors.reportRowHeading,
    lineHeight: 22,
    letterSpacing: -0.41,
    textAlign: 'left',
  },
});

interface ILargeTextProps {
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
}

export function LargeText({
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
}: ILargeTextProps) {
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
          fontSize: fontSize ? fontSize : 17,
        },
      ]}
    >
      {text}
    </Text>
  );
}

LargeText.defaultProps = {
  fontFamily: Fonts.type.medium,
  color: Colors.reportRowHeading,
  lineHeight: 22,
  letterSpacing: -0.41,
  textAlign: 'left',
  marginBottom: 0,
  marginTop: 0,
  marginLeft: 0,
};
