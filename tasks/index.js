// Carrega dinamicamente todas as tasks desta pasta
import fs from 'fs';

let tasks = [];

fs.readdirSync(__dirname)
  .filter(file => {
    return file.match(/-task.\js/i);
  })
  .forEach(file => {
    tasks.push(require('./' + file));
  });

export default tasks;
