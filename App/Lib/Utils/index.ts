import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { all, values } from 'ramda';
import Snackbar from 'react-native-snackbar';
import Urls from '../../Constants/Urls';
import NavigationService from '../../NavigationService';
import Api from '../../Services/Api';
import { Colors } from '../../Themes';
import AuthenticationManager from '../KeyChain/AuthenticationManager';



/**
 * Shows notification in a SnackBar
 *
 * @method showNotification
 *
 * @param {string} message
 *
 * @returns {void}
 */
export const showNotification = (message: string, duration?: number) => {
  Snackbar.show({
    title: message,
    backgroundColor: Colors.background,
    duration: duration ? duration : 4000,
    action: {
      title: 'OK',
      color: Colors.white,

      onPress: () => { },
    },
  });
};

export function displayInDays(date: string) {
  return moment(date).fromNow();
}
//a.diff(b, 'days')

export function diffInHours(date: string) {

  const now = moment(new Date());
  const future = moment(date).add(1, "day");
  const diff = future.diff(now);
  const duration = moment.duration(diff).asHours();

  //   var a = moment(new Date().toString()); //now
  //   var b = moment(date);
  //   var c = 24 - Number(a.diff(b, 'hours'));
  return duration;
}
export function getMonthLetters(date: string) {
  return moment(date, 'DD/MM/YYYYs').format('MMM');
}

//moment(date, 'YYY-MM-DD').format('DD/MMM')
export function getMonthDay(date: string) {
  return moment(date, 'DD/MM/YYYY').format('DD');
}

//2019-11-20 20:09:24')
export function getPubishedDateFormate(date: Date) {
  return moment(date).format('YYYY-MM-DD hh:mm:ss');
}

export function getTimeInAmPm(date: string) {
  return moment(date, 'h:mm a').format('LT');
}

export function getFormatedDateDDMMYYY(date: string) {
  return moment(date).format('DD/MM/YYYY');
}

export function getDateWithMonthName(date: string) {
  return moment(date).format('Do MMMM YYYY');
}

export function getInitialsForDisplayName(displayName: string) {
  let initials = displayName.split(' ');
  let first = initials[0];
  if (initials.length === 2) {
    let second = initials[1];

    return `${first[0]}${second[0]}`;
  } else {
    return first[0];
  }
}
/**
 * Checks if an object has all props truthy
 *
 * @method allTruthyProps
 *
 * @param {[key:string]: string} object
 *
 * @returns {boolean}
 */
export function allTruthyProps(object) {
  const keyValues = values(object);
  return all(Boolean)(keyValues);
}

export function saveInAsyncStorage(key: string, value: string) {
  AsyncStorage.getItem(key).then((users) => {


    if (users?.length) {
      let prevVale = JSON.parse(users)
      for (let i = 0; i < prevVale.length; i++) {
        if (prevVale[i] === value) {
          return;
        }
      }
      prevVale.push(value);
      AsyncStorage.setItem(key, JSON.stringify(prevVale)).then((users) => {

      });
    } else {
      let usersIds = [value];
      AsyncStorage.setItem(key, JSON.stringify(usersIds)).then((users) => {

      });
    }
  });
}

export async function catchExpiredToken() {

  const authManager = new AuthenticationManager();

  try {

    const temp = await Api({
      method: 'POST',
      url: Urls.auth.refresh,
    })
    authManager.remove().then(() => {
      authManager
        .set(temp.data.accessToken)
        .then(() => {
          return
        })
    })
      .catch((error) => {
        authManager.remove().then(() => {
          NavigationService.navigate('Introduction');
        })
        return
      });
  } catch (err) {

  }



}

