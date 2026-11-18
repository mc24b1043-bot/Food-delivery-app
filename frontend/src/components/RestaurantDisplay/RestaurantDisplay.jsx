import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./RestaurantDisplay.css";

const RestaurantDisplay = ({ selectedRestaurant, setSelectedRestaurant }) => {
  const { restaurants, food_list, url } = useContext(StoreContext);

  return (
    <section className="restaurant-section" id="restaurants">
      <div className="restaurant-section-heading">
        <div>
          <span className="restaurant-eyebrow">GOOD FOOD, CLOSE BY</span>
          <h2>Choose a restaurant</h2>
          <p>Browse local kitchens, then explore each restaurant's full menu.</p>
        </div>
        <span className="restaurant-count">{restaurants.length} kitchens</span>
      </div>
      <div className="restaurant-grid">
        <button className={`restaurant-card restaurant-all ${selectedRestaurant === "all" ? "selected" : ""}`} onClick={() => setSelectedRestaurant("all")}>
          <span className="restaurant-all-icon">A</span>
          <span className="restaurant-card-copy">
            <strong>All restaurants</strong>
            <small>{food_list.length} dishes to explore</small>
          </span>
          <span className="restaurant-arrow" aria-hidden="true">→</span>
        </button>
        {restaurants.map((restaurant) => {
          const itemCount = food_list.filter((food) => food.restaurantId === restaurant._id).length;
          return (
            <button
              className={`restaurant-card ${selectedRestaurant === restaurant._id ? "selected" : ""}`}
              key={restaurant._id}
              onClick={() => setSelectedRestaurant(restaurant._id)}
              aria-pressed={selectedRestaurant === restaurant._id}
            >
              <img className="restaurant-cover" src={`${url}/images/${restaurant.image}`} alt="" />
              <span className="restaurant-card-copy">
                <strong>{restaurant.name}</strong>
                <small>{restaurant.cuisine} · {itemCount || restaurant.itemCount || 0} dishes</small>
                <small>★ {restaurant.rating || "4.5"} · {restaurant.deliveryTime || "25-35 min"}</small>
              </span>
              <span className="restaurant-arrow" aria-hidden="true">→</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default RestaurantDisplay;
