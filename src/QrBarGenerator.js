import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import GenerateQrCode from "./Components/GenerateQrCode";
import GenerateBarCode from "./Components/GenerateBarCode";

export default function QrBarGenerator() {
    return (
        <div className="container">
            <BrowserRouter>
                <div className="card">
                    <h1 className="title-gradient">ScanCraft</h1>
                    <p className="subtitle">Generate professional QR Codes & Barcodes instantly</p>
                    
                    <div className="nav-tabs">
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                            end
                        >
                            QR Code
                        </NavLink>
                        <NavLink 
                            to="/bar-code" 
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                        >
                            Barcode
                        </NavLink>
                    </div>

                    <Routes>
                        <Route path="/" element={<GenerateQrCode />} />
                        <Route path="/bar-code" element={<GenerateBarCode />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}