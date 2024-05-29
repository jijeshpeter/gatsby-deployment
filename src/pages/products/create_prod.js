import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../../Assets/CSS/CreateProductForm.css"; // Assuming you will create this CSS file for styling
import { navigate } from "gatsby";

const CreateProductForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (data) => {
    try {
      let uploadedImageId = null;
      // Check if an image is selected
      if (data.p_img.length > 0) {
        // Upload the image
        const formData = new FormData();
        formData.append("files", data.p_img[0]);

        const uploadRes = await axios.post(
          "http://localhost:1337/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Get the uploaded image ID
        uploadedImageId = uploadRes.data[0].id;
      }

      // Create the product with the uploaded image reference (if any)
      const response = await axios.post(
        "http://localhost:1337/api/products",
        {
          data: {
            p_name: data.p_name,
            p_qty: data.p_qty,
            p_price: data.p_price,
            p_desc: data.p_desc,
            p_img: uploadedImageId,
          },
        },
        {
          headers: {},
        }
      );

      setSuccess("Product created successfully!");
      setError("");
      reset();
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setSuccess("");
    }
  };

  return (
    <div className="create-product-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            {...register("p_name", { required: "Product name is required" })}
          />
          {errors.p_name && (
            <p style={{ color: "red" }}>{errors.p_name.message}</p>
          )}
        </div>
        <div>
          <label>Product Quantity:</label>
          <input
            type="number"
            {...register("p_qty", { required: "Product quantity is required" })}
          />
          {errors.p_qty && (
            <p style={{ color: "red" }}>{errors.p_qty.message}</p>
          )}
        </div>
        <div>
          <label>Product Price:</label>
          <input
            type="number"
            {...register("p_price", { required: "Product price is required" })}
          />
          {errors.p_price && (
            <p style={{ color: "red" }}>{errors.p_price.message}</p>
          )}
        </div>
        <div>
          <label>Product Description:</label>
          <textarea
            {...register("p_desc", {
              required: "Product description is required",
            })}
          />
          {errors.p_desc && (
            <p style={{ color: "red" }}>{errors.p_desc.message}</p>
          )}
        </div>
        <div>
          <label>Product Image:</label>
          <input type="file" {...register("p_img")} />
          {errors.p_img && (
            <p style={{ color: "red" }}>{errors.p_img.message}</p>
          )}
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProductForm;
