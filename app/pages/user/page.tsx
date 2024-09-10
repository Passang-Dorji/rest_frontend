"use client"
import { Table } from "@/app/model/table"
import { useState, useEffect } from "react"
import { fetchTable } from "@/app/service/table"
import { getMenuItemsByRestaurantId } from "@/app/service/menu_item"
import { MenuItems } from "@/app/model/meni_item"
import { fetchSession, createSession } from "@/app/service/session"
import { Session } from "@/app/model/session"
import { createOrder } from "@/app/service/order"
import { useForm, useFieldArray } from "react-hook-form"
import { OrderListItem,OrderFormValues } from "@/app/model/order"

export default function ListTables() {
    const { register, handleSubmit, control, reset } = useForm<OrderFormValues>({
        defaultValues: {
            orderLists: []
        }
    })
    const { fields } = useFieldArray({
        control,
        name: "orderLists"
    })

    const [tables, setTables] = useState<Table[]>([])
    const [items, setItems] = useState<MenuItems[]>([])
    const [selectedTable, setSelectedTable] = useState<Table | null>(null)
    const [newSession, setNewSession] = useState<Session | null>(null)
    const [cart, setCart] = useState<any[]>([]) // to store items in cart

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

            // Populate the form with items and their default quantities
            reset({
                orderLists: data.data.map(item => ({
                    menu_item_id: item.id,
                    quantity: 0,
                    total_prices: 0,
                    price: item.price
                }))
            })
        } catch (error) {
            console.log("Fetching error:", error)
        }
    }

    async function loadNewSession(tableId: string) {
        try {
            const session = await createSession(tableId)
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

    function addItemToCart(index: number, quantity: number) {
        const item = items[index]
        const existingCartItem = cart.find(cartItem => cartItem.id === item.id)

        if (existingCartItem) {
            setCart(cart.map(cartItem =>
                cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
            ))
        } else {
            setCart([...cart, { ...item, quantity }])
        }
    }

    function onSubmit(data: any) {
        if (!newSession || !selectedTable) {
            console.log("Session or selected table is missing")
            return
        }

        const orderLists = cart.map(item => ({
            menu_item_id: item.id,
            quantity: item.quantity,
            total_prices: item.quantity * item.price
        }))

        const totalAmount = orderLists.reduce((acc, list) => acc + list.total_prices, 0)

        const orderData = {
            order: {
                session_id: newSession.session.id,
                total_amount: totalAmount,
                order_lists: orderLists
            }
        }

        console.log("Prepared JSON object:", JSON.stringify(orderData, null, 2))

        // Call the service to create the order with the JSON object
        createOrder(orderData)
            .then(() => console.log("Order created successfully"))
            .catch(error => console.log("Order creation failed:", error))
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {fields.map((field, index) => (
                            <div key={field.id} className="bg-white p-4 rounded-lg shadow-md">
                                <p className="text-lg font-bold text-gray-900">{items[index].item_name}</p>
                                <p className="text-gray-700">{items[index].item_description}</p>
                                <p className="text-gray-800 font-semibold">${items[index].price}</p>
                                <input
                                    className="text-black"
                                    type="number"
                                    placeholder="quantity"
                                    {...register(`orderLists.${index}.quantity`)}
                                    defaultValue={0}
                                    onChange={(e) => addItemToCart(index, parseInt(e.target.value) || 0)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Cart Display */}
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
            )}
        </div>
    )
}
