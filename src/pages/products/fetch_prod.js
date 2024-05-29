import React, { useEffect, useState } from "react";
import { Link, navigate } from "gatsby";
import axios from "axios";
import "../../Assets/CSS/ProductTable.css"; // Assuming you will create this CSS file for styling

const FetchProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://promising-cat-680b70d2aa.strapiapp.com/api/products?populate=*",
          {}
        );

        setProducts(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      }
    };
    fetchProducts();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:1337/api/products/${productId}`, {});

      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleUpdate = (productId) => {
    navigate(`/products/${productId}`);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.attributes.p_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.attributes.p_desc
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="product-table">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or description"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Product Quantity</th>
            <th>Product Price</th>
            <th>Product Description</th>
            <th>Product Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>
                <Link to={`/products/${product.attributes.id}`}>
                  {product.attributes.p_name}
                </Link>
              </td>
              <td>{product.attributes.p_qty}</td>
              <td>{product.attributes.p_price}</td>
              <td>{product.attributes.p_desc}</td>
              <td>
                {product.attributes.p_img.data && (
                  <img
                    src={`${product.attributes.p_img.data.attributes.url}`}
                    alt={product.attributes.p_name}
                    width="100"
                  />
                )}
              </td>
              <td>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
                <button onClick={() => handleUpdate(product.id)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FetchProducts;
