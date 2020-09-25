import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { Colors, Fonts } from '../Themes';

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    flexDirection: 'row',
    height: 60,
    borderRadius: 5,
    marginVertical: 3,
    alignItems: 'center',
    backgroundColor: Colors.transparent,
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 8,
    fontFamily: Fonts.type.regular,
    letterSpacing: 0.35,
  },
  errorText: {
    flex: 1,
    color: Colors.error,
    height: 17,
    fontFamily: Fonts.type.light,
    flexWrap: 'wrap',
  },
  inputIcon: { marginRight: 10 },
});

export function InputField(props: any) {
  /** Current state of the input field */
  const [active, setActive] = useState(false);
  /** Visibility status of the input text - Initialized based on the field type of input */

  function toggleTextVisibility() {
    setIsSecured(!isSecured);
  }
  const {
    handleChange,
    handleBlur,
    values,
    fieldName,
    setFieldTouched,
    placeholder,
    errors,
    touched,
    keyboardType,
    returnKeyType,
    typeTextColor,
    borderColor,
    placeHolderColor,
    fieldType,
    multiline,
    height,
    backgroundColor,
    borderNone,
    borderRadius,
    numberOfLines,
  } = props;
  const [isSecured, setIsSecured] = useState(fieldType === 'password');

  /**
   * Sets touched value of the field to true
   * Sets the active status of the field to true
   *
   * @method handleFieldFocus
   *
   * @returns {void}
   */
  function handleFieldFocus() {
    setFieldTouched(fieldName, true);
    setActive(true);
  }

  /**
   * Calls handleBlur of the formik with the field name
   * Sets the active status of the field to false
   *
   * @method handleFieldBlur
   *
   * @returns {void}
   */
  function handleFieldBlur() {
    handleBlur(fieldName);
    setActive(false);
  }

  return (
    <View style={{ borderColor: Colors.fieldErrorBorder, borderWidth: 0 }}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: borderNone
              ? Colors.transparent
              : active
              ? Colors.fieldActiveBorder
              : errors[fieldName] && touched[fieldName]
              ? Colors.fieldErrorBorder
              : borderColor,

            borderRadius: borderRadius ? borderRadius : 0,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              textAlignVertical: 'top',
              color: typeTextColor ? typeTextColor : Colors.black,
              backgroundColor: backgroundColor ? backgroundColor : null,
              height: height ? height : null,
            },
          ]}
          placeholderTextColor={
            placeHolderColor ? placeHolderColor : Colors.black
          }
          placeholder={placeholder}
          onChangeText={handleChange(fieldName)}
          onFocus={handleFieldFocus}
          onBlur={handleFieldBlur}
          value={values[fieldName]}
          secureTextEntry={isSecured}
          keyboardType={keyboardType ? keyboardType : 'default'}
          returnKeyType={returnKeyType}
          multiline={multiline}
          numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
          minHeight={
            Platform.OS === 'ios' && numberOfLines ? 20 * numberOfLines : null
          }
        />

        {/* If field type is password then show an icon to show or hide the text inside the input field */}
        {fieldType === 'password' ? (
          <TouchableOpacity
            onPress={toggleTextVisibility}
            style={{ paddingHorizontal: 10 }}
          >
            <EntypoIcons
              size={20}
              color={Colors.white}
              name={isSecured ? 'eye-with-line' : 'eye'}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={{ flexDirection: 'row' }}>
        <Text style={{ flex: 1, flexWrap: 'wrap' }}>
          <Text style={styles.errorText}>
            {Boolean(errors[fieldName]) &&
            Boolean(touched[fieldName]) &&
            !active ? (
              <Text>{errors[fieldName]}</Text>
            ) : (
              ''
            )}
          </Text>
        </Text>
      </View>
    </View>
  );
}
