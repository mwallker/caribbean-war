module.exports = function(grunt) {
	grunt.initConfig({
		uglify: {
			target: {
				files: {
					'dest/output.min.js': ['src/input1.js', 'src/input2.js']
				}
			}
  		},
		//
		concat: {
		    extras: {
		      src: ['src/main.js', 'src/extras.js'],
		      dest: 'dist/with_extras.js',
		    },
  		},
  		// running `grunt less` will compile once
		less: {
			development: {
				options: {
					paths: ["../scr/css/result"],
					yuicompress: true
				},
				files: {
					"../src/css/result/style.css": "../src/css/source/style.less"
				}
			}
		},
		// running `grunt watch` will watch for changes
		watch: {
			files: ".././src/css/source/*.less",
			tasks: ["less"]
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
};