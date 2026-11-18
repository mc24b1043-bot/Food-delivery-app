import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const List = ({ url }) => {
  const navigate = useNavigate();
  const { token,admin } = useContext(StoreContext);
  const [list, setList] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) setList(response.data.data || []);
      else toast.error(response.data.message || "Could not load the menu.");
      const restaurantResponse = await axios.get(`${url}/api/restaurant/list`);
      if (restaurantResponse.data.success) setRestaurants(restaurantResponse.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not connect to the backend.");
    }
  };

  const removeFood = async (foodId) => {
    try {
    const response = await axios.post(
      `${url}/api/food/remove`,
      { id: foodId },
      { headers: { token } }
    );
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message || "Could not remove this dish.");
    }
    } catch (error) { toast.error(error.response?.data?.message || "Could not remove this dish."); }
  };
  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Restaurant</b>
          <b>Category</b>
          <b>Diet</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{restaurants.find((restaurant) => restaurant._id === item.restaurantId)?.name || "-"}</p>
              <p>{item.category}</p>
              <p>{item.isVeg ? "Veg" : "Non-veg"}</p>
              <p>${item.price}</p>
              <p onClick={() => removeFood(item._id)} className="cursor">
                X
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
