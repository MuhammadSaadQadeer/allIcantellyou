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
  FlatList,
  Image,
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
import ProgressCircle from 'react-native-progress-circle';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { NavigationEvents } from 'react-navigation';
import Async from '../../Components/Async';
import Connectivity from '../../Components/Connectivity';
import Countdown from '../../Components/Countdown';
import BlockButton from '../../Components/General/BlockButton';
import NoRecords from '../../Components/NoRecords';
import { NormalText } from '../../Components/NormalText';
import { SmallText } from '../../Components/SmallText';
import WithoutLoginComponent from '../../Components/WithoutLoginComponent';
import { SCREEN_WIDTH } from '../../Constants';
import Urls from '../../Constants/Urls';
import { AppContext } from '../../Contexts/AppContext';
import { useApi } from '../../CustomHooks';
import {
  diffInHours,
  displayInDays,
  getInitialsForDisplayName,
  showNotification,
} from '../../Lib/Utils';
import Api from '../../Services/Api';
import { AgreeSvg, CompassionSvg, LogoSvg, RespectSvg } from '../../Svgs';
import { Colors, Fonts, Icon } from '../../Themes';
import { IDiaryFeed, IReactionPayload } from '../MainApp/Home/DiaryFeed';
import { articleStyles, diaryFeedStyles } from '../MainApp/Home/styles';
import { storyStyles } from '../Story/styles';
import { diaryStyles } from './styles';

