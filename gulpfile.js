const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
// const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');

const babel = require('gulp-babel');
const Server = require('karma').Server;

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

var dev = true;

const paths = {
    src:      ['src/**.js', 'src/*/**.js'],
    dest:     'build/src',
    specSrc:  'spec/**/*Spec.js',
    specDest: 'build/spec',
    spec:     'build/spec/**/*Spec.js',
    appSrc:   'app/**/*.js',
    appDest:  'build/app'
};


gulp.task('clean', del.bind(null, ['build']));

function lintFix(files) {
  return gulp.src(files)
    .pipe($.eslint({ fix: true }))
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

function lint(files) {
  return gulp.src(files)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
}

function build(src, dst) {
  return gulp.src(src)
      .pipe(babel())
      .pipe(gulp.dest(dst));
    // var pipe = gulp.src(src).pipe(babel({ presets: ['es2015'] })), dest = gulp.dest(dst);
    // return pipe.pipe(dest);
}

gulp.task('lint', () => {
  return lint('app/**/*.js');
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js')
    .pipe(gulp.dest('test/spec'));
});

gulp.task('build:src', function() {
    return build(paths.src, paths.dest);
});

gulp.task('build:test', function() {
    return build(paths.specSrc, paths.specDest);
});

gulp.task('build:app', function() {
    return build(paths.appSrc, paths.appDest);
});

gulp.task('copy:app', function() {
    return gulp.src(['app/**/*.*','!'+paths.appSrc]).pipe(gulp.dest(paths.appDest));
});

// Run the unit tests without any coverage calculations
gulp.task('test', ['build:src', 'build:test', 'build:app'], function(cb) {
    new Server({
        configFile: __dirname + '/karma.conf.js'
        ,singleRun: true
    }, cb).start();
});

gulp.task('build', ['build:src', 'build:test', 'build:app','copy:app']);


gulp.task('default', ['serve']);

gulp.task('dummy', function(){

});

gulp.task('serve', () => {
  runSequence(['clean'], ['build'], () => {
    browserSync.init({
      notify: false,
      port: 9000,
      server: {
        baseDir: ['build/app'],
        index: "index.html",
        routes: {
          '/node_modules': 'node_modules'
        }
      }
    });

    gulp.watch([
      'build/app/*.html',
      'build/app/**/*.js'
    ]).on('change', reload);


    gulp.watch('app/**/*.js', ['build:app']);
  });
});

gulp.task('serve:dist', ['dummy'], () => {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['build/app'],
      index: "index.html",
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });
});

