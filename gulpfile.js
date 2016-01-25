/* jshint -W097 */
/* globals require */

const gulp = require('gulp'),
    gutil = require('gulp-util'),
    jasmine = require('gulp-jasmine'),
    jshint = require('gulp-jshint'),
    istanbul = require('gulp-istanbul');
    //replace = require('gulp-replace'),
    //del = require('del');

// See http://jshint.com/docs/options/ for all options
const lintOptions = {
    curly: true,  // All code blocks must be wrapped in curly braces§
    eqeqeq: true,  // All equality checks must use !== or ===
    latedef: 'nofunc', // Don't allow variables to be used before they're declared
    shadow: true, // Don't allow a variable name to be used if it's been used in an outer scope alread
    undef: true, // Don't allow undeclared variables to be used (global variables must be declared with the GLOBAL keyword)
    unused: true, // Don't allow unused variables,
    esversion: 6 // allow ES6 keywords
};

const matchAllSourceFiles = './**/*.js',
    matchNodeModulesDirectory = './node_modules/**',
    matchAllSpecFiles = './js/tests/*.spec.js';
/**
 * Returns a glob that will NOT match the input glob
 * @param {String} glob Input glob
 * @returns {String} the inverse of the input glob
 */
var exclude = function(glob) {
    return '!' + glob;
};

gulp.task('lint', function() {

    return gulp.src(
            [
                exclude(matchAllSpecFiles),
                exclude(matchNodeModulesDirectory),
                matchAllSourceFiles
            ])
        //.pipe(replace(traceProcessing.lineMatchRegex, traceProcessing.processLine))
        .pipe(jshint(lintOptions))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));

});

gulp.task('test', function() {

    return gulp.src([matchAllSourceFiles, exclude(matchAllSpecFiles)])
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function () {
            return gulp.src(matchAllSpecFiles)
                .pipe(jasmine())
                .pipe(istanbul.writeReports({
                    dir: './coverage',
                    reporters: ['lcov', 'json'],
                    reportOpts: { dir: './coverage' }
                }));
        });
});

/*
gulp.task('clean', function() {

    return del(prepareDestFolder);
});

gulp.task('prepare-trace', ['clean'], function () {

    return gulp.src([matchAllSourceFiles, exclude(matchAllSpecFiles)])
        .pipe(replace(traceProcessing.lineMatchRegex, traceProcessing.processLine))
        .pipe(gulp.dest(prepareDestFolder));
});
*/

gulp.task('build', ['lint', 'test'], function() {
    gutil.log('Finished.');
});

gulp.task('default', ['build']);
