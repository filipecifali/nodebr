// Código retirado do repositório rauchg/slackin
// https://github.com/rauchg/slackin/blob/c75f8cea0a644f873ca34fa7e97fddea88a062fd/lib/badge.js
// jshint maxlen: 96

var svg = require('vd').default;
var title = 'slack';
var color = '#E01563';
var pad = 8; // left / right padding
var sep = 4; // middle separation

// π=3
function width(str) {
  return 7 * str.length;
}

// generate text with 1px shadow
function text(str, x, y) {
  return [
    svg('text fill="#010101" fill-opacity=".3" x="' + x + '" y="' + (y + 1) + '"', str),
    svg('text fill="#fff" x="' + x + '" y="' + y + '"', str)
  ];
}

module.exports = function(total, active) {
  var value = active ? active + '/' + total : '' + total || '–';
  var lw = pad + width(title) + sep; // left side width
  var rw = sep + width(value) + pad; // right side width
  var tw = lw + rw; // total width

  return svg('svg xmlns="http://www.w3.org/2000/svg" width=' + tw + ' height="20"',
    svg('rect rx="3" width="' + tw + '" height="20" fill="#555"'),
    svg('rect rx="3" x="' + lw + '" width="' + rw + '" height="20" fill="' + color + '"'),
    svg('path d="M' + lw + ' 0h' + sep + 'v20h-' + sep + 'z" fill="' + color + '"'),
    svg('rect rx="3" width="' + tw + '" height="20" fill=url(#g)'),
    svg('g text-anchor="middle" font-family="Verdana" font-size="11"',
      text(title, Math.round(lw / 2).toString(), '14'),
      text(value, (lw + Math.round(rw / 2)).toString(), '14')
    )
  );
};
