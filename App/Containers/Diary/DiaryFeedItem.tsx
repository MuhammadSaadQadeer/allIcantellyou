import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import {
  Alert,
  Image,
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
import EntypoIcons from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Countdown from '../../Components/Countdown';
import { NormalText } from '../../Components/NormalText';
import { SmallText } from '../../Components/SmallText';
import Urls from '../../Constants/Urls';
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

interface IDiaryFeedItemProps {
  item: IDiaryFeed;
  navigation: NavigationScreenProp<NavigationState>;
}

function DiaryFeedItem(props: IDiaryFeedItemProps) {
  const [publishQueuePerc, setPublishQueuePerc] = useState(0);
  const [showPublishTimer, setShowPublishTimer] = useState(false);
  const [cooldownDateTime, setCooldownDateTime] = useState(undefined);
  const [isReactionProcessing, setIsReactionProcessing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    const now = moment(new Date());
    const future = moment(props.item.publishedAt).add(1, 'day');
    const diff = future.diff(now);
    const duration = moment.duration(diff).asHours();
    if (duration < 24 && duration > 0) {
      const percentage = (100 / 24) * duration;
      setPublishQueuePerc(Math.floor(percentage));
      setShowPublishTimer(true);
      setCooldownDateTime(future);
    }
  }, []);

  function enableEditMode(feed: IDiaryFeed) {
    props.navigation.navigate('AddNewDiaryPost', {
      editPost: true,
      post: feed,
    });
  }

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

  function HeartLikes(props: any) {
    return (
      <View style={diaryFeedStyles.heartLikesContainer}>
        <LogoSvg size={30} />
        <Text style={diaryFeedStyles.heartLikeText}>{props.mood}</Text>
      </View>
    );
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

  return (
    <Fragment>
      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('ViewDiaryAuthor', {
                  profileData: props.item.author,
                });
              }}
            >
              {props.item.author.avatar ? (
                <Avatar
                  overlayContainerStyle={{
                    backgroundColor: Colors.background,
                  }}
                  rounded
                  source={{
                    uri: props.item.author.avatar,
                  }}
                  size={'medium'}
                />
              ) : props.item.author.displayName ? (
                <Avatar
                  overlayContainerStyle={{
                    backgroundColor: Colors.background,
                  }}
                  rounded
                  size={'medium'}
                  title={getInitialsForDisplayName(
                    props.item.author.displayName,
                  )}
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

              {/* <Badge
                      value={
                        <View>
                          <Text style={{ color: Colors.white }}>1</Text>
                        </View>
                      }
                      badgeStyle={diaryFeedStyles.avatarBadgeStyle}
                      textStyle={diaryFeedStyles.avatarTextStyle}
                      containerStyle={diaryFeedStyles.avatarContainerStyle}
                    /> */}
            </TouchableOpacity>

            <View style={{ paddingHorizontal: 15 }}>
              <SmallText
                fontSize={12}
                text={props.item.author.displayName}
                color={Colors.black}
              />

              <SmallText
                fontSize={10}
                text={displayInDays(props.item.publishedAt)}
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
              <MenuOption onSelect={() => enableEditMode(props.item)}>
                <View style={storyStyles.menuOption}>
                  <EvilIcons name={'pencil'} size={25} />
                  <Text style={storyStyles.menuOptionIcon}>Edit</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => showConfirmationAlert(props.item.id)}>
                <View style={storyStyles.menuOption}>
                  <EvilIcons size={25} name={'trash'} color={Colors.error} />
                  <Text style={storyStyles.menuOptionIcon}>Delete</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
          {/* 
                <View>
                  <SmallText text={'(Author)'} color={'#00BCFF'} />
                </View> */}
        </View>
        <View style={{ paddingVertical: 10 }}>
          <NormalText
            color={Colors.black}
            marginBottom={10}
            lineHeight={25}
            text={props.item.body}
          />

          {props.item.images && props.item.images.length ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            >
              {props.item.images.map((image) => {
                return (
                  <View
                    style={{
                      paddingHorizontal: 10,
                    }}
                  >
                    <Image
                      style={articleStyles.articleThumbnail}
                      source={{
                        uri: image.thumbUrl,
                      }}
                    />
                  </View>
                );
              })}
            </ScrollView>
          ) : null}
        </View>
      </View>

      <HeartLikes mood={props.item.mood} />

      <View
        style={[
          diaryFeedStyles.emoticonsParentContainer,
          { opacity: isReactionProcessing ? 20 : 70 },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            updateReaction({
              entityId: props.item.id,
              entityType: 'DiaryPost',
              reaction: 'respect',
            });
          }}
          disabled={isReactionProcessing}
        >
          <EmotiIcons notification={props.item.reactions.respect.count}>
            {props.item.reactions.respect.count > 0 ? (
              <Icon name='ico-respect-white' size={30} color={Colors.white} />
            ) : (
              <RespectSvg size={30} />
            )}
          </EmotiIcons>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            updateReaction({
              entityId: props.item.id,
              entityType: 'DiaryPost',
              reaction: 'clap',
            });
          }}
          disabled={isReactionProcessing}
        >
          <EmotiIcons notification={props.item.reactions.clap.count}>
            {props.item.reactions.clap.count > 0 ? (
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
              entityId: props.item.id,
              entityType: 'DiaryPost',
              reaction: 'like',
            });
          }}
          disabled={isReactionProcessing}
        >
          <EmotiIcons notification={props.item.reactions.like.count}>
            {props.item.reactions.like.count > 0 ? (
              <Icon name='ico-agree-white' color={Colors.white} size={30} />
            ) : (
              <AgreeSvg size={30} />
            )}
          </EmotiIcons>
        </TouchableOpacity>
      </View>
      {props.item.visibility !== 'private' ? (
        <View>
          {diffInHours(props.item.publishedAt) > 0 ? (
            <View
              style={{
                backgroundColor: '#FFC400',
                paddingVertical: 15,
                paddingHorizontal: 15,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 13,
                  fontFamily: Fonts.type.regular,
                }}
              >
                {/* {showTimer(props.item.publishedAt)} */}
                in publish queue
              </Text>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 13,
                  fontFamily: Fonts.type.regular,
                }}
              >
                <Countdown
                  label={'time left'}
                  timeTillDate={moment(props.item.publishedAt).add(1, 'day')}
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

export default DiaryFeedItem;
