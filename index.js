var Metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    permalinks = require('metalsmith-permalinks'),
    templates = require('metalsmith-templates');

Metalsmith(__dirname)
    .use(markdown())
    .use(permalinks({
        pattern: ':title'
    }))
    .use(templates('jade'))
    .build(function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log('Blog built');
        }
    });
