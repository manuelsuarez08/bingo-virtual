from flask import Flask, render_template, jsonify, request
import sqlite3
import random
import os

app = Flask(__name__)

# Configuración de la base de datos
DATABASE = 'bingo.db'

def init_db():
    """Inicializar la base de datos"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Crear tabla para números sorteados
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS numeros_sorteados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero INTEGER NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Crear tabla para estado del juego
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS estado_juego (
            id INTEGER PRIMARY KEY,
            numeros_disponibles TEXT NOT NULL
        )
    ''')
    
    # Inicializar números disponibles si no existen
    cursor.execute('SELECT COUNT(*) FROM estado_juego')
    if cursor.fetchone()[0] == 0:
        numeros_disponibles = ','.join(map(str, range(1, 76)))
        cursor.execute('INSERT INTO estado_juego (id, numeros_disponibles) VALUES (1, ?)', 
                      (numeros_disponibles,))
    
    conn.commit()
    conn.close()

def get_numeros_disponibles():
    """Obtener números disponibles"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('SELECT numeros_disponibles FROM estado_juego WHERE id = 1')
    result = cursor.fetchone()
    conn.close()
    
    if result and result[0]:
        return list(map(int, result[0].split(',')))
    return []

def actualizar_numeros_disponibles(numeros):
    """Actualizar números disponibles"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    numeros_str = ','.join(map(str, numeros)) if numeros else ''
    cursor.execute('UPDATE estado_juego SET numeros_disponibles = ? WHERE id = 1', 
                  (numeros_str,))
    conn.commit()
    conn.close()

def guardar_numero_sorteado(numero):
    """Guardar número sorteado en la base de datos"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('INSERT INTO numeros_sorteados (numero) VALUES (?)', (numero,))
    conn.commit()
    conn.close()

def obtener_historial():
    """Obtener historial de números sorteados"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('SELECT numero FROM numeros_sorteados ORDER BY timestamp DESC')
    numeros = [row[0] for row in cursor.fetchall()]
    conn.close()
    return numeros

@app.route('/')
def index():
    """Página principal"""
    return render_template('index.html')

@app.route('/sortear', methods=['POST'])
def sortear_numero():
    """Sortear un número aleatorio"""
    numeros_disponibles = get_numeros_disponibles()
    
    if not numeros_disponibles:
        return jsonify({'error': 'No hay más números disponibles'}), 400
    
    # Seleccionar número aleatorio
    numero_sorteado = random.choice(numeros_disponibles)
    
    # Remover el número de los disponibles
    numeros_disponibles.remove(numero_sorteado)
    actualizar_numeros_disponibles(numeros_disponibles)
    
    # Guardar en historial
    guardar_numero_sorteado(numero_sorteado)
    
    # Determinar la letra correspondiente
    if 1 <= numero_sorteado <= 15:
        letra = 'B'
    elif 16 <= numero_sorteado <= 30:
        letra = 'I'
    elif 31 <= numero_sorteado <= 45:
        letra = 'N'
    elif 46 <= numero_sorteado <= 60:
        letra = 'G'
    else:
        letra = 'O'
    
    return jsonify({
        'numero': numero_sorteado,
        'letra': letra,
        'numeros_restantes': len(numeros_disponibles)
    })

@app.route('/historial')
def historial():
    """Obtener historial de números sorteados"""
    return jsonify({'historial': obtener_historial()})

@app.route('/reiniciar', methods=['POST'])
def reiniciar_juego():
    """Reiniciar el juego"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Limpiar historial
    cursor.execute('DELETE FROM numeros_sorteados')
    
    # Reiniciar números disponibles
    numeros_disponibles = ','.join(map(str, range(1, 76)))
    cursor.execute('UPDATE estado_juego SET numeros_disponibles = ? WHERE id = 1', 
                  (numeros_disponibles,))
    
    conn.commit()
    conn.close()
    
    return jsonify({'mensaje': 'Juego reiniciado correctamente'})

if __name__ == '__main__':
    init_db()
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)