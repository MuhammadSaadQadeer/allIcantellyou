import { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import AuthenticationManager from '../Lib/KeyChain/AuthenticationManager';
import { showNotification } from '../Lib/Utils';
import Api from '../Services/Api';

export function useApi(
  navigation?: NavigationScreenProp<NavigationState>,
  isAuth?: boolean,
  navigateTo?: string,
  source?: any,
) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  /** To keep track of the upload progress */
  const [uploadProgress, setProgress] = useState(0);

  const apiCaller = <T>(
    method,
    url: string,
    payload?: T,
    hideError?: boolean,
    headers?: any,
    returnProgress?: boolean,
    successNotification?: string,
  ) => {
    const authManager = new AuthenticationManager();

    setLoading(true);
    setError(false);
    setSuccess(false);
    Api({
      method,
      url,
      data: payload,
      headers: Boolean(headers) ? headers : undefined,
      cancelToken: Boolean(source) ? source.token : null,
    })
      .then((result: AxiosResponse) => {
        setError(false);

        setResponse(result.data);
        setSuccess(true);

        /**  If api call is related to auth then store the key in keychain manager and navigate to main app */
        if (isAuth) {
          //  AsyncStorage.setItem('token', result.data.accessToken).then(() => {});
          authManager.remove().then(() => {});
          authManager
            .set(result.data.accessToken)
            .then(() => {
              navigation.navigate('MainApp');
              setLoading(false);
            })
            .catch((error) => {
              setLoading(false);
              showNotification('Unable to login something went wrong');
              // console.tron.warn(`Error: ${error}`);
            });
          return;
        }

        if (Boolean(successNotification)) {
          // showNotification(successNotification);
        }

        /** If user wants to navigate to a specific screen then navigate to that screen */
        if (Boolean(navigateTo)) {
          navigation.navigate(navigateTo);
          setLoading(false);
          return;
        }
        setLoading(false);
      })
      .catch((error: AxiosError) => {
        setSuccess(false);
        setLoading(false);
        /** In case of error handling in calling component */
        setError(true);

        if (!hideError) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            //showNotification(`Error: ${error.response.data.errors[0]}`);
          } else {
            if (error.message === 'Request failed with status code 400') {
              showNotification('Username or is password incorrect');
              return;
            }
            //showNotification(`Error: ${error.message}`);
          }
        }
      });
  };
  return [apiCaller, response, loading, error, success, uploadProgress];
}
