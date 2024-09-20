import { Table } from "../model/table";

export const fetchTable = async():Promise<{data:Table[]}>=>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tables`,
    {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
    if (!response.ok){
        throw new Error("failed to fetch")
    }
    const data = await response.json()
    console.log(data,"response data")
    return data
}