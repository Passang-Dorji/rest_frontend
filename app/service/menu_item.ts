
import { MenuItems } from "../model/meni_item";

export const getMenuItemsByRestaurantId = async(restaurantId:string):Promise<{data:MenuItems[]}>=>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu_items?restaurant_id=${restaurantId}`,
        {
            headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            Accept: "application/json",
            },
        }
    )
    if(!response.ok){
        throw new Error("failed to fetch")
    }
    return response.json()
}