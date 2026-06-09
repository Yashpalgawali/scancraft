import { useState, useEffect } from "react";
import { createBarCode } from "./Services/generateBar";

export default function GenerateBarCode() {
    const [data, setData] = useState("");
    const [barCodeUrl, setBarCodeUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Clean up Object URL on unmount or when barCodeUrl changes to prevent memory leaks
    useEffect(() => {
        return () => {
            if (barCodeUrl) {
                URL.revokeObjectURL(barCodeUrl);
            }
        };
    }, [barCodeUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.trim()) {
            setError("Please enter data for the barcode first");
            return;
        }

        setLoading(true);
        setError(null);

        // Revoke old URL if it exists
        if (barCodeUrl) {
            URL.revokeObjectURL(barCodeUrl);
            setBarCodeUrl(null);
        }

        try {
            alert('Bar code called')
            const response = await createBarCode(data.trim());
            const blob = response.data;
            const objectUrl = URL.createObjectURL(blob);
            setBarCodeUrl(objectUrl);
        } catch (err) {
            console.error("Error generating Barcode:", err);
            setError("Failed to generate Barcode. Make sure the backend server is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!barCodeUrl) return;
        const link = document.createElement("a");
        link.href = barCodeUrl;
        link.download = `barcode-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClear = () => {
        setData("");
        if (barCodeUrl) {
            URL.revokeObjectURL(barCodeUrl);
            setBarCodeUrl(null);
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
                    <label className="form-label">Data for Barcode</label>
                    <input
                        className="form-input"
                        placeholder="Enter Text or Numbers (e.g., 123456789)"
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
                                <line x1="3" y1="5" x2="3" y2="19"></line>
                                <line x1="8" y1="5" x2="8" y2="19"></line>
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="17" y1="5" x2="17" y2="19"></line>
                                <line x1="21" y1="5" x2="21" y2="19"></line>
                                <line x1="5" y1="5" x2="5" y2="19"></line>
                                <line x1="10" y1="5" x2="10" y2="19"></line>
                                <line x1="14" y1="5" x2="14" y2="19"></line>
                                <line x1="19" y1="5" x2="19" y2="19"></line>
                            </svg>
                            <span>Generate Barcode</span>
                        </>
                    )}
                </button>
            </form>

            {barCodeUrl && !loading && (
                <div className="result-container">
                    <div className="qr-wrapper" style={{ padding: "20px 30px" }}>
                        <img
                            src={barCodeUrl}
                            alt="Generated Barcode"
                            className="qr-image"
                            style={{ maxHeight: "120px", width: "auto" }}
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