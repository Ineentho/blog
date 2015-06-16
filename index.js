var Metalsmith  = require('metalsmith'),
    markdown    = require('metalsmith-markdown'),
    permalinks  = require('metalsmith-permalinks'),
    templates   = require('metalsmith-templates'),
    watch       = require('metalsmith-watch'),
    define      = require('metalsmith-define'),
    serve       = require('metalsmith-serve'),
    collections = require('metalsmith-collections'),
    pagination  = require('metalsmith-pagination'),
    snippet     = require('metalsmith-snippet'),
    stylus      = require('metalsmith-stylus'),
    cleanCSS    = require('metalsmith-clean-css'),
    babel       = require('metalsmith-babel');


var watchEnabled = process.argv.length > 2 && process.argv[2] === 'watch';

var metalsmith = Metalsmith(__dirname)
    .use(collections({
        posts: {
            pattern: 'posts/*.md',
            sortBy: 'date',
            reverse: true
        }
    }))
    .use(markdown())
    .use(permalinks({
        pattern: ':title'
    }))
    .use(define({
        watch: watchEnabled
    }))

    .use(pagination({
        'collections.posts': {
            perPage: 5,
            template: 'index.jade',
            first: 'index.html',
            path: 'page/:num/index.html'
        }
    }))
    .use(snippet({
        maxLength: 250,
        suffix: '...'
    }))
    .use(templates('jade'))
    .use(stylus({
        nib: true
    }))
    .use(cleanCSS())
    .use(babel({
        compact: true
    }));


if (watchEnabled) {
    metalsmith = metalsmith
        .use(watch({
            paths: {
                "${source}/**/*": "**/*",
                "templates/**/*": "**/*"
            },
            livereload: true
        }))
        .use(serve());
}


metalsmith.build(function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log('Blog built');
    }
});
