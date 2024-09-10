"use client"
import { useState, useEffect } from "react"
import { Order } from "@/app/model/order"
import { fetchOrder } from "@/app/service/order"
export default function OrderList(){
    const [orders, setOrders] = useState<Order[]>([])

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

    return(
        <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold text-white mb-6">Order List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Session ID</h3>
              <p className="text-gray-300 mb-4">{order.session_id}</p>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Total Amount</h3>
              <p className="text-gray-300">${order.total_amount}</p>
            </div>
          ))}
        </div>
      </div>
      
    )
}