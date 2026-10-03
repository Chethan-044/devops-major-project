import { useEffect, useState } from "react";
import {
  getUsers,
  getProducts,
  getOrders,
  createOrder,
} from "./api/api";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersData, productsData, ordersData] = await Promise.all([
        getUsers(),
        getProducts(),
        getOrders(),
      ]);

      setUsers(usersData);
      setProducts(productsData);
      setOrders(ordersData);

      if (usersData.length > 0) {
        setSelectedUser(String(usersData[0].id));
      }

      if (productsData.length > 0) {
        setSelectedProduct(String(productsData[0].id));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load data from backend services.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (event) => {
    event.preventDefault();

    try {
      setMessage("");
      setError("");

      const order = await createOrder(
        Number(selectedUser),
        Number(selectedProduct),
        Number(quantity)
      );

      setMessage(
        `Order #${order.id} created successfully. Total: ₹${order.total_price}`
      );

      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
    } catch (err) {
      console.error(err);
      setError("Failed to create order.");
    }
  };

  if (loading) {
    return (
      <div className="app">
        <h1>E-Commerce Platform</h1>
        <p>Loading data from microservices...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>E-Commerce Platform</h1>
        <p>React + Microservices + Kubernetes</p>
      </header>

      {error && <div className="message error">{error}</div>}

      {message && <div className="message success">{message}</div>}

      <section className="section">
        <h2>Products</h2>

        <div className="products">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <h3>{product.name}</h3>

              <p>{product.description}</p>

              <strong>
                ₹{product.price.toLocaleString("en-IN")}
              </strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Create Order</h2>

        <form className="order-form" onSubmit={handleCreateOrder}>
          <label>
            User

            <select
              value={selectedUser}
              onChange={(event) => setSelectedUser(event.target.value)}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </label>

          <label>
            Product

            <select
              value={selectedProduct}
              onChange={(event) => setSelectedProduct(event.target.value)}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ₹{product.price}
                </option>
              ))}
            </select>
          </label>

          <label>
            Quantity

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </label>

          <button type="submit">
            Place Order
          </button>
        </form>
      </section>

      <section className="section">
        <h2>Orders</h2>

        <div className="orders">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <h3>Order #{order.id}</h3>

              <p>
                User ID: {order.user_id}
              </p>

              <p>
                Product ID: {order.product_id}
              </p>

              <p>
                Quantity: {order.quantity}
              </p>

              <strong>
                Total: ₹{order.total_price.toLocaleString("en-IN")}
              </strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;