import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useEffect } from "react";
import {useNavigate } from "react-router-dom";

const Add = ({url}) => {
  const navigate=useNavigate();
  const {token,admin} = useContext(StoreContext);
  const [image, setImage] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
    restaurantId: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("restaurantId", data.restaurantId);
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData, { headers: { token } });
      if (!response.data.success) {
        toast.error(response.data.message || "Could not add this dish.");
        return;
      }
      setData((current) => ({ ...current, name: "", description: "", price: "", category: "Salad" }));
      setImage(false);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not connect to the menu API.");
    }
  };
  useEffect(()=>{
    if(!admin && !token){
      toast.error("Please Login First");
       navigate("/");
    }
    axios.get(`${url}/api/restaurant/list`).then((response) => {
      if (response.data.success) {
        setRestaurants(response.data.data || []);
        setData((current) => ({ ...current, restaurantId: current.restaurantId || response.data.data?.[0]?._id || "" }));
      }
    }).catch(() => toast.error("Could not load restaurants. Start the backend and try again."));
  },[url])
  return (
    <div className="add">
      <form onSubmit={onSubmitHandler} className="flex-col">
        <div className="add-product-name flex-col">
          <p>Restaurant</p>
          {restaurants.length ? (
            <select name="restaurantId" value={data.restaurantId} onChange={onChangeHandler} required>
              {restaurants.map((restaurant) => <option key={restaurant._id} value={restaurant._id}>{restaurant.name}</option>)}
            </select>
          ) : (
            <p>No restaurants yet. Add one from the Restaurants page first.</p>
          )}
        </div>
        <div className="add-img-upload flex-col">
          <p>Upload image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            required
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select
              name="category"
              required
              onChange={onChangeHandler}
              value={data.category}
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Desserts">Desserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
            type="number"
            min="0.01"
            step="0.01"
              name="price"
              placeholder="$20"
              required
            />
          </div>
        </div>
        <button type="submit" className="add-btn" disabled={!restaurants.length}>
          {restaurants.length ? "ADD DISH" : "ADD A RESTAURANT FIRST"}
        </button>
      </form>
    </div>
  );
};

export default Add;
