const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export const getUsers = () => {
  return apiRequest("/api/users");
};

export const getProducts = () => {
  return apiRequest("/api/products");
};

export const getOrders = () => {
  return apiRequest("/api/orders");
};

export const createOrder = (userId, productId, quantity) => {
  return apiRequest("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      userId,
      productId,
      quantity,
    }),
  });
};