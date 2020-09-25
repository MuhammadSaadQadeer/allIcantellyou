import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { NavigationEvents } from 'react-navigation';
import Async from '../../../Components/Async';
import Connectivity from '../../../Components/Connectivity';
import NoRecords from '../../../Components/NoRecords';
import { NormalText } from '../../../Components/NormalText';
import { SmallText } from '../../../Components/SmallText';
import WithoutLoginComponent from '../../../Components/WithoutLoginComponent';
import { SCREEN_WIDTH } from '../../../Constants';
import Urls from '../../../Constants/Urls';
import { AppContext } from '../../../Contexts/AppContext';
import { useApi } from '../../../CustomHooks';
import {
  displayInDays,
  saveInAsyncStorage,
  showNotification,
} from '../../../Lib/Utils';
import Api from '../../../Services/Api';
import { AgreeSvg, CompassionSvg, LogoSvg, RespectSvg } from '../../../Svgs';
import { Colors, Icon } from '../../../Themes';
import { storyStyles } from '../../Story/styles';
import { articleStyles, diaryFeedStyles } from './styles';
export interface IReactions {
  count: number;
  currentUserReacted: boolean;
}

export interface IReactionPayload {
  entityType: string;
  entityId: string;
  reaction: string;
}
export interface IAuthor {
  id: string;
  displayName: string;
  isGuestAuthor: string;
  avatar: string;
}

export interface IImage {
  id: string;
  thumbUrl: string;
  originalUrl: string;
}
export interface IDiaryFeed {
  id: string;
  body: string;
  mood: number;
  publishedAt: string;
  visibility: string;
  author: IAuthor;
  useFullName: boolean;
  usePseudonym: boolean;
  images: IImage[];
  reactions: {
    like: IReactions;
    clap: IReactions;
    heart: IReactions;
    respect: IReactions;
  };
}

