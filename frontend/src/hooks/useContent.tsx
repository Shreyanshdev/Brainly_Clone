import axios from "axios";
import { useState , useEffect } from "react";
import { BACKEND_URL } from "../config";

export function useContent() {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_URL}/content`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
        
        .then((response) => {
            setContent(response.data.content);
            console.log("Fetching content from backend...")
            setLoading(false);
        }) 
        .catch(error => {
            console.error("Error fetching content:", error);
            setLoading(false);
        });
    }
    , []);

    return { content, loading };
}