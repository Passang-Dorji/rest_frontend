
import { MenuItems } from "../model/meni_item";

export const getMenuItemsByRestaurantId = async(restaurantId:string):Promise<{data:MenuItems[]}>=>{
    const response = await fetch(`http://localhost:4000/api/menu_items?restaurant_id=${restaurantId}`)
    if(!response.ok){
        throw new Error("failed to fetch")
    }
    return response.json()
}