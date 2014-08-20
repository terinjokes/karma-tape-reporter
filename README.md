# karma-tape-reporter

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
