// Importing the libraries required
const gulp = require('gulp'),
			colors = require('colors'),
			htmlmin = require('gulp-htmlmin'),
			webp = require('gulp-webp'),
			imagemin = require('gulp-imagemin'),
			cleanCSS = require('gulp-clean-css'),
			uglify = require('gulp-uglify'),
			connect = require('gulp-connect'),
			ngrok = require('ngrok'),
			psi = require('psi');

// Config variables
const appPath = 'app',
			publicPath = 'public',
			port = 8787;

// Defining global variable to use later
let ngrokUrl;

// Main task, calling the essential tasks and closing necessary stuff
gulp.task('default', ['compile', 'serve', 'psi', 'after']);

// Task to call out of gulp, just to run everything, watches 
// the changes and don't stop the server and ngrok
gulp.task('online', ['compile', 'serve', 'psi']);

// Task running subtasks of compiling files from app folder to the public folder
gulp.task('compile', ['minify-html', 'minify-css', 'minify-js', 'images']);

// Task to run image optimizations
gulp.task('images', ['optimize-image', 'convert-webp']);

// Subtask to convert all images to webp
gulp.task('convert-webp', () => {
	console.log('Converting images to webp'.cyan);
  return gulp.src(appPath + '/img/*')
    .pipe(webp())
    .pipe(gulp.dest(publicPath + '/img'));
});

// Subtask to optimize the size of traditional images
gulp.task('optimize-image', () => {
	console.log('Optimizing images'.cyan);
  return gulp.src(appPath + '/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest(publicPath + '/img'))
});

// Subtask to minify the CSS
gulp.task('minify-css', () => {
	console.log('Minifying CSS'.cyan);
	return gulp.src(appPath + '/css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest(publicPath + '/css'));
});

// Subtask to minify the JavaScript
gulp.task('minify-js', () => {
	console.log('Minifying JavaScript'.cyan);
	return gulp.src(appPath + '/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(publicPath + '/js'));
});

// Subtask to minify the HTML
gulp.task('minify-html', () => {
	console.log('Minifying HTML'.cyan);
	return gulp.src(appPath + '/*.html')
    .pipe(htmlmin({
    	collapseWhitespace: true,
    	minifyJS: true,
    	minifyCSS: true
    }))
    .pipe(gulp.dest(publicPath));
});

// Task running subtasks to start the server and ngrok
gulp.task('serve', ['connect', 'ngrok']);

// Subtask to run the server
gulp.task('connect', () => {
	console.log('Running server'.yellow);
  connect.server({
  	root: publicPath,
    livereload: false,
    port: port
  });
});

// Subtask to run ngrok
gulp.task('ngrok', (callback) => {
	ngrok.connect({
		port: port
	}, (err, url) => {
		console.log('Ngrok:'.blue, url.blue);
		ngrokUrl = url;
		callback();
	});
});

// Task running subtaks to measure the score of PageSpeed Insight
gulp.task('psi', ['psi-mobile', 'psi-desktop']);

// Subtask to get the mobile PageSpeed score 
gulp.task('psi-mobile', ['serve'], (callback) => {
	psi(ngrokUrl, {strategy: 'mobile'}).then(data => {
	  console.log("Mobile:".magenta, data.ruleGroups.SPEED.score);
	  callback();
	});
});

// Subtask to get the desktop PageSpeed score 
gulp.task('psi-desktop', ['serve'], (callback) => {
	psi(ngrokUrl).then(data => {
	  console.log("Desktop:".magenta, data.ruleGroups.SPEED.score);
	  callback();
	});
});

// Subtask to run all finish processes
gulp.task('after', ['psi'], () => {
	console.log('Stopping server'.red);
	connect.serverClose();
	ngrok.kill();
})