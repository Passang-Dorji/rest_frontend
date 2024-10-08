export interface Order{
    id:string,
    table_no:string,
    session_id:string,
    total_amount:number,
    ordered_at:string,
    payed_at:Date
}

export interface OrderList{
    id:string,
    menu_item_id: string,
    item_name: string;
    quantity:number,
    total_prices: number
    price: number;
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