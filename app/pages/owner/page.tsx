"use client"
import { useState, useEffect } from "react"
import { Order } from "@/app/model/order"
import type { OrderList } from "@/app/model/order"
import { fetchOrder , fetchOrderListWithItem,updateOrder} from "@/app/service/order"
export default function OrderList(){
    const [orders, setOrders] = useState<Order[]>([])
    const [orderItems, setOrderItems] = useState<OrderList[]>([])
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(()=>{
        async function loadOrder() {
            try{
                const data = await fetchOrder()
                setOrders(data.data)
            }catch(error){
                console.log("fetching error",error)
            }
        }
        loadOrder()
    },[])

    async function loadOrderListWithItem(orderId:string) {
      try{
        const data = await fetchOrderListWithItem(orderId)
        setOrderItems(data.data)
        setModalOpen(true);
      }catch(error){
        console.log("fetching error",error)
      }
    }
    const closeModal = () => {
      setModalOpen(false);
      setOrderItems([]);
    };

    async function loadUpdateOrder(orderId:string) {
      try {
        const updatedData = await updateOrder(orderId); // Assuming updateOrder returns the updated order
        setOrders((prevOrders:any) =>
          prevOrders.map((order) =>
            order.id === updatedData.data.id ? updatedData.data : order
          )
        );
      } catch (error) {
        console.log("fetching error", error);
      }
    }
    return (
      <div className="container mx-auto p-4 relative">
        <h2 className="text-2xl font-bold text-white mb-6">Order List</h2>
        {orders.length === 0 ? (
      <p className="text-gray-300 text-lg">No orders available.</p>
    ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
              key={order.id}
              onClick={() => loadOrderListWithItem(order.id)}
            >
              <p className="text-xl font-semibold text-yellow-400 mb-2">
                Table No. {order.table_no}
              </p>
              <p className="text-gray-300 mb-4">Ordered At: {order.ordered_at}</p>
              <p className="text-gray-300 mb-4">Session ID: {order.session_id}</p>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Total Amount</h3>
              <p className="text-gray-300">Nu. {order.total_amount} /-</p>

              {/* Conditionally render payed_at or pending status */}
              {order.payed_at ? (
                <p className="text-green-400 font-semibold mt-4">
                  Paid on {new Date(order.payed_at).toLocaleString()}
                </p>
              ) : (
                <>
                  <p className="text-red-500 font-semibold mt-4">Pending ...</p>
                  <button
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering onClick of parent
                      loadUpdateOrder(order.id); // Call function to update payed_at
                    }}
                  >
                    Mark as Paid
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
    )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-end">
            <div className="bg-gray-800 w-1/3 h-full shadow-lg p-6 relative overflow-y-auto">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={closeModal}
              >
                &times; {/* Close icon */}
              </button>
              <h2 className="text-xl font-bold text-white mb-6">Order Items</h2>
              {orderItems.length > 0 ? (
                <div className="space-y-4">
                  {orderItems.map((orderItem) => (
                    <div
                      key={orderItem.id}
                      className="bg-gray-700 p-4 rounded-lg shadow-md"
                    >
                      <h3 className="text-lg font-semibold text-yellow-400">
                        {orderItem.item_name}
                      </h3>
                      <p className="text-gray-300">Quantity: {orderItem.quantity}</p>
                      <p className="text-gray-300">Price: Nu. {orderItem.price}</p>
                      <p className="text-gray-300 font-bold">
                        Total Price: Nu. {orderItem.total_prices}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No items found for this order.</p>
              )}
            </div>
          </div>
        )}
      </div>
      
    );
  }