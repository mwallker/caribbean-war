module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		less: {
			development: {
				files: {
					"src/_css/style.css": ['src/templates/**/*.less', 'src/shared/*.less']
				}
			}
		},
		watch: {
			options: {
				atBegin: true
			},
			less: {
				files: ['src/templates/**/*.less', 'src/shared/*.less'],
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
		'string-replace': {
			dist: {
				files: {
					'src/': 'index.html'
				},
				options: {
					replacements: [{
						pattern: /<!-- @import libs -->/ig,
						replacement: '<script src="_js/libs.min.js"></script>'
					}]
				}
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
					updateType: 'force',
					reportUpdated: false,
					semver: true,
					packages: {
						devDependencies: true,
						dependencies: true
					},
					packageJson: null,
					reportOnlyPkgs: []
				}
			}
		}
	});

	grunt.registerTask('default', [
		'http-server',
		'watch'
	]);

	grunt.registerTask('build', [
		'devUpdate',
		'less',
		'nodewebkit'
	]);
};
