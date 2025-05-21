// ---------- Cambiar entre juegos ----------
function mostrarJuego(juego) {
  document.getElementById("menu").style.display = "none";
  document.getElementById("ahorcado").style.display = "none";
  document.getElementById("gato").style.display = "none";

  if (juego === "ahorcado") {
    iniciarAhorcado();
    document.getElementById("ahorcado").style.display = "block";
  } else if (juego === "gato") {
    iniciarGato();
    document.getElementById("gato").style.display = "block";
  }
}

function volverAlMenu() {
  location.reload();
}

// ---------- Juego del Ahorcado ----------
let palabra = "";
let palabraMostrada = [];
let errores = 0;
let letrasUsadas = [];

function iniciarAhorcado() {
  document.getElementById("form-palabra-secreta").style.display = "block";
  document.getElementById("juego-ahorcado").style.display = "none";
  document.getElementById("palabra-input").value = "";
  document.getElementById("mensaje").textContent = "";
  document.getElementById("imagen").src = "images/ahorcado0.png";
  document.getElementById("input-letra").disabled = false;
  document.querySelector("#juego-ahorcado button").disabled = false;
}

function establecerPalabra() {
  const input = document.getElementById("palabra-input").value.toLowerCase().trim();

  if (!input || input.length === 0 || !/^[a-zñáéíóúü]+$/i.test(input)) {
    alert("Por favor, ingresa una palabra válida (sin números ni símbolos).");
    return;
  }

  palabra = input;
  palabraMostrada = Array(palabra.length).fill("_");
  errores = 0;
  letrasUsadas = [];

  document.getElementById("form-palabra-secreta").style.display = "none";
  document.getElementById("juego-ahorcado").style.display = "block";

  actualizarPantallaAhorcado();
}

function actualizarPantallaAhorcado() {
  document.getElementById("palabra-secreta").textContent = palabraMostrada.join(" ");
  document.getElementById("errores").textContent = errores;
  document.getElementById("letras-usadas").textContent = letrasUsadas.join(", ");
  document.getElementById("mensaje").textContent = "";
  document.getElementById("input-letra").value = "";

  // Cambia la imagen del ahorcado según el número de errores
  document.getElementById("imagen").src = `images/ahorcado${errores}.png`;
}

function adivinarLetra() {
  const input = document.getElementById("input-letra");
  const letra = input.value.toLowerCase();
  input.value = "";

  if (!letra || !/^[a-zñáéíóúü]$/i.test(letra)) {
    alert("Ingresa solo una letra válida.");
    return;
  }

  if (letrasUsadas.includes(letra)) return;

  letrasUsadas.push(letra);

  if (palabra.includes(letra)) {
    for (let i = 0; i < palabra.length; i++) {
      if (palabra[i] === letra) {
        palabraMostrada[i] = letra;
      }
    }
  } else {
    errores++;
  }

  actualizarPantallaAhorcado();
  comprobarEstadoAhorcado();
}

function comprobarEstadoAhorcado() {
  if (!palabraMostrada.includes("_")) {
    document.getElementById("mensaje").textContent = "¡Ganaste!";
    deshabilitarAhorcado();
  } else if (errores >= 6) {
    document.getElementById("mensaje").textContent = `Perdiste. La palabra era "${palabra}"`;
    deshabilitarAhorcado();
  }
}

function deshabilitarAhorcado() {
  document.getElementById("input-letra").disabled = true;
  const botones = document.querySelectorAll("#juego-ahorcado button");
  botones.forEach(btn => {
    if (btn.textContent.toLowerCase().includes("adivinar")) {
      btn.disabled = true;
    }
  });
}

// ---------- Juego del Gato ----------
let turno = "X";
let tablero = ["", "", "", "", "", "", "", "", ""];

function iniciarGato() {
  tablero = ["", "", "", "", "", "", "", "", ""];
  turno = "X";
  const contenedor = document.getElementById("tablero-gato");
  contenedor.innerHTML = "";
  document.getElementById("ganador").textContent = "";

  for (let i = 0; i < 9; i++) {
    const celda = document.createElement("div");
    celda.classList.add("celda");
    celda.dataset.index = i;
    celda.addEventListener("click", jugarGato);
    contenedor.appendChild(celda);
  }
}

function jugarGato(e) {
  const i = e.target.dataset.index;
  if (tablero[i] === "") {
    tablero[i] = turno;
    e.target.textContent = turno;
    if (verificarGanador()) {
      document.getElementById("ganador").textContent = `¡Ganó ${turno}!`;
      deshabilitarTablero();
    } else if (!tablero.includes("")) {
      document.getElementById("ganador").textContent = "Empate";
    } else {
      turno = turno === "X" ? "O" : "X";
    }
  }
}

function verificarGanador() {
  const combinaciones = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return combinaciones.some(comb => {
    const [a, b, c] = comb;
    return tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c];
  });
}

function deshabilitarTablero() {
  document.querySelectorAll(".celda").forEach(celda => {
    celda.removeEventListener("click", jugarGato);
  });
}

function reiniciarGato() {
  iniciarGato();
}
