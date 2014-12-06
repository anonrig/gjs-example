'use strict';

var fs = require('fs');

module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            before: ['www', 'www/img', 'www/css', 'www/compiled', 'www/js']
        },
        jade: {
            compile: {
                options: {
                    pretty: true,
                    data: {
                        debug: true
                    }
                },
                files: [{
                    cwd: "src",
                    src: "**/*.jade",
                    dest: "www",
                    expand: true,
                    ext: ".html"
                }]
            }
        },
        stylus: {
            build: {
                options: {
                    linenos: false,
                    compress: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: [ '**/*.styl' ],
                    dest: 'www/css',
                    ext: '.css'
                }]
            }
        },
        mkdir: {
            all: {
                options: {
                    create: ['www/img', 'www/compiled']
                }
            }
        },
        symlink: {
            all: {
                files: [
                    { expand: true, cwd: 'src', src: ['img/*', 'fonts/*'], dest: 'www' }
                ]
            }
        },
        concat: {
            css: {
                src: [
                    'www/css/*'
                ],
                dest: 'www/compiled/compiled.css'
            },
            js: {
                src: [
                    'src/js/*'
                ],
                dest: 'www/compiled/compiled.js'
            }
        },
        cssmin: {
            minify: {
                src: 'www/compiled/compiled.css',
                dest: 'www/compiled/compiled.min.css'
            }
        },
        'jsmin-sourcemap': {
            all: {
                // Source files to concatenate and minify (also accepts a string and minimatch items)
                src: ['src/js/app.js'],

                // Destination for concatenated/minified JavaScript
                dest: 'www/compiled/compiled.min.js',

                // Destination for sourcemap of minified JavaScript
                destMap: 'www/compiled/compiled.js.map'
            }
        },
        combine: {
            dev: {
                input:"www/index.html",
                output:"www/index.html",
                tokens: [{
                    token: "<environment></environment>",
                    string: fs.readFileSync('src/config/dev.js').toString()
                }]
            },
            prod: {
                input:"www/index.html",
                output:"www/index.html",
                tokens: [{
                    token: "<environment></environment>",
                    string: fs.readFileSync('src/config/prod.js').toString()
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-combine');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsmin-sourcemap');

    grunt.registerTask('default', 'Default configuration', ['clean:before', 'jade', 'stylus', 'mkdir:all', 'symlink', 'concat', 'cssmin', 'jsmin-sourcemap', 'combine:dev']);
    grunt.registerTask('prod', ['clean:before', 'jade', 'stylus', 'mkdir:all', 'symlink', 'concat', 'cssmin', 'jsmin-sourcemap', 'combine:prod']);
};
