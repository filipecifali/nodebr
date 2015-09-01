// Este gruntfile é apenas um bootstrap para todas as tarefas dentro
// da pasta tasks
import mout from 'mout';
import crypto from 'crypto';
import tasks from './tasks';

module.exports = function(grunt) {
  var hash = crypto.createHash('sha1')
    .update(new Date().getTime().toString())
    .digest('hex');

  var defaults = {
    hash: hash
  };

  var config = tasks
    .map(task => task(grunt))
    .reduce((prev, curr) => mout.object.merge(prev, curr), defaults);

  grunt.initConfig(config);
};
