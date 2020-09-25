import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import {
  ConversationsSvg,
  DiaryFeedSvg,
  EventsSvg,
  HomeSvg,
  MyStorySvg,
} from '../../Svgs';
import { Colors } from '../../Themes';

const styles = StyleSheet.create({
  tabView: {
    height: DeviceInfo.hasNotchSync() ? 66 : 56,
    flexDirection: 'row',
    backgroundColor: Colors.tabViewBg,
    borderWidth: 0.3,
    borderColor: Colors.tabViewBorder,
  },
  label: {
    fontSize: 9,
    letterSpacing: 0.16,
    color: Colors.text,
    alignSelf: 'center',
    //  marginTop: Platform.OS === 'ios' ? 7 : 0,
  },
});

interface ITabBarProps {
  navigation: NavigationScreenProp<NavigationState>;
}

function TabBar(props: ITabBarProps) {
  const { navigation } = props;
  const { routes, index } = navigation.state;

  return (
    <View style={styles.tabView}>
      {routes.map((route, i) => (
        <TabItem
          navigation={navigation}
          key={route.routeName}
          {...route}
          isActive={index === i}
        />
      ))}
    </View>
  );
}

function TabItem(props) {
  const { isActive, params } = props;

  /**
   * Navigates to the selected tab
   *
   * @method handlePress
   *
   * @returns {void}
   */
  function handlePress() {
    props.navigation.navigate(props.routeName);
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: Platform.OS === 'ios' ? 10 : 0,
        }}
      >
        {params.iconName === 'home' ? <HomeSvg size={23} /> : null}
        {params.iconName === 'event' ? <EventsSvg size={23} /> : null}
        {params.iconName === 'story' ? <MyStorySvg size={23} /> : null}
        {params.iconName === 'diary' ? <DiaryFeedSvg size={23} /> : null}
        {params.iconName === 'convos' ? <ConversationsSvg size={23} /> : null}

        <Text
          style={[
            styles.label,
            { color: isActive ? Colors.activeBlue : Colors.black },
          ]}
        >
          {params.label}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default TabBar;
