import { useState, useEffect } from "react";
import { createQrCode } from "./Services/generateQr";

export default function GenerateQrCode() {
    const [data, setData] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Clean up Object URL on unmount or when qrCodeUrl changes to prevent memory leaks
    useEffect(() => {
        return () => {
            if (qrCodeUrl) {
                URL.revokeObjectURL(qrCodeUrl);
            }
        };
    }, [qrCodeUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.trim()) {
            setError("Please enter text or a URL first");
            return;
        }

        setLoading(true);
        setError(null);
        
        // Revoke old URL if it exists
        if (qrCodeUrl) {
            URL.revokeObjectURL(qrCodeUrl);
            setQrCodeUrl(null);
        }

        try {
            const response = await createQrCode(data.trim());
            const blob = response.data;
            const objectUrl = URL.createObjectURL(blob);
            setQrCodeUrl(objectUrl);
        } catch (err) {
            console.error("Error generating QR code:", err);
            setError("Failed to generate QR Code. Make sure the backend server is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!qrCodeUrl) return;
        const link = document.createElement("a");
        link.href = qrCodeUrl;
        link.download = `qrcode-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClear = () => {
        setData("");
        if (qrCodeUrl) {
            URL.revokeObjectURL(qrCodeUrl);
            setQrCodeUrl(null);
        }
        setError(null);
    };

    return (
        <div>
            {error && (
                <div className="alert alert-error">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Data for QR Code</label>
                    <input
                        className="form-input"
                        placeholder="Enter Text or URL (e.g., https://example.com)"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={loading || !data.trim()}
                >
                    {loading ? (
                        <>
                            <div className="spinner"></div>
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <rect x="7" y="7" width="3" height="3"></rect>
                                <rect x="14" y="7" width="3" height="3"></rect>
                                <rect x="7" y="14" width="3" height="3"></rect>
                                <rect x="14" y="14" width="3" height="3"></rect>
                            </svg>
                            <span>Generate QR Code</span>
                        </>
                    )}
                </button>
            </form>

            {qrCodeUrl && !loading && (
                <div className="result-container">
                    <div className="qr-wrapper">
                        <img 
                            src={qrCodeUrl} 
                            alt="Generated QR Code" 
                            className="qr-image"
                            style={{ width: "200px", height: "200px" }}
                        />
                    </div>
                    <div className="action-buttons">
                        <button onClick={handleDownload} className="btn-action">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download
                        </button>
                        <button onClick={handleClear} className="btn-action">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}