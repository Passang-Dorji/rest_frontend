"use client"
import { Table } from "@/app/model/table"
import { useState, useEffect } from "react"
import { fetchTable } from "@/app/service/table"
import { getMenuItemsByRestaurantId } from "@/app/service/menu_item"
import { MenuItems } from "@/app/model/meni_item"
import { fetchSession, createSession } from "@/app/service/session"
import { Session } from "@/app/model/session"
import { createOrder } from "@/app/service/order"

export default function ListTables() {
    const [tables, setTables] = useState<Table[]>([])
    const [items, setItems] = useState<MenuItems[]>([])
    const [selectedTable, setSelectedTable] = useState<Table | null>(null)
    const [newSession, setNewSession] = useState<Session | null>(null)
    const [quantities, setQuantities] = useState<{ [key: string]: string }>({})

    useEffect(() => {
        async function loadTables() {
            try {
                const data = await fetchTable()
                setTables(data.data)
            } catch (error) {
                console.log("Fetching error:", error)
            }
        }
        loadTables()
    }, [])

    async function loadMenuItems(table: Table) {
        try {
            const data = await getMenuItemsByRestaurantId(table.restaurant_id)
            setItems(data.data)
            setSelectedTable(table)
        } catch (error) {
            console.log("Fetching error:", error)
        }
    }

    async function loadNewSession(tableId: string) {
        try {
            const session = await createSession(tableId)
            console.log(session, "newly created session data")
            setNewSession(session)
        } catch (error) {
            console.log("Fetching error:", error)
        }
    }

    useEffect(() => {
        if (selectedTable) {
            loadNewSession(selectedTable.id)
        }
    }, [selectedTable])

    function handleQuantityChange(itemId: string, quantity: string) {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [itemId]: quantity,
        }))
    }

    async function handleSubmitOrder() {
        if (!newSession || !selectedTable) {
            console.log("Session or selected table is missing")
            return
        }

        let totalAmount = 0
        const orderLists: {
            menu_item_id: string;
            quantity: number;
            total_prices: number;
        }[] = []

        items.forEach((item) => {
            const quantity = parseFloat(quantities[item.id]) || 0
            if (quantity > 0) { // Only include items with a quantity greater than 0
                const totalPrices = quantity * item.price
                totalAmount += totalPrices
    
                // Push to the orderLists array directly
                orderLists.push({
                    menu_item_id: item.id,
                    quantity,
                    total_prices: totalPrices
                })
            }
        })

        // Build the JSON object
        const orderData = {
            order: {
                session_id: newSession.session.id,
                total_amount: totalAmount,
                order_lists: orderLists
            }
        }

        console.log("Prepared JSON object:", JSON.stringify(orderData, null, 2))

        // Call the service to create the order with the JSON object
        try {
            const response = await createOrder(orderData)
            console.log("Order created successfully")
        } catch (error) {
            console.log("Order creation failed:", error)
        }
    }

    return (
        <div className="min-h-screen bg-purple-100 p-8">
            {!items.length ? (
                <div>
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">Tables List</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {tables.length > 0 ? (
                            tables.map((table) => (
                                <div
                                    key={table.id}
                                    className="bg-purple-200 p-6 rounded-lg shadow-lg transition transform hover:scale-105"
                                    onClick={() => loadMenuItems(table)}
                                >
                                    <p className="text-xl font-bold text-gray-900">Restaurant ID: {table.restaurant_id}</p>
                                    <p className="text-lg text-gray-700">Table No: {table.table_no}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-lg text-gray-500">No tables available</p>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <h3 className="text-3xl font-semibold text-gray-800 mb-6">Items List</h3>
                    <p className="text-3xl font-semibold text-gray-800 mb-6">
                        Table No: {selectedTable?.table_no}
                    </p>
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmitOrder(); }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
                                    <p className="text-lg font-bold text-gray-900">{item.item_name}</p>
                                    <p className="text-gray-700">{item.item_description}</p>
                                    <p className="text-gray-800 font-semibold">${item.price}</p>
                                    <input
                                        className="text-black border border-gray-300 rounded mt-2 p-1 w-full"
                                        type="number"
                                        placeholder="Quantity"
                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                        value={quantities[item.id] || ""}
                                    />
                                </div>
                            ))}
                        </div>
                        <button 
                            type="submit" 
                            className="bg-purple-500 text-white mt-4 px-4 py-2 rounded-lg hover:bg-purple-600 transition"
                        >
                            Submit Order
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}
