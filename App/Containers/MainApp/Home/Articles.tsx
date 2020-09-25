import AsyncStorage from '@react-native-community/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Linking,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar, Divider } from 'react-native-elements';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {
  FlatList,
  NavigationEvents,
  NavigationScreenProp,
  NavigationState,
  ScrollView,
} from 'react-navigation';
import Async from '../../../Components/Async';
import Connectivity from '../../../Components/Connectivity';
import NoRecords from '../../../Components/NoRecords';
import { NormalText } from '../../../Components/NormalText';
import { SmallText } from '../../../Components/SmallText';
import Urls from '../../../Constants/Urls';
import { AppContext } from '../../../Contexts/AppContext';
import { displayInDays, saveInAsyncStorage } from '../../../Lib/Utils';
import Api from '../../../Services/Api';
import {
  AgeingSvg,
  ChallengesSvg,
  HappinessSvg,
  LogoSvg,
  MentalHealthSvg,
  RelationShipSvg,
  StartSvg,
} from '../../../Svgs';
import { Colors, Fonts } from '../../../Themes';
import { storyStyles } from '../../Story/styles';
import { articleStyles, homeStyles } from '../Home/styles';
import quotes from './inspirationQuote';
export interface Articles {
  id: string;
  title: string;
  shortDescription: string;
  tags: [];
  type: string;
  rank: string;
  severity: string;
  createdAt: string;
  publishedAt: string;
  author: {
    id: string;
    displayName: string;
    isGuestAuthor: boolean;
    avatar: string;
  };
  images: [{ id: string; thumbUrl: string; originalUrl: string }];
}

interface IArticleProps {
  navigation: NavigationScreenProp<NavigationState>;
  articles: Articles;
}

