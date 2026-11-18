import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import RestaurantDisplay from '../../components/RestaurantDisplay/RestaurantDisplay'

const Home = () => {
  const [category,setCategory]=useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("featured");
  const [restaurantId, setRestaurantId] = useState("all");
  const [dietFilter, setDietFilter] = useState("all");
  return (
    <div>
      <Header/>
      <RestaurantDisplay selectedRestaurant={restaurantId} setSelectedRestaurant={setRestaurantId} />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} restaurantId={restaurantId} searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortOrder={sortOrder} setSortOrder={setSortOrder} dietFilter={dietFilter} setDietFilter={setDietFilter}/>
      <AppDownload/>
    </div>
  )
}

export default Home
