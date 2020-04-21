const description = require('eleventy-plugin-description');
const readingTime = require('reading-time');

module.exports = function(config) {
  config.addPassthroughCopy('fonts');
  config.addPassthroughCopy('img');

  config.addCollection('blogMaybeWithDrafts', collection => {
    let posts = collection.getFilteredByTag('blog');
    if (process.env.SHOW_DRAFTS !== 'true') {
      return posts.filter(post => !post.data.draft);
    }
    return posts;
  });

  config.addFilter('dateFormat', date =>
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(date),
  );

  config.addPlugin(description);

  config.addFilter('readingTime', templateContent =>
    Math.ceil(readingTime(templateContent).minutes),
  );
};
