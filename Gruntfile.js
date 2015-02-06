module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		less: {
			development: {
				files: {
					"src/css/style.css": "src/css/*.less"
				}
			}
		},
		watch: {
			options: {
				atBegin: true
			},
			less: {
				files: "src/css/*.less",
				tasks: ["less"]
			}//,
			//js: {
			//	files: ["src/**/*.js", "!src/js/libs/**/*"],
			//	tasks: ["jshint"]
			//}*/
		},
		jshint: {
			all: {
				src: ["src/**/*.js", "!src/js/libs/**/*"]
			}
		},
		'http-server': {
			dev: {
				root: "src",
				port: 9000,
				host: "127.0.0.1",
				runInBackground: true
			}
		},
		nodewebkit: {
			options: {
				platforms: ['win'],
				buildDir: './bin'
			},
			src: ['src/**/*']
		}
	});

	grunt.registerTask('default', [
		'http-server',
		'watch'
	]);

	grunt.registerTask('build', [
		'jshint',
		'less',
		'nodewebkit'
	]);
};
