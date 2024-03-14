import { promises as fs } from 'fs';

export class ProductManager {
  constructor(products = []) {
    this.products = products;
    this.nextId = 1;
    this.path = './src/productos.txt'; // Ruta del archivo de productos
  }

  async addProduct(product) {
    const productsData = await fs.readFile('./src/productos.txt', 'utf-8');
		this.products = JSON.parse(productsData);
    
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.error('Todos los campos del producto son obligatorios.');
      return;
    }

    if (this.products.some(p => p.code === product.code)) {
      console.error('Ya existe un producto con el mismo código.');
      return;
    }

    product.id = this.nextId++;
    this.products.push(product);
    console.log('Producto agregado correctamente:', product);
    await this.saveProductsToFile();
  }

  async getProducts() {
    const productsData = await fs.readFile('./src/productos.txt', 'utf-8');
		this.products = JSON.parse(productsData);
  try {
    const productsData = await fs.readFile(this.path, 'utf-8');

    if (productsData.trim() === "") {
      console.log("El archivo de productos está vacío.");
      return [];
    }

    const products = JSON.parse(productsData);
    return products;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return [];
  }
}
  async getProductById(id) {
    const productsData = await fs.readFile('./src/productos.txt', 'utf-8');
		this.products = JSON.parse(productsData);
    try {
      const productsData = await fs.readFile(this.path, 'utf-8');

      if (productsData.trim() === "") {
        console.log("El archivo de productos está vacío.");
        return null;
      }

      const products = JSON.parse(productsData);
      const product = products.find(producto => producto.id === id);

      if (product) {
        console.log(product);
        return product;  // Devolvemos el objeto del producto encontrado
      } else {
        console.log("Producto no encontrado");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      return null;
    }
  }

  async updateProduct(id, updatedProduct){
    const productsData = await fs.readFile('./src/productos.txt', 'utf-8');
		this.products = JSON.parse(productsData);
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updatedProduct };
      await this.saveProductsToFile();
      console.log('Producto actualizado correctamente:', this.products[productIndex]);
    } else {
      console.error('Producto no encontrado.');
    }
  }

  async deleteProduct(id) {
    const productsData = await fs.readFile('./src/productos.txt', 'utf-8');
		this.products = JSON.parse(productsData);
    const initialProductCount = this.products.length;
    this.products = this.products.filter(p => p.id !== id);

    if (this.products.length === initialProductCount) {
      console.error('Producto no encontrado.');
    } else {
      await this.saveProductsToFile();
      console.log('Producto eliminado correctamente.');
    }
  }

  async saveProductsToFile() {
   
    await fs.writeFile(this.path, JSON.stringify(this.products));
  }
}

// Cargar productos desde el archivo tx al crear una instancia de ProductManager
const loadProductsFromFile = async () => {
  try {
   
    return new ProductManager(products);
  } catch (error) {
    return new ProductManager();
  }
};

// Crear una instancia de ProductManager y cargar los productos desde el txt
loadProductsFromFile().then(async (manager) => {
  
  
  // Agregar, obtener, actualizar y eliminar productos aquí

  // agregando productos
  await manager.addProduct({
    title: 'Producto 6',
    description: 'Descripción del Producto 1',
    price: 25.99,
    thumbnail: 'ruta/imagen1.jpg',
    code: 'P6',
    stock: 30
  });

  await manager.addProduct({
    title: 'Producto 6',
    description: 'Descripción del Producto 2',
    price: 256.99,
    thumbnail: 'ruta/imagen3.jpg',
    code: 'P5',
    stock: 30
  });

  

  //await manager.getProductById(1); // Busca producto con ID 1

  await manager.updateProduct(1, { title: 'Producto 1', price:'20000' }); // Actualiza producto con ID 1

  //await manager.deleteProduct(2); // Eliminar producto con ID 1

  const updatedProducts = manager.getProducts(); // Obtener todos los productos actualizados

  console.log('Productos actualizados:', updatedProducts);
});