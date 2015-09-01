// Geramos nosso CSS e nosso JS a partir da concatenação de vários
// arquivos, guardamos seu nome como a data atual em SHA1 para evitar
// qualquer mecanismo de cache

export default grunt => {
 grunt.loadNpmTasks('grunt-contrib-concat');

  return {
    concat: {
      css: {
        src: [
          'node_modules/bootstrap/dist/css/bootstrap.css',
          'frontend/css/**/*.css'
        ],
        dest: 'public/css/<%= hash %>.css',
        nonull: true
      },
      js: {
        src: [
          'node_modules/jquery/dist/jquery.js',
          'node_modules/bootstrap/dist/js/bootstrap.js',
          'frontend/js/**/*.js'
        ],
        dest: 'public/js/<%= hash %>.js',
        nonull: true
      }
    }
  };
};
