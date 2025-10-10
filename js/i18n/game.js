// Atrapa Notas game translations
(function() {
  const payload = {
    es: {
      'game.solmi.back': 'Volver a Atrapa Notas',
      'game.solmi.title': 'Atrapa Notas: Sol y Mi',
      'game.solmi.instructions': 'Las notas (MI y SOL) avanzan de izquierda a derecha sobre su línea del pentagrama — SOL en 2ª línea y MI en 1ª (abajo). Pulsa la tecla correspondiente del piano inferior antes de que la nota salga por la derecha. Si te equivocas de nombre (respecto a la nota que va delante), pierdes una vida. A partir de 10 puntos, se oculta el nombre sobre la nota; a partir de 20, también se ocultan los nombres en el teclado. Teclado: S = Sol, M = Mi.',
      'game.solmi.level.label': 'Nivel:',
      'game.solmi.level.basic': 'Nivel 1 · Colores',
      'game.solmi.level.advanced': 'Nivel 2 · Notas negras',
      'game.solmila.title': 'Atrapa Notas: Sol, Mi y La',
      'game.solmila.instructions': 'Las notas (MI, SOL y LA) avanzan de izquierda a derecha sobre sus posiciones en el pentagrama. Pulsa la tecla correspondiente del piano inferior antes de que la nota salga por la derecha. Si fallas, pierdes una vida. A partir de 10 puntos se ocultan los nombres sobre las notas y a partir de 20 también los del teclado. Teclado: S = Sol, M = Mi, L = La.',
      'game.solmila.level.label': 'Nivel:',
      'game.solmila.level.basic': 'Nivel 1 · Colores',
      'game.solmila.level.advanced': 'Nivel 2 · Notas negras',
      'game.solmilado.title': 'Atrapa Notas: Sol, Mi, La y Do grave',
      'game.solmilado.instructions': 'Las notas (DO grave, MI, SOL y LA) avanzan de izquierda a derecha respetando sus posiciones en el pentagrama. Pulsa la tecla correspondiente del piano inferior antes de que la nota salga por la derecha. Si fallas, pierdes una vida. A partir de 10 puntos se ocultan los nombres sobre las notas y a partir de 20 también los del teclado. Teclado: D = Do, M = Mi, S = Sol, L = La.',
      'game.solmilado.level.label': 'Nivel:',
      'game.solmilado.level.basic': 'Nivel 1 · Colores',
      'game.solmilado.level.advanced': 'Nivel 2 · Notas negras',
      'game.title': 'Atrapa Notas: Sol y Mi',
      'game.instructions': 'Las notas (MI y SOL) avanzan de izquierda a derecha sobre su línea del pentagrama — SOL en 2ª línea y MI en 1ª (abajo). Pulsa la tecla correspondiente del piano inferior antes de que la nota salga por la derecha. Si te equivocas de nombre (respecto a la nota que va delante), pierdes una vida. A partir de 10 puntos, se oculta el nombre sobre la nota; a partir de 20, también se ocultan los nombres en el teclado. Teclado: S = Sol, M = Mi.',
      'game.ranking': 'Ranking',
      'game.save.your_score': 'Tu puntuación:',
      'game.save.your_name': 'Tu nombre:',
      'game.save.placeholder': 'Escribe tu nombre',
      'game.save.button': 'Guardar puntuación',
      'game.piano_hint': 'Pulsa MI o SOL en el piano',
      'game.piano_hint.solmi': 'Pulsa MI o SOL en el piano',
      'game.piano_hint.solmila': 'Pulsa MI, SOL o LA en el piano',
      'game.piano_hint.solmilado': 'Pulsa DO, MI, SOL o LA en el piano',
      'game.overlay.over': 'Juego terminado',
      'game.overlay.over_sub': 'Pulsa Reiniciar para jugar de nuevo',
      'game.overlay.pause': 'Pausa',
      'game.overlay.pause_sub': 'Pulsa Pausa para continuar',
      'game.rank.empty': 'Aún no hay puntuaciones. ¡Sé el primero!',
      'game.rank.pts': 'pts'
    },
    val: {
      'game.solmi.back': 'Torna a Atrapa Notes',
      'game.solmi.title': 'Atrapa Notes: Sol i Mi',
      'game.solmi.instructions': 'Les notes (MI i SOL) avancen d’esquerra a dreta per la seua línia del pentagrama — SOL en la 2a línia i MI en la 1a (baix). Prem la tecla corresponent del piano inferior abans que la nota isca per la dreta. Si t’equivoques de nom (respecte a la nota que va davant), perds una vida. A partir de 10 punts, s’oculta el nom damunt de la nota; a partir de 20, també s’oculten els noms del teclat. Teclat: S = Sol, M = Mi.',
      'game.solmi.level.label': 'Nivell:',
      'game.solmi.level.basic': 'Nivell 1 · Colors',
      'game.solmi.level.advanced': 'Nivell 2 · Notes negres',
      'game.solmila.title': 'Atrapa Notes: Sol, Mi i La',
      'game.solmila.instructions': 'Les notes (MI, SOL i LA) avancen d’esquerra a dreta per les seues posicions al pentagrama. Prem la tecla corresponent del piano inferior abans que la nota isca per la dreta. Si falles, perds una vida. A partir de 10 punts s’oculten els noms damunt de les notes i a partir de 20 també els del teclat. Teclat: S = Sol, M = Mi, L = La.',
      'game.solmila.level.label': 'Nivell:',
      'game.solmila.level.basic': 'Nivell 1 · Colors',
      'game.solmila.level.advanced': 'Nivell 2 · Notes negres',
      'game.solmilado.title': 'Atrapa Notes: Sol, Mi, La i Do greu',
      'game.solmilado.instructions': 'Les notes (DO greu, MI, SOL i LA) avancen d’esquerra a dreta respectant les seues posicions al pentagrama. Prem la tecla corresponent del piano inferior abans que la nota isca per la dreta. Si falles, perds una vida. A partir de 10 punts s’oculten els noms damunt de les notes i a partir de 20 també els del teclat. Teclat: D = Do, M = Mi, S = Sol, L = La.',
      'game.solmilado.level.label': 'Nivell:',
      'game.solmilado.level.basic': 'Nivell 1 · Colors',
      'game.solmilado.level.advanced': 'Nivell 2 · Notes negres',
      'game.title': 'Atrapa Notes: Sol i Mi',
      'game.instructions': 'Les notes (MI i SOL) avancen d’esquerra a dreta per la seua línia del pentagrama — SOL en la 2a línia i MI en la 1a (baix). Prem la tecla corresponent del piano inferior abans que la nota isca per la dreta. Si t’equivoques de nom (respecte a la nota que va davant), perds una vida. A partir de 10 punts, s’oculta el nom damunt de la nota; a partir de 20, també s’oculten els noms del teclat. Teclat: S = Sol, M = Mi.',
      'game.ranking': 'Rànquing',
      'game.save.your_score': 'La teua puntuació:',
      'game.save.your_name': 'El teu nom:',
      'game.save.placeholder': 'Escriu el teu nom',
      'game.save.button': 'Guarda la puntuació',
      'game.piano_hint': 'Prem MI o SOL al piano',
      'game.piano_hint.solmi': 'Prem MI o SOL al piano',
      'game.piano_hint.solmila': 'Prem MI, SOL o LA al piano',
      'game.piano_hint.solmilado': 'Prem DO, MI, SOL o LA al piano',
      'game.overlay.over': 'Joc acabat',
      'game.overlay.over_sub': 'Prem Reinicia per a jugar de nou',
      'game.overlay.pause': 'Pausa',
      'game.overlay.pause_sub': 'Prem Pausa per a continuar',
      'game.rank.empty': 'Encara no hi ha puntuacions. Sigues el primer!',
      'game.rank.pts': 'pts'
    }
  };
  if (window.i18n && typeof window.i18n.registerBundle === 'function') {
    window.i18n.registerBundle('game', payload);
  } else {
    window.__i18nPendingBundles = window.__i18nPendingBundles || [];
    window.__i18nPendingBundles.push({ name: 'game', payload });
  }
})();
