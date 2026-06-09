import { useState, useRef } from "react";
import { readCode } from "./Services/readCode";

export default function ReadCode() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };

    const processFile = (selectedFile) => {
        setFile(selectedFile);
        setResult(null);
        setError(null);
        setCopied(false);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            processFile(droppedFile);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select or drop an image file first");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setCopied(false);

        try {
            const response = await readCode(file);
            // Normalise: backend may return a plain string OR { text, format }
            const raw = response.data;
            if (typeof raw === "string") {
                setResult({ text: raw, format: null });
            } else {
                setResult({ text: raw.text ?? "", format: raw.format ?? null });
            }
        } catch (err) {
            console.error("Error decoding code:", err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("Failed to read the code. Ensure the image is clear and the backend server is running.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFile(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
        setCopied(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCopy = () => {
        if (!result?.text) return;

        const text = result.text;

        // Clipboard API requires HTTPS or localhost.
        // Fall back to the legacy execCommand approach for HTTP / IP addresses.
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch((err) => {
                    console.error("Clipboard write failed:", err);
                    legacyCopy(text);
                });
        } else {
            legacyCopy(text);
        }
    };

    const legacyCopy = (text) => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";   // avoid scrolling
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            const ok = document.execCommand("copy");
            if (ok) {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            console.error("Legacy copy failed:", err);
        }
        document.body.removeChild(textarea);
    };

    // Helper to check if text is a URL
    const isUrl = (text) => {
        if (!text || typeof text !== "string") return false;
        try {
            new URL(text);
            return true;
        } catch (_) {
            return text.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/) !== null;
        }
    };

    const getFormattedUrl = (text) => {
        return text.startsWith("http://") || text.startsWith("https://") ? text : `https://${text}`;
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
                    <label className="form-label">Upload QR or Barcode Image</label>
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleUploadClick}
                        style={{
                            ...styles.dropZone,
                            border: dragActive
                                ? "2px dashed var(--accent-primary)"
                                : "2px dashed rgba(255, 255, 255, 0.15)",
                            background: dragActive
                                ? "rgba(99, 102, 241, 0.08)"
                                : "rgba(255, 255, 255, 0.02)",
                        }}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: "none" }}
                        />
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" style={styles.previewImage} />
                        ) : (
                            <div style={styles.dropZoneContent}>
                                {/* Scanner / QR icon */}
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-primary)", marginBottom: "12px" }}>
                                    <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                                    <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                                    <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                                    <rect x="14" y="14" width="3" height="3" rx="0.5"></rect>
                                    <rect x="18" y="14" width="3" height="3" rx="0.5"></rect>
                                    <rect x="14" y="18" width="3" height="3" rx="0.5"></rect>
                                    <rect x="18" y="18" width="3" height="3" rx="0.5"></rect>
                                </svg>
                                <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: "500" }}>
                                    Drag & drop image here
                                </p>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                                    or click to select file · PNG, JPG, WEBP
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading || !file}
                        style={{ flex: 2 }}
                    >
                        {loading ? (
                            <>
                                <div className="spinner"></div>
                                <span>Scanning...</span>
                            </>
                        ) : (
                            <>
                                {/* Scan / camera icon */}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                                    <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                                    <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                                    <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                                    <line x1="7" y1="12" x2="17" y2="12"></line>
                                </svg>
                                <span>Decode Code</span>
                            </>
                        )}
                    </button>
                    {file && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="btn-action"
                            style={{ flex: 1, height: "54px", borderRadius: "14px" }}
                        >
                            Reset
                        </button>
                    )}
                </div>
            </form>

            {result && !loading && (
                <div className="result-container" style={{ textAlign: "left", alignItems: "stretch" }}>
                    {/* Header row: format badge + copy button */}
                    <div style={styles.resultHeader}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={styles.badge}>
                                {result.format || "Unknown Format"}
                            </span>
                            <span style={styles.successDot}></span>
                            <span style={{ color: "var(--success)", fontSize: "0.85rem", fontWeight: "500" }}>
                                Decoded
                            </span>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="btn-action"
                            title="Copy to clipboard"
                            style={{ padding: "8px 14px", borderRadius: "10px", fontSize: "0.85rem", gap: "6px" }}
                        >
                            {copied ? (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                    Copy
                                </>
                            )}
                        </button>
                    </div>

                    {/* Decoded text body */}
                    <div style={styles.resultBody}>
                        <p style={styles.resultLabel}>Decoded Text</p>
                        <div style={styles.resultTextContainer}>
                            <p style={styles.resultText}>{result.text}</p>
                        </div>

                        {isUrl(result.text) && (
                            <a
                                href={getFormattedUrl(result.text)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-submit"
                                style={{ marginTop: "16px", textDecoration: "none" }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                                <span>Visit Link</span>
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    dropZone: {
        borderRadius: "16px",
        padding: "30px 20px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
        minHeight: "180px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    dropZoneContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    previewImage: {
        maxWidth: "100%",
        maxHeight: "180px",
        borderRadius: "8px",
        objectFit: "contain",
    },
    resultHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
    },
    badge: {
        background: "var(--gradient-accent)",
        color: "#fff",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "0.8rem",
        fontWeight: "600",
        textTransform: "uppercase",
    },
    successDot: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "var(--success)",
        display: "inline-block",
    },
    resultBody: {
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "14px",
        padding: "20px",
    },
    resultLabel: {
        color: "var(--text-secondary)",
        fontSize: "0.85rem",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginBottom: "8px",
    },
    resultTextContainer: {
        background: "rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "8px",
        padding: "12px 16px",
        wordBreak: "break-all",
    },
    resultText: {
        color: "var(--text-primary)",
        fontSize: "1rem",
        lineHeight: "1.5",
        margin: 0,
    },
};
