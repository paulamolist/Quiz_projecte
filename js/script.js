
const preguntas = [
  {
    texto: "De quin país és aquesta bandera?",
    imagen: "assets/egipte.png",
    opciones: ["Xina", "Islàndia", "Egipte", "Hèlsinki"],
    correcta: 2
  },
  {
    texto: "Quina és la capital de Nova Zelanda? 🇳🇿",
    opciones: ["Auckland", "Wellington", "Christchurch", "Hamilton"],
    correcta: 1
  },
  {
    texto: "De quin país és aquesta bandera?",
    imagen: "assets/polonia.png",
    opciones: ["Polònia", "Turquia", "Suïssa", "Ucraïna"],
    correcta: 0
  },
  {
    texto: "Quina és la capital de Grècia? 🇬🇷",
    opciones: ["Roma", "Atenes", "Lisboa", "Istanbul"],
    correcta: 1
  },
  {
    texto: "Quina és la capital d'aquesta bandera?",
    imagen: "assets/portugal.png",
    opciones: ["Oslo", "Hèlsinki", "Lisboa", "Copenhaguen"],
    correcta: 2
  },
  {
    texto: "Quina és la capital del Japó? 🇯🇵",
    opciones: ["Pequín", "Seül", "Tòquio", "Bangkok"],
    correcta: 2
  },
  {
    texto: "Quina és la capital d'Alemanya?",
    imagen: "assets/alemanya.png",
    opciones: ["Berlín", "Viena", "Brussel·les", "Amsterdam"],
    correcta: 0
  },
  {
    texto: "Quina és la capital de Suïssa? 🇨🇭",
    opciones: ["Zuric", "Ginebra", "Berna", "Basilea"],
    correcta: 2
  },
  {
    texto: "De quin país és aquesta bandera?",
    imagen: "assets/noruega.png",
    opciones: ["Noruega", "Irlanda", "Mèxic", "Bulgària"],
    correcta: 0
  },
  {
    texto: "Quina és la capital d'Austràlia? 🇦🇺",
    opciones: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correcta: 2
  },
{
  texto: "Quina d'aquestes banderes és la de Brasil?",
  opciones: [
    { imagen: "assets/brasil.png" },
    { imagen: "assets/argentina.png" },
    { imagen: "assets/alemanya.png" },
    { imagen: "assets/estats units.png" }
  ],
  correcta: 0
},
  {
    texto: "Quin és el país de Ottawa? 🇨🇦",
    opciones: ["Tailàndia", "Croàcia", "Marroc", "Canadà"],
    correcta: 3
  },
  {
    texto: "Quina és la capital d'Itàlia? 🇮🇹",
    opciones: ["Venècia", "Roma", "Milà", "Nàpols"],
    correcta: 1
  },
{
  texto: "Quina d'aquestes banderes és la d'Irlanda?",
  opciones: [
    { imagen: "assets/ecuador.png" },
    { imagen: "assets/irlanda.png" },
    { imagen: "assets/canada.png" },
    { imagen: "assets/singapur.png" }
  ],
  correcta: 1
},
  {
    texto: "Quina és la capital de Mèxic? 🇲🇽",
    opciones: ["Lima", "Bogotà", "Ciutat de Mèxic", "Santiago de Xile"],
    correcta: 2
  },
  {
    texto: "De quin país és aquesta bandera?",
    imagen: "assets/suecia.png",
    opciones: ["Espanya", "Suècia", "Rússia", "Portugal"],
    correcta: 1
  }
];

const SEGONS_PER_PREGUNTA = 15;

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

  pregunta.replaceChildren();

  const texto = document.createElement("span");
  texto.textContent =
    `PREGUNTA ${preguntaActual + 1}: ${actual.texto}`;

  pregunta.appendChild(texto);

  if (actual.imagen) {
    const imagen = document.createElement("img");
    imagen.src = actual.imagen;
    imagen.alt = "Bandera de la pregunta";
    imagen.className = "bandera-pregunta";

    pregunta.appendChild(imagen);
  }

  puntos.textContent = `${aciertos}/${preguntas.length}`;
  mensaje.textContent = "";

  siguiente.hidden = true;
  reiniciar.hidden = true;
  respuestas.hidden = false;

  botones.forEach((boton, indice) => {
    const contenido = boton.querySelector("span");
    const opcion = actual.opciones[indice];

    contenido.replaceChildren();

    if (opcion.imagen) {
      const imagen = document.createElement("img");

      imagen.src = opcion.imagen;
      imagen.alt = "Bandera";
      imagen.className = "bandera-opcion";

      contenido.appendChild(imagen);
    } else {
    contenido.textContent = opcion;
    }

  boton.disabled = false;
  boton.classList.remove("correcta", "incorrecta");
});

  fechaLimite = Date.now() + SEGONS_PER_PREGUNTA * 1000;

  actualizarTiempo();
  temporizador = setInterval(actualizarTiempo, 200);
}

function comprobarRespuesta(indiceElegido) {
  if (respondida) return;

  if (Date.now() >= fechaLimite) {
    indiceElegido = null;
  }

  respondida = true;
  clearInterval(temporizador);

  const actual = preguntas[preguntaActual];

  botones.forEach(boton => {
    boton.disabled = true;
  });

  botones[actual.correcta].classList.add("correcta");

  if (indiceElegido === null) {
    tiempo.textContent = "0 s";
    mensaje.textContent = "S'ha acabat el temps!";
  } else if (indiceElegido === actual.correcta) {
    aciertos++;
    mensaje.textContent = "Resposta correcta!";
  } else {
    botones[indiceElegido].classList.add("incorrecta");

    mensaje.textContent =
      `Resposta incorrecta. La correcta és: ${actual.opciones[actual.correcta]}.`;
  }

  puntos.textContent = `${aciertos}/${preguntas.length}`;

  siguiente.textContent =
    preguntaActual === preguntas.length - 1
      ? "Veure resultats"
      : "Pregunta següent";

  siguiente.hidden = false;
}

function mostrarResultados() {
  clearInterval(temporizador);

  progreso.textContent = "PARTIDA ACABADA";

  pregunta.textContent =
    `Has encertat ${aciertos} de ${preguntas.length} preguntes`;

  tiempo.textContent = "FI";
  tiempo.classList.remove("urgente");

  respuestas.hidden = true;
  siguiente.hidden = true;

  mensaje.textContent = "Gràcies per jugar!";

  reiniciar.hidden = false;
  reiniciar.focus();
}

botones.forEach(boton => {
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
