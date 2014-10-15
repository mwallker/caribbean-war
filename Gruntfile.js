module.exports = function(grunt) {
	grunt.initConfig({
  		// running `grunt less` will compile once
		less: {
			development: {
				options: {
					paths: ["./scr/css"],
					yuicompress: true
				},
				files: {
					"./src/css/style.css": "./src/css/style.less"
				}
			}
		},
		// running `grunt watch` will watch for changes
		watch: {
			files: "./src/css/*.less",
			tasks: ["less"]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
};