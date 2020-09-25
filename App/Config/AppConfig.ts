// Simple React Native specific changes

export default {
  // font scaling override - RN default is on
  allowTextFontScaling: true,
  BASE_URL: __DEV__
    ? 'https://api-development.allicantellyou.com/'
    : 'https://api.allicantellyou.com/',
};

// diaryPosts
// resources
// posts
// users
