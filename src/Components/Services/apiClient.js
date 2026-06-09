import axios from "axios";


// For Local Development
// export const apiClient = axios.create({
//     baseURL: "http://localhost:9191/qrbarcodegenerator",
//     headers: {
//         "Content-Type": "application/json",
//     },
// })

// For Local Development
export const apiClient = axios.create({
    baseURL: "http://192.168.0.219:8081/qrbarcodegenerator",
    headers: {
        "Content-Type": "application/json",
    },
})
