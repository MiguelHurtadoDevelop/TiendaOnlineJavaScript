const { createApp } = Vue
    
        createApp({
            data() {
                return {
                    Productos: [],
                    ProductosCarrito: JSON.parse(localStorage.getItem('carrito')) || [],
                    categorias: ["home","men's clothing", 'jewelery', 'electronics', "women's clothing"],
                    ProductoDetalles: [],
                    mostrandoDetalles: false,
                    mostrandoCarrito: false,
                    mostrandoMenu: false,
                    mostrandoHome: true,
                    isLoading: false,
                    PedidoRealizado: "",
                }
            },
            methods: {
                gestionarMenu() {
                    this.mostrandoMenu = !this.mostrandoMenu;
                },
                
                buscarProductos(categoria) {
                    if (categoria === 'home') {
                        this.mostrandoHome = true;
                        this.mostrandoMenu = false;
                        this.mostrandoDetalles = false;
                        this.mostrandoCarrito = false;
                    }else{
                        this.isLoading = true;
                        this.mostrandoHome = false;
                        this.mostrandoMenu = false;
                        this.mostrandoDetalles = false;
                        this.mostrandoCarrito = false;
                        fetch(`https://fakestoreapi.com/products/category/${categoria}`)
                            .then(response => response.json())
                            .then(data => {
                                this.Productos = data;
                                this.isLoading = false;
                            });
                    }
                    
                        
                },

                mostrarDetalles(producto) {
                    this.mostrandoDetalles = true;
                    fetch(`https://fakestoreapi.com/products/${producto}`)
                        .then(response => response.json())
                        .then(data => {
                            this.ProductoDetalles = data;
                        });
                },
                ordenarProductos(orden) {
                    if (orden === 'nombreAsc') {
                        this.Productos.sort((a, b) => a.title.localeCompare(b.title));
                    } else if (orden === 'nombreDesc') {
                        this.Productos.sort((a, b) => b.title.localeCompare(a.title));
                    } else if (orden === 'precioAsc') {
                        this.Productos.sort((a, b) => a.price - b.price);
                    } else if (orden === 'precioDesc') {
                        this.Productos.sort((a, b) => b.price - a.price);
                    }
                },
                
                añadirAlCarrito(producto) {
                    this.PedidoRealizado = "";
                    let productoEnCarrito = this.ProductosCarrito.find(item => item.id === producto.id);
                    if (productoEnCarrito) {
                        productoEnCarrito.cantidad++;
                        productoEnCarrito.total = productoEnCarrito.cantidad * productoEnCarrito.price;
                    } else {
                        this.ProductosCarrito.push({ ...producto, cantidad: 1, total: producto.price });
                    }
                    this.calcularTotalCarrito();
                    this.guardarCarrito();
                },
                calcularTotalCarrito() {
                    this.totalCarrito = this.ProductosCarrito.reduce((total, producto) => total + producto.total, 0);
                },
                modificarCantidad(producto, cantidad) {
                    let productoEnCarrito = this.ProductosCarrito.find(item => item.id === producto.id);
                    if (productoEnCarrito) {
                        productoEnCarrito.cantidad = cantidad;
                        productoEnCarrito.total = productoEnCarrito.cantidad * productoEnCarrito.price;
                        this.calcularTotalCarrito();
                        this.guardarCarrito();
                    }
                },
                eliminarDelCarrito(producto) {
                    let index = this.ProductosCarrito.findIndex(item => item.id === producto.id);
                    if (index !== -1) {
                        this.ProductosCarrito.splice(index, 1);
                        this.calcularTotalCarrito();
                        this.guardarCarrito();
                    }
                },
                guardarCarrito() {
                    localStorage.setItem('carrito', JSON.stringify(this.ProductosCarrito));
                },
                comprar() {
                    this.PedidoRealizado = "Pedido realizado con éxito";
                    this.ProductosCarrito = [];
                    this.calcularTotalCarrito();
                    this.guardarCarrito();
                    
                }

            },
            mounted() {
                this.buscarProductos(this.categorias[0]);
                this.calcularTotalCarrito();
            }
        }).mount('#Tienda')