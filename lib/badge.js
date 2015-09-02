// Código retirado do repositório rauchg/slackin
// https://github.com/rauchg/slackin/blob/c75f8cea0a644f873ca34fa7e97fddea88a062fd/lib/badge.js
// jshint maxlen: 96

import svg from 'vd';

/**
 * Cria badges em diferentes formatos
 */
class Badge {

  /**
   * Constrói a classe Badge
   *
   * @param {Object} [options] Parametros de configuração da badge
   * @param {String} [options.title=slack] Texto a ser inserido na badge
   * @param {String} [options.color=#e01563] Cor de fundo do texto
   * @param {Number} [options.sep=4] Quantidade de caracteres separadores
   * @param {Number} [options.pad=8] Quantidade de caracteres alinhadores
   * @param {Number} [options.total=0] Quantidade de pessoas online
   * @param {Number} [options.active=0] Quantidade de pessoas ativas
   */
  constructor({
    title = 'slack',
    color = '#e01563',
    pad = 8,
    sep = 4,
    total = 0,
    active = 0
  }) {
    let value = active ? `${active}/${total}` : (total || '–');
    let lw = pad + this.width(title) + sep; // left side width
    let rw = sep + this.width(value) + pad; // right side width
    let tw = lw + rw; // total width

    return svg(`svg xmlns="http://www.w3.org/2000/svg" width=${tw} height=${tw}`,
      svg(`rect rx=3 width=${tw} height=20 fill=#555`),
      svg(`rect rx=3 x=${lw} width=${rw} height=20 fill=${color}`),
      svg(`path d="M${lw} 0h${sep}v20h-${sep}z" fill=${color}`),
      svg(`rect rx=3 width=${tw} height=20 fill=url(#g)`),
      svg('g text-anchor=middle font-family=Verdana font-size=11',
        this.text({ str: title, x: Math.round(lw / 2), y: 14 }),
        this.text({ str: value, x: lw + Math.round(rw / 2), y: 14 })
      )
    );
  }

  /**
   * Cria um elemento de SVG de texto
   * @param {Object} [options] Opções da função
   * @param {String} options.str O texto a ser escrito
   * @param {Number} options.x Posição horizontal do texto
   * @param {Number} options.y Posição vertical do texto
   */
  static text({str, x, y}) {
    return [
      svg(`text fill=#010101 fill-opacity=.3 x=${x} y=${y + 1}`, str),
      svg(`text fill=#fff x=${x} y=${y}`, str)
    ];
  }

  /**
   * Calcula o tamanho necessário para a badge
   * @param {String} str O texto a ser medido
   */
  static width(str) {
    return 7 * str.length;
  }
}

export default Badge;
