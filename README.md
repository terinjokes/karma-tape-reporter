# karma-tape-reporter [![Build Status](http://img.shields.io/travis/terinjokes/karma-tape-reporter.svg?style=flat)](https://travis-ci.org/terinjokes/karma-tape-reporter) [![](http://img.shields.io/npm/dm/karma-tape-reporter.svg?style=flat)](https://www.npmjs.org/package/karma-tape-reporter) [![](http://img.shields.io/npm/v/karma-tape-reporter.svg?style=flat)](https://www.npmjs.org/package/karma-tape-reporter) [![](http://img.shields.io/codeclimate/github/terinjokes/karma-tape-reporter.svg?style=flat)](https://codeclimate.com/github/terinjokes/karma-tape-reporter) [![](http://img.shields.io/codeclimate/coverage/github/terinjokes/karma-tape-reporter.svg?style=flat)](https://codeclimate.com/github/terinjokes/karma-tape-reporter)

> Karma plugin to report test results that mimics `tape`.

# Installation

`npm install --save-dev karma-tape-reporter`

# Configuration

```javascript
// karma.conf.js

module.exports = function(config) {
  config.set({
    // ...

    reporters: ['tape'],

    // ...
  });
};
```
