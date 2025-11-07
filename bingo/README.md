# 🎱 Bingo Virtual Interactivo

Una aplicación web completa para simular un juego de bingo en tiempo real con interfaz visual atractiva y animaciones.

## 🚀 Características

- **Rueda de Bingo Animada**: Animación de rueda giratoria que simula el sorteo
- **Visualización de Bolas**: Presentación visual de bolas con números sorteados
- **Tabla Interactiva**: Tabla completa de bingo con resaltado dinámico de números sorteados
- **Base de Datos SQLite**: Almacenamiento persistente del estado del juego
- **Historial Completo**: Seguimiento de todos los números sorteados
- **Diseño Responsivo**: Adaptable a diferentes dispositivos
- **Interfaz Intuitiva**: Fácil de usar para jugadores de todas las edades

## 🛠️ Tecnologías Utilizadas

- **Backend**: Python con Flask
- **Base de Datos**: SQLite
- **Frontend**: HTML5, CSS3, JavaScript
- **Animaciones**: CSS Animations y JavaScript

## 📋 Instalación y Uso

### Prerrequisitos
- Python 3.7 o superior
- pip (gestor de paquetes de Python)

### Pasos de Instalación

1. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Ejecutar la aplicación**:
   ```bash
   python app.py
   ```

3. **Abrir en el navegador**:
   - Ir a `http://localhost:5000`

## 🎮 Cómo Jugar

1. **Iniciar el Juego**: Abre la aplicación en tu navegador
2. **Sortear Números**: Haz clic en "🎲 Sortear Número" para obtener un número aleatorio
3. **Visualizar Resultados**: 
   - La rueda girará y mostrará una animación
   - El número sorteado aparecerá en una bola
   - El número se resaltará automáticamente en la tabla de bingo
4. **Seguir el Historial**: Todos los números sorteados aparecen en el historial
5. **Reiniciar**: Usa "🔄 Reiniciar Juego" para comenzar una nueva partida

## 📊 Estructura del Proyecto

```
bingo/
├── app.py                 # Aplicación Flask principal
├── requirements.txt       # Dependencias de Python
├── bingo.db              # Base de datos SQLite (se crea automáticamente)
├── templates/
│   └── index.html        # Plantilla HTML principal
└── static/
    ├── css/
    │   └── style.css     # Estilos CSS
    └── js/
        └── app.js        # Lógica JavaScript
```

## 🎨 Características de la Interfaz

### Rueda de Bingo
- Animación de rotación suave
- Colores vibrantes temáticos
- Efecto visual atractivo

### Tabla de Bingo
- **Columna B**: Números 1-15 (Rojo)
- **Columna I**: Números 16-30 (Turquesa)
- **Columna N**: Números 31-45 (Azul)
- **Columna G**: Números 46-60 (Verde)
- **Columna O**: Números 61-75 (Amarillo)

### Resaltado Dinámico
- Cambio de color de fondo inmediato
- Animación de destello al sortear
- Borde destacado para mayor visibilidad

## 🔧 Funcionalidades Técnicas

### Backend (Flask)
- Generación aleatoria de números únicos
- Gestión de estado del juego en SQLite
- API REST para comunicación con frontend
- Validación de números disponibles

### Frontend (JavaScript)
- Animaciones CSS y JavaScript
- Comunicación asíncrona con el backend
- Actualización dinámica de la interfaz
- Manejo de estados del juego

### Base de Datos
- Tabla `numeros_sorteados`: Historial de números
- Tabla `estado_juego`: Números disponibles
- Persistencia automática del estado

## 🎯 Casos de Uso

- **Eventos Virtuales**: Perfecto para bingos online
- **Eventos Presenciales**: Proyección en pantallas grandes
- **Entretenimiento Familiar**: Juegos caseros
- **Eventos Corporativos**: Actividades de team building

## 🔄 Flujo del Juego

1. Usuario abre la aplicación
2. Se muestra la rueda, botones y tabla completa
3. Usuario hace clic en "Sortear Número"
4. Rueda gira con animación
5. Número se muestra en bola animada
6. Número se resalta en la tabla
7. Se actualiza el historial
8. Proceso se repite hasta completar todos los números
9. Opción de reiniciar para nueva partida

## 📱 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Desktop, Tablet, Móvil
- **Sistemas**: Windows, macOS, Linux

## 🎨 Personalización

El diseño es fácilmente personalizable modificando:
- **Colores**: En `static/css/style.css`
- **Animaciones**: Duración y efectos en CSS y JavaScript
- **Rangos de Números**: En `app.py` (actualmente 1-75)
- **Estilos de Tabla**: Colores y efectos de resaltado