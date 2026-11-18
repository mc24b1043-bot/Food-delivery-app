import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = import.meta.env.VITE_API_URL || "http://127.0.0.1:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    if (token) {
      try {
        const response = await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        if (!response.data.success) throw new Error(response.data.message || "Could not add item to cart.");
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || "Could not add item to cart.");
        return;
      }
    }
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const removeFromCart = async (itemId) => {
    if (token) {
      try {
        const response = await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        if (!response.data.success) throw new Error(response.data.message || "Could not remove item.");
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || "Could not remove item.");
        return;
      }
    }
    setCartItems((prev) => {
      const next = { ...prev };
      if ((next[itemId] || 0) <= 1) delete next[itemId];
      else next[itemId] -= 1;
      return next;
    });
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    if (!response.data.success) throw new Error(response.data.message || "Menu could not load.");
    setFoodList(response.data.data || []);
  };

  const syncCart = async (accountToken) => {
    const response = await axios.post(url + "/api/cart/get", {}, { headers: { token: accountToken } });
    if (!response.data.success) throw new Error(response.data.message || "Could not load your cart.");
    const mergedCart = { ...response.data.cartData };
    for (const [itemId, localQuantity] of Object.entries(cartItems)) {
      const missingQuantity = Math.max(0, localQuantity - (mergedCart[itemId] || 0));
      for (let count = 0; count < missingQuantity; count += 1) {
        const addResponse = await axios.post(url + "/api/cart/add", { itemId }, { headers: { token: accountToken } });
        if (!addResponse.data.success) break;
        mergedCart[itemId] = (mergedCart[itemId] || 0) + 1;
      }
    }
    setCartItems(mergedCart);
  };

  useEffect(() => {
    async function loadData() {
      try {
        await fetchFoodList();
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not connect to the menu API. Start the backend and refresh.");
      }
      if (localStorage.getItem("token")) {
        const savedToken = localStorage.getItem("token");
        setToken(savedToken);
        try { await syncCart(savedToken); } catch { localStorage.removeItem("token"); setToken(""); }
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    syncCart,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
