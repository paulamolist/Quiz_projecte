// Puedes cambiar las preguntas y sus respuestas aquí.
// "correcta" indica la posición: 0 = A, 1 = B, 2 = C, 3 = D.
const preguntas = [
  {
    texto: "¿Cuál es la capital de Francia?",
    opciones: ["Madrid", "París", "Roma", "Lisboa"],
    correcta: 1
  },
  {
    texto: "¿Cuántos jugadores tiene un equipo de fútbol en el campo?",
    opciones: ["9", "10", "11", "12"],
    correcta: 2
  },
  {
    texto: "¿Cuál es el planeta más grande del sistema solar?",
    opciones: ["Júpiter", "Marte", "Tierra", "Venus"],
    correcta: 0
  },
   {
    texto: "¿Cuál es el planeta más grande del sistema solar?",
    opciones: ["Júpiter", "Marte", "Tierra", "Venus"],
    correcta: 0
  }
];

const SEGUNDOS_POR_PREGUNTA = 15;

const progreso = document.querySelector("#progreso");
const pregunta = document.querySelector("#pregunta");
const puntos = document.querySelector("#puntos");
const tiempo = document.querySelector("#tiempo");
const respuestas = document.querySelector("#respuestas");
const botones = document.querySelectorAll(".respuesta");
const mensaje = document.querySelector("#mensaje");
const siguiente = document.querySelector("#siguiente");
const reiniciar = document.querySelector("#reiniciar");

let preguntaActual = 0;
let aciertos = 0;
let respondida = false;
let temporizador;
let fechaLimite;

function actualizarTiempo() {
  const segundosRestantes = Math.max(
    0,
    Math.ceil((fechaLimite - Date.now()) / 1000)
  );

  tiempo.textContent = `${segundosRestantes} s`;
  tiempo.classList.toggle("urgente", segundosRestantes <= 5);

  if (segundosRestantes === 0) {
    comprobarRespuesta(null);
  }
}

function mostrarPregunta() {
  clearInterval(temporizador);

  const actual = preguntas[preguntaActual];
  respondida = false;

  progreso.textContent =
    `PREGUNTA ${preguntaActual + 1} / ${preguntas.length}`;

  pregunta.textContent =
    `PREGUNTA ${preguntaActual + 1}: ${actual.texto}`;

  puntos.textContent = `${aciertos}/${preguntas.length}`;
  mensaje.textContent = "";
  siguiente.hidden = true;
  reiniciar.hidden = true;
  respuestas.hidden = false;

  botones.forEach((boton, indice) => {
    boton.querySelector("span").textContent = actual.opciones[indice];
    boton.disabled = false;
    boton.classList.remove("correcta", "incorrecta");
  });

  fechaLimite = Date.now() + SEGUNDOS_POR_PREGUNTA * 1000;
  actualizarTiempo();
  temporizador = setInterval(actualizarTiempo, 200);
}

function comprobarRespuesta(indiceElegido) {
  if (respondida) return;

  // Evita aceptar respuestas después del límite de tiempo.
  if (Date.now() >= fechaLimite) {
    indiceElegido = null;
  }

  respondida = true;
  clearInterval(temporizador);

  const actual = preguntas[preguntaActual];

  botones.forEach((boton) => {
    boton.disabled = true;
  });

  botones[actual.correcta].classList.add("correcta");

  if (indiceElegido === null) {
    tiempo.textContent = "0 s";
    mensaje.textContent = "¡Se ha acabado el tiempo!";
  } else if (indiceElegido === actual.correcta) {
    aciertos++;
    mensaje.textContent = "¡Respuesta correcta!";
  } else {
    botones[indiceElegido].classList.add("incorrecta");
    mensaje.textContent =
      `Respuesta incorrecta. La correcta es: ${actual.opciones[actual.correcta]}.`;
  }

  puntos.textContent = `${aciertos}/${preguntas.length}`;
  siguiente.textContent =
    preguntaActual === preguntas.length - 1
      ? "Ver resultados"
      : "Siguiente pregunta";

  siguiente.hidden = false;
}

function mostrarResultados() {
  clearInterval(temporizador);

  progreso.textContent = "PARTIDA TERMINADA";
  pregunta.textContent =
    `Has acertado ${aciertos} de ${preguntas.length} preguntas`;

  tiempo.textContent = "FIN";
  tiempo.classList.remove("urgente");
  respuestas.hidden = true;
  siguiente.hidden = true;
  mensaje.textContent = "¡Gracias por jugar!";
  reiniciar.hidden = false;
  reiniciar.focus();
}

botones.forEach((boton) => {
  boton.addEventListener("click", () => {
    comprobarRespuesta(Number(boton.dataset.indice));
  });
});

siguiente.addEventListener("click", () => {
  preguntaActual++;

  if (preguntaActual < preguntas.length) {
    mostrarPregunta();
    botones[0].focus();
  } else {
    mostrarResultados();
  }
});

reiniciar.addEventListener("click", () => {
  preguntaActual = 0;
  aciertos = 0;
  mostrarPregunta();
  botones[0].focus();
});

mostrarPregunta();