import React, { useContext, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, ButtonGroup, Divider } from 'react-native-elements';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import NoRecords from '../../Components/NoRecords';
import { NormalText } from '../../Components/NormalText';
import { SmallText } from '../../Components/SmallText';
import { AppContext } from '../../Contexts/AppContext';
import { displayInDays, getInitialsForDisplayName } from '../../Lib/Utils';
import { LogoSvg } from '../../Svgs';
import { Colors } from '../../Themes';
import { Articles } from '../MainApp/Home/Articles';
import { IDiaryFeed } from '../MainApp/Home/DiaryFeed';
import { articleStyles, diaryFeedStyles } from '../MainApp/Home/styles';

interface IUser {
  description: string;
  author: {
    id: string;
    displayName: string;
    avatar: string;
    followed: boolean;
  };
}

function Search(props: any) {
  const appCtx = useContext(AppContext);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const articles = () => {
    return (
      <NormalText
        text='Articles'
        color={selectedIndex === 0 ? Colors.black : Colors.lightGray}
      />
    );
  };
  const diary = () => {
    return (
      <NormalText
        text={'Diary'}
        color={selectedIndex === 1 ? Colors.black : Colors.lightGray}
      />
    );
  };

  const members = () => {
    return (
      <NormalText
        text={'Members'}
        color={selectedIndex === 2 ? Colors.black : Colors.lightGray}
      />
    );
  };

  const resources = () => {
    return (
      <NormalText
        text={'Resources'}
        color={selectedIndex === 3 ? Colors.black : Colors.lightGray}
      />
    );
  };

  const buttons = [
    { element: articles },
    { element: diary },
    { element: members },
    { element: resources },
  ];

  function updateIndex(selectedIndex: number) {
    setSelectedIndex(selectedIndex);
  }

  function renderDiaryFeedItem(feed: IDiaryFeed) {
    return (
      <View style={diaryFeedStyles.diaryFeedContainer}>
        <View style={{ flexDirection: 'row', paddingBottom: 20 }}>
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
              overlayContainerStyle={{ backgroundColor: Colors.background }}
              size={'medium'}
              rounded
              title={feed.author.displayName.charAt(0)}
            />
          ) : null}

          <View style={{ paddingHorizontal: 15 }}>
            <SmallText
              fontSize={12}
              text={feed.author.displayName}
              color={Colors.black}
            />
            <SmallText fontSize={10} text={displayInDays(feed.publishedAt)} />
          </View>
        </View>
        {/* <HeartLikes notification={feed.reactions.heart.count} /> */}
        <Text>{feed.body}</Text>
        {feed.images && feed.images.length > 0 ? (
          <Image
            resizeMode={'contain'}
            style={{ width: 340, height: 450 }}
            source={{
              uri: feed.images[0].thumbUrl,
            }}
          />
        ) : null}
      </View>
    );
  }

  function renderArticleVerticalView(article: Articles) {
    return (
      <View style={articleStyles.articleItemContainer}>
        {/* Top Section with Avatar and Title */}
        <View style={articleStyles.avatarTitleSection}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('ViewArticleAuthor', {
                profileData: article.author,
              });
            }}
            disabled={!article.author.id}
          >
            {article.author.avatar ? (
              <View>
                <Avatar
                  rounded
                  source={{
                    uri: article.author.avatar,
                  }}
                  size={'medium'}
                />
                {/* <Badge
                  value={
                    <View>
                      <Text style={{ color: Colors.white }}>1</Text>
                    </View>
                  }
                  badgeStyle={{
                    backgroundColor: '#8E77D8',
                  }}
                  textStyle={{
                    color: Colors.white,
                  }}
                  containerStyle={articleStyles.badgeContainerStyle}
                /> */}
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

          {/* <View>
              <SmallText text={'(Author)'} color={'#00BCFF'} />
            </View> */}
        </View>

        <NormalText color={Colors.black} marginTop={20} text={article.title} />
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('ViewArticleInSearch', {
              article: article,
            });
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
        </TouchableOpacity>

        <Image
          style={articleStyles.articleThumbnail}
          source={{
            uri:
              article.images && article.images.length > 0
                ? article.images[0].thumbUrl
                : 'https://education.fsu.edu/wp-content/uploads/2016/09/staff-avatar-man.png',
          }}
        />
      </View>
    );
  }

  function renderUsers(user: IUser) {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('MemberProfile', {
            profileData: user.author,
          });
        }}
        style={{
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
            alignItems: 'center',
          }}
        >
          {user.author.avatar ? (
            <Avatar
              rounded
              source={{ uri: user.author.avatar }}
              size={'medium'}
            />
          ) : user.author.displayName ? (
            <Avatar
              overlayContainerStyle={{ backgroundColor: Colors.background }}
              rounded
              title={getInitialsForDisplayName(user.author.displayName)}
              size={'medium'}
            />
          ) : null}
          <NormalText
            text={user.author.displayName}
            color={Colors.black}
            marginLeft={8}
          />
        </View>
      </TouchableOpacity>
    );
  }

  function clearSearchOnBack() {
    appCtx.dispatch({
      type: 'CLEAR_SEARCH',
      clearSearch: true,
    });
    props.navigation.navigate('HomeNav');
  }

  return (
    <View>
      <View
        style={{
          marginTop: 10,
          marginLeft: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => clearSearchOnBack()}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <EntypoIcon name={'chevron-left'} color={Colors.black} size={20} />
          <NormalText
            text={props.navTitle ? props.navTitle : 'Back'}
            color={Colors.black}
          />
        </TouchableOpacity>
      </View>
      <ButtonGroup
        onPress={updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={{
          backgroundColor: Colors.transparent,
          width: '100%',
          alignSelf: 'center',
          justifyContent: 'center',
        }}
        innerBorderStyle={{ color: Colors.transparent }}
        selectedButtonStyle={{
          backgroundColor: Colors.transparent,
        }}
        textStyle={{
          color: Colors.background,
        }}
        disabledTextStyle={{ color: Colors.lightGray }}
      />

      {selectedIndex === 0 ? (
        appCtx.searchResult.posts && appCtx.searchResult.posts.length ? (
          <FlatList
            contentInset={{
              bottom: 100,
            }}
            contentContainerStyle={{
              paddingHorizontal: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            data={appCtx.searchResult.posts}
            renderItem={({ item }) => renderArticleVerticalView(item)}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <NoRecords title={'Nothing to display'} />
        )
      ) : null}
      {selectedIndex === 1 ? (
        appCtx.searchResult.diaryPosts &&
        appCtx.searchResult.diaryPosts.length ? (
          <FlatList
            contentInset={{
              bottom: 100,
            }}
            contentContainerStyle={{
              paddingHorizontal: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            data={appCtx.searchResult.diaryPosts}
            renderItem={({ item }) => renderDiaryFeedItem(item)}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <NoRecords title={'Nothing to display'} />
        )
      ) : null}
      {selectedIndex === 2 ? (
        appCtx.searchResult.users && appCtx.searchResult.users.length ? (
          <FlatList
            contentInset={{
              bottom: 100,
            }}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            ItemSeparatorComponent={() => {
              return <Divider />;
            }}
            data={appCtx.searchResult.users}
            renderItem={({ item }) => renderUsers(item)}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <NoRecords title={'Nothing to display'} />
        )
      ) : null}
      {selectedIndex === 3 ? (
        appCtx.searchResult.resources &&
        appCtx.searchResult.resources.length ? (
          <FlatList
            contentInset={{
              bottom: 100,
            }}
            contentContainerStyle={{
              paddingHorizontal: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            data={appCtx.searchResult.resources}
            renderItem={({ item }) => renderArticleVerticalView(item)}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <NoRecords title={'Nothing to display'} />
        )
      ) : null}
    </View>
  );
}

export default Search;
