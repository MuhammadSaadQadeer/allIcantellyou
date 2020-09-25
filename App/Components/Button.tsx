import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NormalText } from './NormalText';
import { Colors } from '../Themes';

const styles = StyleSheet.create({
  linkContainer: {
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingLeft: 15,
  },
  buttonContainer: {
    height: 59,
    flex: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.white,
    borderWidth: 2,
  },
});

interface IButtonProps {
  disabled?: boolean;
  buttonText: string;
  onPress: () => void;
  textColor?: string;
  isLink: boolean;
  backgroundColor?: string;
  alignSelf?: string;
  isLoading?: boolean;
  decoration?: boolean;
}

export function Button(props: IButtonProps) {
  if (props.isLink) {
    return (
      <TouchableOpacity
        style={[
          styles.linkContainer,
          {
            alignSelf: props.alignSelf ? props.alignSelf : undefined,
            opacity: props.disabled ? 0.5 : 1,
          },
        ]}
        onPress={props.onPress}
        disabled={props.disabled}
      >
        <NormalText
          text={props.buttonText}
          color={props.textColor ? props.textColor : Colors.button}
          letterSpacing={0.36}
          decoration={props.decoration ? true : false}
        />
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          backgroundColor: props.backgroundColor,
          opacity: props.disabled ? 0.5 : 1,
        },
      ]}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      {props.isLoading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <NormalText
          text={props.buttonText}
          color={props.textColor ? props.textColor : Colors.button}
          letterSpacing={0.36}
        />
      )}
    </TouchableOpacity>
  );
}

Button.defaultProps = {
  disabled: false,
  buttonText: '',
  onPress: () => {},
  textColor: Colors.white,
  isLink: true,
};
