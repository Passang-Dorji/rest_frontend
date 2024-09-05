export interface Order{
    id:string,
    session_id:string,
    total_amount:number
}

export interface OrderList{
    id:string,
    menu_item_id: string,
    quantity:number,
    total_prices: number
}

export interface OrderListItem {
    menu_item_id: string;
    quantity: number;
    total_prices: number;
    price: number;
}
 export interface OrderFormValues {
    orderLists: OrderListItem[];
}