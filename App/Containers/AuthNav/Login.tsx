import AsyncStorage from '@react-native-community/async-storage';
import { Formik, FormikProps } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import * as Yup from 'yup';
import Async from '../../Components//Async';
import Connectivity from '../../Components/Connectivity';
import { InputField } from '../../Components/InputField';
import { SCREEN_HEIGHT } from '../../Constants';
import Urls from '../../Constants/Urls';
import { AppContext } from '../../Contexts/AppContext';
import { useApi } from '../../CustomHooks';
import AuthenticationManager from '../../Lib/KeyChain/AuthenticationManager';
import { Colors, Fonts, Images } from '../../Themes';
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(' '),
  password: Yup.string().required(' '),
});
export interface ILoginFormValues {
  email: string;
  password: string;
}

interface ILogingProps {
  navigation: NavigationScreenProp<NavigationState>;
}
function Login(props: ILogingProps) {
  const [emailLogin, , emailLoading, , isLoginSuccess] = useApi(
    props.navigation,
    true,
  );
  const [lastEmail, setLastEmail] = useState('');
  const [password, setPassword] = useState('');
  const appCtx = useContext(AppContext);

  useEffect(() => {
    AsyncStorage.getItem('email').then((email) => {
      appCtx.dispatch({
        type: 'LOGIN_CREDENTIALS',
        lastLoggedInEmail: email,
      });
      setLastEmail(email);
    });

    AsyncStorage.getItem('password').then((password) => {
      setPassword(password);
    });
  }, [lastEmail, password]);
  /** Locks app in portrait mode */
  const authManager = new AuthenticationManager();
  function loginUser(values: ILoginFormValues) {
    AsyncStorage.setItem('email', values.email)
      .then(() => {})
      .catch(() => {});
    AsyncStorage.setItem('password', values.password)
      .then(() => {})
      .catch(() => {});
    emailLogin('POST', Urls.auth.login, values, false);
    appCtx.dispatch({
      type: 'LOGIN_CREDENTIALS',
      lastLoggedInEmail: values.email,
    });

    appCtx.dispatch({
      type: 'LOGIN_PASSWORD',
      loginPassword: values.password,
    });
  }

  useEffect(() => {}, [appCtx.lastLoggedInEmail]);

  useEffect(() => {
    if (isLoginSuccess) {
      appCtx.dispatch({
        type: 'IS_AUTHENTICATED',
        isAuthenticated: true,
      });
    }
  }, [isLoginSuccess]);

  useEffect(() => {
    // authManager.remove().then(() => {});
    authManager.get().then((item) => {
      if (item !== null) {
        props.navigation.navigate('MainApp');
      } else {
        props.navigation.navigate('Login');
      }
    });
  }, [appCtx.isAuthenticated]);

  return (
    <Connectivity>
      <Async displayChildren={emailLoading}>
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
          <View style={{ flex: 1 }}>
            <ImageBackground
              resizeMode={'cover'}
              source={Images['bg']}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
          <View style={{ flex: 1, paddingHorizontal: 15 }}>
            <Formik
              initialValues={{
                email: appCtx.lastLoggedInEmail,
                password: appCtx.loginPassword,
              }}
              onSubmit={loginUser}
              validationSchema={LoginSchema}
            >
              {(formProps: FormikProps<ILoginFormValues>) => {
                return (
                  <View>
                    <InputField
                      placeholder={'Email'}
                      fieldName='email'
                      fieldType={'text'}
                      keyboardType={'email-address'}
                      returnKeyType={'next'}
                      typeTextColor={Colors.white}
                      borderColor={Colors.white}
                      placeHolderColor={Colors.white}
                      {...formProps}
                    />
                    <InputField
                      placeholder={'Password'}
                      fieldName='password'
                      fieldType={'password'}
                      returnKeyType={'done'}
                      typeTextColor={Colors.white}
                      borderColor={Colors.white}
                      placeHolderColor={Colors.white}
                      {...formProps}
                    />
                    {/* 
                          
                          TODO: For future
                          <Button
                            alignSelf={'flex-start'}
                            textColor={Colors.button}
                            buttonText={'Forgot Password?'}
                            isLink={true}
                          /> */}
                    <TouchableOpacity
                      onPress={formProps.handleSubmit}
                      style={{
                        alignItems: 'center',
                        height: 47,
                        backgroundColor: Colors.black,
                        justifyContent: 'center',
                        marginVertical: 4,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: Fonts.type.regular,
                          color: Colors.white,
                        }}
                      >
                        Login
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        height: 47,
                        backgroundColor: Colors.white,
                        justifyContent: 'center',
                        marginVertical: 4,
                        borderRadius: 6,
                      }}
                      onPress={() => {
                        props.navigation.navigate('Signup');
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: Fonts.type.regular,
                        }}
                      >
                        Create New Account
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        height: 47,
                        justifyContent: 'center',
                        marginVertical: 4,
                        borderRadius: 6,
                      }}
                      onPress={() => {
                        props.navigation.navigate('MainApp');
                        appCtx.dispatch({
                          type: 'IS_CONTINUE_WITHOUT_LOGIN',
                          isContinueWithoutLogin: true,
                        });
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: Fonts.type.regular,
                          color: Colors.white,
                        }}
                      >
                        Continue Without Logging In
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            </Formik>
          </View>
        </View>
      </Async>
    </Connectivity>
  );
}

export default Login;
