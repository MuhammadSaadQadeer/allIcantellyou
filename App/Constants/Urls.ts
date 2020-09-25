export default {
  auth: {
    login: 'login',
    signup: 'register',
    refresh: 'refresh',
  },
  home: {
    articles: 'posts?limit=10&',
    diary_posts: 'feed/diary-posts?&limit=20',
    diary_feed: 'feed',
    react: 'react',
    my_diary: 'diary-posts',
    delete_diary_post: (deleteId: string) => `diary-posts/${deleteId}`,
    edit_diary_post: (postId: string) => `diary-posts/${postId}`,
  },

  // https://api.allicantellyou.com/posts?limit=12&
  helpfulLinks: {
    links: 'helpful-links',
  },

  profile: {
    me: 'me',
    followed: 'followed',
    user: 'user/',
    avatar: 'me/avatar',
  },
  events: {
    events: 'events',
  },
  conversations: {
    my_conversations: 'forum-topics?&limit=1000',
    join: (convo_id: string) => `forum-messages/${convo_id}`,
    post_answer: 'forum-messages',
    delete_message: (msg_id: string) => `forum-messages/${msg_id}`,
    add_topic: 'forum-topics',
  },
  my_story: {
    bio: 'bio',
    answers: 'bio/answers',
    delete_answer: (deleteId: string) => `bio/answers/${deleteId}`,
  },
  search: {
    search_query: (query: string) => `search?q=${query}`,
  },
  notifications: {
    notifications: 'notifications',
    seen: 'notifications/seen',
  },
};

// To fetch questions on story section for creating new story use bio url