function MyDiary(props: any) {
  const appCtx = useContext(AppContext);
  const carouselRef = useRef(null);
  const [localDiaryFeed, setLocalDiaryFeed] = useState<IDiaryFeed[]>([]);
  const [isReactionProcessing, setIsReactionProcessing] = useState(false);
  const [slider1ActiveSlide, setSlider1ActiveSlide] = useState(0);

  // Fetch MyDiary feed
  const [diaryFeedCaller, diaryFeed, isLoading, , success] = useApi();
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    if (appCtx.isAuthenticated) {
      diaryFeedCaller('GET', Urls.home.my_diary);
    }
  }, []);

  useEffect(() => {
    if (diaryFeed && diaryFeed.length > 0) {
      setLocalDiaryFeed(diaryFeed);
    }
  }, [diaryFeed]);

  function deleteDiaryPost(deleteId: string) {
    setIsProcessing(true);

    Api({
      method: 'DELETE',
      url: Urls.home.delete_diary_post(encodeURIComponent(deleteId)),
    })
      .then((response) => {
        if (response.data) {
          showNotification('Post deleted successfully!');
          diaryFeedCaller('GET', Urls.home.my_diary);
          setIsProcessing(false);
        }
      })
      .catch((error) => {
        setIsProcessing(false);
      });
  }

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
        <Text style={diaryFeedStyles.heartLikeText}>{props.mood}</Text>
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

        <View style={{ paddingLeft: 5 }}>
          <NotificationBadge
            isHighLighted={props.notification > 0}
            notification={props.notification}
          />
        </View>
      </View>
    );
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

  function updateReaction(payload: IReactionPayload) {
    updateReactionLocally(payload);

    setIsReactionProcessing(true);
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
        setIsReactionProcessing(false);
      })
      .catch((error: any) => {
        setIsReactionProcessing(false);
        showNotification('Something went wrong');
      });
  }

  function enableEditMode(feed: IDiaryFeed) {
    props.navigation.navigate('AddNewDiaryPost', {
      editPost: true,
      post: feed,
    });
  }

  function showConfirmationAlert(postId: string) {
    return Alert.alert(
      'Delete Post ? ',
      'Are you sure you want to delete this post ? ',
      [
        { text: 'Yes', onPress: () => deleteDiaryPost(postId) },
        { text: 'No', onPress: () => {} },
      ],
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
      <Fragment>
        <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('ViewDiaryAuthor', {
                    profileData: feed.author,
                  });
                }}
              >
                {feed.author.avatar ? (
                  <Avatar
                    overlayContainerStyle={{
                      backgroundColor: Colors.background,
                    }}
                    rounded
                    source={{
                      uri: feed.author.avatar,
                    }}
                    size={'medium'}
                  />
                ) : feed.author.displayName ? (
                  <Avatar
                    overlayContainerStyle={{
                      backgroundColor: Colors.background,
                    }}
                    rounded
                    size={'medium'}
                    title={getInitialsForDisplayName(feed.author.displayName)}
                  />
                ) : (
                  <Avatar
                    overlayContainerStyle={{
                      backgroundColor: Colors.background,
                    }}
                    rounded
                    size={'medium'}
                    title={'NA'}
                  />
                )}
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
            <Menu>
              <MenuTrigger>
                <EntypoIcons size={20} name={'dots-three-vertical'} />
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{
                  width: 150,
                  paddingHorizontal: 10,
                }}
              >
                <MenuOption onSelect={() => enableEditMode(feed)}>
                  <View style={storyStyles.menuOption}>
                    <EvilIcons name={'pencil'} size={25} />
                    <Text style={storyStyles.menuOptionIcon}>Edit</Text>
                  </View>
                </MenuOption>
                <MenuOption onSelect={() => showConfirmationAlert(feed.id)}>
                  <View style={storyStyles.menuOption}>
                    <EvilIcons size={25} name={'trash'} color={Colors.error} />
                    <Text style={storyStyles.menuOptionIcon}>Delete</Text>
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
          <View style={{ paddingVertical: 10 }}>
            <NormalText
              color={Colors.black}
              marginBottom={10}
              lineHeight={25}
              text={feed.body}
            />

            {feed.images && feed.images.length ? (
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
            ) : null}
          </View>
        </View>

        <HeartLikes mood={feed.mood} />

        <View
          style={[
            diaryFeedStyles.emoticonsParentContainer,
            { opacity: isReactionProcessing ? 20 : 70 },
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
            disabled={isReactionProcessing}
          >
            <EmotiIcons notification={feed.reactions.respect.count}>
              {feed.reactions.respect.count > 0 ? (
                <Icon name='ico-respect-white' size={30} color={Colors.white} />
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
            disabled={isReactionProcessing}
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
            disabled={isReactionProcessing}
          >
            <EmotiIcons notification={feed.reactions.like.count}>
              {feed.reactions.like.count > 0 ? (
                <Icon name='ico-agree-white' color={Colors.white} size={30} />
              ) : (
                <AgreeSvg size={30} />
              )}
            </EmotiIcons>
          </TouchableOpacity>
        </View>
        {feed.visibility !== 'private' ? (
          <View>
            {diffInHours(feed.publishedAt) < 24 &&
            diffInHours(feed.publishedAt) > 0 ? (
              <View
                style={{
                  backgroundColor: '#FFC400',
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}
                >
                  <ProgressCircle
                    percent={Math.floor(
                      (100 / 24) * diffInHours(feed.publishedAt),
                    )}
                    radius={12}
                    borderWidth={3}
                    color='#000'
                    shadowColor='#fff'
                    bgColor='#FFC400'
                  />
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 13,
                      fontFamily: Fonts.type.regular,
                      marginLeft: 8,
                    }}
                  >
                    in publish queue
                  </Text>
                </View>

                <Text
                  style={{
                    color: Colors.white,
                    fontSize: 13,
                    fontFamily: Fonts.type.regular,
                  }}
                >
                  <Countdown
                    label={'time left'}
                    timeTillDate={moment(feed.publishedAt).add(1, 'day')}
                    timeFormat='YYYY-MM-DD HH:mm:ss'
                  />
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </Fragment>
    );
  }

  return (
    <Connectivity>
      <Async displayChildren={isLoading || isProcessing}>
        {appCtx.isAuthenticated ? (
          <View style={diaryStyles.parentContainer}>
            <NavigationEvents
              onWillFocus={() => diaryFeedCaller('GET', Urls.home.my_diary)}
            />
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 20,
              }}
            >
              <BlockButton
                title={'New Diary Post'}
                onPress={() => props.navigation.navigate('AddNewDiaryPost')}
                color={Colors.black}
                width={'100%'}
              />
            </View>
            <Divider />

            {localDiaryFeed && localDiaryFeed.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={localDiaryFeed}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => renderDiaryFeedItem(item)}
              />
            ) : (
              <>
                <NoRecords title={'Nothing To Display'} />
              </>
            )}
          </View>
        ) : (
          <WithoutLoginComponent
            navigation={props.navigation}
            title={'Login or create account to view My Diary Feed'}
            btnTitle={'Proceed to Login'}
          />
        )}
      </Async>
    </Connectivity>
  );
}

export default MyDiary;
