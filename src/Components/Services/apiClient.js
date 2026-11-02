import axios from "axios";


// For Local Development (IDE / localhost)
/*export const apiClient = axios.create({
    baseURL: "http://localhost:9191/qrbarcodegeneratorrest",
})*/

export const apiClient = axios.create({
    baseURL: "http://172.20.96.1:8081/qrbarcodegeneratorrest",
})

// For Tomcat Deployment
// export const apiClient = axios.create({
//     baseURL: 'http://192.168.0.219:8081/qrbarcodegeneratorrest'
// })
