// Learn more at developers.reddit.com/docs
import { Devvit, useState, useForm } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Add my post',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Submitting your post - upon completion you'll navigate there.");

    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'My devvit post',
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.navigateTo(post);
  },
});

// Add a post type definition
Devvit.addCustomPostType({
  name: '',
  height: 'regular',
  render: (_context) => {
    // state
    // 0 == log in
    // 1 == log in fail page
    // 2 == log in success, showing page with image and textbox and post button
    // 3 == post success
    // default === post fail
    const [state, setState] = useState(0);
    const [postTitle, setPostTitle] = useState('');

    const postForm = useForm(
      {
        fields: [
          {
            type: 'string',
            name: 'name',
            label: 'Write your post title...',
          },
        ],
      },
      (values) => {
        setPostTitle(values.name);
        // TODO
        // const status = sendPost(postTitle, image);
        setState(3);
      }
    );
    
    if (state === 0) {
      return (
        <vstack height="100%" width="100%" gap="medium" alignment="center middle">
          <image
            url="logo.png"
            description="logo"
            imageHeight={256}
            imageWidth={256}
            height="48px"
            width="48px"
          />
          <text size="large">{`Generate your r/statsfm post!`}</text>
          <button appearance="primary" onPress={() => {
            // TODO
            // const [status, data] = getSpotifyData
            setState(2)
          }}>
            Login to Spotify
          </button>
        </vstack>
      );
    } else if (state === 1) {
      return (
        <vstack height="100%" width="100%" gap="medium" alignment="center middle">
          <image
            url="error.png"
            description="logo"
            imageHeight={256}
            imageWidth={256}
            height="48px"
            width="48px"
          />
          <text size="large">{`Login error. Please try again.`}</text>
          <button appearance="primary" onPress={() => { setState(0); }}>
            Try again
          </button>
        </vstack>
      );
    } else if (state === 2) {
      return (
        <vstack height="100%" width="100%" gap="medium" alignment="center middle">
          <text size="large">{`These are your top artists`}</text>
          // TODO
          // image of top artists
          <button appearance="primary" onPress={() => {
            _context.ui.showForm(postForm);
          }}>
            Post!
          </button>
        </vstack>
      );
    } else if (state === 3) {
      return (
        <vstack height="100%" width="100%" gap="medium" alignment="center middle">
          <image
            url="success.png"
            description="logo"
            imageHeight={256}
            imageWidth={256}
            height="48px"
            width="48px"
          />
          <text size="large">{`Posted!`}</text>
        </vstack>
      );
    } else {
      return (
        <vstack height="100%" width="100%" gap="medium" alignment="center middle">
          <image
            url="error.png"
            description="logo"
            imageHeight={256}
            imageWidth={256}
            height="48px"
            width="48px"
          />
          <text size="large">{`Posting failed. Please try again.`}</text>
          <button appearance="primary" onPress={() => setState(0)}>
            Try again
          </button>
        </vstack>
      );
    }
  },
});

export default Devvit;