function DiaryFeed(props) {
  const [diaryFeedCaller, diaryFeed, isLoading, , success] = useApi();
  const [localDiaryFeed, setLocalDiaryFeed] = useState<IDiaryFeed[]>([]);
  const [isReaction, setIsReaction] = useState(false);
  const [slider1ActiveSlide, setSlider1ActiveSlide] = useState(0);
  const carouselRef = useRef(null);
  const appCtx = useContext(AppContext);
  useEffect(() => {
    if (appCtx.isAuthenticated) {
      diaryFeedCaller('GET', Urls.home.diary_posts);
    }
  }, []);

  useEffect(() => {
    if (diaryFeed && diaryFeed.length > 0) {
      AsyncStorage.getItem('diaryFeed')
        .then((diaryFeeds) => {
          if (diaryFeeds) {
            JSON.parse(diaryFeeds).map((id) => {
              var removeIndex = diaryFeed
                .map((item) => {
                  return item.id;
                })
                .indexOf(id);
              diaryFeed.splice(removeIndex, 1);
            });
            setLocalDiaryFeed(diaryFeed);
          } else {
            setLocalDiaryFeed(diaryFeed);
          }
        })
        .catch((error) => {
          setLocalDiaryFeed(diaryFeed);
        });
    }
  }, [diaryFeed]);

  //useEffect(() => {}, [isReaction]);

  function NotificationBadge(props: any) {
    return (
      <View
        style={[
          diaryFeedStyles.ntfBadge,
          {
            backgroundColor: props.isHighLighted ? '#65D7FF' : Colors.black,
          },
        ]}
      >
        <Text style={diaryFeedStyles.ntfText}>{props.notification}</Text>
      </View>
    );
  }

  function HeartLikes(props: any) {
    return (
      <View style={diaryFeedStyles.heartLikesContainer}>
        <LogoSvg size={30} />
        {/* {props.notification > 0 ? ( */}
        <Text style={diaryFeedStyles.heartLikeText}>{props.notification}</Text>
        {/* ) : null} */}
      </View>
    );
  }

  function EmotiIcons(props: any) {
    return (
      <View
        style={[
          diaryFeedStyles.emoticonsContainer,
          {
            backgroundColor:
              props.notification > 0 ? Colors.background : Colors.transparent,
          },
        ]}
      >
        {props.children}
        {/* {props.notification > 0 ? ( */}
        <View style={{ paddingLeft: 5 }}>
          <NotificationBadge
            isHighLighted={props.notification > 0}
            notification={props.notification}
          />
        </View>
        {/* ) : null} */}
      </View>
    );
  }

  function updateReaction(payload: IReactionPayload) {
    updateReactionLocally(payload);
    setIsReaction(true);
    Api({
      method: 'POST',
      url: `react`,
      data: payload,
    })
      .then((result: any) => {
        let obj = localDiaryFeed.find((item) => item.id === payload.entityId);
        obj.reactions = result.data;
        let tempDiaryFeed = localDiaryFeed;
        for (let i = 0; i < tempDiaryFeed.length; i++) {
          if (tempDiaryFeed[i].id === payload.entityId) {
            tempDiaryFeed[i] = obj;
          }
        }
        setLocalDiaryFeed(tempDiaryFeed);
        setIsReaction(false);
      })
      .catch((error: any) => {
        setIsReaction(false);
        showNotification('Something went wrong');
      });
  }

  function updateReactionLocally(payload: IReactionPayload) {
    let tempDiaryFeed = localDiaryFeed;
    let obj = tempDiaryFeed.find((item) => item.id === payload.entityId);
    switch (payload.reaction) {
      case 'respect':
        if (obj.reactions.respect.count > 0) {
          obj.reactions.respect.count = 0;
        } else {
          obj.reactions.respect.count = 1;
        }
        break;
      case 'like':
        if (obj.reactions.like.count > 0) {
          obj.reactions.like.count = 0;
        } else {
          obj.reactions.like.count = 1;
        }
        break;
      case 'clap':
        if (obj.reactions.clap.count > 0) {
          obj.reactions.clap.count = 0;
        } else {
          obj.reactions.clap.count = 1;
        }
        break;
      case 'heart':
        if (obj.reactions.heart.count > 0) {
          obj.reactions.heart.count = 0;
        } else {
          obj.reactions.heart.count = 1;
        }
        break;
      default:
        return;
    }
    for (let i = 0; i < tempDiaryFeed.length; i++) {
      if (tempDiaryFeed[i].id === payload.entityId) {
        tempDiaryFeed[i] = obj;
      }
    }

    setLocalDiaryFeed(tempDiaryFeed);
  }

  function reportAndHideDiaryFeed(diaryFeedId: string) {
    saveInAsyncStorage('diaryFeed', diaryFeedId);
    setLocalDiaryFeed(
      localDiaryFeed.filter((diaryFeed: IDiaryFeed) => {
        return diaryFeed.id !== diaryFeedId;
      }),
    );
  }

  function renderImage(data: any) {
    return (
      <View style={{ marginRight: 30 }}>
        <Image
          style={articleStyles.articleThumbnail}
          source={{
            uri: data.item.thumbUrl,
          }}
        />
      </View>
    );
  }

  function renderDiaryFeedItem(feed: IDiaryFeed) {
    return (
      <>
        {moment().diff(moment(feed.publishedAt), 'h') < 24 ? null : (
          <Fragment>
            <View style={diaryFeedStyles.diaryFeedContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                  }}
                >
                  <TouchableOpacity
                    disabled={feed.usePseudonym}
                    onPress={() => {
                      props.navigation.navigate('ViewArticleAuthor', {
                        profileData: feed.author,
                      });
                    }}
                  >
                    {feed.author.avatar ? (
                      <Avatar
                        rounded
                        source={{
                          uri: feed.author.avatar,
                        }}
                        size='medium'
                      />
                    ) : feed.author.displayName ? (
                      <Avatar
                        overlayContainerStyle={{
                          backgroundColor: Colors.background,
                        }}
                        size={'medium'}
                        rounded
                        title={feed.author.displayName.charAt(0)}
                      />
                    ) : null}
                  </TouchableOpacity>

                  <View style={{ paddingHorizontal: 15 }}>
                    <SmallText
                      fontSize={12}
                      text={feed.author.displayName}
                      color={Colors.black}
                    />
                    <SmallText
                      fontSize={10}
                      text={displayInDays(feed.publishedAt)}
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
                            'Hide Feed',
                            `Are you sure you want to hide this feed. You won't be able to see this feed any longer?`,
                            [
                              {
                                text: 'Yes',
                                onPress: () => reportAndHideDiaryFeed(feed.id),
                              },
                              { text: 'No', onPress: () => {} },
                            ],
                          );
                        }}
                      >
                        <Text style={storyStyles.menuOptions}>Hide</Text>
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
                                  Linking.openURL(
                                    `mailto:hello@allicantellyou.com`,
                                  ),
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
                {/* 
            <View>
              <SmallText text={'(Author)'} color={'#00BCFF'} />
            </View> */}
              </View>
              <View style={{ paddingVertical: 10 }}>
                <NormalText
                  color={Colors.black}
                  lineHeight={25}
                  text={feed.body}
                  marginBottom={10}
                />

                <View>
                  <Carousel
                    ref={carouselRef}
                    data={feed.images}
                    renderItem={renderImage}
                    sliderWidth={SCREEN_WIDTH}
                    itemWidth={SCREEN_WIDTH}
                    removeClippedSubviews={false}
                    inactiveSlideScale={1.0}
                    inactiveSlideOpacity={1.0}
                    slideStyle={{ alignSelf: 'center' }}
                    onSnapToItem={(index) => setSlider1ActiveSlide(index)}
                  />
                  <Pagination
                    dotsLength={feed.images.length}
                    activeDotIndex={slider1ActiveSlide}
                    containerStyle={{ paddingVertical: 8 }}
                    dotColor={Colors.darkSkyBlue}
                    dotStyle={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                    }}
                    inactiveDotColor={Colors.black}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    carouselRef={carouselRef}
                    tappableDots={!!carouselRef}
                  />
                </View>
              </View>
            </View>

            <HeartLikes notification={feed.reactions.heart.count} />

            <View
              style={[
                diaryFeedStyles.emoticonsParentContainer,
                { opacity: isReaction ? 20 : 70 },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  updateReaction({
                    entityId: feed.id,
                    entityType: 'DiaryPost',
                    reaction: 'respect',
                  });
                }}
                disabled={isReaction}
              >
                <EmotiIcons notification={feed.reactions.respect.count}>
                  {feed.reactions.respect.count > 0 ? (
                    <Icon
                      name='ico-respect-white'
                      size={30}
                      color={Colors.white}
                    />
                  ) : (
                    <RespectSvg size={30} />
                  )}
                </EmotiIcons>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  updateReaction({
                    entityId: feed.id,
                    entityType: 'DiaryPost',
                    reaction: 'clap',
                  });
                }}
                disabled={isReaction}
              >
                <EmotiIcons notification={feed.reactions.clap.count}>
                  {feed.reactions.clap.count > 0 ? (
                    <Icon
                      name='ico-compassion-white'
                      size={30}
                      color={Colors.white}
                    />
                  ) : (
                    <CompassionSvg size={30} />
                  )}
                </EmotiIcons>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  updateReaction({
                    entityId: feed.id,
                    entityType: 'DiaryPost',
                    reaction: 'like',
                  });
                }}
                disabled={isReaction}
              >
                <EmotiIcons notification={feed.reactions.like.count}>
                  {feed.reactions.like.count > 0 ? (
                    <Icon
                      name='ico-agree-white'
                      color={Colors.white}
                      size={30}
                    />
                  ) : (
                    <AgreeSvg size={30} />
                  )}
                </EmotiIcons>
              </TouchableOpacity>
            </View>
          </Fragment>
        )}
      </>
    );
  }

  return (
    <Connectivity>
      <Async
        displayChildren={isLoading}
        containerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <NavigationEvents
          onWillFocus={() => diaryFeedCaller('GET', Urls.home.diary_posts)}
        />
        {appCtx.isAuthenticated ? (
          <ScrollView>
            {localDiaryFeed && localDiaryFeed.length > 0 ? (
              localDiaryFeed.map((feed: IDiaryFeed) => {
                return renderDiaryFeedItem(feed);
              })
            ) : (
              <NoRecords title={'Nothing To Display'} />
            )}
          </ScrollView>
        ) : (
          <WithoutLoginComponent
            navigation={props.navigation}
            title={'Login or create account to view Diary Feed'}
            btnTitle={'Proceed to Login'}
          />
        )}
      </Async>
    </Connectivity>
  );
}

export default DiaryFeed;
