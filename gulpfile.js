var fs = require('fs');
var gulp = require('gulp');
var qunit = require('node-qunit-phantomjs');

//var browserify = require('gulp-browserify');
var browserify = require('browserify');

gulp.task('bundle', function() {
	browserify('./index.js').require('./index.js', {expose: 'regard'})
		.bundle()
		.pipe(fs.createWriteStream(__dirname + '/dist/regard.js'));
});

gulp.task('test', function() {
     qunit('./testing/run_tests.html');
});

gulp.task('default', ['bundle', 'test']);