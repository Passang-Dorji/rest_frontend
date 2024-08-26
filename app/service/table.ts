import { Table } from "../model/table";

export const fetchTable = async():Promise<{data:Table[]}>=>{
    const response = await fetch("http://localhost:4000/api/tables")
    if (!response.ok){
        throw new Error("failed to fetch")
    }
    return response.json()
}