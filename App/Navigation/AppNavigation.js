import React from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator, Header } from 'react-navigation-stack';
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
} from 'react-navigation-tabs';
import MaterialTopTab from '../Components/General/MaterialTopTab';
import TabBar from '../Components/General/TabBar';
import Login from '../Containers/AuthNav/Login';
import Signup from '../Containers/AuthNav/Signup';
import AddNewTopic from '../Containers/Conversations/AddNewTopic';
import Conversations from '../Containers/Conversations/Conversation';
import ConversationView from '../Containers/Conversations/ConversationView';
import ReplyConvo from '../Containers/Conversations/ReplyConvo';
import AddNewDiaryPost from '../Containers/Diary/AddNewDiaryPost';
import MyDiary from '../Containers/Diary/MyDiary';
import Events from '../Containers/Events/Events';
import Introduction from '../Containers/Intro/Introduction';
import ArticleAuthorProfile from '../Containers/MainApp/Home/ArticleAuthorProfile';
import Articles from '../Containers/MainApp/Home/Articles';
import DiaryFeed from '../Containers/MainApp/Home/DiaryFeed';
import {
  default as HelpfulLinkDetail,
  default as HelpFulLinkDetails,
} from '../Containers/MainApp/Home/HelpFulLinkDetail';
import HelpfulLinks from '../Containers/MainApp/Home/HelpfulLinks';
import ViewArticle from '../Containers/MainApp/Home/ViewArticle';
import MyNotifications from '../Containers/Notifications/MyNotifications';
import Profile from '../Containers/Profile/Profile';
import Search from '../Containers/Search/Search';
import ViewArticleInSearch from '../Containers/Search/ViewArticleInSearch';
import Questions from '../Containers/Story/Questions';
import Story from '../Containers/Story/Story';
import { Colors, Fonts } from '../Themes';

/** Default header config for stack navigation */
const headerDefaultConfig = {
  header: (props) => <Header {...props} />,
  headerStyle: {
    backgroundColor: Colors.headerPrimary,
    elevation: 0,
    height: 44,
  },
  headerForceInset: { top: 'never', bottom: 'never' },
  headerTitleContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    left: 0,
    right: 0,
    position: 'relative',
  },
  headerTitleStyle: {
    fontWeight: undefined, // React Navigation bug https://github.com/react-navigation/rieact-navigation/issues/542
    color: Colors.white,
    textAlign: 'center',
    flex: 1,
    alignSelf: 'center',
    fontFamily: Fonts.type.medium,
    fontSize: 17,
    lineHeight: 22,
  },
  headerLeft: (navigation) => {
    /** If it's the first screen of the stack, don't show the back button */
    if (navigation.scene.index === 0) return null;
    return (
      <TouchableOpacity
        onPress={navigation.onPress}
        // style={styles.backButtonContainer}
      >
        {/* <Icon name='arrow-left' color={Colors.white} size={20} /> */}
        <Text>Back</Text>
      </TouchableOpacity>
    );
  },
  headerTintColor: Colors.transparent,
  gesturesEnabled: false,
};

const ArticlesNav = createStackNavigator(
  {
    Articles: {
      screen: Articles,
    },
    ViewArticle: {
      screen: ViewArticle,
    },
    ViewArticleAuthor: {
      screen: ArticleAuthorProfile,
    },
  },
  {
    initialRouteName: 'Articles',
    headerMode: 'none',
    swipeEnabled: true,
  },
);

const HelpfulLinksNav = createStackNavigator(
  {
    HelpfulLinks: { screen: HelpfulLinks },
    HelpfulLinkDetail: { screen: HelpFulLinkDetails },
  },
  {
    initialRouteName: 'HelpfulLinks',
    headerMode: 'none',
    swipeEnabled: true,
  },
);

const Home = createMaterialTopTabNavigator(
  {
    DiaryFeed: {
      screen: DiaryFeed,
      params: {
        label: 'DiaryFeed',
        iconName: 'diary',
      },
    },
    Articles: {
      screen: ArticlesNav,
      params: {
        label: 'Articles',
        iconName: 'article',
      },
    },

    HelpfulLinks: {
      screen: HelpfulLinksNav,
      params: {
        label: 'HelpfulLinks',
        iconName: 'links',
      },
    },
  },
  {
    //defaultNavigationOptions: { ...headerDefaultConfig },
    initialRouteName: 'Articles',
    swipeEnabled: true,
    tabBarComponent: ({ navigation }) => (
      <MaterialTopTab navigation={navigation} />
    ),
  },
);

