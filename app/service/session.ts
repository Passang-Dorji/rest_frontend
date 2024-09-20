import { Session } from "../model/session";

export const fetchSession = async():Promise<{data:Session[]}> =>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions`,
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

export const createSession = async(tableId:string):Promise<{data:Session[]}> =>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions`,{
        method:"POST",
        body:JSON.stringify({
            "table_id": tableId
        }),
        headers: {
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