import { Formik, FormikProps } from 'formik';
import { equals, not } from 'ramda';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import { CheckBox, Overlay } from 'react-native-elements';
import * as Yup from 'yup';
import Async from '../../Components/Async';
import Connectivity from '../../Components/Connectivity';
import BackButton from '../../Components/General/BackButton';
import { InputField } from '../../Components/InputField';
import Urls from '../../Constants/Urls';
import { useApi } from '../../CustomHooks';
import { showNotification } from '../../Lib/Utils';
import { Colors, Fonts } from '../../Themes';

export interface ISignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  password: string;
  passwordConfirmation: string;
  newsSubscription: boolean;
  pseudonym: string;
  isNamePrivateOnRegister: boolean;
}

export const agreement = `Apps made available through the App Store are licensed, not sold, to you. Your license to each App is subject to your prior acceptance of either this Licensed Application End User License Agreement (“Standard EULA”), or a custom end user license agreement between you and the Application Provider (“Custom EULA”), if one is provided. Your license to any Apple App under this Standard EULA or Custom EULA is granted by Apple, and your license to any Third Party App under this Standard EULA or Custom EULA is granted by the Application Provider of that Third Party App. Any App that is subject to this Standard EULA is referred to herein as the “Licensed Application.” The Application Provider or Apple as applicable (“Licensor”) reserves all rights in and to the Licensed Application not expressly granted to you under this Standard EULA.

a. Scope of License: Licensor grants to you a nontransferable license to use the Licensed Application on any Apple-branded products that you own or control and as permitted by the Usage Rules. The terms of this Standard EULA will govern any content, materials, or services accessible from or purchased within the Licensed Application as well as upgrades provided by Licensor that replace or supplement the original Licensed Application, unless such upgrade is accompanied by a Custom EULA. Except as provided in the Usage Rules, you may not distribute or make the Licensed Application available over a network where it could be used by multiple devices at the same time. You may not transfer, redistribute or sublicense the Licensed Application and, if you sell your Apple Device to a third party, you must remove the Licensed Application from the Apple Device before doing so. You may not copy (except as permitted by this license and the Usage Rules), reverse-engineer, disassemble, attempt to derive the source code of, modify, or create derivative works of the Licensed Application, any updates, or any part thereof (except as and only to the extent that any foregoing restriction is prohibited by applicable law or to the extent as may be permitted by the licensing terms governing use of any open-sourced components included with the Licensed Application).

b. Consent to Use of Data: You agree that Licensor may collect and use technical data and related information—including but not limited to technical information about your device, system and application software, and peripherals—that is gathered periodically to facilitate the provision of software updates, product support, and other services to you (if any) related to the Licensed Application. Licensor may use this information, as long as it is in a form that does not personally identify you, to improve its products or to provide services or technologies to you.

c. Termination. This Standard EULA is effective until terminated by you or Licensor. Your rights under this Standard EULA will terminate automatically if you fail to comply with any of its terms. 

d. External Services. The Licensed Application may enable access to Licensor’s and/or third-party services and websites (collectively and individually, "External Services"). You agree to use the External Services at your sole risk. Licensor is not responsible for examining or evaluating the content or accuracy of any third-party External Services, and shall not be liable for any such third-party External Services. Data displayed by any Licensed Application or External Service, including but not limited to financial, medical and location information, is for general informational purposes only and is not guaranteed by Licensor or its agents. You will not use the External Services in any manner that is inconsistent with the terms of this Standard EULA or that infringes the intellectual property rights of Licensor or any third party. You agree not to use the External Services to harass, abuse, stalk, threaten or defame any person or entity, and that Licensor is not responsible for any such use. External Services may not be available in all languages or in your Home Country, and may not be appropriate or available for use in any particular location. To the extent you choose to use such External Services, you are solely responsible for compliance with any applicable laws. Licensor reserves the right to change, suspend, remove, disable or impose access restrictions or limits on any External Services at any time without notice or liability to you. 

e. NO WARRANTY: YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT USE OF THE LICENSED APPLICATION IS AT YOUR SOLE RISK. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE LICENSED APPLICATION AND ANY SERVICES PERFORMED OR PROVIDED BY THE LICENSED APPLICATION ARE PROVIDED "AS IS" AND “AS AVAILABLE,” WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND, AND LICENSOR HEREBY DISCLAIMS ALL WARRANTIES AND CONDITIONS WITH RESPECT TO THE LICENSED APPLICATION AND ANY SERVICES, EITHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES AND/OR CONDITIONS OF MERCHANTABILITY, OF SATISFACTORY QUALITY, OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY, OF QUIET ENJOYMENT, AND OF NONINFRINGEMENT OF THIRD-PARTY RIGHTS. NO ORAL OR WRITTEN INFORMATION OR ADVICE GIVEN BY LICENSOR OR ITS AUTHORIZED REPRESENTATIVE SHALL CREATE A WARRANTY. SHOULD THE LICENSED APPLICATION OR SERVICES PROVE DEFECTIVE, YOU ASSUME THE ENTIRE COST OF ALL NECESSARY SERVICING, REPAIR, OR CORRECTION. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES OR LIMITATIONS ON APPLICABLE STATUTORY RIGHTS OF A CONSUMER, SO THE ABOVE EXCLUSION AND LIMITATIONS MAY NOT APPLY TO YOU.

f. Limitation of Liability. TO THE EXTENT NOT PROHIBITED BY LAW, IN NO EVENT SHALL LICENSOR BE LIABLE FOR PERSONAL INJURY OR ANY INCIDENTAL, SPECIAL, INDIRECT, OR CONSEQUENTIAL DAMAGES WHATSOEVER, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, LOSS OF DATA, BUSINESS INTERRUPTION, OR ANY OTHER COMMERCIAL DAMAGES OR LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE LICENSED APPLICATION, HOWEVER CAUSED, REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT, OR OTHERWISE) AND EVEN IF LICENSOR HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OF LIABILITY FOR PERSONAL INJURY, OR OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THIS LIMITATION MAY NOT APPLY TO YOU. In no event shall Licensor’s total liability to you for all damages (other than as may be required by applicable law in cases involving personal injury) exceed the amount of fifty dollars ($50.00). The foregoing limitations will apply even if the above stated remedy fails of its essential purpose.

g. You may not use or otherwise export or re-export the Licensed Application except as authorized by United States law and the laws of the jurisdiction in which the Licensed Application was obtained. In particular, but without limitation, the Licensed Application may not be exported or re-exported (a) into any U.S.-embargoed countries or (b) to anyone on the U.S. Treasury Department's Specially Designated Nationals List or the U.S. Department of Commerce Denied Persons List or Entity List. By using the Licensed Application, you represent and warrant that you are not located in any such country or on any such list. You also agree that you will not use these products for any purposes prohibited by United States law, including, without limitation, the development, design, manufacture, or production of nuclear, missile, or chemical or biological weapons.

h. The Licensed Application and related documentation are "Commercial Items", as that term is defined at 48 C.F.R. §2.101, consisting of "Commercial Computer Software" and "Commercial Computer Software Documentation", as such terms are used in 48 C.F.R. §12.212 or 48 C.F.R. §227.7202, as applicable. Consistent with 48 C.F.R. §12.212 or 48 C.F.R. §227.7202-1 through 227.7202-4, as applicable, the Commercial Computer Software and Commercial Computer Software Documentation are being licensed to U.S. Government end users (a) only as Commercial Items and (b) with only those rights as are granted to all other end users pursuant to the terms and conditions herein. Unpublished-rights reserved under the copyright laws of the United States.

i. Except to the extent expressly provided in the following paragraph, this Agreement and the relationship between you and Apple shall be governed by the laws of the State of California, excluding its conflicts of law provisions. You and Apple agree to submit to the personal and exclusive jurisdiction of the courts located within the county of Santa Clara, California, to resolve any dispute or claim arising from this Agreement. If (a) you are not a U.S. citizen; (b) you do not reside in the U.S.; (c) you are not accessing the Service from the U.S.; and (d) you are a citizen of one of the countries identified below, you hereby agree that any dispute or claim arising from this Agreement shall be governed by the applicable law set forth below, without regard to any conflict of law provisions, and you hereby irrevocably submit to the non-exclusive jurisdiction of the courts located in the state, province or country identified below whose law governs:

If you are a citizen of any European Union country or Switzerland, Norway or Iceland, the governing law and forum shall be the laws and courts of your usual place of residence.

Specifically excluded from application to this Agreement is that law known as the United Nations Convention on the International Sale of Goods.`;

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required(' '),
  lastName: Yup.string().required(' '),
  email: Yup.string()
    .email()
    .required(' '),
  password: Yup.string()
    .matches(
      /^(?=.*\d)(?=.*[!@#\$%\^\&*\)\(+=._-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      'Password length must be atleast 8 characters including 1 capital letter, 1 lower case letter, 1 number and a special character',
    )
    .required(' '),
  passwordConfirmation: Yup.string()
    .matches(
      /^(?=.*\d)(?=.*[!@#\$%\^\&*\)\(+=._-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      'Password length must be atleast 8 characters including 1 capital letter, 1 lower case letter, 1 number and a special character',
    )
    .required(' '),
  // birthday: Yup.string().required(' '),
  pseudonym: Yup.string().required(' '),
});

function Signup(props: any) {
  const [keepPrivate, setKeepPrivate] = useState(false);
  const [newsLetter, setNewsLetter] = useState(false);
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [birthDate, setBirthDate] = useState('');

  const [emailSignupCaller, signupResponse, emailLoading, , success] = useApi(
    props.navigation,
    false,
  );

  useEffect(() => {
    if (success) {
      setKeepPrivate(false);
      setNewsLetter(false);
      showNotification('Sign up successfull proceed to login');
    }
  }, [success]);

  function signupWithEmail(values: ISignupFormValues) {
    /** Notify the user about password mismatch */

    if (!termsAndConditions) {
      return Alert.alert(
        'Accept Terms & Conditions',
        `Please Agree to our terms and conditions to proceed`,
      );
    }
    if (!birthDate) {
      Alert.alert('Birthday Missing', 'Please enter your birthday');
      return;
    } else {
      values = { ...values, birthday: birthDate };
    }
    if (not(equals(values.password, values.passwordConfirmation))) {
      Alert.alert('Password Mismatch', 'Both Passwords should be the same');
      return;
    }

    if (keepPrivate) {
      values = { ...values, isNamePrivateOnRegister: keepPrivate };
    }

    if (newsLetter) {
      values = { ...values, newsSubscription: newsLetter };
    }

    Alert.alert(
      'LICENSED APPLICATION END USER LICENSE AGREEMENT',
      agreement,

      [
        {
          text: 'I Accept',
          onPress: () =>
            emailSignupCaller('POST', Urls.auth.signup, values, false),
        },
        { text: 'Cancel', onPress: () => {} },
      ],
    );
  }
  return (
    <Connectivity>
      <Async displayChildren={emailLoading}>
        <KeyboardAvoidingView behavior='padding'>
          <Overlay
            isVisible={isVisible}
            windowBackgroundColor='rgba(255, 255, 255, .5)'
            overlayBackgroundColor='red'
            width='auto'
            height='auto'
          >
            <Text>Hello from Overlay!</Text>
          </Overlay>

          <ScrollView contentInset={{ bottom: 100 }}>
            <View
              style={{
                paddingHorizontal: 30,
                justifyContent: 'center',
                marginVertical: 15,
                flex: 1,
              }}
            >
              <BackButton navigation={props.navigation} />

              <Formik
                initialValues={{
                  firstName: '',
                  lastName: '',
                  email: '',
                  birthday: '',
                  password: '',
                  passwordConfirmation: '',
                  newsSubscription: false,
                  pseudonym: '',
                  isNamePrivateOnRegister: false,
                }}
                onSubmit={signupWithEmail}
                validationSchema={SignupSchema}
              >
                {(formProps: FormikProps<ISignupFormValues>) => {
                  return (
                    <View>
                      <View>
                        <InputField
                          placeholder={'First Name'}
                          fieldName='firstName'
                          fieldType={'text'}
                          keyboardType={'default'}
                          returnKeyType={'next'}
                          {...formProps}
                          typeTextColor={Colors.black}
                          borderColor={'#C3C3C3'}
                          placeHolderColor={Colors.lightGray}
                        />
                        <InputField
                          placeholder={'Last Name'}
                          fieldName='lastName'
                          fieldType={'text'}
                          keyboardType={'default'}
                          returnKeyType={'next'}
                          {...formProps}
                          typeTextColor={Colors.black}
                          borderColor={'#C3C3C3'}
                          placeHolderColor={Colors.lightGray}
                        />

                        <DatePicker
                          style={{ width: '100%', paddingVertical: 20 }}
                          date={birthDate}
                          mode='date'
                          placeholder='Date of Birth'
                          format='YYYY-MM-DD'
                          // minDate='2016-05-01'
                          //maxDate='2016-06-01'
                          confirmBtnText='Confirm'
                          cancelBtnText='Cancel'
                          customStyles={{
                            dateInput: {
                              borderRadius: 7,
                              height: 60,
                              marginBottom: 15,
                              color: Colors.black,
                              textAlign: 'left',
                              alignItems: 'flex-start',
                              paddingHorizontal: 8,
                            },
                            // ... You can check the source to find the other keys.
                          }}
                          showIcon={false}
                          onDateChange={(date) => {
                            setBirthDate(date);
                          }}
                        />
                        {/* <InputField
                          placeholder={'Date Of Birth'}
                          fieldName='birthday'
                          fieldType={'text'}
                          keyboardType={'default'}
                          returnKeyType={'next'}
                          {...formProps}
                          typeTextColor={Colors.black}
                          borderColor={'#C3C3C3'}
                        /> */}
                        <InputField
                          placeholder={'Pseudonym'}
                          fieldName='pseudonym'
                          fieldType={'text'}
                          keyboardType={'default'}
                          returnKeyType={'next'}
                          {...formProps}
                          typeTextColor={Colors.black}
                          borderColor={'#C3C3C3'}
                          placeHolderColor={Colors.lightGray}
                        />

                        <CheckBox
                          containerStyle={{
                            backgroundColor: Colors.transparent,
                            borderColor: Colors.transparent,
                            marginRight: 40,
                          }}
                          textStyle={{
                            fontFamily: Fonts.type.regular,
                            fontSize: 14,
                          }}
                          right={true}
                          title='Tick here to keep your real name private from other users'
                          checked={keepPrivate}
                          onPress={() => setKeepPrivate(!keepPrivate)}
                        />

                        <InputField
                          placeholder={'Email'}
                          fieldName='email'
                          fieldType={'email'}
                          keyboardType={'email-address'}
                          returnKeyType={'next'}
                          {...formProps}
                          typeTextColor={Colors.black}
                          borderColor={'#C3C3C3'}
                          placeHolderColor={Colors.lightGray}
                        />
                        <InputField
                          placeholder={'Password'}
                          fieldName='passwordConfirmation'
                          fieldType={'password'}
                          returnKeyType={'done'}
                          {...formProps}
                          borderColor={'#C3C3C3'}
                          placeHolderColor={Colors.lightGray}
                        />

                        <InputField
                          placeholder={'Confirm Password'}
                          fieldName='password'
                          fieldType={'password'}
                          returnKeyType={'done'}
                          {...formProps}
                          borderColor={'#C3C3C3'}
                          placeHolderColor={Colors.lightGray}
                        />
                        <View>
                          <CheckBox
                            containerStyle={{
                              backgroundColor: Colors.transparent,
                              borderColor: Colors.transparent,
                            }}
                            right={true}
                            textStyle={{
                              fontFamily: Fonts.type.regular,
                              fontSize: 14,
                            }}
                            title='Tick here to receive our newsletter and updates'
                            checked={newsLetter}
                            onPress={() => setNewsLetter(!newsLetter)}
                          />
                        </View>

                        <View
                          style={{
                            alignItems: 'flex-start',
                            flexDirection: 'row',
                            marginRight: 10,
                          }}
                        >
                          <CheckBox
                            containerStyle={{
                              backgroundColor: Colors.transparent,
                              borderColor: Colors.transparent,
                            }}
                            right={true}
                            textStyle={{
                              fontFamily: Fonts.type.regular,
                              fontSize: 14,
                            }}
                            title={`I agree to the Terms & Conditions and Privacy Policy`}
                            checked={termsAndConditions}
                            onPress={() =>
                              setTermsAndConditions(!termsAndConditions)
                            }
                          />
                        </View>

                        <TouchableOpacity
                          style={{
                            alignItems: 'center',
                            height: 47,
                            backgroundColor: formProps.isValid
                              ? Colors.black
                              : '#404040',

                            justifyContent: 'center',
                            marginVertical: 4,
                            borderRadius: 6,
                          }}
                          onPress={formProps.handleSubmit}
                          disabled={!formProps.isValid}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: Fonts.type.regular,
                              color: Colors.white,
                            }}
                          >
                            Sign Up
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: Fonts.type.regular,
                          color: Colors.lightGray,
                          textAlign: 'center',
                        }}
                      >
                        By creating an account and using our website, you agree
                        to our{' '}
                        <Text
                          style={{ color: Colors.background }}
                          onPress={() => {
                            Linking.openURL('https://allicantellyou.com/terms');
                          }}
                        >
                          Terms of Use.
                        </Text>
                        For information about how we use your personal
                        information, see our{' '}
                        <Text
                          style={{ color: Colors.background }}
                          onPress={() => {
                            Linking.openURL(
                              'https://www.allicantellyou.com/privacy',
                            );
                          }}
                        >
                          Privacy Policy.
                        </Text>
                      </Text>
                    </View>
                  );
                }}
              </Formik>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Async>
    </Connectivity>
  );
}

export default Signup;
