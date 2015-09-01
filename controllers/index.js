import fs from 'fs';

let modules = [];

fs.readdirSync(__dirname)
  .filter(function(ctrl) {
    return ctrl.match(/-ctrl\.js/i);
  })
  .forEach(function(ctrl) {
    modules.push(require('./' + ctrl));
  });

export default modules;
