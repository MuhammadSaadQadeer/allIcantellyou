import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AppContext } from '../Contexts/AppContext';
import { LargeText } from './LargeText';
import CustomIcon from 'react-native-vector-icons/Feather';
import { Colors } from '../Themes';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childrenContainer: {
    flex: 1,
  },
});

interface IConnectivityProps {
  displayChildrenContainer?: {};
  children: any;
}

function Connectivity(props: IConnectivityProps) {
  const { displayChildrenContainer } = props;
  /** App Context */
  const appCtx = useContext(AppContext);

  /** If internet connectivity is available then show the children */
  if (appCtx.isConnected) {
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
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CustomIcon name='wifi-off' color={Colors.black} size={50} />
      <LargeText text={'No Internet Connection'} />
    </View>
  );
}

export default Connectivity;
