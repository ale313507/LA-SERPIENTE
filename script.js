document.addEventListener("DOMContentLoaded", () => {
    const nombreInput = document.getElementById("nombre");
    const startButton = document.getElementById("start");
    const board = document.getElementById("board");
    const apple = document.getElementById("apple");
    const historialBody = document.getElementById("historial-body");
    const clearHistoryButton = document.getElementById("clear-history");
    let snake = [[150, 150]]; // Posición inicial de la serpiente
    let direction = "L";
    let applePosition = [];
    let interval;
    let manzanas = 0;

    // Eventos de teclas
    document.addEventListener("keydown", (e) => {
        const dir = { "ArrowUp": "U", "ArrowDown": "D", "ArrowLeft": "L", "ArrowRight": "R" };
        direction = dir[e.key] || direction;
    });

    // Iniciar el juego
    startButton.addEventListener("click", () => {
        if (!nombreInput.value.trim()) return alert("Ingresa tu nombre");
        startGame();
    });

    // Borrar historial
    clearHistoryButton.addEventListener("click", () => {
        localStorage.removeItem("historial");
        cargarHistorial();
    });

    // Lógica del juego
    function startGame() {
        manzanas = 0;
        snake = [[150, 150]];
        direction = "L";
        generarManzana();
        interval = setInterval(moverSerpiente, 100);
    }

    function moverSerpiente() {
        const [x, y] = snake[0];
        const nuevaPosicion = {
            "L": [x - 10, y], "R": [x + 10, y],
            "U": [x, y - 10], "D": [x, y + 10]
        }[direction];
        snake.unshift(nuevaPosicion);

        if (nuevaPosicion[0] === applePosition[0] && nuevaPosicion[1] === applePosition[1]) {
            manzanas++;
            generarManzana();
        } else {
            snake.pop();
        }

        if (checkCollision(nuevaPosicion)) {
            guardarHistorial(nombreInput.value);
            clearInterval(interval);
            alert("Juego terminado");
        } else {
            dibujarSerpiente();
        }
    }

    function generarManzana() {
        applePosition = [Math.floor(Math.random() * 30) * 10, Math.floor(Math.random() * 30) * 10];
        apple.style.left = `${applePosition[0]}px`;
        apple.style.top = `${applePosition[1]}px`;
    }

    function dibujarSerpiente() {
        board.querySelectorAll(".snake-segment").forEach(seg => seg.remove());
        snake.forEach(([x, y]) => {
            const segment = document.createElement("div");
            segment.className = "snake-segment";
            segment.style.left = `${x}px`;
            segment.style.top = `${y}px`;
            segment.style.backgroundColor = "green";
            board.appendChild(segment);
        });
    }

    function checkCollision([x, y]) {
        return x < 0 || x >= 300 || y < 0 || y >= 300 || snake.slice(1).some(([sx, sy]) => sx === x && sy === y);
    }

    // Historial
    function guardarHistorial(nombre) {
        const historial = JSON.parse(localStorage.getItem("historial")) || [];
        historial.push({ nombre, fecha: new Date().toLocaleString(), manzanas });
        localStorage.setItem("historial", JSON.stringify(historial));
        cargarHistorial();
    }

    function cargarHistorial() {
        const historial = JSON.parse(localStorage.getItem("historial")) || [];
        historialBody.innerHTML = historial.map(({ nombre, fecha, manzanas }) => `
            <tr><td>${nombre}</td><td>${fecha}</td><td>${manzanas}</td></tr>
        `).join("");
    }

    cargarHistorial();
});

