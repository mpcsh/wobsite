const htmlToText = require('html-to-text');
const readingTime = require('reading-time');

module.exports = function(config) {
  config.addPassthroughCopy('css');
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

  config.addFilter('description', templateContent => {
    let content = htmlToText.fromString(templateContent, {
      wordwrap: false,
      ignoreHref: true,
      ignoreImage: true,
      uppercaseHeadings: false,
    });

    let sentences = content.split(
      /(\p{Terminal_Punctuation}\p{White_Space})/gu,
    );

    let beginning = sentences.shift();
    while (beginning.length < 200) {
      beginning += sentences.shift() + sentences.shift();
    }

    beginning += '...';
    return beginning;
  });

  config.addFilter('readingTime', templateContent =>
    Math.ceil(readingTime(templateContent).minutes),
  );
};
