var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('default', () =>
{
	gulp.src('./src/**/*.ts')
		.pipe(ts({
			noImplicitAny: true,
			outDir: 'bin',
			target: 'ES6',
			module: 'commonjs',
			moduleResolution: 'node'
		}))
		.pipe(gulp.dest('bin/'));
	gulp.src('./src/config.json')
		.pipe(gulp.dest('bin/'));
});
