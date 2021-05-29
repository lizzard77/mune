const gulp = require("gulp");
const less = require("gulp-less");

function convertLESS(cb) {
    return gulp.src("./less/*.less")
    .pipe(less())
    .pipe(gulp.dest("./"));
}

function watch(cb) {
    gulp.watch("less/**/*.less", convertLESS);
}

exports.less = convertLESS;
exports.watch = gulp.series(convertLESS, watch);