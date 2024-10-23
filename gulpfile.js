"use strict";

const gulp = require("gulp"),
    postcss = require("gulp-postcss"),
    rename = require("gulp-rename"),
    replace = require("gulp-replace"),
    browser_sync = require("browser-sync"),
    file_include = require("gulp-file-include"),
    prettier = require("gulp-prettier"),
    clean = require("gulp-clean"),
    newer = require("gulp-newer"),
    webpack = require("webpack"),
    webpack_stream = require("webpack-stream"),
    gulp_if = require("gulp-if"),
    pug = require("gulp-pug"),
    dart_sass = require("sass"),
    gulp_sass = require("gulp-sass"),
    group_media_queries = require("gulp-group-css-media-queries");

const sass = gulp_sass(dart_sass);

// Получаем имя папки проекта
const node_path = require("path");
const root_folder = node_path.basename(node_path.resolve());

const build_folder = "./build";
const dest_folder = "./dest";
const src_folder = "./src";

const isBuild = process.argv.includes("--build");

const path = {
    build: {
        html: `${build_folder}/`,
        css: `${build_folder}/css/`,
        js: `${build_folder}/js/`,
        assets: `${build_folder}/assets/`,
    },
    dest: {
        html: `${dest_folder}/`,
        css: `${dest_folder}/css/`,
        js: `${dest_folder}/js/`,
        assets: `${dest_folder}/assets/`,
    },
    src: {
        html: `${src_folder}/*.pug`,
        css: `${src_folder}/style.scss`,
        js: `${src_folder}/js/app.js`,
        assets: `${src_folder}/assets/**/*`,
    },
    watch: {
        html: `${src_folder}/**/*.pug`,
        css: [
            `${src_folder}/style.scss`,
            `${src_folder}/**/*.pug`,
            `${src_folder}/styles/**/*.scss`,
            `./tailwind.config.js`,
        ],
        js: `${src_folder}/js/**/*.js`,
        assets: `${src_folder}/assets/**/*`,
    },
    buildFolder: build_folder,
    destFolder: dest_folder,
    srcFolder: src_folder,
    rootFolder: root_folder,
};

const reset = () => {
    return gulp
        .src(isBuild ? path.buildFolder : path.destFolder, {
            read: false,
            allowEmpty: true,
        })
        .pipe(clean());
};

const html = () => {
    return (
        gulp
            .src(path.src.html)
            // .pipe(file_include())
            .pipe(pug({ verbose: false, pretty: false }))
            .pipe(replace("{{ styles }}", "./css/app.min.css"))
            .pipe(replace("{{ scripts }}", "./js/app.min.js"))
            .pipe(replace(/@\//g, "./assets/"))
            .pipe(replace(/@css\//g, "../assets/"))
            .pipe(
                gulp_if(
                    isBuild,
                    prettier({
                        useTabs: false,
                        trailingComma: "es5",
                        tabWidth: 4,
                        semi: true,
                    })
                )
            )
            .pipe(gulp.dest(isBuild ? path.build.html : path.dest.html))
            .pipe(gulp_if(!isBuild, browser_sync.stream()))
    );
};

const css = () => {
    return gulp
        .src(path.src.css)
        .pipe(sass())
        .pipe(postcss([require("tailwindcss"), require("autoprefixer")]))
        .pipe(replace(/\\@css\\\//g, "\\.\\.\\/assets\\/"))
        .pipe(replace(/@css\//g, "../assets/"))
        .pipe(group_media_queries())
        .pipe(gulp_if(isBuild, postcss([require("postcss-minify")])))
        .pipe(
            rename({
                basename: "app",
                extname: ".min.css",
            })
        )
        .pipe(gulp.dest(isBuild ? path.build.css : path.dest.css))
        .pipe(gulp_if(!isBuild, browser_sync.stream()));
};

const js = () => {
    return gulp
        .src(path.src.js)
        .pipe(
            webpack_stream(
                {
                    mode: isBuild ? "production" : "development",
                    devtool: isBuild ? undefined : "source-map",
                    output: { filename: "app.min.js" },
                },
                webpack
            )
        )
        .pipe(gulp.dest(isBuild ? path.build.js : path.dest.js))
        .pipe(gulp_if(!isBuild, browser_sync.stream()));
};

const files = () => {
    return gulp
        .src(path.src.assets)
        .pipe(gulp_if(!isBuild, newer(path.dest.assets)))
        .pipe(gulp.dest(isBuild ? path.build.assets : path.dest.assets))
        .pipe(gulp_if(!isBuild, browser_sync.stream()));
};

const server = (done) => {
    browser_sync.init({
        server: {
            baseDir: `${path.dest.html}`,
        },
        notify: false,
        port: 3000,
    });
};

const watcher = () => {
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.assets, files);
    gulp.watch(path.watch.css, css);
    gulp.watch(path.watch.js, js);
};

const main_tasks = gulp.parallel(gulp.series(html, css), files, js);

const dev = gulp.series(reset, main_tasks, gulp.parallel(server, watcher));
const build = gulp.series(reset, main_tasks);

gulp.task("default", isBuild ? build : dev);
