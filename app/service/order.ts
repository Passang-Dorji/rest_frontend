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