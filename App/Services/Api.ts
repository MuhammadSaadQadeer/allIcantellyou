import { AxiosPromise, AxiosRequestConfig, default as axios } from 'axios';
import { isNil } from 'ramda';
import { UserCredentials } from 'react-native-keychain';
import AppConfig from '../Config/AppConfig';
import AuthenticationManager from '../Lib/KeyChain/AuthenticationManager';
import { catchExpiredToken } from '../Lib/Utils';
import NavigationService from '../NavigationService';
/**
 * Assigns headers (Authorization) to axios config
 *
 * @method assignHeaders
 *
 * @param {AxiosRequestConfig} config
 *
 * @returns {Promise<AxiosRequestConfig>}
 */
export const assignHeaders = (
  config: AxiosRequestConfig,
): Promise<AxiosRequestConfig> => {
  const manager = new AuthenticationManager();

  return manager
    .get()
    .then((credentials: UserCredentials | null) =>
      // If there is no keychain entry for token
      // Then it's safe to assume that we're hitting an unprotected endpoint.
      isNil(credentials)
        ? config
        : Object.assign({}, config, {
          headers: {
            // credentials.password -> token
            Authorization: `Bearer ${credentials.password}`,
          },
        }),
    )
    .catch(() => config);
};

/**
 * Wraps axios (http-client
 *
 * @param {AxiosRequestConfig}
 *
 * @returns {AxiosPromise}
 */
export default (config: AxiosRequestConfig): AxiosPromise => {
  const updatedConfig = Object.assign(
    { 'Content-Type': 'application/json' },
    config,
    {
      url: `${AppConfig.BASE_URL}${config.url}`,
    },
  );

  if (
    updatedConfig.url.includes('api/mobile/v1/user') ||
    updatedConfig.url.includes('api-token-auth')
  ) {
    // TODO (laumair): api module should not know about any urls and this should be handled outside of this module
    return axios(updatedConfig);
  }

  // response parse
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      //Handle refresh
      if (error.response.status == 401) {
        return catchExpiredToken();
      }

      //Handle two weeks timedout

      if (error.response.status == 400) {
        const manager = new AuthenticationManager();
        manager.remove().then(() => {
          NavigationService.navigate('Introduction')
        })
        return
      }
      if (error.response) {
        return error.response.data;
      } else {
        return Promise.reject(error);
      }
    },
  );

  return assignHeaders(updatedConfig).then(
    (configWithHeaders: AxiosRequestConfig) => axios(configWithHeaders),
  );
};
