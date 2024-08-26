"use client"
import { Table } from "@/app/model/table"
import { useState, useEffect } from "react"
import { fetchTable } from "@/app/service/table"
import { getMenuItemsByRestaurantId } from "@/app/service/menu_item"
import { MenuItems } from "@/app/model/meni_item"

export default function ListTables() {
    const [tables, setTables] = useState<Table[]>([])
    const [items, setItems] = useState<MenuItems[]>([])
    const [selectedTable, setSelectedTable] = useState<Table | null>(null)
    useEffect(() => {
        async function loadTables() {
            try {
                const data = await fetchTable()
                console.log(data, "my tables")
                setTables(data.data)
            } catch (error) {
                console.log("fetching error")
            }
        }
        loadTables()
    }, [])

    async function loadMenuItems(table:Table) {
        try{
            const data = await getMenuItemsByRestaurantId(table.restaurant_id)
            setItems(data.data)
            setSelectedTable(table)
        }catch(error){
            console.log("fetching error",error)
        }
    }

    return (
        <div className="min-h-screen bg-purple-100 p-8">
            {!items.length?(
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
            ):(
            <div>
                 <h3 className="text-3xl font-semibold text-gray-800 mb-6">Items List</h3>
                 <p className="text-3xl font-semibold text-gray-800 mb-6">
                    Table No:{selectedTable?.table_no}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {items.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
                        <p className="text-lg font-bold text-gray-900">{item.item_name}</p>
                        <p className="text-gray-700">{item.item_description}</p>
                        <p className="text-gray-800 font-semibold">${item.price}</p>
                    </div>
                ))}
                </div>
            </div>
            )}
            
           
        </div>
    )
}
