import express from 'express';
import { ProductManager } from './productManager.js';

const app = express();
const PORT = 4000;

const manager = new ProductManager('./src/productos.txt');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hola');
});

app.get('/productos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const product = await manager.getProductById(id);
  if (product) {
    res.send(`Producto encontrado: ${JSON.stringify(product)}`);
  } else {
    res.send('Producto no encontrado');
  }
});

app.get('/productos', async (req, res) => {
  const { limit } = req.query;
  const products = await manager.getProducts();
  if (limit) {
    res.send(products.slice(0, limit));
  } else {
    res.send(products);
  }
});

app.get('*', (req, res) => {
  res.send('Error 404');
});

app.listen(PORT, () => {
  console.log(`Server on PORT: ${PORT}\nhttp://localhost:${PORT}`);
});