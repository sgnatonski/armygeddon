var gulp = require('gulp');
var minify = require('gulp-minify');
var concat = require('gulp-concat');

gulp.task('bundle-hex', function() {
    gulp.src(['./bhex/BinaryHeap.js', './bhex/BHex.Core.js', './bhex/BHex.Drawing.js'])
      .pipe(concat('bhex.js'))
      .pipe(gulp.dest('./dist/'));
  });

gulp.task('bundle-3rdparty', function() {
    gulp.src(['./node_modules/image-promise/dist/image-promise.common-js.js'])
      .pipe(concat('3rd.js'))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('bundle-app', function() {
    gulp.src([
        './public/scripts/app/battle.js', 
        './public/scripts/app/player.js', 
        './public/scripts/app/army.js', 
        './public/scripts/app/start.js'
    ])
      .pipe(concat('app.js'))
      .pipe(gulp.dest('./dist/'));
  });
     
gulp.task('compress', ['bundle-hex', 'bundle-app', 'bundle-3rdparty'], function() {
  gulp.src('dist/*.js')
    .pipe(minify({
        ext:{
            min:'.min.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['*.min.js']
    }))
    .pipe(gulp.dest('./public/scripts/dist/'));
});

gulp.task('build', ['compress']);