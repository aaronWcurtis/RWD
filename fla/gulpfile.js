// Required // 
var gulp = require('gulp'),
		//runSequence = require('run-sequence'),
		del = require('del'),
		minifyCss = require('gulp-minify-css'),
		rename = require('gulp-rename'),
		//sass = require('gulp-sass'),
		plumber = require('gulp-plumber'),
		autoprefixer = require('gulp-autoprefixer'),
		browserSync = require('browser-sync'),
		reload = browserSync.reload
		//sass = require('gulp-sass')
		uglify = require('gulp-uglify'),
		imagemin = require('gulp-imagemin'),
		pngquant = require('imagemin-pngquant');

// HTML Tasks //
gulp.task('html', function() {
	gulp.src('app/index.html')
	.pipe(reload({stream:true}));
});

// Task to minify images and pipe them into build folder
gulp.task('imagemin', function() {
	return gulp.src('app/images/**.*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('build/images/'));
});


// Sass Tasks //
//gulp.task('sass', function() {
//	gulp.src('app/sass/*.sass')
//		.pipe(plumber())
//		.pipe(sass())
//		.pipe(gulp.dest('app/css'))
//		.pipe(reload({stream:true}));
//})


// Stylesheet Tasks //
gulp.task('styles', function() {
	gulp.src(['app/css/**/*.css', '!app/css/**/*.min.css'])
		.pipe(plumber())
		.pipe(rename({suffix: '.min'}))
		.pipe(minifyCss())
		.pipe(gulp.dest('app/css'))
		.pipe(reload({stream:true}));
});


// Script Tasks //
gulp.task('scripts', function() {
	gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js'])
		.pipe(plumber())
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(reload({stream:true}));
})


// Browser Sync Tasks //
gulp.task('browserSync', function() {
	browserSync({
		server:{
			baseDir: "./app/"
		}
	});
});


// Watch Tasks //
gulp.task('watch', function() {
	//gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/css/**/*.css', ['styles']);
	//gulp.watch('app/js/**/*.js', ['scripts']);
	gulp.watch('app/**/*.html', ['html']);
})


// Old Build Tasks //



// ////////////////////////////////////////////
// Default Tasks //
///////////////////////////////////////////////
gulp.task('default', ['scripts', 'html', 'browserSync', 'watch']);

// Build Tasks for Production time

// buildFilesFoldersRemove => list of files to remove when running final build
var config = { 
	buildFilesFoldersRemove:[
		// 'build/sass/', 
		'build/js/!(*.min.js)',
		'build/css/!(*.min.css)'
	]
};

gulp.task('build:serve', function() {
    browserSync({
        server: {
            baseDir: "./build/"
        }
    });
});

// clean out all files and folders from build folder
gulp.task('build:cleanfolder', function (cb) {
	del([
		'build/**'
	], cb);
});

// task to create build directory of all files
gulp.task('build:copy', function(){
    return gulp.src('app/**/*/')
    .pipe(gulp.dest('build/'));
});

// task to removed unwanted build files
// list all files and directories here that you don't want included
gulp.task('build:remove', ['build:copy'], function (cb) {
	del(config.buildFilesFoldersRemove, cb);
});

gulp.task('build', ['build:copy', 'build:remove']);