import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category, restaurantId, searchTerm, setSearchTerm, sortOrder, setSortOrder }) => {
  const { food_list, restaurants } = useContext(StoreContext);
  const restaurantName = restaurants.find((restaurant) => restaurant._id === restaurantId)?.name;
  const visibleFoods = food_list
    .filter((item) => restaurantId === "all" || item.restaurantId === restaurantId)
    .filter((item) => (category === "All" || category === item.category))
    .filter((item) => `${item.name} ${item.description}`.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortOrder === "price-low" ? a.price - b.price : sortOrder === "price-high" ? b.price - a.price : 0);

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-heading">
        <div><h2>{restaurantName ? `${restaurantName} menu` : "Popular dishes across Amber"}</h2><p>Find something delicious for your next meal.</p></div>
        <div className="food-tools">
          <label className="food-search" id="dish-search"><span aria-hidden="true">Search</span><input aria-label="Search dishes" placeholder="Dishes..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />{searchTerm && <button aria-label="Clear search" onClick={() => setSearchTerm("")}>x</button>}</label>
          <select aria-label="Sort dishes" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select>
        </div>
      </div>
      <div className="food-display-list">
        {visibleFoods.map((item) => {
            return (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                restaurantName={restaurants.find((restaurant) => restaurant._id === item.restaurantId)?.name}
              />
            );
        })}
      </div>
      {visibleFoods.length === 0 && <p className="food-empty">No dishes match that search. Try another name or category.</p>}
    </div>
  );
};

export default FoodDisplay;
