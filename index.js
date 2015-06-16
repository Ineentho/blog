var Metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    permalinks = require('metalsmith-permalinks'),
    templates = require('metalsmith-templates'),
    watch = require('metalsmith-watch'),
    define = require('metalsmith-define');


var watchEnabled = process.argv.length > 2 && process.argv[2] === 'watch';

var metalsmith = Metalsmith(__dirname)
    .use(markdown())
    .use(permalinks({
        pattern: ':title'
    }))
    .use(templates('jade'))
    .use(define({
        watch: watchEnabled
    }));


if (watchEnabled) {
    metalsmith.use(
        watch({
            paths: {
                "${source}/**/*": true,
                "templates/**/*": "**/*"
            },
            livereload: true
        })
    );
}


metalsmith.build(function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log('Blog built');
    }
});