//
//
// gulp.task('styles', () => {
//   return gulp.src('app/styles/*.scss')
//     .pipe($.plumber())
//     .pipe($.if(dev, $.sourcemaps.init()))
//     .pipe($.sass.sync({
//       outputStyle: 'expanded',
//       precision: 10,
//       includePaths: ['.']
//     }).on('error', $.sass.logError))
//     .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
//     .pipe($.if(dev, $.sourcemaps.write()))
//     .pipe(gulp.dest('.tmp/styles'))
//     .pipe(reload({stream: true}));
// });
//
// gulp.task('scripts', () => {
//   return gulp.src('app/scripts/**/*.js')
//     .pipe($.plumber())
//     .pipe($.if(dev, $.sourcemaps.init()))
//     .pipe($.babel())
//     .pipe($.if(dev, $.sourcemaps.write('.')))
//     .pipe(gulp.dest('.tmp/scripts'))
//     .pipe(reload({stream: true}));
// });
//
// function lint(files) {
//   return gulp.src(files)
//     .pipe($.eslint({ fix: true }))
//     .pipe(reload({stream: true, once: true}))
//     .pipe($.eslint.format())
//     .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
// }
//
// gulp.task('lint', () => {
//   return lint('app/scripts/**/*.js')
//     .pipe(gulp.dest('app/scripts'));
// });
// gulp.task('lint:test', () => {
//   return lint('test/spec/**/*.js')
//     .pipe(gulp.dest('test/spec'));
// });
//
// gulp.task('html', ['styles', 'scripts'], () => {
//   return gulp.src('app/*.html')
//     .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
//     .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
//     .pipe($.if(/\.css$/, $.cssnano({safe: true, autoprefixer: false})))
//     .pipe($.if(/\.html$/, $.htmlmin({
//       collapseWhitespace: true,
//       minifyCSS: true,
//       minifyJS: {compress: {drop_console: true}},
//       processConditionalComments: true,
//       removeComments: true,
//       removeEmptyAttributes: true,
//       removeScriptTypeAttributes: true,
//       removeStyleLinkTypeAttributes: true
//     })))
//     .pipe(gulp.dest('dist'));
// });
//
// gulp.task('images', () => {
//   return gulp.src('app/images/**/*')
//     .pipe($.cache($.imagemin()))
//     .pipe(gulp.dest('dist/images'));
// });
//
// gulp.task('fonts', () => {
//   return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
//     .concat('app/fonts/**/*'))
//     .pipe($.if(dev, gulp.dest('.tmp/fonts'), gulp.dest('dist/fonts')));
// });
//
// gulp.task('extras', () => {
//   return gulp.src([
//     'app/*',
//     '!app/*.html'
//   ], {
//     dot: true
//   }).pipe(gulp.dest('dist'));
// });
//
// gulp.task('clean', del.bind(null, ['.tmp', 'dist']));
//
// gulp.task('serve', () => {
//   runSequence(['clean', 'wiredep'], ['styles', 'scripts', 'fonts'], () => {
//     browserSync.init({
//       notify: false,
//       port: 9000,
//       server: {
//         baseDir: ['.tmp', 'app'],
//         routes: {
//           '/bower_components': 'bower_components'
//         }
//       }
//     });
//
//     gulp.watch([
//       'app/*.html',
//       'app/images/**/*',
//       '.tmp/fonts/**/*'
//     ]).on('change', reload);
//
//     gulp.watch('app/styles/**/*.scss', ['styles']);
//     gulp.watch('app/scripts/**/*.js', ['scripts']);
//     gulp.watch('app/fonts/**/*', ['fonts']);
//     gulp.watch('bower.json', ['wiredep', 'fonts']);
//   });
// });
//
// gulp.task('serve:dist', ['default'], () => {
//   browserSync.init({
//     notify: false,
//     port: 9000,
//     server: {
//       baseDir: ['dist']
//     }
//   });
// });
//
// gulp.task('serve:test', ['scripts'], () => {
//   browserSync.init({
//     notify: false,
//     port: 9000,
//     ui: false,
//     server: {
//       baseDir: 'test',
//       routes: {
//         '/scripts': '.tmp/scripts',
//         '/bower_components': 'bower_components'
//       }
//     }
//   });
//
//   gulp.watch('app/scripts/**/*.js', ['scripts']);
//   gulp.watch(['test/spec/**/*.js', 'test/index.html']).on('change', reload);
//   gulp.watch('test/spec/**/*.js', ['lint:test']);
// });
//
// // inject bower components
// gulp.task('wiredep', () => {
//   gulp.src('app/styles/*.scss')
//     .pipe($.filter(file => file.stat && file.stat.size))
//     .pipe(wiredep({
//       ignorePath: /^(\.\.\/)+/
//     }))
//     .pipe(gulp.dest('app/styles'));
//
//   gulp.src('app/*.html')
//     .pipe(wiredep({
//       exclude: ['bootstrap'],
//       ignorePath: /^(\.\.\/)*\.\./
//     }))
//     .pipe(gulp.dest('app'));
// });
//
// gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
//   return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
// });
//
// gulp.task('default', () => {
//   return new Promise(resolve => {
//     dev = false;
//     runSequence(['clean', 'wiredep'], 'build', resolve);
//   });
// });
