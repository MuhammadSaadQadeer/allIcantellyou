import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Colors } from '../Themes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.transparent,
  },
  childrenContainer: {
    flex: 1,
    backgroundColor: Colors.transparent,
  },
});

interface IAsyncProps {
  displayChildren: boolean;
  containerStyle?: {};
  displayChildrenContainer?: {};
  children: any;
}

function Async(props: IAsyncProps) {
  const { displayChildren, containerStyle, displayChildrenContainer } = props;

  if (!displayChildren) {
    return (
      <View
        style={
          displayChildrenContainer
            ? displayChildrenContainer
            : styles.childrenContainer
        }
      >
        {props.children}
      </View>
    );
  }

  return (
    <View style={containerStyle ? containerStyle : styles.container}>
      <ActivityIndicator size={'large'} color={Colors.darkSkyBlue} />
    </View>
  );
}

export default Async;
