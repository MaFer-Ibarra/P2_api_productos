# API de Productos

API REST hecha con Node.js y Express para administrar productos (CRUD).
Responde en JSON con los códigos de estado HTTP correctos.

> ### Integrantes
> - **Integrante 1:** Ibarra Ibarra Maria Fernanda · 232310080
> - **Integrante 2:** Nombre Apellido · 232310
>
> **Materia:** Programación Web · Grupo 4X7B
> **Docente:** Dra. María Guadalupe Flores Luevanos

## Instalación

```bash
npm install
npm start
```

El servidor queda en http://localhost:3000

## Rutas

| Método | Ruta | Acción | Respuesta correcta | Posibles errores |
|---|---|---|---|---|
| GET | /api/productos | Listar todos | 200 + arreglo | — |
| GET | /api/productos/:id | Ver uno | 200 + objeto | 404 |
| POST | /api/productos | Crear | 201 + objeto creado | 400 |
| PUT | /api/productos/:id | Actualizar | 200 + objeto actualizado | 400, 404 |
| DELETE | /api/productos/:id | Eliminar | 204 sin contenido | 404 |

## Ejemplo

**Petición**

```
POST /api/productos
Content-Type: application/json

{"nombre":"Monitor","precio":2500,"stock":5}
```

**Respuesta (201)**

```json
{"id":3,"nombre":"Monitor","precio":2500,"stock":5}
```