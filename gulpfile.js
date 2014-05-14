var fs = require('fs');
var gulp = require('gulp');
//var browserify = require('gulp-browserify');
var browserify = require('browserify');

gulp.task('bundle', function() {
	browserify('./index.js')
		.bundle({standalone: 'regardClient'})
		.pipe(fs.createWriteStream(__dirname + '/dist/regard.js'));
});

gulp.task('default', ['bundle']);