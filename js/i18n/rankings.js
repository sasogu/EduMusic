(function() {
  const payload = {
    es: {
      'rankings.title': 'Rankings de EduMúsic',
      'rankings.subtitle': 'Consulta las mejores puntuaciones de cada juego y reta a tu clase a superarlas.',
      'rankings.back': 'Volver al inicio',
      'rankings.group.catch': 'Atrapa Notas',
      'rankings.group.eartraining': 'Oído y dictados',
      'rankings.group.challenges': 'Retos y memoria',
      'rankings.solmi': 'Sol y Mi',
      'rankings.solmila': 'Sol, Mi y La',
      'rankings.solmilado': 'Sol, Mi, La y Do',
      'rankings.solmiladore': 'Sol, Mi, La, Do y Re',
      'rankings.solmiladorefa': 'Sol, Mi, La, Do, Re y Fa',
      'rankings.allnotes': 'Escala completa',
      'rankings.pitch_direction': 'Dirección del sonido',
      'rankings.rhythm': 'Ritmo: TA, SU y TITI',
      'rankings.rhythm_dictation': 'Dictado rítmico',
      'rankings.melody_dictation': 'Dictado melódico',
      'rankings.melo_rhythm': 'Dictado melódico-rítmico',
      'rankings.melody': 'Secuencia de melodías',
      'rankings.compas': 'Puzzle de compases',
      'rankings.quiz': 'Quiz musical',
      'rankings.wordguess': 'Palabras musicales'
    },
    val: {
      'rankings.title': 'Rànquings d\'EduMúsic',
      'rankings.subtitle': 'Consulta les millors puntuacions de cada joc i desafia la teua classe a superar-les.',
      'rankings.back': 'Torna a l\'inici',
      'rankings.group.catch': 'Atrapa Notes',
      'rankings.group.eartraining': 'Oïda i dictats',
      'rankings.group.challenges': 'Reptes i memòria',
      'rankings.solmi': 'Sol i Mi',
      'rankings.solmila': 'Sol, Mi i La',
      'rankings.solmilado': 'Sol, Mi, La i Do',
      'rankings.solmiladore': 'Sol, Mi, La, Do i Re',
      'rankings.solmiladorefa': 'Sol, Mi, La, Do, Re i Fa',
      'rankings.allnotes': 'Escala completa',
      'rankings.pitch_direction': 'Direcció del so',
      'rankings.rhythm': 'Ritme: TA, SU i TITI',
      'rankings.rhythm_dictation': 'Dictat rítmic',
      'rankings.melody_dictation': 'Dictat melòdic',
      'rankings.melo_rhythm': 'Dictat melòdic-rítmic',
      'rankings.melody': 'Seqüència de melodies',
      'rankings.compas': 'Puzzle de compassos',
      'rankings.quiz': 'Quiz musical',
      'rankings.wordguess': 'Paraules musicals'
    },
    en: {
      'rankings.title': 'EduMúsic Rankings',
      'rankings.subtitle': 'Check the top scores for every game and challenge your students to beat them.',
      'rankings.back': 'Back to home',
      'rankings.group.catch': 'Catch the Notes',
      'rankings.group.eartraining': 'Ear training & dictations',
      'rankings.group.challenges': 'Challenges & memory',
      'rankings.solmi': 'G & E',
      'rankings.solmila': 'G, E and A',
      'rankings.solmilado': 'G, E, A and low C',
      'rankings.solmiladore': 'G, E, A, C and high D',
      'rankings.solmiladorefa': 'G, E, A, C, D and F',
      'rankings.allnotes': 'Full scale',
      'rankings.pitch_direction': 'Pitch direction',
      'rankings.rhythm': 'Rhythm: TA, SU and TITI',
      'rankings.rhythm_dictation': 'Rhythm dictation',
      'rankings.melody_dictation': 'Melody dictation',
      'rankings.melo_rhythm': 'Melodic-rhythmic dictation',
      'rankings.melody': 'Melody sequence',
      'rankings.compas': 'Time signature puzzle',
      'rankings.quiz': 'Music quiz',
      'rankings.wordguess': 'Musical words'
    }
  };

  if (window.i18n && typeof window.i18n.registerBundle === 'function') {
    window.i18n.registerBundle('rankings', payload);
  } else {
    window.__i18nPendingBundles = window.__i18nPendingBundles || [];
    window.__i18nPendingBundles.push({ name: 'rankings', payload });
  }
})();
