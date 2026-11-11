const express = require("express");
const cors = require("cors");

const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ARCHIVO = path.join(__dirname, "productos.json");

function cargarProductos() {
  try {
    const texto = fs.readFileSync(ARCHIVO, "utf8");
    return JSON.parse(texto);
  } catch (error) {
    // sino existe, usar ejemplos
    return [
      { id: 1, nombre: "Teclado", precio: 350, stock: 10 },
      { id: 2, nombre: "Mouse", precio: 180, stock: 25 }
    ];
  }
}

function guardarProductos() {
  fs.writeFileSync(ARCHIVO, JSON.stringify(productos, null, 2));
}

let productos = cargarProductos();
let siguienteId = productos.length > 0
  ? Math.max(...productos.map(p => p.id)) + 1
  : 1;

guardarProductos(); // crear archivo si no existe

app.get("/", (req, res) => {
  res.json({ mensaje: "API de productos funcionando" });
});


// rutas de lectura GET
// Listar todos
app.get("/api/productos", (req, res) => {
  const { buscar } = req.query;

  if (buscar) {
    const texto = String(buscar).toLowerCase();
    const resultado = productos.filter(p =>
      p.nombre.toLowerCase().includes(texto)
    );
    return res.status(200).json(resultado);
  }

  res.status(200).json(productos);
});

// Ver uno por id
app.get("/api/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: `No existe el producto ${id}` });
  }

  res.status(200).json(producto);
});

// validar y crear POST
function validar(datos) {
  const errores = [];
  if (!datos.nombre || typeof datos.nombre !== "string")
    errores.push("nombre es obligatorio");
  if (typeof datos.precio !== "number" || datos.precio < 0)
    errores.push("precio debe ser un número positivo");
  if (!Number.isInteger(datos.stock) || datos.stock < 0)
    errores.push("stock debe ser un entero positivo");
  return errores;
}

app.post("/api/productos", (req, res) => {
  const errores = validar(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  const nuevo = { id: siguienteId++, ...req.body };
  productos.push(nuevo);
  guardarProductos();
  res.status(201).json(nuevo);
});

// actualizar PUT y eliminar DELETE
// Actualizar
app.put("/api/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = productos.findIndex(p => p.id === id);

  if (indice === -1)
    return res.status(404).json({ error: `No existe el producto ${id}` });

  const errores = validar(req.body);
  if (errores.length > 0)
    return res.status(400).json({ errores });

  productos[indice] = { id, ...req.body };
  guardarProductos();
  res.status(200).json(productos[indice]);
});

// Eliminar
app.delete("/api/productos/:id", (req, res) => {
  const id = Number(req.params.id);
  const existe = productos.some(p => p.id === id);

  if (!existe)
    return res.status(404).json({ error: `No existe el producto ${id}` });

  productos = productos.filter(p => p.id !== id);
  guardarProductos();
  res.status(204).send();
});

// Ruta no encontrada
app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));