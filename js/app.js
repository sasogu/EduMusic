function verificarNota(nota) {
  const resultado = document.getElementById('resultado');
  if (nota === 'sol') {
    resultado.textContent = '¡Correcto! Has identificado la nota Sol.';
    resultado.style.color = 'green';
  } else if (nota === 'mi') {
    resultado.textContent = '¡Correcto! Has identificado la nota Mi.';
    resultado.style.color = 'green';
  } else {
    resultado.textContent = 'Intenta de nuevo.';
    resultado.style.color = 'red';
  }
}
