(function() {
  const GAME_ID = 'quiz';
  const SCORE_PER_CORRECT = 100;
  const QUESTION_BANK = [
    // Easy level
    {
      id: 'easy_treble_second_line',
      level: 'easy',
      prompt: {
        es: '¿Qué nota se escribe en la segunda línea de la clave de sol?',
        val: 'Quina nota s\'escriu en la segona línia de la clau de sol?',
        en: 'Which note sits on the second line of the treble clef?',
      },
      answers: [
        { id: 'do', correct: false, text: { es: 'Do', val: 'Do', en: 'C' } },
        { id: 'mi', correct: false, text: { es: 'Mi', val: 'Mi', en: 'E' } },
        { id: 'sol', correct: true, text: { es: 'Sol', val: 'Sol', en: 'G' } },
        { id: 'fa', correct: false, text: { es: 'Fa', val: 'Fa', en: 'F' } },
      ],
      explanation: {
        es: 'La segunda línea de la clave de sol siempre representa la nota SOL.',
        val: 'La segona línia de la clau de sol representa la nota SOL.',
        en: 'The second line of the treble clef always represents the note G.',
      },
    },
    {
      id: 'easy_quarter_value',
      level: 'easy',
      prompt: {
        es: '¿Cuántos pulsos dura una negra en un compás de 4/4?',
        val: 'Quants temps dura una negra en un compàs de 4/4?',
        en: 'How many beats does a quarter note last in 4/4 time?',
      },
      answers: [
        { id: 'one', correct: true, text: { es: 'Uno', val: 'Un', en: 'One' } },
        { id: 'two', correct: false, text: { es: 'Dos', val: 'Dos', en: 'Two' } },
        { id: 'three', correct: false, text: { es: 'Tres', val: 'Tres', en: 'Three' } },
        { id: 'four', correct: false, text: { es: 'Cuatro', val: 'Quatre', en: 'Four' } },
      ],
      explanation: {
        es: 'La negra ocupa un pulso completo dentro del compás de 4/4.',
        val: 'La negra equival a un temps complet en un compàs de 4/4.',
        en: 'A quarter note equals one full beat in common time.',
      },
    },
    {
      id: 'easy_violin_family',
      level: 'easy',
      prompt: {
        es: '¿A qué familia instrumental pertenece el violín?',
        val: 'A quina família instrumental pertany el violí?',
        en: 'To which instrument family does the violin belong?',
      },
      answers: [
        { id: 'percussion', correct: false, text: { es: 'Percusión', val: 'Percussió', en: 'Percussion' } },
        { id: 'strings', correct: true, text: { es: 'Cuerda frotada', val: 'Corda fregada', en: 'Strings' } },
        { id: 'brass', correct: false, text: { es: 'Viento metal', val: 'Vent metall', en: 'Brass' } },
        { id: 'woodwind', correct: false, text: { es: 'Viento madera', val: 'Vent fusta', en: 'Woodwind' } },
      ],
      explanation: {
        es: 'El violín es un instrumento de cuerda frotada.',
        val: 'El violí és un instrument de corda fregada.',
        en: 'The violin belongs to the bowed string family.',
      },
    },
    {
      id: 'easy_tempo_fast',
      level: 'easy',
      prompt: {
        es: '¿Qué indicación de tempo significa tocar rápido?',
        val: 'Quina indicació de tempo significa tocar ràpid?',
        en: 'Which tempo marking means to play fast?',
      },
      answers: [
        { id: 'largo', correct: false, text: { es: 'Largo', val: 'Largo', en: 'Largo' } },
        { id: 'andante', correct: false, text: { es: 'Andante', val: 'Andante', en: 'Andante' } },
        { id: 'allegro', correct: true, text: { es: 'Allegro', val: 'Allegro', en: 'Allegro' } },
        { id: 'adagio', correct: false, text: { es: 'Adagio', val: 'Adagio', en: 'Adagio' } },
      ],
      explanation: {
        es: 'Allegro indica un tempo vivo y rápido.',
        val: 'Allegro indica un tempo viu i ràpid.',
        en: 'Allegro indicates a lively, fast tempo.',
      },
    },
    {
      id: 'easy_dynamic_soft',
      level: 'easy',
      prompt: {
        es: '¿Qué indicación dinámica señala tocar suave?',
        val: 'Quina indicació dinàmica indica tocar suau?',
        en: 'Which dynamic marking tells you to play softly?',
      },
      answers: [
        { id: 'ff', correct: false, text: { es: 'ff', val: 'ff', en: 'ff' } },
        { id: 'mf', correct: false, text: { es: 'mf', val: 'mf', en: 'mf' } },
        { id: 'p', correct: true, text: { es: 'p (piano)', val: 'p (piano)', en: 'p (piano)' } },
        { id: 'f', correct: false, text: { es: 'f', val: 'f', en: 'f' } },
      ],
      explanation: {
        es: 'La letra p (piano) indica tocar suave.',
        val: 'La lletra p (piano) indica tocar suau.',
        en: 'The marking p (piano) asks the performer to play softly.',
      },
    },
    {
      id: 'easy_time_signature_top',
      level: 'easy',
      prompt: {
        es: '¿Qué indica el número superior en un compás de 3/4?',
        val: 'Què indica el nombre superior en un compàs de 3/4?',
        en: 'What does the top number show in a 3/4 time signature?',
      },
      answers: [
        { id: 'beats', correct: true, text: { es: 'Número de pulsos por compás', val: 'Nombre de temps per compàs', en: 'Number of beats per measure' } },
        { id: 'note', correct: false, text: { es: 'Figura que vale un pulso', val: 'Figura que val un temps', en: 'Note value of one beat' } },
        { id: 'character', correct: false, text: { es: 'Carácter de la pieza', val: 'Caràcter de la peça', en: 'Character of the piece' } },
        { id: 'tempo', correct: false, text: { es: 'Velocidad del metrónomo', val: 'Velocitat del metrònom', en: 'Metronome speed' } },
      ],
      explanation: {
        es: 'El número superior indica cuántos pulsos hay en cada compás.',
        val: 'El nombre superior marca quants temps hi ha en cada compàs.',
        en: 'The top number tells you how many beats fit in each bar.',
      },
    },
    {
      id: 'easy_bass_clef_use',
      level: 'easy',
      prompt: {
        es: '¿Para qué tipo de voces o instrumentos se usa más la clave de fa?',
        val: 'Per a quin tipus de veus o instruments s\'utilitza més la clau de fa?',
        en: 'Which instruments or voices most commonly use the bass clef?',
      },
      answers: [
        { id: 'low', correct: true, text: { es: 'Instrumentos graves', val: 'Instruments greus', en: 'Low instruments' } },
        { id: 'high', correct: false, text: { es: 'Instrumentos agudos', val: 'Instruments aguts', en: 'High instruments' } },
        { id: 'guitar', correct: false, text: { es: 'Guitarras', val: 'Guitarres', en: 'Guitars' } },
        { id: 'flutes', correct: false, text: { es: 'Flautas traveseras', val: 'Flautes travesseres', en: 'Flutes' } },
      ],
      explanation: {
        es: 'La clave de fa se emplea para instrumentos y voces graves.',
        val: 'La clau de fa serveix per a instruments i veus greus.',
        en: 'Bass clef is used for low-pitched voices and instruments.',
      },
    },
    {
      id: 'easy_highest_instrument',
      level: 'easy',
      prompt: {
        es: '¿Cuál de estos instrumentos produce el sonido más agudo?',
        val: 'Quin d\'aquests instruments produeix el so més agut?',
        en: 'Which of these instruments plays the highest pitches?',
      },
      answers: [
        { id: 'tuba', correct: false, text: { es: 'Tuba', val: 'Tuba', en: 'Tuba' } },
        { id: 'bassoon', correct: false, text: { es: 'Fagot', val: 'Fagot', en: 'Bassoon' } },
        { id: 'viola', correct: false, text: { es: 'Viola', val: 'Viola', en: 'Viola' } },
        { id: 'flute', correct: true, text: { es: 'Flauta travesera', val: 'Flauta travessera', en: 'Flute' } },
      ],
      explanation: {
        es: 'La flauta travesera destaca por su registro agudo.',
        val: 'La flauta travessera destaca pel seu registre agut.',
        en: 'The flute produces the highest range among these instruments.',
      },
    },
    {
      id: 'easy_treble_spaces',
      level: 'easy',
      prompt: {
        es: '¿Qué letras ocupan los espacios de la clave de sol (de abajo arriba)?',
        val: 'Quines lletres ocupen els espais de la clau de sol (de baix a dalt)?',
        en: 'Which letters fill the spaces of the treble staff (from bottom to top)?',
      },
      answers: [
        { id: 'face', correct: true, text: { es: 'F A C E', val: 'F A C E', en: 'F A C E' } },
        { id: 'egbd', correct: false, text: { es: 'E G B D', val: 'E G B D', en: 'E G B D' } },
        { id: 'aceg', correct: false, text: { es: 'A C E G', val: 'A C E G', en: 'A C E G' } },
        { id: 'bdfa', correct: false, text: { es: 'B D F A', val: 'B D F A', en: 'B D F A' } },
      ],
      explanation: {
        es: 'Los espacios de la clave de sol forman la palabra FACE.',
        val: 'Els espais de la clau de sol formen la paraula FACE.',
        en: 'The treble clef spaces spell the word FACE.',
      },
    },
    {
      id: 'easy_half_note',
      level: 'easy',
      prompt: {
        es: '¿Cuántos pulsos dura una blanca en un compás de 4/4?',
        val: 'Quants temps dura una blanca en un compàs de 4/4?',
        en: 'How many beats does a half note last in 4/4 time?',
      },
      answers: [
        { id: 'one', correct: false, text: { es: 'Uno', val: 'Un', en: 'One' } },
        { id: 'two', correct: true, text: { es: 'Dos', val: 'Dos', en: 'Two' } },
        { id: 'three', correct: false, text: { es: 'Tres', val: 'Tres', en: 'Three' } },
        { id: 'four', correct: false, text: { es: 'Cuatro', val: 'Quatre', en: 'Four' } },
      ],
      explanation: {
        es: 'La blanca dura dos pulsos completos en compás de 4/4.',
        val: 'La blanca dura dos temps complets en un 4/4.',
        en: 'A half note equals two full beats in common time.',
      },
    },
    {
      id: 'easy_membrane_percussion',
      level: 'easy',
      prompt: {
        es: '¿Qué instrumento de percusión utiliza una membrana tensada?',
        val: 'Quin instrument de percussió utilitza una membrana tensada?',
        en: 'Which percussion instrument uses a stretched membrane?',
      },
      answers: [
        { id: 'triangle', correct: false, text: { es: 'Triángulo', val: 'Triangle', en: 'Triangle' } },
        { id: 'snare', correct: true, text: { es: 'Caja', val: 'Caixa', en: 'Snare drum' } },
        { id: 'cymbals', correct: false, text: { es: 'Platillos', val: 'Plats', en: 'Cymbals' } },
        { id: 'xylophone', correct: false, text: { es: 'Xilófono', val: 'Xilòfon', en: 'Xylophone' } },
      ],
      explanation: {
        es: 'La caja posee un parche que vibra al ser golpeado.',
        val: 'La caixa té un pedaç que vibra quan es colpeja.',
        en: 'The snare drum uses a membrane that vibrates when struck.',
      },
    },
    {
      id: 'easy_solfege_after_do',
      level: 'easy',
      prompt: {
        es: '¿Qué sílaba del solfeo viene justo después de DO al ascender?',
        val: 'Quina síl·laba del solfeig ve just després de DO en pujar?',
        en: 'Which solfege syllable comes right after DO when ascending?',
      },
      answers: [
        { id: 're', correct: true, text: { es: 'RE', val: 'RE', en: 'RE' } },
        { id: 'mi', correct: false, text: { es: 'MI', val: 'MI', en: 'MI' } },
        { id: 'fa', correct: false, text: { es: 'FA', val: 'FA', en: 'FA' } },
        { id: 'si', correct: false, text: { es: 'SI', val: 'SI', en: 'TI' } },
      ],
      explanation: {
        es: 'El orden ascendente es DO, RE, MI, FA, SOL, LA, SI.',
        val: 'L\'ordre ascendent és DO, RE, MI, FA, SOL, LA, SI.',
        en: 'The ascending order is DO, RE, MI, FA, SOL, LA, TI.',
      },
    },
    {
      id: 'easy_quarter_rest',
      level: 'easy',
      prompt: {
        es: '¿Qué figura representa un silencio de un pulso?',
        val: 'Quina figura representa un silenci d\'un temps?',
        en: 'Which rest symbol equals one beat of silence?',
      },
      answers: [
        { id: 'quarter_rest', correct: true, text: { es: 'Silencio de negra', val: 'Silenci de negra', en: 'Quarter rest' } },
        { id: 'half_rest', correct: false, text: { es: 'Silencio de blanca', val: 'Silenci de blanca', en: 'Half rest' } },
        { id: 'eighth_rest', correct: false, text: { es: 'Silencio de corchea', val: 'Silenci de corxera', en: 'Eighth rest' } },
        { id: 'whole_rest', correct: false, text: { es: 'Silencio de redonda', val: 'Silenci de rodona', en: 'Whole rest' } },
      ],
      explanation: {
        es: 'El silencio de negra coincide en duración con la nota negra.',
        val: 'El silenci de negra té la mateixa durada que la nota negra.',
        en: 'A quarter rest lasts the same as a quarter note: one beat.',
      },
    },
    {
      id: 'easy_orchestra_leader',
      level: 'easy',
      prompt: {
        es: '¿Quién dirige a la orquesta durante un concierto?',
        val: 'Qui dirigeix l\'orquestra durant un concert?',
        en: 'Who leads the orchestra during a concert?',
      },
      answers: [
        { id: 'concertmaster', correct: false, text: { es: 'Concertino', val: 'Concertino', en: 'Concertmaster' } },
        { id: 'conductor', correct: true, text: { es: 'Director o directora', val: 'Director o directora', en: 'Conductor' } },
        { id: 'soloist', correct: false, text: { es: 'Solista', val: 'Solista', en: 'Soloist' } },
        { id: 'percussion', correct: false, text: { es: 'Percusionista principal', val: 'Percussionista principal', en: 'Principal percussionist' } },
      ],
      explanation: {
        es: 'La persona directora marca las entradas y el gesto musical de la orquesta.',
        val: 'La direcció marca les entrades i el gest musical de l\'orquestra.',
        en: 'The conductor shapes the tempo, dynamics and entrances for the orchestra.',
      },
    },
    {
      id: 'easy_metronome_function',
      level: 'easy',
      prompt: {
        es: '¿Para qué sirve un metrónomo?',
        val: 'Per a què serveix un metrònom?',
        en: 'What is a metronome used for?',
      },
      answers: [
        { id: 'tune', correct: false, text: { es: 'Afinar instrumentos', val: 'Afinar instruments', en: 'To tune instruments' } },
        { id: 'keep_tempo', correct: true, text: { es: 'Mantener un pulso constante', val: 'Mantindre un pols constant', en: 'To keep a steady beat' } },
        { id: 'change_key', correct: false, text: { es: 'Cambiar de tonalidad', val: 'Canviar de tonalitat', en: 'To change key' } },
        { id: 'amplify', correct: false, text: { es: 'Aumentar el volumen', val: 'Augmentar el volum', en: 'To make the sound louder' } },
      ],
      explanation: {
        es: 'El metrónomo marca pulsos regulares según la velocidad indicada.',
        val: 'El metrònom marca polsos regulars segons la velocitat indicada.',
        en: 'A metronome provides a regular click at the chosen tempo.',
      },
    },
    {
      id: 'easy_time_signature_bottom',
      level: 'easy',
      prompt: {
        es: '¿Qué indica el número inferior de un compás?',
        val: 'Què indica el nombre inferior d\'un compàs?',
        en: 'What does the lower number in a time signature show?',
      },
      answers: [
        { id: 'beat_value', correct: true, text: { es: 'La figura que recibe un pulso', val: 'La figura que rep un temps', en: 'The note value that gets one beat' } },
        { id: 'bars', correct: false, text: { es: 'El número de compases totales', val: 'El nombre de compassos totals', en: 'The total number of bars' } },
        { id: 'dynamics', correct: false, text: { es: 'La intensidad musical', val: 'La intensitat musical', en: 'The dynamic level' } },
        { id: 'instruments', correct: false, text: { es: 'Los instrumentos participantes', val: 'Els instruments participants', en: 'The instruments playing' } },
      ],
      explanation: {
        es: 'El número inferior indica qué figura equivale a un pulso.',
        val: 'El nombre inferior indica quina figura equival a un temps.',
        en: 'The bottom number tells you which note value equals one beat.',
      },
    },
    {
      id: 'easy_clarinet_family',
      level: 'easy',
      prompt: {
        es: '¿En qué familia se clasifica el clarinete?',
        val: 'En quina família es classifica el clarinet?',
        en: 'Which instrument family includes the clarinet?',
      },
      answers: [
        { id: 'brass', correct: false, text: { es: 'Viento metal', val: 'Vent metall', en: 'Brass' } },
        { id: 'woodwind', correct: true, text: { es: 'Viento madera', val: 'Vent fusta', en: 'Woodwind' } },
        { id: 'strings', correct: false, text: { es: 'Cuerda', val: 'Corda', en: 'Strings' } },
        { id: 'percussion', correct: false, text: { es: 'Percusión', val: 'Percussió', en: 'Percussion' } },
      ],
      explanation: {
        es: 'El clarinete es un instrumento de viento madera con lengüeta simple.',
        val: 'El clarinet és un instrument de vent fusta amb llengüeta senzilla.',
        en: 'Clarinets are woodwinds that use a single reed.',
      },
    },
    {
      id: 'easy_ff_meaning',
      level: 'easy',
      prompt: {
        es: '¿Qué significa ff en una partitura?',
        val: 'Què significa ff en una partitura?',
        en: 'What does ff mean in a score?',
      },
      answers: [
        { id: 'very_soft', correct: false, text: { es: 'Muy suave', val: 'Molt suau', en: 'Very soft' } },
        { id: 'moderately_loud', correct: false, text: { es: 'Medio fuerte', val: 'Mig fort', en: 'Moderately loud' } },
        { id: 'very_loud', correct: true, text: { es: 'Muy fuerte', val: 'Molt fort', en: 'Very loud' } },
        { id: 'sudden', correct: false, text: { es: 'Repentino', val: 'Sobtat', en: 'Sudden' } },
      ],
      explanation: {
        es: 'ff (fortissimo) indica tocar con máxima intensidad.',
        val: 'ff (fortissimo) indica tocar amb la màxima intensitat.',
        en: 'ff (fortissimo) asks the performer to play very loud.',
      },
    },
    {
      id: 'easy_whole_rest',
      level: 'easy',
      prompt: {
        es: '¿Cuántos pulsos dura un silencio de redonda en 4/4?',
        val: 'Quants temps dura un silenci de rodona en 4/4?',
        en: 'How many beats does a whole rest last in 4/4 time?',
      },
      answers: [
        { id: 'one', correct: false, text: { es: 'Uno', val: 'Un', en: 'One' } },
        { id: 'two', correct: false, text: { es: 'Dos', val: 'Dos', en: 'Two' } },
        { id: 'four', correct: true, text: { es: 'Cuatro', val: 'Quatre', en: 'Four' } },
        { id: 'eight', correct: false, text: { es: 'Ocho', val: 'Huit', en: 'Eight' } },
      ],
      explanation: {
        es: 'El silencio de redonda ocupa un compás entero en 4/4.',
        val: 'El silenci de rodona ocupa un compàs complet en 4/4.',
        en: 'A whole rest equals a full measure of silence in 4/4.',
      },
    },
    {
      id: 'easy_brass_instrument',
      level: 'easy',
      prompt: {
        es: '¿Cuál de estos instrumentos pertenece a la familia de viento metal?',
        val: 'Quin d\'aquests instruments pertany a la família de vent metall?',
        en: 'Which of these instruments belongs to the brass family?',
      },
      answers: [
        { id: 'trumpet', correct: true, text: { es: 'Trompeta', val: 'Trompeta', en: 'Trumpet' } },
        { id: 'oboe', correct: false, text: { es: 'Oboe', val: 'Oboè', en: 'Oboe' } },
        { id: 'clarinet', correct: false, text: { es: 'Clarinete', val: 'Clarinet', en: 'Clarinet' } },
        { id: 'flute', correct: false, text: { es: 'Flauta travesera', val: 'Flauta travessera', en: 'Flute' } },
      ],
      explanation: {
        es: 'La trompeta es un instrumento de viento metal con boquilla.',
        val: 'La trompeta és un instrument de vent metall amb embocadura.',
        en: 'The trumpet is a brass instrument played with a mouthpiece.',
      },
    },
    // Medium level
    {
      id: 'medium_interval_c_g',
      level: 'medium',
      prompt: {
        es: '¿Qué intervalo hay entre DO y SOL?',
        val: 'Quin interval hi ha entre DO i SOL?',
        en: 'What interval is formed from C up to G?',
      },
      answers: [
        { id: 'major_third', correct: false, text: { es: 'Tercera mayor', val: 'Tercera major', en: 'Major third' } },
        { id: 'perfect_fifth', correct: true, text: { es: 'Quinta justa', val: 'Quinta justa', en: 'Perfect fifth' } },
        { id: 'perfect_fourth', correct: false, text: { es: 'Cuarta justa', val: 'Quarta justa', en: 'Perfect fourth' } },
        { id: 'minor_sixth', correct: false, text: { es: 'Sexta menor', val: 'Sexta menor', en: 'Minor sixth' } },
      ],
      explanation: {
        es: 'Entre DO y SOL hay una distancia de cinco notas: una quinta justa.',
        val: 'Entre DO i SOL hi ha cinc graus de distància, una quinta justa.',
        en: 'Counting C, D, E, F, G gives a span of five letters: a perfect fifth.',
      },
    },
    {
      id: 'medium_key_one_sharp',
      level: 'medium',
      prompt: {
        es: '¿Qué tonalidad mayor tiene un solo sostenido en la armadura?',
        val: 'Quina tonalitat major té un únic sostingut en l\'armadura?',
        en: 'Which major key signature uses just one sharp?',
      },
      answers: [
        { id: 'g_major', correct: true, text: { es: 'Sol mayor', val: 'Sol major', en: 'G major' } },
        { id: 'd_major', correct: false, text: { es: 'Re mayor', val: 'Re major', en: 'D major' } },
        { id: 'f_major', correct: false, text: { es: 'Fa mayor', val: 'Fa major', en: 'F major' } },
        { id: 'c_major', correct: false, text: { es: 'Do mayor', val: 'Do major', en: 'C major' } },
      ],
      explanation: {
        es: 'Sol mayor usa un único Fa sostenido en la armadura.',
        val: 'Sol major utilitza només Fa sostingut en l\'armadura.',
        en: 'G major includes a single sharp: F sharp.',
      },
    },
    {
      id: 'medium_andante_meaning',
      level: 'medium',
      prompt: {
        es: 'El tempo andante indica tocar...',
        val: 'El tempo andante indica tocar...',
        en: 'The tempo marking Andante indicates playing...',
      },
      answers: [
        { id: 'walking', correct: true, text: { es: 'A paso tranquilo, como caminando', val: 'A pas tranquil, com caminant', en: 'At a walking pace' } },
        { id: 'very_fast', correct: false, text: { es: 'Muy deprisa', val: 'Molt de pressa', en: 'Very fast' } },
        { id: 'very_slow', correct: false, text: { es: 'Muy lento', val: 'Molt lent', en: 'Very slow' } },
        { id: 'freely', correct: false, text: { es: 'Con libertad total', val: 'Amb total llibertat', en: 'Completely freely' } },
      ],
      explanation: {
        es: 'Andante sugiere un movimiento moderado, similar al paso humano.',
        val: 'Andante suggereix un moviment moderat, semblant al pas humà.',
        en: 'Andante means moving at a moderate, walking pace.',
      },
    },
    {
      id: 'medium_bridge_function',
      level: 'medium',
      prompt: {
        es: '¿Cuál es la función del puente en un violín o guitarra?',
        val: 'Quina és la funció del pont en un violí o guitarra?',
        en: 'What is the purpose of the bridge on a violin or guitar?',
      },
      answers: [
        { id: 'transmit', correct: true, text: { es: 'Transmitir las vibraciones a la caja', val: 'Transmetre les vibracions a la caixa', en: 'To transmit string vibration to the body' } },
        { id: 'tuning', correct: false, text: { es: 'Sujetar las clavijas de afinación', val: 'Subjectar les clavilles d\'afinació', en: 'To hold the tuning pegs' } },
        { id: 'decorate', correct: false, text: { es: 'Elemento puramente decorativo', val: 'Element purament decoratiu', en: 'Purely decorative' } },
        { id: 'mute', correct: false, text: { es: 'Apagar el sonido de las cuerdas', val: 'Apagar el so de les cordes', en: 'To mute the strings permanently' } },
      ],
      explanation: {
        es: 'El puente transmite la vibración de las cuerdas a la caja resonante.',
        val: 'El pont transmet la vibració de les cordes a la caixa de ressonància.',
        en: 'The bridge carries string vibrations into the resonant body.',
      },
    },
    {
      id: 'medium_dotted_quarter',
      level: 'medium',
      prompt: {
        es: '¿A cuántas corcheas equivale una negra con puntillo?',
        val: 'A quantes corxeres equival una negra amb puntet?',
        en: 'A dotted quarter note equals how many eighth notes?',
      },
      answers: [
        { id: 'two', correct: false, text: { es: 'A dos corcheas', val: 'A dues corxeres', en: 'Two eighth notes' } },
        { id: 'three', correct: true, text: { es: 'A tres corcheas', val: 'A tres corxeres', en: 'Three eighth notes' } },
        { id: 'four', correct: false, text: { es: 'A cuatro corcheas', val: 'A quatre corxeres', en: 'Four eighth notes' } },
        { id: 'six', correct: false, text: { es: 'A seis corcheas', val: 'A sis corxeres', en: 'Six eighth notes' } },
      ],
      explanation: {
        es: 'La negra con puntillo suma una negra (2 corcheas) más su mitad (1 corchea): tres en total.',
        val: 'La negra amb puntet suma una negra (2 corxeres) més la seua meitat (1 corxera): tres en total.',
        en: 'A dotted quarter equals a quarter (two eighths) plus half of it (one more eighth).',
      },
    },
    {
      id: 'medium_relative_minor_c',
      level: 'medium',
      prompt: {
        es: '¿Cuál es la tonalidad relativa menor de Do mayor?',
        val: 'Quina és la tonalitat relativa menor de Do major?',
        en: 'What is the relative minor key of C major?',
      },
      answers: [
        { id: 'a_minor', correct: true, text: { es: 'La menor', val: 'La menor', en: 'A minor' } },
        { id: 'e_minor', correct: false, text: { es: 'Mi menor', val: 'Mi menor', en: 'E minor' } },
        { id: 'd_minor', correct: false, text: { es: 'Re menor', val: 'Re menor', en: 'D minor' } },
        { id: 'b_minor', correct: false, text: { es: 'Si menor', val: 'Si menor', en: 'B minor' } },
      ],
      explanation: {
        es: 'La tonalidad relativa menor comparte armadura con su mayor: Do mayor y La menor.',
        val: 'La tonalitat relativa menor comparteix l\'armadura amb la major: Do major i La menor.',
        en: 'Relative keys share the same key signature: C major and A minor.',
      },
    },
    {
      id: 'medium_fermata_meaning',
      level: 'medium',
      prompt: {
        es: '¿Qué indica un calderón (fermata) sobre una nota?',
        val: 'Què indica un calderó (fermata) sobre una nota?',
        en: 'What does a fermata (hold) over a note indicate?',
      },
      answers: [
        { id: 'hold', correct: true, text: { es: 'Sostenerla más de lo escrito', val: 'Sostenir-la més del que marca la figura', en: 'Hold it longer than written' } },
        { id: 'repeat', correct: false, text: { es: 'Repetirla varias veces', val: 'Repetir-la diverses vegades', en: 'Repeat it several times' } },
        { id: 'accent', correct: false, text: { es: 'Tocarla con acento fuerte', val: 'Tocar-la amb accent fort', en: 'Play it with a strong accent' } },
        { id: 'staccato', correct: false, text: { es: 'Separarla como staccato', val: 'Separar-la com a staccato', en: 'Play it short (staccato)' } },
      ],
      explanation: {
        es: 'El calderón alarga la nota o silencio a voluntad de intérprete/director.',
        val: 'El calderó allarga la nota o el silenci segons el criteri de l\'intèrpret o la direcció.',
        en: 'A fermata asks performers to sustain the note longer, at the conductor’s discretion.',
      },
    },
    {
      id: 'medium_scale_degree_d',
      level: 'medium',
      prompt: {
        es: '¿Qué nota es el tercer grado de la escala de Re mayor?',
        val: 'Quina nota és el tercer grau de l\'escala de Re major?',
        en: 'Which note is the third degree in the D major scale?',
      },
      answers: [
        { id: 'f_sharp', correct: true, text: { es: 'Fa sostenido', val: 'Fa sostingut', en: 'F sharp' } },
        { id: 'f_natural', correct: false, text: { es: 'Fa natural', val: 'Fa natural', en: 'F natural' } },
        { id: 'e', correct: false, text: { es: 'Mi', val: 'Mi', en: 'E' } },
        { id: 'g', correct: false, text: { es: 'Sol', val: 'Sol', en: 'G' } },
      ],
      explanation: {
        es: 'Re mayor contiene Fa# y Do#; el tercer grado es Fa#.',
        val: 'Re major conté Fa# i Do#; el tercer grau és Fa#.',
        en: 'D major includes F# and C#; its third scale degree is F#.',
      },
    },
    {
      id: 'medium_compound_meter',
      level: 'medium',
      prompt: {
        es: '¿Qué compás pertenece a la familia de compases compuestos?',
        val: 'Quin compàs pertany a la família dels compassos compostos?',
        en: 'Which time signature is a compound meter?',
      },
      answers: [
        { id: '68', correct: true, text: { es: '6/8', val: '6/8', en: '6/8' } },
        { id: '44', correct: false, text: { es: '4/4', val: '4/4', en: '4/4' } },
        { id: '34', correct: false, text: { es: '3/4', val: '3/4', en: '3/4' } },
        { id: '22', correct: false, text: { es: '2/2', val: '2/2', en: '2/2' } },
      ],
      explanation: {
        es: 'Los compases compuestos dividen el pulso en tres; 6/8 es el ejemplo básico.',
        val: 'Els compassos compostos divideixen el temps en tres parts; 6/8 n\'és l\'exemple bàsic.',
        en: 'Compound meters split each beat into three parts; 6/8 is the standard example.',
      },
    },
    {
      id: 'medium_transposing_clarinet',
      level: 'medium',
      prompt: {
        es: '¿Qué instrumento suena una segunda mayor más grave de lo escrito?',
        val: 'Quin instrument sona una segon major més greu del que està escrit?',
        en: 'Which instrument sounds a major second lower than written?',
      },
      answers: [
        { id: 'clarinet_bb', correct: true, text: { es: 'Clarinete en Si bemol', val: 'Clarinet en Si bemoll', en: 'B-flat clarinet' } },
        { id: 'flute', correct: false, text: { es: 'Flauta travesera', val: 'Flauta travessera', en: 'Flute' } },
        { id: 'oboe', correct: false, text: { es: 'Oboe', val: 'Oboè', en: 'Oboe' } },
        { id: 'violin', correct: false, text: { es: 'Violín', val: 'Violí', en: 'Violin' } },
      ],
      explanation: {
        es: 'El clarinete en Si♭ transpone sonando un tono por debajo de lo escrito.',
        val: 'El clarinet en Si♭ transposa sonant un to per davall del que està escrit.',
        en: 'B-flat clarinets transpose down a major second from the written pitch.',
      },
    },
    {
      id: 'medium_legato_meaning',
      level: 'medium',
      prompt: {
        es: 'Interpretar legato significa...',
        val: 'Interpretar legato significa...',
        en: 'To perform legato means to play...',
      },
      answers: [
        { id: 'smooth', correct: true, text: { es: 'Liso y ligado, sin separaciones', val: 'Llis i lligat, sense separacions', en: 'Smoothly connected, without breaks' } },
        { id: 'detached', correct: false, text: { es: 'Muy separado y corto', val: 'Molt separat i curt', en: 'Very detached and short' } },
        { id: 'accented', correct: false, text: { es: 'Con acentos fuertes', val: 'Amb accents forts', en: 'With strong accents' } },
        { id: 'double', correct: false, text: { es: 'Duplicando cada nota', val: 'Duplicant cada nota', en: 'Doubling every note' } },
      ],
      explanation: {
        es: 'Legato pide enlazar las notas suavemente sin cortes evidentes.',
        val: 'Legato demana enllaçar les notes suaument sense talls evidents.',
        en: 'Legato instructs performers to connect notes smoothly.',
      },
    },
    {
      id: 'medium_dynamic_between_mf_ff',
      level: 'medium',
      prompt: {
        es: '¿Qué dinámica es más fuerte que mf pero más suave que ff?',
        val: 'Quina dinàmica és més forta que mf però més suau que ff?',
        en: 'Which dynamic is louder than mf but softer than ff?',
      },
      answers: [
        { id: 'f', correct: true, text: { es: 'f (forte)', val: 'f (forte)', en: 'f (forte)' } },
        { id: 'mp', correct: false, text: { es: 'mp (mezzo piano)', val: 'mp (mezzo piano)', en: 'mp (mezzo piano)' } },
        { id: 'pp', correct: false, text: { es: 'pp (pianissimo)', val: 'pp (pianissimo)', en: 'pp (pianissimo)' } },
        { id: 'fff', correct: false, text: { es: 'fff (fortissimísimo)', val: 'fff (fortissímissim)', en: 'fff (triple forte)' } },
      ],
      explanation: {
        es: 'La secuencia habitual es mf, f, ff; por tanto f queda entre ambas.',
        val: 'La seqüència habitual és mf, f, ff; per tant f queda entre totes dues.',
        en: 'Dynamic order places f between mf and ff.',
      },
    },
    {
      id: 'medium_chord_c_major',
      level: 'medium',
      prompt: {
        es: '¿Cómo se denomina el acorde formado por las notas Do-Mi-Sol?',
        val: 'Com s\'anomena l\'acord format per les notes Do-Mi-Sol?',
        en: 'What is the chord built on C-E-G called?',
      },
      answers: [
        { id: 'major', correct: true, text: { es: 'Acorde mayor', val: 'Acord major', en: 'Major triad' } },
        { id: 'minor', correct: false, text: { es: 'Acorde menor', val: 'Acord menor', en: 'Minor triad' } },
        { id: 'diminished', correct: false, text: { es: 'Acorde disminuido', val: 'Acord disminuït', en: 'Diminished triad' } },
        { id: 'augmented', correct: false, text: { es: 'Acorde aumentado', val: 'Acord augmentat', en: 'Augmented triad' } },
      ],
      explanation: {
        es: 'Do-Mi-Sol forman una tríada mayor (tercera mayor + tercera menor).',
        val: 'Do-Mi-Sol formen una tríada major (tercera major + tercera menor).',
        en: 'C-E-G stack as a major triad: major third plus minor third.',
      },
    },
    {
      id: 'medium_half_step_from_f',
      level: 'medium',
      prompt: {
        es: '¿Qué nota se obtiene al subir un semitono desde Fa?',
        val: 'Quina nota obtenim en pujar un semitò des de Fa?',
        en: 'Which note do you get by raising F by a semitone?',
      },
      answers: [
        { id: 'f_sharp', correct: true, text: { es: 'Fa sostenido', val: 'Fa sostingut', en: 'F sharp' } },
        { id: 'g', correct: false, text: { es: 'Sol', val: 'Sol', en: 'G' } },
        { id: 'e', correct: false, text: { es: 'Mi', val: 'Mi', en: 'E' } },
        { id: 'a_flat', correct: false, text: { es: 'La bemol', val: 'La bemoll', en: 'A flat' } },
      ],
      explanation: {
        es: 'Un semitono ascendente desde Fa conduce a Fa sostenido.',
        val: 'Un semitò ascendent des de Fa porta a Fa sostingut.',
        en: 'F raised by one semitone becomes F sharp.',
      },
    },
    {
      id: 'medium_tie_function',
      level: 'medium',
      prompt: {
        es: '¿Qué hace una ligadura de prolongación?',
        val: 'Què fa una lligadura de prolongació?',
        en: 'What does a tie (slur across identical notes) do?',
      },
      answers: [
        { id: 'adds_value', correct: true, text: { es: 'Suma las duraciones de dos notas iguales', val: 'Suma les durades de dues notes iguals', en: 'Adds the durations of two identical notes' } },
        { id: 'changes_pitch', correct: false, text: { es: 'Cambia la altura de la nota', val: 'Canvia l\'altura de la nota', en: 'Changes the pitch of the note' } },
        { id: 'accentuates', correct: false, text: { es: 'Marca un acento fuerte', val: 'Marca un accent fort', en: 'Adds a strong accent' } },
        { id: 'staccato', correct: false, text: { es: 'Obliga a tocar staccato', val: 'Obliga a tocar staccato', en: 'Forces staccato playing' } },
      ],
      explanation: {
        es: 'La ligadura une notas de igual altura sumando su duración.',
        val: 'La lligadura uneix notes de la mateixa altura sumant la durada.',
        en: 'A tie connects identical pitches so their lengths add together.',
      },
    },
    {
      id: 'medium_key_signature_d_major',
      level: 'medium',
      prompt: {
        es: '¿Qué alteraciones aparecen en la armadura de Re mayor?',
        val: 'Quines alteracions apareixen en l\'armadura de Re major?',
        en: 'Which accidentals appear in the key signature of D major?',
      },
      answers: [
        { id: 'none', correct: false, text: { es: 'Ninguna', val: 'Cap', en: 'None' } },
        { id: 'fsharp_csharp', correct: true, text: { es: 'Fa# y Do#', val: 'Fa# i Do#', en: 'F# and C#' } },
        { id: 'bb_eb', correct: false, text: { es: 'Si♭ y Mi♭', val: 'Si♭ i Mi♭', en: 'Bb and Eb' } },
        { id: 'fsharp_gsharp', correct: false, text: { es: 'Fa# y Sol#', val: 'Fa# i Sol#', en: 'F# and G#' } },
      ],
      explanation: {
        es: 'Re mayor se escribe con dos sostenidos: Fa# y Do#.',
        val: 'Re major s\'escriu amb dos sostinguts: Fa# i Do#.',
        en: 'D major uses two sharps in its signature: F# and C#.',
      },
    },
    {
      id: 'medium_highest_choir_voice',
      level: 'medium',
      prompt: {
        es: '¿Qué cuerda canta las notas más agudas en un coro mixto?',
        val: 'Quina corda canta les notes més agudes en un cor mixt?',
        en: 'Which voice part sings the highest notes in a mixed choir?',
      },
      answers: [
        { id: 'soprano', correct: true, text: { es: 'Soprano', val: 'Soprano', en: 'Soprano' } },
        { id: 'alto', correct: false, text: { es: 'Contralto', val: 'Contralt', en: 'Alto' } },
        { id: 'tenor', correct: false, text: { es: 'Tenor', val: 'Tenor', en: 'Tenor' } },
        { id: 'bass', correct: false, text: { es: 'Bajo', val: 'Baix', en: 'Bass' } },
      ],
      explanation: {
        es: 'La cuerda de sopranos se encarga de la línea más aguda.',
        val: 'La corda de sopranos s\'encarrega de la línia més aguda.',
        en: 'Soprano voices carry the highest melodic line in SATB choirs.',
      },
    },
    {
      id: 'medium_relative_major_e_minor',
      level: 'medium',
      prompt: {
        es: '¿Cuál es la tonalidad relativa mayor de Mi menor?',
        val: 'Quina és la tonalitat relativa major de Mi menor?',
        en: 'What is the relative major key of E minor?',
      },
      answers: [
        { id: 'g_major', correct: true, text: { es: 'Sol mayor', val: 'Sol major', en: 'G major' } },
        { id: 'c_major', correct: false, text: { es: 'Do mayor', val: 'Do major', en: 'C major' } },
        { id: 'a_major', correct: false, text: { es: 'La mayor', val: 'La major', en: 'A major' } },
        { id: 'b_flat_major', correct: false, text: { es: 'Si♭ mayor', val: 'Si♭ major', en: 'B-flat major' } },
      ],
      explanation: {
        es: 'Mi menor comparte armadura con Sol mayor (Fa sostenido).',
        val: 'Mi menor comparteix armadura amb Sol major (Fa sostingut).',
        en: 'E minor and G major share the same key signature (F sharp).',
      },
    },
    {
      id: 'medium_syncopation_definition',
      level: 'medium',
      prompt: {
        es: 'La síncopa consiste en...',
        val: 'La síncope consisteix a...',
        en: 'Syncopation consists of...',
      },
      answers: [
        { id: 'offbeat', correct: true, text: { es: 'Desplazar el acento a tiempos débiles', val: 'Desplaçar l\'accent a temps febles', en: 'Shifting the accent to weak beats' } },
        { id: 'accelerate', correct: false, text: { es: 'Acelerar progresivamente', val: 'Accelerar progressivament', en: 'Gradually speeding up' } },
        { id: 'crescendo', correct: false, text: { es: 'Aumentar el volumen', val: 'Augmentar el volum', en: 'Getting louder' } },
        { id: 'sustain', correct: false, text: { es: 'Sostener notas largas', val: 'Sostenir notes llargues', en: 'Holding long notes' } },
      ],
      explanation: {
        es: 'La síncopa resalta pulsos débiles o contratiempos creando sorpresa rítmica.',
        val: 'La síncope ressalta temps febles o contratemps creant sorpresa rítmica.',
        en: 'Syncopation accents normally weak or off beats for rhythmic surprise.',
      },
    },
    {
      id: 'medium_pentatonic_count',
      level: 'medium',
      prompt: {
        es: '¿Cuántas notas distintas tiene una escala pentatónica mayor?',
        val: 'Quantes notes diferents té una escala pentatònica major?',
        en: 'How many different notes are in a major pentatonic scale?',
      },
      answers: [
        { id: 'three', correct: false, text: { es: 'Tres', val: 'Tres', en: 'Three' } },
        { id: 'four', correct: false, text: { es: 'Cuatro', val: 'Quatre', en: 'Four' } },
        { id: 'five', correct: true, text: { es: 'Cinco', val: 'Cinc', en: 'Five' } },
        { id: 'seven', correct: false, text: { es: 'Siete', val: 'Set', en: 'Seven' } },
      ],
      explanation: {
        es: 'La palabra pentatónico indica cinco sonidos diferentes.',
        val: 'Pentatònic prové del grec i indica cinc sons diferents.',
        en: 'Pentatonic literally means “five tones”.',
      },
    },
    // Hard level
    {
      id: 'hard_interval_c_ab',
      level: 'hard',
      prompt: {
        es: '¿Qué intervalo existe entre DO y LA♭ ascendentes?',
        val: 'Quin interval hi ha entre DO i LA♭ ascendents?',
        en: 'Which interval is formed from C up to A-flat?',
      },
      answers: [
        { id: 'major_sixth', correct: false, text: { es: 'Sexta mayor', val: 'Sexta major', en: 'Major sixth' } },
        { id: 'minor_sixth', correct: true, text: { es: 'Sexta menor', val: 'Sexta menor', en: 'Minor sixth' } },
        { id: 'augmented_fifth', correct: false, text: { es: 'Quinta aumentada', val: 'Quinta augmentada', en: 'Augmented fifth' } },
        { id: 'tritone', correct: false, text: { es: 'Tritono', val: 'Tritó', en: 'Tritone' } },
      ],
      explanation: {
        es: 'De DO a LA♭ hay ocho semitonos: una sexta menor.',
        val: 'De DO a LA♭ hi ha huit semitons: una sexta menor.',
        en: 'C up to A-flat spans eight semitones, a minor sixth.',
      },
    },
    {
      id: 'hard_leading_tone_bb_major',
      level: 'hard',
      prompt: {
        es: '¿Cuál es la nota sensible en la escala de Si♭ mayor?',
        val: 'Quina és la nota sensible de l\'escala de Si♭ major?',
        en: 'What is the leading tone in the B-flat major scale?',
      },
      answers: [
        { id: 'a', correct: true, text: { es: 'La', val: 'La', en: 'A' } },
        { id: 'g', correct: false, text: { es: 'Sol', val: 'Sol', en: 'G' } },
        { id: 'c', correct: false, text: { es: 'Do', val: 'Do', en: 'C' } },
        { id: 'd', correct: false, text: { es: 'Re', val: 'Re', en: 'D' } },
      ],
      explanation: {
        es: 'En Si♭ mayor la sensible (séptimo grado) es La natural.',
        val: 'En Si♭ major la sensible (seté grau) és La natural.',
        en: 'The seventh degree of B-flat major is A, the leading tone.',
      },
    },
    {
      id: 'hard_authentic_cadence',
      level: 'hard',
      prompt: {
        es: '¿Qué progresión forma una cadencia auténtica perfecta en Do mayor?',
        val: 'Quina progressió forma una cadència autèntica perfecta en Do major?',
        en: 'Which progression creates a perfect authentic cadence in C major?',
      },
      answers: [
        { id: 'g7_c', correct: true, text: { es: 'Sol7 → Do', val: 'Sol7 → Do', en: 'G7 → C' } },
        { id: 'f_g', correct: false, text: { es: 'Fa → Sol', val: 'Fa → Sol', en: 'F → G' } },
        { id: 'am_em', correct: false, text: { es: 'La menor → Mi menor', val: 'La menor → Mi menor', en: 'A minor → E minor' } },
        { id: 'dm_c', correct: false, text: { es: 'Re menor → Do', val: 'Re menor → Do', en: 'D minor → C' } },
      ],
      explanation: {
        es: 'La cadencia auténtica perfecta va de V7 a I con ambas en estado fundamental.',
        val: 'La cadència autèntica perfecta va de V7 a I ambdós en estat fonamental.',
        en: 'A perfect authentic cadence moves from V7 to I in root position.',
      },
    },
    {
      id: 'hard_dorian_mode',
      level: 'hard',
      prompt: {
        es: '¿Qué modo surge al comenzar la escala mayor en su segundo grado?',
        val: 'Quin mode apareix en començar l\'escala major al segon grau?',
        en: 'Which mode results from starting a major scale on its second degree?',
      },
      answers: [
        { id: 'dorian', correct: true, text: { es: 'Modo dórico', val: 'Mode dòric', en: 'Dorian mode' } },
        { id: 'phrygian', correct: false, text: { es: 'Modo frigio', val: 'Mode frigi', en: 'Phrygian mode' } },
        { id: 'lydian', correct: false, text: { es: 'Modo lidio', val: 'Mode lidi', en: 'Lydian mode' } },
        { id: 'mixolydian', correct: false, text: { es: 'Modo mixolidio', val: 'Mode mixolidi', en: 'Mixolydian mode' } },
      ],
      explanation: {
        es: 'Al empezar en el segundo grado obtenemos el modo dórico.',
        val: 'En començar pel segon grau d\'una escala major resulta el mode dòric.',
        en: 'Shifting a major scale to start on degree 2 yields the Dorian mode.',
      },
    },
    {
      id: 'hard_triplet_definition',
      level: 'hard',
      prompt: {
        es: 'Un tresillo de corcheas divide un pulso en...',
        val: 'Un treset de corxeres divideix un temps en...',
        en: 'An eighth-note triplet divides one beat into...',
      },
      answers: [
        { id: 'three_parts', correct: true, text: { es: 'Tres partes iguales', val: 'Tres parts iguals', en: 'Three equal parts' } },
        { id: 'two_parts', correct: false, text: { es: 'Dos partes iguales', val: 'Dos parts iguals', en: 'Two equal parts' } },
        { id: 'four_parts', correct: false, text: { es: 'Cuatro partes iguales', val: 'Quatre parts iguals', en: 'Four equal parts' } },
        { id: 'syncopated', correct: false, text: { es: 'Un tiempo fuerte y otro débil', val: 'Un temps fort i un de feble', en: 'One strong and one weak beat' } },
      ],
      explanation: {
        es: 'El tresillo reparte el pulso en tres subdivisiones iguales.',
        val: 'El treset reparteix el temps en tres subdivisions iguals.',
        en: 'Triplets split the beat into three equal subdivisions.',
      },
    },
    {
      id: 'hard_inversion_major_second',
      level: 'hard',
      prompt: {
        es: 'La inversión de una segunda mayor es...',
        val: 'La inversió d\'una segona major és...',
        en: 'The inversion of a major second is...',
      },
      answers: [
        { id: 'minor_seventh', correct: true, text: { es: 'Una séptima menor', val: 'Una sèptima menor', en: 'A minor seventh' } },
        { id: 'major_seventh', correct: false, text: { es: 'Una séptima mayor', val: 'Una sèptima major', en: 'A major seventh' } },
        { id: 'tritone', correct: false, text: { es: 'Un tritono', val: 'Un tritó', en: 'A tritone' } },
        { id: 'minor_sixth', correct: false, text: { es: 'Una sexta menor', val: 'Una sexta menor', en: 'A minor sixth' } },
      ],
      explanation: {
        es: 'Al invertir intervalos, 2 + 7 = 9; mayor pasa a menor, dando séptima menor.',
        val: 'En invertir intervals, 2 + 7 = 9; el major passa a menor, donant sèptima menor.',
        en: 'Interval inversions add to nine; a major second becomes a minor seventh.',
      },
    },
    {
      id: 'hard_key_signature_f_sharp_major',
      level: 'hard',
      prompt: {
        es: '¿Cuántos sostenidos tiene la armadura de Fa# mayor?',
        val: 'Quants sostinguts té l\'armadura de Fa# major?',
        en: 'How many sharps are in the key signature of F-sharp major?',
      },
      answers: [
        { id: 'five', correct: false, text: { es: 'Cinco', val: 'Cinc', en: 'Five' } },
        { id: 'six', correct: true, text: { es: 'Seis', val: 'Sis', en: 'Six' } },
        { id: 'seven', correct: false, text: { es: 'Siete', val: 'Set', en: 'Seven' } },
        { id: 'eight', correct: false, text: { es: 'Ocho', val: 'Huit', en: 'Eight' } },
      ],
      explanation: {
        es: 'Fa# mayor incluye seis sostenidos: Fa#, Do#, Sol#, Re#, La#, Mi#.',
        val: 'Fa# major inclou sis sostinguts: Fa#, Do#, Sol#, Re#, La#, Mi#.',
        en: 'F-sharp major uses six sharps in its key signature.',
      },
    },
    {
      id: 'hard_harmonic_minor_raised_seventh',
      level: 'hard',
      prompt: {
        es: '¿Cuál es el séptimo grado elevado en Mi menor armónica?',
        val: 'Quin és el seté grau elevat en Mi menor harmònica?',
        en: 'What is the raised seventh degree in E harmonic minor?',
      },
      answers: [
        { id: 'd_sharp', correct: true, text: { es: 'Re sostenido', val: 'Re sostingut', en: 'D sharp' } },
        { id: 'd_natural', correct: false, text: { es: 'Re natural', val: 'Re natural', en: 'D natural' } },
        { id: 'c_sharp', correct: false, text: { es: 'Do sostenido', val: 'Do sostingut', en: 'C sharp' } },
        { id: 'b_sharp', correct: false, text: { es: 'Si sostenido', val: 'Si sostingut', en: 'B sharp' } },
      ],
      explanation: {
        es: 'La escala menor armónica eleva el séptimo grado: en Mi menor, Re pasa a Re#.',
        val: 'L\'escala menor harmònica eleva el seté grau: en Mi menor, Re passa a Re#.',
        en: 'Harmonic minor raises the seventh: in E minor, D becomes D-sharp.',
      },
    },
    {
      id: 'hard_tonic_dominant_relation',
      level: 'hard',
      prompt: {
        es: 'La tonalidad dominante está situada a...',
        val: 'La tonalitat dominant està situada a...',
        en: 'The dominant key is located...',
      },
      answers: [
        { id: 'perfect_fifth_up', correct: true, text: { es: 'Una quinta justa por encima', val: 'Una quinta justa per damunt', en: 'A perfect fifth above' } },
        { id: 'perfect_fourth_up', correct: false, text: { es: 'Una cuarta justa por encima', val: 'Una quarta justa per damunt', en: 'A perfect fourth above' } },
        { id: 'minor_third_up', correct: false, text: { es: 'Una tercera menor por encima', val: 'Una tercera menor per damunt', en: 'A minor third above' } },
        { id: 'major_sixth_down', correct: false, text: { es: 'Una sexta mayor por debajo', val: 'Una sexta major per davall', en: 'A major sixth below' } },
      ],
      explanation: {
        es: 'La tonalidad dominante se encuentra a una quinta justa ascendente.',
        val: 'La tonalitat dominant es troba a una quinta justa ascendent.',
        en: 'Dominant keys lie a perfect fifth above the tonic.',
      },
    },
    {
      id: 'hard_subdominant_function',
      level: 'hard',
      prompt: {
        es: '¿Qué función tonal tiene el acorde construido sobre el cuarto grado?',
        val: 'Quina funció tonal té l\'acord construït sobre el quart grau?',
        en: 'What tonal function does the chord on the fourth scale degree have?',
      },
      answers: [
        { id: 'subdominant', correct: true, text: { es: 'Función subdominante (IV)', val: 'Funció subdominant (IV)', en: 'Subdominant function (IV)' } },
        { id: 'dominant', correct: false, text: { es: 'Función dominante', val: 'Funció dominant', en: 'Dominant function' } },
        { id: 'tonic', correct: false, text: { es: 'Función tónica', val: 'Funció tònica', en: 'Tonic function' } },
        { id: 'mediant', correct: false, text: { es: 'Función medianta', val: 'Funció mediant', en: 'Mediant function' } },
      ],
      explanation: {
        es: 'El cuarto grado genera la función subdominante dentro de la tonalidad.',
        val: 'El quart grau genera la funció subdominant dins de la tonalitat.',
        en: 'Scale degree IV provides the subdominant function.',
      },
    },
    {
      id: 'hard_first_inversion_major',
      level: 'hard',
      prompt: {
        es: 'Cuando la tercera de un acorde mayor está en el bajo, se trata de...',
        val: 'Quan la tercera d\'un acord major està al baix, es tracta de...',
        en: 'When the third of a major triad is in the bass, the chord is...',
      },
      answers: [
        { id: 'first_inversion', correct: true, text: { es: 'Primera inversión', val: 'Primera inversió', en: 'First inversion' } },
        { id: 'root_position', correct: false, text: { es: 'Posición fundamental', val: 'Posició fonamental', en: 'Root position' } },
        { id: 'second_inversion', correct: false, text: { es: 'Segunda inversión', val: 'Segona inversió', en: 'Second inversion' } },
        { id: 'suspended', correct: false, text: { es: 'Acorde suspendido', val: 'Acord suspés', en: 'Suspended chord' } },
      ],
      explanation: {
        es: 'Si la tercera está en el bajo, el acorde se halla en primera inversión.',
        val: 'Si la tercera està al baix, l\'acord és en primera inversió.',
        en: 'A triad with its third in the bass is in first inversion.',
      },
    },
    {
      id: 'hard_interval_f_e',
      level: 'hard',
      prompt: {
        es: '¿Qué intervalo forman FA y MI ascendentes?',
        val: 'Quin interval formen FA i MI ascendents?',
        en: 'What interval is formed from F up to E?',
      },
      answers: [
        { id: 'major_seventh', correct: true, text: { es: 'Séptima mayor', val: 'Sèptima major', en: 'Major seventh' } },
        { id: 'minor_seventh', correct: false, text: { es: 'Séptima menor', val: 'Sèptima menor', en: 'Minor seventh' } },
        { id: 'major_sixth', correct: false, text: { es: 'Sexta mayor', val: 'Sexta major', en: 'Major sixth' } },
        { id: 'minor_sixth', correct: false, text: { es: 'Sexta menor', val: 'Sexta menor', en: 'Minor sixth' } },
      ],
      explanation: {
        es: 'De FA a MI hay once semitonos: una séptima mayor.',
        val: 'De FA a MI hi ha onze semitons: una sèptima major.',
        en: 'F to E spans eleven semitones, the size of a major seventh.',
      },
    },
    {
      id: 'hard_irregular_meter',
      level: 'hard',
      prompt: {
        es: '¿Cuál de estos compases se considera irregular?',
        val: 'Quin d\'estos compassos es considera irregular?',
        en: 'Which of these time signatures is considered irregular?',
      },
      answers: [
        { id: '54', correct: true, text: { es: '5/4', val: '5/4', en: '5/4' } },
        { id: '68', correct: false, text: { es: '6/8', val: '6/8', en: '6/8' } },
        { id: '34', correct: false, text: { es: '3/4', val: '3/4', en: '3/4' } },
        { id: '44', correct: false, text: { es: '4/4', val: '4/4', en: '4/4' } },
      ],
      explanation: {
        es: 'Los compases de 5 tiempos son irregulares (combinan 2+3 o 3+2).',
        val: 'Els compassos de 5 temps són irregulars (combinen 2+3 o 3+2).',
        en: 'Meters with five beats, like 5/4, are irregular/odd meters.',
      },
    },
    {
      id: 'hard_col_legno',
      level: 'hard',
      prompt: {
        es: '¿Qué indica la técnica “col legno” en cuerdas frotadas?',
        val: 'Què indica la tècnica “col legno” en instruments de corda fregada?',
        en: 'What does the technique “col legno” ask string players to do?',
      },
      answers: [
        { id: 'wood', correct: true, text: { es: 'Golpear con la madera del arco', val: 'Colpejar amb la fusta de l\'arquet', en: 'Strike with the wooden stick of the bow' } },
        { id: 'mute', correct: false, text: { es: 'Colocar sordina', val: 'Col·locar sordina', en: 'Attach a mute' } },
        { id: 'harmonics', correct: false, text: { es: 'Tocar armónicos', val: 'Tocar harmònics', en: 'Play harmonics' } },
        { id: 'double_stops', correct: false, text: { es: 'Realizar dobles cuerdas', val: 'Fer dobles cordes', en: 'Play double stops' } },
      ],
      explanation: {
        es: 'Col legno significa usar la madera del arco en lugar del pelo.',
        val: 'Col legno significa usar la fusta de l\'arquet en lloc del pèl.',
        en: 'Col legno instructs performers to strike with the wood of the bow.',
      },
    },
    {
      id: 'hard_horn_in_f',
      level: 'hard',
      prompt: {
        es: 'Un corno en Fa suena...',
        val: 'Un corn en Fa sona...',
        en: 'A horn in F sounds...',
      },
      answers: [
        { id: 'perfect_fifth_lower', correct: true, text: { es: 'Una quinta justa más grave que lo escrito', val: 'Una quinta justa més greu del que està escrit', en: 'A perfect fifth lower than written' } },
        { id: 'major_second_lower', correct: false, text: { es: 'Una segunda mayor más grave', val: 'Una segona major més greu', en: 'A major second lower' } },
        { id: 'same_pitch', correct: false, text: { es: 'A la misma altura', val: 'A la mateixa altura', en: 'At the written pitch' } },
        { id: 'octave_higher', correct: false, text: { es: 'Una octava más aguda', val: 'Una octava més aguda', en: 'An octave higher' } },
      ],
      explanation: {
        es: 'El corno en Fa transpone una quinta justa descendente.',
        val: 'El corn en Fa transposa una quinta justa descendent.',
        en: 'F horns transpose down a perfect fifth.',
      },
    },
    {
      id: 'hard_sonata_form',
      level: 'hard',
      prompt: {
        es: 'La forma sonata clásica se organiza en...',
        val: 'La forma sonata clàssica s\'organitza en...',
        en: 'Classical sonata form is organised in...',
      },
      answers: [
        { id: 'exposition_development_recap', correct: true, text: { es: 'Exposición, desarrollo y reexposición', val: 'Exposició, desenvolupament i reexposició', en: 'Exposition, development and recapitulation' } },
        { id: 'theme_variations', correct: false, text: { es: 'Tema y variaciones', val: 'Tema i variacions', en: 'Theme and variations' } },
        { id: 'binary', correct: false, text: { es: 'Sección A y sección B', val: 'Secció A i secció B', en: 'Section A then section B' } },
        { id: 'rondo', correct: false, text: { es: 'Estribillo con episodios', val: 'Estribillo amb episodis', en: 'Refrain with episodes (rondo)' } },
      ],
      explanation: {
        es: 'La forma sonata clásica presenta exposición, desarrollo y reexposición.',
        val: 'La forma sonata clàssica presenta exposició, desenvolupament i reexposició.',
        en: 'Sonata form follows exposition, development, recapitulation.',
      },
    },
    {
      id: 'hard_fully_diminished',
      level: 'hard',
      prompt: {
        es: '¿Cómo se construye un acorde disminuido completo?',
        val: 'Com es construeix un acord disminuït complet?',
        en: 'How is a fully diminished seventh chord built?',
      },
      answers: [
        { id: 'stack_minor_thirds', correct: true, text: { es: 'Apilando terceras menores sucesivas', val: 'Apilant terceres menors successives', en: 'By stacking minor thirds' } },
        { id: 'major_then_minor', correct: false, text: { es: 'Mayor y luego menor', val: 'Major i després menor', en: 'Major third then minor third' } },
        { id: 'minor_then_major', correct: false, text: { es: 'Menor y luego mayor', val: 'Menor i després major', en: 'Minor third then major third' } },
        { id: 'add_sixth', correct: false, text: { es: 'Añadiendo una sexta', val: 'Afegint una sisena', en: 'By adding a sixth' } },
      ],
      explanation: {
        es: 'El acorde disminuido completo suma terceras menores superpuestas.',
        val: 'L\'acord disminuït complet suma terceres menors superposades.',
        en: 'A fully diminished chord stacks consecutive minor thirds.',
      },
    },
    {
      id: 'hard_blues_scale_feature',
      level: 'hard',
      prompt: {
        es: '¿Qué rasgo distingue a la escala blues mayor?',
        val: 'Quin tret distingeix l\'escala blues major?',
        en: 'Which feature distinguishes the (major) blues scale?',
      },
      answers: [
        { id: 'thirds', correct: true, text: { es: 'Incluye tercera mayor y menor a la vez', val: 'Inclou tercera major i menor alhora', en: 'It contains both the major and minor third' } },
        { id: 'only_whole', correct: false, text: { es: 'Solo usa tonos enteros', val: 'Només usa tons sencers', en: 'It uses only whole steps' } },
        { id: 'seven_notes', correct: false, text: { es: 'Tiene siete notas naturales', val: 'Té set notes naturals', en: 'It has seven natural notes' } },
        { id: 'augmented_second', correct: false, text: { es: 'Añade una segunda aumentada fija', val: 'Afig una segona augmentada fixa', en: 'It adds a fixed augmented second' } },
      ],
      explanation: {
        es: 'La escala blues combina la tercera mayor y la “blue note” (tercera menor).',
        val: 'L\'escala blues combina la tercera major i la “blue note” (tercera menor).',
        en: 'The blues scale features both the major third and the flattened third.',
      },
    },
    {
      id: 'hard_mode_aeolian',
      level: 'hard',
      prompt: {
        es: '¿Qué modo coincide con la escala menor natural?',
        val: 'Quin mode coincideix amb l\'escala menor natural?',
        en: 'Which mode matches the natural minor scale?',
      },
      answers: [
        { id: 'aeolian', correct: true, text: { es: 'Modo eólico', val: 'Mode eòlic', en: 'Aeolian mode' } },
        { id: 'ionian', correct: false, text: { es: 'Modo jónico', val: 'Mode jònic', en: 'Ionian mode' } },
        { id: 'locrian', correct: false, text: { es: 'Modo locrio', val: 'Mode locri', en: 'Locrian mode' } },
        { id: 'lydian', correct: false, text: { es: 'Modo lidio', val: 'Mode lidi', en: 'Lydian mode' } },
      ],
      explanation: {
        es: 'El modo eólico tiene la misma estructura que la escala menor natural.',
        val: 'El mode eòlic té la mateixa estructura que l\'escala menor natural.',
        en: 'Aeolian mode is equivalent to the natural minor scale.',
      },
    },
    {
      id: 'hard_senza_sord',
      level: 'hard',
      prompt: {
        es: 'La indicación “senza sord.” en las cuerdas significa...',
        val: 'La indicació “senza sord.” en les cordes significa...',
        en: 'The marking “senza sord.” for strings means...',
      },
      answers: [
        { id: 'without_mute', correct: true, text: { es: 'Tocar sin sordina', val: 'Tocar sense sordina', en: 'Play without the mute' } },
        { id: 'with_mute', correct: false, text: { es: 'Colocar la sordina', val: 'Col·locar la sordina', en: 'Put the mute on' } },
        { id: 'soft_bowing', correct: false, text: { es: 'Arco muy suave', val: 'Arc molt suau', en: 'Use very soft bowing' } },
        { id: 'plucked', correct: false, text: { es: 'Cambiar a pizzicato', val: 'Passar a pizzicato', en: 'Switch to pizzicato' } },
      ],
      explanation: {
        es: 'Senza sordina pide retirar la sordina previamente colocada.',
        val: 'Senza sordina demana retirar la sordina prèviament col·locada.',
        en: 'Senza sordina tells players to play without the mute.',
      },
    },
  ];

  const state = {
    running: false,
    mode: 'solo',
    level: 'easy',
    questionCount: 10,
    currentIndex: 0,
    currentPlayer: 0,
    questions: [],
    scores: [0, 0],
    correctCounts: [0, 0],
    answered: false,
    loadingNext: false,
    lastConfig: {
      mode: 'solo',
      level: 'easy',
      count: 10,
    },
  };

  const dom = {
    startBtn: null,
    nextBtn: null,
    progressValue: null,
    questionText: null,
    questionInfo: null,
    feedback: null,
    options: [],
    playersRoot: null,
    playerCards: [],
    questionCountSelect: null,
    levelSelect: null,
    modeSelect: null,
  };

  function getLang() {
    if (window.i18n && typeof window.i18n.getLang === 'function') {
      return window.i18n.getLang();
    }
    return 'es';
  }

  function formatTemplate(str, params = {}) {
    if (typeof str !== 'string') return str;
    return str.replace(/%\{(\w+)\}/g, (_, name) => {
      return Object.prototype.hasOwnProperty.call(params, name) ? params[name] : '';
    });
  }

  function tr(key, fallback, params = {}) {
    let raw = null;
    if (window.i18n && typeof window.i18n.t === 'function') {
      try {
        raw = window.i18n.t(key, fallback);
      } catch (_) {
        raw = null;
      }
    }
    if (typeof raw !== 'string' || raw === key) {
      raw = typeof fallback === 'string' ? fallback : '';
    }
    return formatTemplate(raw, params);
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  ready(() => {
    dom.startBtn = document.getElementById('quizStart');
    dom.nextBtn = document.getElementById('quizNext');
    dom.progressValue = document.getElementById('quizProgressValue');
    dom.questionText = document.getElementById('quizQuestionText');
    dom.questionInfo = document.getElementById('quizQuestionInfo');
    dom.feedback = document.getElementById('quizFeedback');
    dom.playersRoot = document.getElementById('quizPlayers');
    dom.questionCountSelect = document.getElementById('quizQuestionCount');
    dom.levelSelect = document.getElementById('quizLevel');
    dom.modeSelect = document.getElementById('quizMode');
    dom.options = Array.from(document.querySelectorAll('.quiz-option'));
    dom.playerCards = Array.from(dom.playersRoot.querySelectorAll('.quiz-player'));

    dom.startBtn.addEventListener('click', startGame);
    dom.nextBtn.addEventListener('click', goNextQuestion);
    dom.options.forEach((btn) => {
      btn.addEventListener('click', () => handleAnswer(Number(btn.dataset.index)));
    });

    updatePlayersVisibility('solo');
    updateProgress(0, 0);
  });

  function getText(payload) {
    if (!payload || typeof payload !== 'object') return '';
    const lang = getLang();
    return payload[lang] || payload.es || payload.val || payload.en || '';
  }

  function shuffle(array) {
    const out = array.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function buildQuestionSet(level, count) {
    const pool = QUESTION_BANK.filter((item) => item.level === level);
    if (pool.length === 0) return [];
    const bag = [];
    while (bag.length < count) {
      const round = shuffle(pool);
      for (let i = 0; i < round.length && bag.length < count; i += 1) {
        const base = round[i];
        bag.push({
          id: `${base.id}-${bag.length}`,
          level: base.level,
          prompt: base.prompt,
          explanation: base.explanation || null,
          answers: shuffle(base.answers.map((item) => ({ ...item }))),
        });
      }
    }
    return bag.slice(0, count);
  }

  function resetState() {
    state.currentIndex = 0;
    state.currentPlayer = 0;
    state.scores = [0, 0];
    state.correctCounts = [0, 0];
    state.answered = false;
    state.loadingNext = false;
    dom.feedback.textContent = '';
    dom.questionInfo.hidden = true;
    dom.questionInfo.textContent = '';
    dom.nextBtn.hidden = true;
    dom.options.forEach((btn) => {
      btn.disabled = false;
      btn.classList.remove('is-correct', 'is-wrong');
    });
  }

  function updateProgress(current, total) {
    dom.progressValue.textContent = tr('quiz.progress.value', '', {
      current,
      total,
    });
  }

  function updatePlayersVisibility(mode) {
    if (!dom.playersRoot) return;
    const twoPlayers = mode === 'pairs';
    dom.playersRoot.classList.toggle('is-two', twoPlayers);
    dom.playerCards.forEach((card, idx) => {
      if (idx === 0) {
        card.hidden = false;
      } else {
        card.hidden = !twoPlayers;
      }
      card.classList.toggle('is-active', idx === state.currentPlayer && (!card.hidden));
      const correctEl = card.querySelector('[data-correct]');
      if (correctEl) {
        const base = card.hidden ? '' : correctEl.dataset.i18n ? '' : correctEl.textContent;
        if (base === '') {
          correctEl.textContent = '';
        }
      }
    });
  }

  function updateScoreboard() {
    dom.playerCards.forEach((card, idx) => {
      const scoreEl = card.querySelector('[data-score]');
      const correctEl = card.querySelector('[data-correct]');
      if (scoreEl) {
        scoreEl.textContent = String(state.scores[idx] || 0);
      }
      if (correctEl) {
        const correct = state.correctCounts[idx] || 0;
        correctEl.textContent = tr('quiz.player.correct_count', '', { count: correct });
      }
      const shouldHighlight = !card.hidden && idx === state.currentPlayer && state.running && !state.answered;
      card.classList.toggle('is-active', shouldHighlight);
    });
  }

  function startGame() {
    const count = Number(dom.questionCountSelect.value) || 10;
    const level = dom.levelSelect.value || 'easy';
    const mode = dom.modeSelect.value === 'pairs' ? 'pairs' : 'solo';

    const questions = buildQuestionSet(level, count);
    if (!questions.length) {
      dom.feedback.textContent = tr('quiz.errors.no_questions', 'No hay preguntas disponibles para este nivel.');
      return;
    }

    state.running = true;
    state.mode = mode;
    state.level = level;
    state.questionCount = count;
    state.questions = questions;
    state.lastConfig = { mode, level, count };

    resetState();
    updatePlayersVisibility(mode);
    updateScoreboard();
    updateProgress(0, count);
    dom.startBtn.disabled = true;
    if (window.ScoreService && typeof window.ScoreService.hideSave === 'function') {
      window.ScoreService.hideSave(GAME_ID);
    }
    renderQuestion();
  }

  function renderQuestion() {
    const question = state.questions[state.currentIndex];
    if (!question) return;
    dom.questionText.textContent = getText(question.prompt) || '—';
    if (question.explanation) {
      dom.questionInfo.dataset.explanation = JSON.stringify(question.explanation);
    } else {
      delete dom.questionInfo.dataset.explanation;
    }
    dom.questionInfo.hidden = true;
    dom.questionInfo.textContent = '';
    dom.feedback.textContent = '';
    dom.nextBtn.hidden = true;
    dom.options.forEach((btn, idx) => {
      const option = question.answers[idx];
      if (!option) {
        btn.hidden = true;
        return;
      }
      btn.hidden = false;
      btn.disabled = false;
      btn.classList.remove('is-correct', 'is-wrong');
      const textEl = btn.querySelector('.quiz-option__text');
      if (textEl) {
        textEl.textContent = getText(option.text);
      }
    });
    state.answered = false;
    updateScoreboard();
    updateProgress(Math.min(state.currentIndex + 1, state.questionCount), state.questionCount);
  }

  function handleAnswer(index) {
    if (!state.running || state.answered) return;
    const question = state.questions[state.currentIndex];
    if (!question || !question.answers[index]) return;
    state.answered = true;
    const option = question.answers[index];
    const correct = !!option.correct;

    dom.options.forEach((btn, idx) => {
      btn.disabled = true;
      const candidate = question.answers[idx];
      if (!candidate) return;
      if (candidate.correct) {
        btn.classList.add('is-correct');
      }
      if (idx === index && !candidate.correct) {
        btn.classList.add('is-wrong');
      }
    });

    if (correct) {
      state.scores[state.currentPlayer] += SCORE_PER_CORRECT;
      state.correctCounts[state.currentPlayer] += 1;
    }

    showFeedback(correct, option);
    updateScoreboard();

    const explanation = question.explanation;
    if (explanation) {
      dom.questionInfo.hidden = false;
      dom.questionInfo.textContent = getText(explanation);
    }

    dom.nextBtn.hidden = false;
  }

  function showFeedback(correct) {
    dom.feedback.textContent = correct
      ? tr('quiz.feedback.correct', '', { points: SCORE_PER_CORRECT })
      : tr('quiz.feedback.wrong', 'Respuesta incorrecta, ¡sigue intentándolo!');
  }

  function goNextQuestion() {
    if (!state.running) return;
    if (!state.answered) return;
    const nextIndex = state.currentIndex + 1;
    if (nextIndex >= state.questionCount) {
      finishGame();
      return;
    }
    state.currentIndex = nextIndex;
    if (state.mode === 'pairs') {
      state.currentPlayer = (state.currentPlayer + 1) % 2;
    } else {
      state.currentPlayer = 0;
    }
    renderQuestion();
  }

  function finishGame() {
    state.running = false;
    const totalScore = state.scores.reduce((sum, value) => sum + value, 0);
    const summary = tr('quiz.summary.score', '', { score: totalScore });
    dom.feedback.textContent = summary;
    dom.nextBtn.hidden = true;
    dom.startBtn.disabled = false;
    dom.questionText.textContent = summary;
    dom.questionInfo.hidden = false;
    const correctSum = state.correctCounts.reduce((sum, value) => sum + value, 0);
    dom.questionInfo.textContent = tr('quiz.summary.correct', '', {
      count: correctSum,
      total: state.questionCount,
    });

    if (window.ScoreService && typeof window.ScoreService.showSave === 'function') {
      window.ScoreService.showSave(GAME_ID, totalScore);
    }
    if (window.GameOverOverlay && typeof window.GameOverOverlay.show === 'function') {
      window.GameOverOverlay.show({
        gameId: GAME_ID,
        score: totalScore,
        subtitleKey: 'quiz.overlay.subtitle',
        onRetry: () => {
          dom.startBtn.focus();
          startGame();
        },
      });
    }
    dom.startBtn.textContent = tr('quiz.actions.play_again', 'Jugar de nuevo');
  }
})();
