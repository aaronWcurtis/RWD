// Required //
var gulp = require('gulp'),
		//runSequence = require('run-sequence'),
		del = require('del'),
		minifyCss = require('gulp-minify-css'),
		rename = require('gulp-rename'),
		plumber = require('gulp-plumber'),
		autoprefixer = require('gulp-autoprefixer'),
		browserSync = require('browser-sync'),
		reload = browserSync.reload
		sass = require('gulp-sass')
		uglify = require('gulp-uglify'),
		imagemin = require('gulp-imagemin'),
		pngquant = require('imagemin-pngquant');

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

// HTML Tasks
gulp.task('html', function() {
	gulp.src('./index.html')
	.pipe(reload({stream:true}));
});

// Sass Tasks, convert Sass to CSS
gulp.task('sass', function() {
	gulp.src('app/sass/styles.sass')
		.pipe(plumber())
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(reload({stream:true}));
})

// Task to minify the CSS, and then autoprefix it
gulp.task('styles', function() {
	gulp.src(['app/css/**/*.css', '!app/css/**/*.min.css'])
		.pipe(plumber())
		.pipe(rename({suffix: '.min'}))
		.pipe(minifyCss())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('app/css'))
		.pipe(reload({stream:true}));
});

// Script Tasks, minify the JS files except those already minified
gulp.task('scripts', function() {
	gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js'])
		.pipe(plumber())
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(reload({stream:true}));
})


// Browser Sync Tasks to auto refresh page
gulp.task('browserSync', function() {
	browserSync({
		server:{
			baseDir: "./"
		}
	});
});


// Watch Tasks to watch certain files for updates
gulp.task('watch', function() {
	gulp.watch('*.html', ['html']);
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/css/**/*.css', ['styles']);
	gulp.watch('app/js/**/*.js', ['scripts']);

})

// Default Tasks //
gulp.task('default', ['sass', 'scripts', 'html', 'browserSync', 'watch']);


// Build Tasks for Production time
// buildFilesFoldersRemove => list of files to remove when running final build
var config = {
	buildFilesFoldersRemove:[
		'build/sass/',
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
