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

function addUrl(files, metalsmith, done) {

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    function bestUrl(file) {
        var url = '/';
        if (endsWith(file, 'index.html')) {
            url += file.substr(0, file.length - 'index.html'.length);
        } else {
            url += file;
        }
        url = url.split('\\').join('/');
        return url;
    }

    for (var file in files) {
        if (files.hasOwnProperty(file)) {
            files[file].url = bestUrl(file);
        }
    }

    done();
}

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
    .use(addUrl)
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
