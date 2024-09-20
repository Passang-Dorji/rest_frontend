"use client"
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { MenuItems } from '@/app/model/meni_item';
import { getMenuItemsByRestaurantId } from '@/app/service/menu_item';

const MenuItemsPage = () => {
  const searchParams = useSearchParams();
  const restaurant_id  = searchParams.get('restaurant_id') // Get restaurant_id from query parameter
  const table_number = searchParams.get('table_number');   // Get table number from query parameters

  const [menuItems, setMenuItems] = useState<MenuItems[]>([]);

  useEffect(() => {
    if (restaurant_id) {
      // Fetch menu items for the specific restaurant
      const data = getMenuItemsByRestaurantId(restaurant_id)
        .then((data) => {
          setMenuItems(data.data); // Assuming the API response has menu_items field
        })
        .catch((error) => {
          console.error("Error fetching menu items:", error);
        });
    }
  }, [restaurant_id]);

  if (!restaurant_id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
    <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Menu Items for Restaurant {restaurant_id} (Table{table_number})</h1>
    {menuItems.length === 0 ? (
      <p className="text-lg text-center text-gray-500">No menu items available</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{item.item_name}</h2>
            <p className="text-gray-600 mb-4">{item.item_description}</p>
            <p className="text-lg font-bold text-red-500">${item.price}</p>
          </div>
        ))}
      </div>
    )}
  </div>  
  );
};

export default MenuItemsPage;
