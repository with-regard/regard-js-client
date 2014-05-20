var fs = require('fs');
var gulp = require('gulp');
var qunit = require('node-qunit-phantomjs');

//var browserify = require('gulp-browserify');

gulp.task('bundle', function() {
  var browserify = require('browserify');
	browserify('./index.js')
		.bundle({standalone: 'regardClient'})
		.pipe(fs.createWriteStream(__dirname + '/dist/regard.js'));
});


gulp.task('default', ['bundle']);