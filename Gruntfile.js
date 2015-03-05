module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
          // define a string to put between each file in the concatenated output
          separator: ';'
        },
        dist: {
          // the files to concatenate
          src: ['public/lib/underscore.js', 'public/lib/jquery.js',
                'public/lib/Backbone.js','public/lib/handlebars.js'],
          // the location of the resulting JS file
          dest: 'public/dist/libs.js'
        },
        extras: {
          // the files to concatenate
          src: ['public/client/*.js'],
          // the location of the resulting JS file
          dest: 'public/dist/<%= pkg.name %>.js'
        }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
          // the banner is inserted at the top of the output
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        dist: {
          files: {
            'public/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>'],
            'public/dist/libs.min.js': ['<%= concat.extras.dest %>'],
          }
        }
    },

    jshint: {
      files: [
        // Add filespec list here
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      target: {
          files: [{
            expand: true,
            cwd: 'public',
            src: ['*.css'],
            dest: 'public/dist',
            ext: '.min.css'
          }]
        }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push azure master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.requires('test');
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', ['mochaTest', 'jshint']);

  grunt.registerTask('build', ['concat','uglify','cssmin']);

  grunt.registerTask('push', function() {
    grunt.task.requires('test');
    grunt.task.run(['shell:prodServer']);
  });

  grunt.registerTask('upload', function(n) {
    grunt.task.run([ 'build' ]);

    if(grunt.option('prod')) {
      grunt.task.run([ 'test', 'push' ])
    } else {
      grunt.task.run([ 'test', 'server-dev' ]);
    }
  });



};
