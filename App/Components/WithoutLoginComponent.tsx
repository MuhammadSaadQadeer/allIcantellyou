import React, { useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { AppContext } from '../Contexts/AppContext';
import { Colors, Fonts } from '../Themes';
import { LargeText } from './LargeText';
function WithoutLoginComponent(props: any) {
  const appCtx = useContext(AppContext);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: '70%',
      }}
    >
      <LargeText text={props.title} />

      <TouchableOpacity
        onPress={() => {
          appCtx.dispatch({
            type: 'IS_CONTINUE_WITHOUT_LOGIN',
            isContinueWithoutLogin: false,
          });
          props.navigation.navigate('Login');
        }}
        style={{
          alignItems: 'center',
          height: 47,
          backgroundColor: Colors.black,
          justifyContent: 'center',
          marginVertical: 4,
          borderRadius: 6,
          width: '80%',
          marginTop: 20,
          flexDirection: 'row',
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: Fonts.type.regular,
            color: Colors.white,
          }}
        >
          {props.btnTitle}
        </Text>

        <EntypoIcons
          style={{ marginLeft: 10 }}
          name={'login'}
          size={20}
          color={Colors.white}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          props.navigation.goBack();
        }}
        style={{
          alignItems: 'center',
          height: 47,
          backgroundColor: Colors.black,
          justifyContent: 'center',
          marginVertical: 4,
          borderRadius: 6,
          width: '80%',
          marginTop: 20,
          flexDirection: 'row',
        }}
      >
        <EntypoIcons
          style={{ marginRight: 10 }}
          name={'arrow-left'}
          size={20}
          color={Colors.white}
        />
        <Text
          style={{
            fontSize: 16,
            fontFamily: Fonts.type.regular,
            color: Colors.white,
          }}
        >
          {`Go Back`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default WithoutLoginComponent;
