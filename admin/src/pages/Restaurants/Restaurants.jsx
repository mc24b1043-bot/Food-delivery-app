import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import "./Restaurants.css";

const blankForm = { name: "", cuisine: "", description: "", deliveryTime: "25-35 min" };

const Restaurants = ({ url }) => {
  const { token } = useContext(StoreContext);
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [saving, setSaving] = useState(false);

  const loadRestaurants = async () => {
    try {
      const response = await axios.get(`${url}/api/restaurant/list`);
      if (response.data.success) setRestaurants(response.data.data || []);
      else toast.error(response.data.message || "Could not load restaurants.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not connect to the backend.");
    }
  };

  useEffect(() => { loadRestaurants(); }, [url]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await axios.post(`${url}/api/restaurant/add`, form, { headers: { token } });
      if (!response.data.success) {
        toast.error(response.data.message || "Could not add this restaurant.");
        return;
      }
      toast.success(response.data.message);
      setForm(blankForm);
      await loadRestaurants();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add this restaurant.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="restaurant-admin">
      <header className="restaurant-admin-heading">
        <span>PARTNER MANAGEMENT</span>
        <h1>Restaurants</h1>
        <p>Add a restaurant first, then attach its dishes from Add Items.</p>
      </header>
      <div className="restaurant-admin-layout">
        <form className="restaurant-form" onSubmit={submit}>
          <h2>Add a restaurant</h2>
          <label>Restaurant name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Cedar & Spice" required /></label>
          <label>Cuisine<input value={form.cuisine} onChange={(event) => setForm({ ...form, cuisine: event.target.value })} placeholder="e.g. North Indian" required /></label>
          <label>Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What makes this restaurant special?" rows="4" required /></label>
          <label>Delivery estimate<input value={form.deliveryTime} onChange={(event) => setForm({ ...form, deliveryTime: event.target.value })} placeholder="25-35 min" required /></label>
          <button disabled={saving}>{saving ? "Adding..." : "Add restaurant"}</button>
        </form>
        <section className="restaurant-admin-list">
          <div className="restaurant-admin-list-heading"><h2>Partner kitchens</h2><span>{restaurants.length} total</span></div>
          {restaurants.map((restaurant) => (
            <article className="restaurant-admin-row" key={restaurant._id}>
              <img src={`${url}/images/${restaurant.image}`} alt="" />
              <div><h3>{restaurant.name}</h3><p>{restaurant.cuisine}</p><small>{restaurant.deliveryTime || "25-35 min"}</small></div>
              <b>{restaurant.itemCount || 0} dishes</b>
            </article>
          ))}
          {!restaurants.length && <p className="restaurant-admin-empty">No restaurants yet. Create the first one here.</p>}
        </section>
      </div>
    </main>
  );
};

export default Restaurants;
