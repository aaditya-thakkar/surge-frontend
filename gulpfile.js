var gulp = require('gulp');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var reactify = require('reactify');

gulp.task('browserify', function() {
	var b = browserify({
		entries: ['src/index.js'],
		debug: true
	});
	b.transform(reactify); // use the reactify transform
	return b.bundle()
		.pipe(source('index.js'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
         .use(require('connect-livereload')({ port: 35730 }))
         .use(connect.static('./'))
         .use(connect.static('.tmp'))
         .use(connect.directory('./'));

    require('http').createServer(app)
        .listen(3001)
        .on('listening', function () {
            console.log('Started connect web server on http://127.0.0.1:3001');
        });
});

gulp.task('watch',['connect'], function() {
	gulp.watch('src/*.js', ['browserify']);
	gulp.watch('src/*.jsx', ['browserify']);
});

gulp.task('default', ['watch','browserify']);