const HomeAndroid = createMaterialTopTabNavigator(
  {
    Articles: {
      screen: ArticlesNav,
      params: {
        label: 'Articles',
        iconName: 'article',
      },
    },
    DiaryFeed: {
      screen: DiaryFeed,
      params: {
        label: 'DiaryFeed',
        iconName: 'diary',
      },
    },

    HelpfulLinks: {
      screen: HelpfulLinksNav,
      params: {
        label: 'HelpfulLinks',
        iconName: 'links',
      },
    },
  },
  {
    //defaultNavigationOptions: { ...headerDefaultConfig },
    initialRouteName: 'Articles',
    swipeEnabled: true,
    tabBarComponent: ({ navigation }) => (
      <MaterialTopTab navigation={navigation} />
    ),
  },
);

const MyStoryNav = createStackNavigator(
  {
    Story: {
      screen: Story,
    },

    Questions: {
      screen: Questions,
    },
  },
  {
    initialRouteName: 'Story',
    headerMode: 'none',
    swipeEnabled: true,
    lazy: false,
  },
);

const ConversationsNav = createStackNavigator(
  {
    Conversations: {
      screen: Conversations,
    },
    ConversationView: {
      screen: ConversationView,
    },
    ReplyToConvo: {
      screen: ReplyConvo,
    },
    AddNewTopic: {
      screen: AddNewTopic,
    },
    AuthorProfileConv: {
      screen: ArticleAuthorProfile,
    },
  },
  {
    initialRouteName: 'Conversations',
    headerMode: 'none',
    swipeEnabled: true,
    lazy: false,
  },
);

const NotificationNav = createStackNavigator(
  {
    Notifications: {
      screen: MyNotifications,
    },
    Search: {
      screen: Search,
    },
    ViewArticleInSearch: {
      screen: ViewArticleInSearch,
    },
    MemberProfile: {
      screen: ArticleAuthorProfile,
    },
  },
  {
    initialRouteName: 'Notifications',
    headerMode: 'none',
    swipeEnabled: true,
    lazy: false,
  },
);

const MyDiaryNav = createStackNavigator(
  {
    MyDiary: {
      screen: MyDiary,
    },
    AddNewDiaryPost: {
      screen: AddNewDiaryPost,
    },
    ViewDiaryAuthor: {
      screen: ArticleAuthorProfile,
    },
  },
  {
    initialRouteName: 'MyDiary',
    headerMode: 'none',
    swipeEnabled: true,
    lazy: false,
  },
);

/** Tab Navigation Stack - Each tab will have it's own navigation stack */
const MainApp = createBottomTabNavigator(
  {
    HomeNav: {
      screen: Platform.OS === 'ios' ? Home : HomeAndroid,
      params: {
        label: 'Home',
        iconName: 'home',
      },
    },
    Conversations: {
      screen: ConversationsNav,
      params: {
        label: 'Conversations',
        iconName: 'convos',
      },
    },
    Events: {
      screen: Events,
      params: {
        label: 'Events',
        iconName: 'event',
      },
    },
    Story: {
      screen: MyStoryNav,
      params: {
        label: 'My Story',
        iconName: 'story',
      },
    },
    Diary: {
      screen: MyDiaryNav,
      params: {
        label: 'My Diary',
        iconName: 'diary',
      },
    },
  },
  {
    // defaultNavigationOptions: { ...headerDefaultConfig },
    initialRouteName: 'HomeNav',
    lazy: true,

    swipeEnabled: false,
    tabBarComponent: ({ navigation }) => <TabBar navigation={navigation} />,
  },
);

const ActionItems = createStackNavigator(
  {
    Profile: {
      screen: Profile,
    },

    HelpfulLinkDetail: {
      screen: HelpfulLinkDetail,
    },
  },
  {
    initialRouteName: 'Profile',
    headerMode: 'none',
    // defaultNavigationOptions: { ...headerDefaultConfig },
    /** determines if the stack has header or not*/
  },
);

/** AuthNav contains the authentication screens */
const AuthNav = createStackNavigator(
  {
    Signup: {
      screen: Signup,
    },
    Login: { screen: Login },
  },
  {
    initialRouteName: 'Login',
    /** determines if the stack has header or not*/
    headerMode: 'none',
  },
);

const AppNav = createSwitchNavigator(
  {
    NotificationNav: { screen: NotificationNav },
    AuthNav: { screen: AuthNav },
    MainApp: { screen: MainApp },
    ActionItems: { screen: ActionItems },
    Introduction: { screen: Introduction },
  },
  {
    initialRouteName: 'Introduction',
  },
);

const RootStack = createStackNavigator(
  {
    MainStack: {
      screen: AppNav,
    },
  },
  {
    /** Detemines if the screen is a modal or card */
    mode: 'modal',
    /** determines if the stack has header or not*/
    headerMode: 'none',
  },
);

export default createAppContainer(RootStack);
