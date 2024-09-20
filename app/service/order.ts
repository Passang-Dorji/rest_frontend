import { Order,OrderList } from "../model/order";

export const createOrder = async(order:object):Promise<{data:Order[] & OrderList[]}> =>{
    const response = await fetch("http://localhost:4000/api/orders",{
        method:"POST",
        body:JSON.stringify(order),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    if(!response.ok){
        throw new Error("failed to fetch")
    }
    return response.json()
}

export const fetchOrder = async():Promise<{data:Order[]}>=>{
    const response = await fetch("http://localhost:4000/api/orders")
    if(!response.ok){
        throw new Error("failed to fetch")
    }
    return response.json()
}

export const fetchOrderListWithItem = async(orderId:string):Promise<{data:OrderList[]}>=>{
    const response = await fetch(`http://localhost:4000/api/order_lists?order_id=${orderId}`)
    if(!response.ok){
        throw new Error("failed to fetch")
    }
    return response.json()
}

export const updateOrder = async(orderId:string):Promise<{data:Order[]}>=>{
    const currentDateTime = new Date().toISOString();
        const response = await fetch(`http://localhost:4000/api/orders/${orderId}`,{
            method: 'PATCH', // Use PATCH for partial updates
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({order: { payed_at: currentDateTime} }),
             })
        if (!response.ok){
            throw new Error("failed to fetch")
        }
    return response.json()
}