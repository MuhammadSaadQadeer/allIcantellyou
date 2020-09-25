import { isNil, not } from 'ramda';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Async from '../../Components/Async';
import Connectivity from '../../Components/Connectivity';
import { SCREEN_WIDTH } from '../../Constants';
import Urls from '../../Constants/Urls';
import { AppContext } from '../../Contexts/AppContext';
import AuthenticationManager from '../../Lib/KeyChain/AuthenticationManager';
import Api from '../../Services/Api';
import { LogoWhite } from '../../Svgs';
import { Colors, Fonts, Icon } from '../../Themes';
import { introductionStyles } from './styles';

const introData = [
  {
    slide: 0,
    title: 'Respect',
    imageSrc: 'ico-respect-white',
    headerTitle: 'A publishing platform to inspire and empower',
    bodyTitle:
      'Indicate your respect when someone has been courageous in their honesty, self analysis or actions.',
    lastSlide: false,
  },
  {
    slide: 1,
    title: 'Compassion',
    imageSrc: 'ico-compassion-white',
    headerTitle: 'Conversations & events to inspire a supportive community',
    bodyTitle: 'Express your feelings of empathy or understanding',
    lastSlide: false,
  },
  {
    slide: 2,
    title: 'Agree',
    imageSrc: 'ico-agree-white',
    headerTitle:
      'Share for support or keep your thoughts private in your diary and life story for reflection and posterity',
    bodyTitle:
      'Show your support for sentiments and views that resonate with you',
    lastSlide: false,
  },
  {
    slide: 3,
    title: 'Speak Your Truth',
    imageSrc: 'Logo',
    headerTitle: 'Welcome to our community.',
    bodyTitle:
      'This is the start of the rest of your life. All I Can Tell You helps you to make sense of your past and supports you in your present and future journey, to leave a lasting legacy of your time on earth.',
    lastSlide: true,
  },
];
function Introduction(props: any) {
  const carouselRef = useRef(null);
  const [activeSlideNumber, setActiveSlideNumber] = useState(0);
  const appCtx = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const authManager = new AuthenticationManager();

    authManager.get().then((tokenObject) => {
      if (not(isNil(tokenObject))) {
        Api({
          method: 'POST',
          url: Urls.auth.refresh,
        })
          .then((token) => {
            // AsyncStorage.setItem('token', token.data.accessToken).then(() => {});
            authManager
              .set(token.data.accessToken)
              .then(() => {
                appCtx.dispatch({
                  type: 'IS_AUTHENTICATED',
                  isAuthenticated: true,
                });
                setLoading(false);
                props.navigation.navigate('MainApp');
              })
              .catch((error) => {
                authManager.remove().then(() => {
                  appCtx.dispatch({
                    type: 'IS_AUTHENTICATED',
                    isAuthenticated: false,
                  });
                  props.navigation.navigate('Introduction');
                  setLoading(false);
                });
              });
          })
          .catch((error) => {
            authManager.remove().then(() => {
              appCtx.dispatch({
                type: 'IS_AUTHENTICATED',
                isAuthenticated: false,
              });
              props.navigation.navigate('Introduction');
              setLoading(false);
            });
          });
      } else {
        authManager.remove().then(() => {
          appCtx.dispatch({
            type: 'IS_AUTHENTICATED',
            isAuthenticated: false,
          });
          props.navigation.navigate('Introduction');
          setLoading(false);
        });
      }
    });
  }, []);

  function navigateToLogin() {
    props.navigation.navigate('Login');
  }

  function onSlide(slideIndex) {
    setActiveSlideNumber(slideIndex);
  }

  function renderOnboardingSlide(data: any) {
    return (
      <View style={introductionStyles.container}>
        {data.item.lastSlide ? (
          <View
            style={{
              justifyContent: 'flex-end',
              flexDirection: 'column',
              alignItems: 'center',
              paddingHorizontal: 60,
            }}
          >
            <LogoWhite size={90} />
            <Text
              style={{
                fontSize: 22,
                color: 'white',
                textAlign: 'center',
                marginTop: 40,
              }}
            >
              {data.item.headerTitle}
            </Text>

            <Text
              style={[
                introductionStyles.introText,
                { textAlign: 'center', marginBottom: 50 },
              ]}
            >
              {data.item.bodyTitle}
            </Text>
          </View>
        ) : (
          <>
            <View
              style={{
                justifyContent: 'flex-end',
                flexDirection: 'column',
                alignItems: 'center',
                paddingHorizontal: 50,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  color: 'white',
                  marginBottom: 50,
                  textAlign: 'center',
                }}
              >
                {data.item.headerTitle}
              </Text>
              <Icon size={70} color={Colors.white} name={data.item.imageSrc} />
              <Text
                style={[
                  introductionStyles.introText,
                  { marginTop: 50, textAlign: 'center' },
                ]}
              >
                {data.item.bodyTitle}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                height: 47,
                backgroundColor: Colors.white,
                justifyContent: 'center',
                marginVertical: 4,
                borderRadius: 6,
                width: '80%',
              }}
              onPress={() =>
                carouselRef.current.snapToItem(data.item.slide + 1)
              }
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Fonts.type.regular,
                  color: Colors.background,
                  paddingHorizontal: 50,
                }}
              >
                Ok I Agree
              </Text>
            </TouchableOpacity>
          </>
        )}

        {data.item.lastSlide ? (
          <TouchableOpacity
            style={{
              alignItems: 'center',
              height: 47,
              backgroundColor: Colors.black,
              justifyContent: 'center',
              marginVertical: 4,
              borderRadius: 6,
              width: '85%',
            }}
            onPress={navigateToLogin}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: Fonts.type.regular,
                color: Colors.white,
                paddingHorizontal: 20,
              }}
            >
              Get Started
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
  return (
    <Connectivity>
      <Async displayChildren={loading}>
        <View style={{ backgroundColor: Colors.background }}>
          <Carousel
            scrollEnabled={false}
            ref={carouselRef}
            data={introData}
            renderItem={renderOnboardingSlide}
            sliderWidth={SCREEN_WIDTH}
            itemWidth={SCREEN_WIDTH}
            removeClippedSubviews={false}
            inactiveSlideScale={1.0}
            inactiveSlideOpacity={1.0}
            slideStyle={{ alignSelf: 'center' }}
            onSnapToItem={onSlide}
            // autoplay={true}
            // autoplayInterval={1000}
            // autoplayDelay={1}
          />
        </View>
      </Async>
    </Connectivity>
  );
}

export default Introduction;
