import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import GenerateQrCode from "./Components/GenerateQrCode";
import GenerateBarCode from "./Components/GenerateBarCode";
import ReadCode from "./Components/ReadCode";

export default function QrBarGenerator() {
    return (
        <div className="container">
            <BrowserRouter basename="/scancraft">
                <div className="card">
                    <h1 className="title-gradient">ScanCraft</h1>
                    <p className="subtitle">Generate & scan QR Codes and Barcodes instantly</p>

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
                        <NavLink
                            to="/scan"
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                        >
                            Scan Code
                        </NavLink>
                    </div>

                    <Routes>
                        <Route path="/" element={<GenerateQrCode />} />
                        <Route path="/bar-code" element={<GenerateBarCode />} />
                        <Route path="/scan" element={<ReadCode />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}