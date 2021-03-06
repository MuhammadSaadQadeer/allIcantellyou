import React, { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import HTML from 'react-native-render-html';
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';
import Async from '../../../Components/Async';
import Connectivity from '../../../Components/Connectivity';
import BackButton from '../../../Components/General/BackButton';
import { NormalText } from '../../../Components/NormalText';
import { SmallText } from '../../../Components/SmallText';
import { displayInDays } from '../../../Lib/Utils';
import Api from '../../../Services/Api';
import { LogoSvg } from '../../../Svgs';
import { Colors } from '../../../Themes';
import { Articles } from './Articles';
import { articleStyles } from './styles';

function ViewArticle(props: any) {
  const [article, setArticle] = useState<Articles>();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    Api({
      method: 'GET',
      url: `posts/${props.navigation.getParam('article').slug}`,
    })
      .then((response) => {
        setIsLoading(false);
        setArticle(response.data);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Connectivity>
      <Async displayChildren={isLoading}>
        <View style={{ marginTop: 10, marginLeft: 10 }}>
          <BackButton navigation={props.navigation} marginTop={10} />
        </View>
        {article ? (
          <ScrollView style={{ paddingHorizontal: 20 }}>
            <View style={articleStyles.articleItemContainer}>
              {/* Top Section with Avatar and Title */}
              <View style={articleStyles.avatarTitleSection}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('ViewArticleAuthor', {
                      profileData: article.author,
                    });
                  }}
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
              <NormalText
                color={Colors.black}
                marginTop={10}
                marginBottom={10}
                text={article.title}
              />
              {/* <Text style={articleStyles.articleDescription}>
                <NormalText
                  marginTop={10}
                  textAlign={'left'}
                  marginBottom={10}
                  text={`shortDescription}...`}
                />
                <NormalText text={'Read More'} color={'#00BCFF'} />
              </Text> */}

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

            <HTML
              onLinkPress={(evt, href) => {
                Linking.openURL(href);
              }}
              html={article.body}
              imagesMaxWidth={1000}
              ignoredTags={[...IGNORED_TAGS, 'img']}
            />

            {/* <NormalText text={article.body} /> */}
          </ScrollView>
        ) : null}
      </Async>
    </Connectivity>
  );
}

export default ViewArticle;
