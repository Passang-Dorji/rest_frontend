"use client";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { MenuItems } from '@/app/model/meni_item';
import { getMenuItemsByRestaurantId } from '@/app/service/menu_item';
import { createSession } from '@/app/service/session';
import { useForm } from "react-hook-form";
import { OrderFormValues } from "@/app/model/order";
import { createOrder } from "@/app/service/order";

const MenuItemsPage = () => {
  const searchParams = useSearchParams();
  const restaurant_id  = searchParams.get('restaurant_id'); // Get restaurant_id from query parameter
  const table_number = searchParams.get('table_number'); // Get table number from query parameters
  const table_id = searchParams.get('table_id'); // Get table ID from URL

  const [newSession, setNewSession] = useState<any>(null); // Adjust type accordingly
  const [cart, setCart] = useState<any[]>([]); // To store items in cart
  const [menuItems, setMenuItems] = useState<MenuItems[]>([]);

  const { register, handleSubmit } = useForm<OrderFormValues>({
    defaultValues: {
      orderLists: []
    }
  });

  useEffect(() => {
    if (table_id) {
      createSession(table_id)
        .then((data) => {
          setNewSession(data);
          alert("Session created successfully"); 
        })
        .catch((error) => {
          console.error("Error creating session:", error);
        });
      }
    }, [table_id]);
  useEffect(() => {
    if (restaurant_id) {
      getMenuItemsByRestaurantId(restaurant_id)
        .then((data) => {
          setMenuItems(data.data); 
        })
        .catch((error) => {
          console.error("Error fetching menu items:", error);
        });
    }
  }, [restaurant_id]);

  function addItemToCart(index: number, quantity: number) {
    const item = menuItems[index];
    const existingCartItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingCartItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity }]);
    }
  }

  function onSubmit() {
    if (!newSession) {
      console.log("Session or selected table is missing");
      return;
    }

    const orderLists = cart.map(item => ({
      menu_item_id: item.id,
      quantity: item.quantity,
      total_prices: item.quantity * item.price
    }));

    const totalAmount = orderLists.reduce((acc, list) => acc + list.total_prices, 0);

    const orderData = {
      order: {
        session_id: newSession.session.id, 
        total_amount: totalAmount,
        order_lists: orderLists
      }
    };

    createOrder(orderData)
      .then(() => alert("Order created successfully"))
      .catch(error => console.log("Order creation failed:", error));
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
       (Table {table_number})
      </h1>

      {menuItems.length ? (
        <div>
          <h3 className="text-3xl font-semibold text-gray-800 mb-6">Items List</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-lg font-bold text-gray-900">{item.item_name}</p>
                <p className="text-gray-700">{item.item_description}</p>
                <p className="text-gray-800 font-semibold">${item.price}</p>
                <input
                  className="text-black"
                  type="number"
                  placeholder="quantity"
                  defaultValue={0}
                  onChange={(e) => addItemToCart(index, parseInt(e.target.value) || 0)}
                />
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-purple-300 pb-2">Ordered List</h3>
              <ul>
                {cart.map((cartItem, index) => (
                  <li key={index} className="mb-4 p-4 bg-purple-100 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{cartItem.item_name}</p>
                        <p className="text-gray-600">Quantity: {cartItem.quantity}</p>
                      </div>
                      <p className="text-lg font-semibold text-purple-700">${(cartItem.quantity * cartItem.price).toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleSubmit(onSubmit)}
            className="border-2 border-purple-300 text-purple-600 mt-4 px-4 py-2 rounded-lg"
          >
            Submit Order
          </button>
        </div>
      ) : (
        <p className="text-lg text-center text-gray-500">No menu items available</p>
      )}
    </div>
  );
};

export default MenuItemsPage;
