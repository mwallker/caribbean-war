module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		less: {
			development: {
				files: {
					"src/css/style.css": ['src/templates/**/*.less', 'src/*.less']
				}
			}
		},
		watch: {
			options: {
				atBegin: true
			},
			less: {
				files: ['src/templates/**/*.less', 'src/*.less'],
				tasks: ['less']
			} //,
			//js: {
			//	files: ["src/**/*.js", "!src/js/libs/**/*"],
			//	tasks: ["jshint"]
			//}*/
		},
		jshint: {
			all: {
				src: ['src/**/*.js', '!src/js/libs/**/*']
			}
		},
		'http-server': {
			dev: {
				root: 'src',
				port: 9000,
				host: '127.0.0.1',
				runInBackground: true
			}
		},
		nodewebkit: {
			options: {
				platforms: ['win'],
				buildDir: './bin'
			},
			src: ['src/**/*']
		},
		devUpdate: {
			main: {
				options: {
					updateType: 'force', //just report outdated packages
					reportUpdated: false, //don't report up-to-date packages
					semver: true, //stay within semver when updating
					packages: {
						devDependencies: true, //only check for devDependencies
						dependencies: false
					},
					packageJson: null, //use matchdep default findup to locate package.json
					reportOnlyPkgs: [] //use updateType action on all packages
				}
			}
		}
	});

	grunt.registerTask('default', [
		'http-server',
		'watch'
	]);

	grunt.registerTask('build', [
		//'jshint',
		'less',
		'nodewebkit'
	]);
};
