import React, { useEffect, useState } from "react";
import { navigate } from "gatsby";
import axios from "axios";

const UpdateProduct = ({ params }) => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/products/${params.slug}`
        );
        setProduct(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      }
    };

    fetchProduct();
  }, []);

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:1337/api/products/${params.id}`, {
        data: product.attributes,
      });
      navigate("/products/fetch_prod"); // Redirect to another page after successful update
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      attributes: {
        ...prevProduct.attributes,
        [name]: value,
      },
    }));
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleUpdate}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            name="p_name"
            value={product.attributes.p_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Product Quantity:</label>
          <input
            type="number"
            name="p_qty"
            value={product.attributes.p_qty}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Product Price:</label>
          <input
            type="number"
            name="p_price"
            value={product.attributes.p_price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Product Description:</label>
          <textarea
            name="p_desc"
            value={product.attributes.p_desc}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default UpdateProduct;
