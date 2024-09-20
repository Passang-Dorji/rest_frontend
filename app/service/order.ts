import { Order,OrderList } from "../model/order";

export const createOrder = async(order:object):Promise<{data:Order[] & OrderList[]}> =>{    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`,{
        method:"POST",
        body:JSON.stringify(order),
        headers:{
            'Content-Type': 'application/json',
            "ngrok-skip-browser-warning": "true",
            Accept: "application/json",
        }
    })
    if(!response.ok){
        throw new Error("failed to fetch")
    }
    return response.json()
}

export const fetchOrder = async():Promise<{data:Order[]}>=>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
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

export const fetchOrderListWithItem = async(orderId:string):Promise<{data:OrderList[]}>=>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order_lists?order_id=${orderId}`,
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

export const updateOrder = async(orderId:string):Promise<{data:Order[]}>=>{
    const currentDateTime = new Date().toISOString();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,{
            method: 'PATCH', // Use PATCH for partial updates
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({order: { payed_at: currentDateTime} }),
             })
        if (!response.ok){
            throw new Error("failed to fetch")
        }
    return response.json()
}