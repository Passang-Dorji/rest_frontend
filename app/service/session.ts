import { Session } from "../model/session";

export const fetchSession = async():Promise<{data:Session[]}> =>{
    const response = await fetch("http://localhost:4000/api/sessions")
    if(!response.ok){
        throw new Error("failed to fetch")
    }
    return response.json()
}

export const createSession = async(tableId:string):Promise<{data:Session[]}> =>{
    const response = await fetch("http://localhost:4000/api/sessions",{
        method:"POST",
        body:JSON.stringify({
            "table_id": tableId
        }),
        headers: {
            'Content-Type': 'application/json'
          }
    })
    if(!response.ok){
        throw new Error("failed to fetch")
    }
    return response.json()
}