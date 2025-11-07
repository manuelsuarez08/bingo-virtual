class BingoGame {
    constructor() {
        this.initializeElements();
        this.generateBingoTable();
        this.attachEventListeners();
        this.loadHistory();
    }

    initializeElements() {
        this.sortearBtn = document.getElementById('sortearBtn');
        this.reiniciarBtn = document.getElementById('reiniciarBtn');
        this.bingoWheel = document.getElementById('bingoWheel');
        this.ball = document.getElementById('ball');
        this.ballNumber = document.getElementById('ballNumber');
        this.currentLetter = document.getElementById('currentLetter');
        this.currentNumber = document.getElementById('currentNumber');
        this.numerosRestantes = document.getElementById('numerosRestantes');
        this.historyContainer = document.getElementById('historyContainer');
        this.bingoTableBody = document.getElementById('bingoTableBody');
    }

    generateBingoTable() {
        const ranges = {
            'B': [1, 15],
            'I': [16, 30],
            'N': [31, 45],
            'G': [46, 60],
            'O': [61, 75]
        };

        // Crear 15 filas (máximo de números por columna)
        for (let row = 0; row < 15; row++) {
            const tr = document.createElement('tr');
            
            Object.keys(ranges).forEach(letter => {
                const td = document.createElement('td');
                const [start, end] = ranges[letter];
                const number = start + row;
                
                if (number <= end) {
                    td.textContent = number;
                    td.dataset.number = number;
                    td.classList.add(`col-${letter.toLowerCase()}`);
                } else {
                    td.style.visibility = 'hidden';
                }
                
                tr.appendChild(td);
            });
            
            this.bingoTableBody.appendChild(tr);
        }
    }

    attachEventListeners() {
        this.sortearBtn.addEventListener('click', () => this.sortearNumero());
        this.reiniciarBtn.addEventListener('click', () => this.reiniciarJuego());
    }

    async sortearNumero() {
        try {
            // Deshabilitar botón durante la animación
            this.sortearBtn.disabled = true;
            
            // Animación de la rueda
            this.bingoWheel.classList.add('spinning');
            
            // Ocultar bola anterior
            this.ball.classList.remove('show');
            
            // Esperar un momento para la animación
            await this.delay(1000);
            
            // Hacer petición al servidor
            const response = await fetch('/sortear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al sortear número');
            }

            const data = await response.json();
            
            // Actualizar interfaz
            this.mostrarNumeroSorteado(data.numero, data.letra);
            this.actualizarNumerosRestantes(data.numeros_restantes);
            this.resaltarEnTabla(data.numero);
            this.actualizarHistorial();
            
            // Detener animación de la rueda
            this.bingoWheel.classList.remove('spinning');
            
            // Mostrar bola con animación
            this.ballNumber.textContent = data.numero;
            this.ball.classList.add('show');
            
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
            this.bingoWheel.classList.remove('spinning');
        } finally {
            this.sortearBtn.disabled = false;
        }
    }

    mostrarNumeroSorteado(numero, letra) {
        this.currentLetter.textContent = letra;
        this.currentNumber.textContent = numero;
        
        // Cambiar color de la bola según la letra
        const colors = {
            'B': '#ff6b6b',
            'I': '#4ecdc4',
            'N': '#45b7d1',
            'G': '#96ceb4',
            'O': '#feca57'
        };
        
        this.ball.style.background = `radial-gradient(circle at 30% 30%, #fff, ${colors[letra]})`;
    }

    actualizarNumerosRestantes(cantidad) {
        this.numerosRestantes.textContent = cantidad;
        
        if (cantidad === 0) {
            this.sortearBtn.disabled = true;
            this.sortearBtn.textContent = '🎉 Juego Completado';
        }
    }

    resaltarEnTabla(numero) {
        const cell = document.querySelector(`td[data-number="${numero}"]`);
        if (cell) {
            cell.classList.add('sorteado');
        }
    }

    async actualizarHistorial() {
        try {
            const response = await fetch('/historial');
            const data = await response.json();
            
            this.mostrarHistorial(data.historial);
        } catch (error) {
            console.error('Error al cargar historial:', error);
        }
    }

    mostrarHistorial(historial) {
        if (historial.length === 0) {
            this.historyContainer.innerHTML = '<p class="no-history">Aún no se han sorteado números</p>';
            return;
        }

        this.historyContainer.innerHTML = '';
        
        // Mostrar solo los últimos 20 números para no sobrecargar la interfaz
        const numerosAMostrar = historial.slice(0, 20);
        
        numerosAMostrar.forEach((numero, index) => {
            const span = document.createElement('span');
            span.className = 'history-number';
            span.textContent = numero;
            
            // Resaltar el último número sorteado
            if (index === 0) {
                span.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
                span.style.transform = 'scale(1.1)';
            }
            
            this.historyContainer.appendChild(span);
        });
    }

    async reiniciarJuego() {
        if (!confirm('¿Estás seguro de que quieres reiniciar el juego?')) {
            return;
        }

        try {
            const response = await fetch('/reiniciar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al reiniciar el juego');
            }

            // Reiniciar interfaz
            this.currentLetter.textContent = '-';
            this.currentNumber.textContent = '--';
            this.ballNumber.textContent = '?';
            this.numerosRestantes.textContent = '75';
            this.ball.classList.remove('show');
            
            // Limpiar tabla
            document.querySelectorAll('.bingo-table td.sorteado').forEach(cell => {
                cell.classList.remove('sorteado');
            });
            
            // Limpiar historial
            this.historyContainer.innerHTML = '<p class="no-history">Aún no se han sorteado números</p>';
            
            // Rehabilitar botón
            this.sortearBtn.disabled = false;
            this.sortearBtn.textContent = '🎲 Sortear Número';
            
            alert('Juego reiniciado correctamente');
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error al reiniciar el juego');
        }
    }

    async loadHistory() {
        await this.actualizarHistorial();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new BingoGame();
});