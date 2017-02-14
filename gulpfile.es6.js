import browserify from 'browserify'
import watchify from 'watchify'
import babelify from 'babelify'
import path from 'path'

import gulp from 'gulp'
/* Nice Browserify Errors */
import chalk from 'chalk'
import gutil from 'gulp-util'
/* Jade => HTML */
import jade from 'gulp-jade'
/* Stylus => CSS */
import stylus from 'gulp-stylus'
import nib from 'nib'
import bootstrap from 'bootstrap-styl'
/* Babel => JS */
import babel from 'gulp-babel'

import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import merge from 'utils-merge'

import rename from 'gulp-rename'
import uglify from 'gulp-uglify'

import sourcemaps from 'gulp-sourcemaps'
import server from './src/server'

// Sources of files that need to be preprocessed
const sources = {
    jade: "src/jade/*.jade",
    stylus: "src/stylus/*.styl",
    js: "src/js/App.js"
}

// Destination of preprocessed files
const destinations = {
    html: "dist/",
    css: "dist/css",
    js: "dist/js"
}

// Color errors with chalk
function map_error(err) {
  if (err.fileName) {
    // regular error
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
      + ': '
      + 'Line '
      + chalk.magenta(err.lineNumber)
      + ' & '
      + 'Column '
      + chalk.magenta(err.columnNumber || err.column)
      + ': '
      + chalk.blue(err.description))
  } else {
    // browserify error..
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.message))
  }

  if (this.end) {
      this.end()
  }
}

// Compile jade templates
gulp.task("jade", function(event) {
    return gulp.src(sources.jade).pipe(jade({
        pretty: true
    })).pipe(gulp.dest(destinations.html))
});

// Compile stylus templates
gulp.task("stylus", function(event) {
    console.log("stylus")

    return gulp.src(sources.stylus).pipe(stylus({
        use: [bootstrap(), nib()],
        compress: true
    })).pipe(gulp.dest(destinations.css))
})

// // Compile babel templates
// gulp.task('babel', function() {
//     console.log('babel')

//     return gulp.src(sources.js)
//         .browserify(babel({
//             presets: ['es2015', 'react']
//         }))
//         .pipe(gulp.dest(destinations.js));
// })

const getBundler = (scriptName, args) => {
  return watchify(browserify(`./src/js/${ scriptName }`, args)).transform(babelify, { presets: ['es2015', 'react'], plugins: ['syntax-async-functions', 'transform-regenerator'] })
}

// Watchify
gulp.task('watchify', function () {
    var args = merge(watchify.args, { debug: true })
    var appBundler = getBundler('App.js', args)
    var adminBundler = getBundler('Admin.js', args)

    bundle_js(appBundler, 'app')
    bundle_js(adminBundler, 'admin')

    appBundler.on('update', function () {
        bundle_js(appBundler, 'app')
    })

    adminBundler.on('update', function () {
        bundle_js(adminBundler, 'admin')
    })
})

// Without watchify
gulp.task('browserify', function () {
    var bundler = browserify('./src/js/App.js', { debug: true }).transform(babelify, {/* options */ })
    
    return bundle_js(bundler)
})

// Without sourcemaps
gulp.task('browserify-production', function () {
  var bundler = browserify('./src/js/App.js').transform(babelify, {/* options */ })

  return bundler.bundle()
    .on('error', map_error)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
})

function bundle_js(bundler, scriptName = 'app') {
  const js = `${ scriptName }.js`
  const min = `${ scriptName }.min.js`

  return bundler.bundle()
    .on('error', map_error)
    .pipe(source(js))
    .pipe(buffer())
    .pipe(gulp.dest('dist/js'))
    .pipe(rename(min))
    .pipe(sourcemaps.init({ loadMaps: true }))
      // capture sourcemaps from transforms
      .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
}

// Init livereload var
var lr = null

function refresh(event) {
    var fileName = path.relative(__dirname, event.path)
    gutil.log.apply(gutil, [gutil.colors.magenta(fileName), gutil.colors.cyan('built')])
    
    if (lr) {
      lr.changed({
          body: { files: [fileName] }
      })
    }
}

gulp.task("watch", function() {
    gulp.watch(sources.jade, ["jade"])
    gulp.watch(sources.stylus, ["stylus"])
    gulp.watch('dist/**/*', refresh)
})

const port = process.env.PORT || 3800

gulp.task('serve', function () {
    var express = require('express')
    var app = express()
    app.use(server)
    app.use(express.static(path.resolve(__dirname, './dist/')))
    app.use(require('connect-livereload')())
    app.listen(port)
    console.log('Listening on port ' + port)
    lr = require('tiny-lr')()
    lr.listen(35730)
})

gulp.task("default", ["jade", "stylus", "watch", "watchify", "serve"])