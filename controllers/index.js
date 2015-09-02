import fs from 'fs';

let modules = [];

fs.readdirSync(__dirname)
  .filter(ctrl => ctrl.match(/-ctrl\.js/i))
  .forEach(ctrl => modules.push(require('./' + ctrl)));

export default modules;
