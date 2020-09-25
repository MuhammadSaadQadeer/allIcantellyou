import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { WebView } from 'react-native-webview';
import BackButton from '../../../Components/General/BackButton';
import NoRecords from '../../../Components/NoRecords';
import { NormalText } from '../../../Components/NormalText';
import { Colors, Fonts } from '../../../Themes';

function HelpFulLinkDetails(props) {
  const [showWebView, setShowWebView] = useState(false);
  const [webUrl, setWebUrl] = useState('');
  const [linksDetails, setLinksDetails] = useState([]);
  useEffect(() => {
    setLinksDetails(props.navigation.getParam('links'));
  });

  function openWebView(url) {
    setShowWebView(true);
    setWebUrl(url);
  }

  function Item(item) {
    const imageUri = item.item.linkLogo != null ? item.item.linkLogo : '';
    return (
      <View style={{ paddingHorizontal: 23, paddingVertical: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            style={{
              width: 50,
              height: 50,
              borderColor: Colors.lightGray,
              borderWidth: 0.5,
              borderRadius: 5,
            }}
            source={imageUri.length != 0 ? { uri: imageUri } : null}
          />

          <View style={{ width: 0, flexGrow: 1, flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                marginTop: 5,
                marginBottom: 5,
                marginLeft: 5,
              }}
            >
              {item.item.name}
            </Text>
          </View>

          {/* <LargeText
            marginLeft={10}
            marginTop={5}
            marginBottom={5}
            text={item.item.name}
          /> */}
        </View>

        {/* <NormalText
          marginTop={10}
          marginBottom={10}
          text={item.item.websiteUrl}
          color={'#00BCFF'}
        /> */}
        <NormalText
          marginBottom={10}
          marginTop={10}
          text={item.item.description}
        />
        <TouchableOpacity
          style={{
            alignItems: 'center',
            height: 47,
            backgroundColor: Colors.black,
            justifyContent: 'center',
            marginVertical: 4,
            borderRadius: 6,
          }}
          onPress={() => openWebView(item.item.websiteUrl)}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts.type.regular,
              color: Colors.white,
            }}
          >
            Visit Website
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderContent() {
    return (
      <WebView
        source={{
          uri: webUrl,
        }}
        //  / onNavigationStateChange={this.onNavigationStateChange}
        startInLoadingState
        scalesPageToFit
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={{ flex: 1 }}
      />
    );
  }

  function renderSeparator() {
    return (
      <View
        style={{
          borderColor: '#EDEDED',
          borderWidth: 1,
        }}
      />
    );
  }
  return (
    <React.Fragment>
      {showWebView ? (
        <>
          <TouchableOpacity
            onPress={() => {
              setShowWebView(false);
            }}
            style={{
              backgroundColor: Colors.transparent,
              flexDirection: 'row',
              alignSelf: 'flex-end',
            }}
          >
            <EntypoIcons name={'cross'} size={25} color={Colors.lightGray} />
          </TouchableOpacity>
          {renderContent()}
        </>
      ) : (
        <View>
          <View style={{ paddingHorizontal: 20, marginVertical: 10 }}>
            <BackButton
              navigation={props.navigation}
              navTitle={props.navigation.getParam('backTitle')}
              // routeName={'HelpfulLinkDetail'}
              tabNo={2}
            />
          </View>

          {linksDetails && linksDetails.length > 0 ? (
            <ScrollView contentInset={{ bottom: 100 }}>
              <FlatList
                contentContainerStyle={{ marginBottom: 100 }}
                ItemSeparatorComponent={renderSeparator}
                data={linksDetails}
                renderItem={({ item }) => <Item item={item} />}
                keyExtractor={(item) => item.linkId}
              />
            </ScrollView>
          ) : (
            <NoRecords title={'Nothing to display'} />
          )}
        </View>
      )}
    </React.Fragment>
  );
}

export default HelpFulLinkDetails;
