import React, { useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { TabContext } from '../../Containers/MainApp/Home/Context';
import { Colors } from '../../Themes';
import { NormalText } from '../NormalText';
function BackButton(props) {
  const tabContext = useContext(TabContext);
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (props.routeName) {
            props.navigation.navigate(props.routeName);
          } else {
            props.navigation.goBack();
          }
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        {props.isOnlyIcon ? (
          <EntypoIcon name={'chevron-left'} color={Colors.black} size={20} />
        ) : (
          <>
            <EntypoIcon name={'chevron-left'} color={Colors.black} size={20} />
            <NormalText
              text={props.navTitle ? props.navTitle : 'Back'}
              color={Colors.black}
            />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default BackButton;
