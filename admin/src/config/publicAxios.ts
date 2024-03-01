import axios from "axios";

const baseURL = "http://localhost:8080";

export const publicAxios = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

