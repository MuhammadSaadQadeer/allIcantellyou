import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { ArticleSvg, DiaryFeedSvg } from '../../Svgs';
import { Colors } from '../../Themes';
interface IMaterialTopTab {
  navigation: NavigationScreenProp<NavigationState>;
}
const styles = StyleSheet.create({
  tabView: {
    height: DeviceInfo.hasNotchSync() ? 46 : 36,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderWidth: 0.3,
    borderColor: Colors.tabViewBorder,
  },
  label: {
    fontSize: 14,
    letterSpacing: 0.16,
    color: Colors.lightGray,
    paddingHorizontal: 2,
  },
});

function MaterialTopTab(props: IMaterialTopTab) {
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
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          //  marginBottom: 10,
        }}
      >
        {params.iconName === 'article' ? <ArticleSvg size={25} /> : null}
        {params.iconName === 'diary' ? <DiaryFeedSvg size={25} /> : null}

        <Text
          style={[
            styles.label,
            { color: isActive ? Colors.black : Colors.lightGray },
          ]}
        >
          {params.label}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default MaterialTopTab;