function Articles(props: IArticleProps) {
  const appCtx = useContext(AppContext);
  const [hideQuote, setHideQuote] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [paginationKey, setPaginationKey] = useState('');
  const [displayQuote, setDisplayQuote] = useState('');
  const [isFilter, setIsFilter] = useState(false);
  const [pageLimit, setPageLimit] = useState(2);
  const [filterName, setFilterName] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [listEndReached, setListEndReached] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(true);
  const [filterNavState, setFilterNavState] = useState({
    all: false,
    mental: false,
    happiness: false,
    relations: false,
    aging: false,
    challeng: false,
    positivity: false,
  });
  useEffect(() => {
    fetchArticlesOnMount();
    setDisplayQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setPageLimit(2);
  }, []);

  useEffect(() => {
    if (props.navigation.getParam('refresh')) {
      fetchArticlesOnMount();
    }
  }, [props.navigation.getParam('refresh')]);
  useEffect(() => {
    Api({
      method: 'GET',
      url: Urls.profile.me,
    })
      .then((result) => {
        appCtx.dispatch({
          type: 'SET_PROFILE_DATA',
          profileData: result.data,
        });
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {}, [listEndReached]);
  /**
   *  onRefresh will be called when the
   *  user will refresh the report screen
   *  by pulling scroll view downwards
   */
  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    Api({
      method: 'GET',
      url: Urls.home.articles,
    })
      .then((result) => {
        setArticles(result.data);
        setPaginationKey(result.data[result.data.length - 1].paginationKey);
        setIsRefreshing(false);
      })
      .catch((error) => {
        setIsRefreshing(false);
      });
  }, []);

  function fetchArticlesOnMount() {
    setFilterNavState({
      all: true,
      mental: false,
      happiness: false,
      relations: false,
      aging: false,
      challeng: false,
      positivity: false,
    });
    setIsLoading(true);
    Api({
      method: 'GET',
      url: Urls.home.articles,
    })
      .then((result) => {
        AsyncStorage.getItem('blockedUsers')
          .then((blockedUsers) => {
            if (blockedUsers) {
              JSON.parse(blockedUsers).map((id) => {
                var removeIndex = result.data
                  .map((item) => {
                    return item.author.id;
                  })
                  .indexOf(id);
                result.data.splice(removeIndex, 1);
              });
              setArticles(result.data);
              setIsLoading(false);
            } else {
              setArticles(result.data);
              setIsLoading(false);
            }
          })
          .catch((error) => {
            setArticles(result.data);
            setIsLoading(false);
          });

        AsyncStorage.getItem('articles')
          .then((articles) => {
            if (articles) {
              JSON.parse(articles).map((id) => {
                var removeIndex = result.data
                  .map((item) => {
                    return item.id;
                  })
                  .indexOf(id);
                result.data.splice(removeIndex, 1);
              });
              setArticles(result.data);
              setIsLoading(false);
            } else {
              setArticles(result.data);
              setIsLoading(false);
            }
          })
          .catch((error) => {
            setArticles(result.data);
            setIsLoading(false);
          });
        setPaginationKey(result.data[result.data.length - 1].paginationKey);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  function filterArticle(filterName: string, limit: number) {
    setIsLoading(true);

    Api({
      method: 'GET',
      url: `search?tags=${filterName}&page=1&limit=10`,
    })
      .then((result) => {
        setArticles(result.data.posts);
        setIsLoading(false);
        setIsFilter(true);
        setFilterName(filterName);
        setPageLimit(1);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  function filterMoreArticle() {
    let prevPageLimit = pageLimit;
    prevPageLimit = prevPageLimit + 1;
    setPageLimit(prevPageLimit);
    Api({
      method: 'GET',
      url: `search?tags=${filterName}&page=${prevPageLimit}&limit=10`,
    })
      .then((result) => {
        if (result.data.length > 0) {
          let newArticles = [...articles, ...result.data.posts];
          setArticles(newArticles);
        } else {
          setListEndReached(true);
        }
      })
      .catch((error) => {});
  }

  function fetchMoreArticles() {
    setIsLoading(false);
    Api({
      method: 'GET',
      url: `posts?start_key=${paginationKey}=&limit=12&severity!=top`,
    })
      .then((result) => {
        if (result.data.length > 0) {
          setPaginationKey(result.data[result.data.length - 1].paginationKey);
          let newArticles = [...articles, ...result.data];
          setArticles(newArticles);
        } else {
          setListEndReached(true);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  function RenderFilterNav(props: any) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ marginLeft: 17 }}>{props.children}</View>

        <SmallText
          fontSize={12}
          color={props.isActive ? Colors.background : Colors.lightGray}
          fontFamily={Fonts.type.light}
          text={props.title}
          textAlign={'center'}
          marginLeft={2}
        />
      </View>
    );
  }

  function renderArticleSlide(data: any) {
    return (
      <View style={{ marginRight: 24 }}>
        <ImageBackground
          imageStyle={{
            borderRadius: 5,
            overflow: 'hidden',
          }}
          style={{
            width: 200,
            height: 242,
            borderRadius: 5,
            marginVertical: 24,
          }}
          source={{
            uri:
              data.images && data.images.length > 0
                ? data.images[0].thumbUrl
                : 'https://shaiba.com/wp-content/uploads/2016/06/placeholder-news.jpg',
          }}
        >
          <View
            style={{
              height: '100%',
              paddingHorizontal: 20,
              backgroundColor: 'rgba(36, 34, 34, 0.70)',
              borderRadius: 5,
              paddingVertical: 20,
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: Fonts.type.regular,
                  fontSize: 11,
                  color: Colors.white,
                }}
              >
                {data.author ? data.author.displayName : null}
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.type.regular,
                  fontSize: 10,
                  color: Colors.white,
                }}
              >
                {displayInDays(data.createdAt)}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontFamily: Fonts.type.semi_bold,
                  fontSize: 14,
                  color: Colors.white,
                }}
              >
                {data.title}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  function reportAndHideArticle(articleId: string) {
    saveInAsyncStorage('articles', articleId);
    setArticles(
      articles.filter((article: Articles) => {
        return article.id !== articleId;
      }),
    );
  }

  function renderArticleVerticalView(article: Articles) {
    return (
      <View style={articleStyles.articleItemContainer}>
        {/* Top Section with Avatar and Title */}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View style={[articleStyles.avatarTitleSection]}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('ViewArticleAuthor', {
                  profileData: article.author,
                });
              }}
              disabled={!article.author.id}
            >
              {article.author.avatar ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Avatar
                    rounded
                    source={{
                      uri: article.author.avatar,
                    }}
                    size={'medium'}
                  />
                </View>
              ) : (
                <LogoSvg size={30} />
              )}
            </TouchableOpacity>

            <View style={{ paddingHorizontal: 15 }}>
              <SmallText
                fontSize={12}
                text={
                  article.author.displayName
                    ? article.author.displayName
                    : 'All I Can Tell You'
                }
                color={Colors.black}
              />

              <SmallText
                fontSize={10}
                text={displayInDays(article.publishedAt)}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Menu>
              <MenuTrigger>
                <EntypoIcons
                  size={20}
                  color={Colors.black}
                  name={'dots-three-vertical'}
                />
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{
                  width: 150,
                  paddingHorizontal: 10,
                }}
              >
                <MenuOption
                  onSelect={() => {
                    Alert.alert(
                      'Hide Article',
                      `Are you sure you want to hide this article. You won't be able to see this conversation any longer?`,
                      [
                        {
                          text: 'Yes',
                          onPress: () => reportAndHideArticle(article.id),
                        },
                        { text: 'No', onPress: () => {} },
                      ],
                    );
                  }}
                >
                  <Text style={storyStyles.menuOptionIcon}>Hide</Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    Alert.alert(
                      'Report',
                      `Write an email to us about any objectionable content and we will get back to you with proper action with in 24 hours`,
                      [
                        {
                          text: 'Write Email',
                          onPress: () =>
                            Linking.openURL(`mailto:hello@allicantellyou.com`),
                        },
                        { text: 'Cancel', onPress: () => {} },
                      ],
                    );
                  }}
                >
                  <Text style={storyStyles.menuOptionIcon}>Report</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        </View>

        <NormalText color={Colors.black} marginTop={20} text={article.title} />
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('ViewArticle', { article: article });
          }}
        >
          <Text style={articleStyles.articleDescription}>
            <NormalText
              marginTop={10}
              textAlign={'left'}
              marginBottom={10}
              text={`${article.shortDescription}...`}
            />
            <NormalText text={'Read More'} color={'#00BCFF'} />
          </Text>

          <Image
            resizeMode={'contain'}
            onLoadEnd={() => {
              setIsImgLoading(false);
            }}
            style={articleStyles.articleThumbnail}
            source={{
              uri:
                article.images && article.images.length > 0
                  ? article.images[0].thumbUrl
                  : 'https://education.fsu.edu/wp-content/uploads/2016/09/staff-avatar-man.png',
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isImgLoading ? (
              <ActivityIndicator
                style={{ alignSelf: 'center' }}
                color={Colors.darkSkyBlue}
              />
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  function horizontalFilterSection() {
    return (
      <ScrollView
        horizontal={true}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps={true}
        keyboardDismissMode='on-drag'
      >
        <TouchableOpacity onPress={() => fetchArticlesOnMount()}>
          <RenderFilterNav isActive={filterNavState.all} title={'All'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setFilterNavState({
              all: false,
              mental: true,
              happiness: false,
              relations: false,
              aging: false,
              challeng: false,
              positivity: false,
            });
            filterArticle('mental,health', 10);
          }}
        >
          <RenderFilterNav
            isActive={filterNavState.mental}
            title={'Mental Health & Wellbeing'}
          >
            <MentalHealthSvg size={20} />
          </RenderFilterNav>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setFilterNavState({
              all: false,
              mental: false,
              happiness: true,
              relations: false,
              aging: false,
              challeng: false,
              positivity: false,
            });
            filterArticle('happiness,and,humour', 10);
          }}
        >
          <RenderFilterNav
            isActive={filterNavState.happiness}
            title={'Happiness & Humour'}
          >
            <HappinessSvg size={20} />
          </RenderFilterNav>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setFilterNavState({
              all: false,
              mental: false,
              happiness: false,
              relations: true,
              aging: false,
              challeng: false,
              positivity: false,
            });
            filterArticle('relationships', 10);
          }}
        >
          <RenderFilterNav
            title={'Relationhips'}
            isActive={filterNavState.relations}
          >
            <RelationShipSvg size={20} />
          </RenderFilterNav>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setFilterNavState({
              all: false,
              mental: false,
              happiness: false,
              relations: false,
              aging: true,
              challeng: false,
              positivity: false,
            });
            filterArticle('aging,and,death', 10);
          }}
        >
          <RenderFilterNav
            isActive={filterNavState.aging}
            title={'Ageing and Death'}
          >
            <AgeingSvg size={20} />
          </RenderFilterNav>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setFilterNavState({
              all: false,
              mental: false,
              happiness: false,
              relations: false,
              aging: false,
              challeng: true,
              positivity: false,
            });
            filterArticle('challenges', 10);
          }}
        >
          <RenderFilterNav
            isActive={filterNavState.challeng}
            title={'Challenges and Crises'}
          >
            <ChallengesSvg size={20} />
          </RenderFilterNav>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setFilterNavState({
              all: false,
              mental: false,
              happiness: false,
              relations: false,
              aging: false,
              challeng: false,
              positivity: true,
            });
            filterArticle('self,esteem', 10);
          }}
        >
          <RenderFilterNav
            isActive={filterNavState.positivity}
            title={'Postivity and Self-esteem'}
          >
            <StartSvg size={20} />
          </RenderFilterNav>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <Connectivity>
      <Async displayChildren={isLoading}>
        <NavigationEvents onWillFocus={() => fetchArticlesOnMount()} />
        {/* Filter Section */}
        <View style={homeStyles.filterSection}>
          <View style={[homeStyles.filterViews]}>
            {horizontalFilterSection()}
          </View>
        </View>
        <View style={homeStyles.container}>
          {/* Quptes section */}

          {!hideQuote ? (
            <View style={homeStyles.quotesSection}>
              <TouchableOpacity
                onPress={() => {
                  setHideQuote(true);
                }}
                style={{ alignSelf: 'flex-end' }}
              >
                <AntDesignIcon size={20} name={'close'} color={Colors.white} />
              </TouchableOpacity>
              <SmallText
                color={Colors.white}
                fontFamily={Fonts.type.light_italic}
                textAlign={'left'}
                text={displayQuote}
              />
            </View>
          ) : null}
          {/* Quote section ends here*/}

          {/* Horizonatl Scroll View for articles */}

          {/* <FlatList
            data={articles}
            contentContainerStyle={{ paddingHorizontal: 23 }}
            horizontal={true}
            renderItem={({ item }) => renderArticleSlide(item)}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          /> */}
        </View>

        <Divider />

        {articles && articles.length ? (
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            data={articles}
            renderItem={({ item }) => renderArticleVerticalView(item)}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={isFilter ? filterMoreArticle : fetchMoreArticles}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={Colors.background}
              />
            }
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              listEndReached ? null : (
                <ActivityIndicator size={'large'} color={Colors.darkSkyBlue} />
              )
            }
          />
        ) : (
          <NoRecords title={'Nothing to display'} />
        )}
      </Async>
    </Connectivity>
  );
}

export default Articles;
