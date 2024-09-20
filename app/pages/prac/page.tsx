"use client"
import TableList from "@/app/component/qrcode"
import MenuItemsPage from "../menu_items/page"

export default function(){
    return(
        <div className="bg-white ml-3 my-2">
            <TableList/>
            <MenuItemsPage/>
        </div>
    )
}