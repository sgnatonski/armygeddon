var gulp = require('gulp');
var minify = require('gulp-minify');
var concat = require('gulp-concat');

gulp.task('bundle-hex', function () {
    gulp.src(['./src/common/bhex/BinaryHeap.js', './src/common/bhex/BHex.Core.js', './src/common/bhex/BHex.Drawing.js'])
        .pipe(concat('bhex.js'))
        .pipe(gulp.dest('./src/front/dist/'));
});

gulp.task('bundle-3rdparty', function () {
    gulp.src([
        './node_modules/image-promise/dist/image-promise.common-js.js',
        './node_modules/jsnlog/jsnlog.js',
        './node_modules/vue/dist/vue.js'
    ])
        .pipe(concat('3rd.js'))
        .pipe(gulp.dest('./src/front/dist/'));
});

gulp.task('bundle-visual', function () {
    gulp.src(
        './src/front/public/scripts/visual/**'
    )
        .pipe(concat('visual.js'))
        .pipe(gulp.dest('./src/front/dist/'));
});

gulp.task('bundle-app', function () {
    gulp.src(
        './src/front/public/scripts/app/**'
    )
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./src/front/dist/'));
});

gulp.task('compress', ['bundle-hex', 'bundle-visual', 'bundle-app', 'bundle-3rdparty'], function () {
    gulp.src('./src/front/dist/*.js')
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['*.min.js']
        }))
        .pipe(gulp.dest('./src/front/public/scripts/dist/'));
});

gulp.task('build', ['compress']);