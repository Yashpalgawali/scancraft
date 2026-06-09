import { useLocation } from 'react-router-dom';

function LandingPage() {
    const query = new URLSearchParams(useLocation().search);
    const rawLinks = query.get('links');

    // Parse links
    const links = rawLinks ? rawLinks.split(',') : [];

    // Helper to format url protocols
    const formatUrl = (url) => {
        const trimmed = url.trim();
        return trimmed.startsWith('http://') || trimmed.startsWith('https://')
            ? trimmed
            : `https://${trimmed}`;
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Scanned Links</h2>
                <p style={styles.subtitle}>Please select a link to visit:</p>

                <div style={styles.linksContainer}>
                    {links.map((link, index) => (
                        <a
                            key={index}
                            href={formatUrl(link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.linkButton}
                        >
                            {link.trim()}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Sleek CSS-in-JS styling
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#121212', // Premium dark mode
        fontFamily: 'Inter, sans-serif',
        padding: '20px',
    },
    card: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '30px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    },
    title: {
        color: '#ffffff',
        fontSize: '24px',
        marginBottom: '10px',
    },
    subtitle: {
        color: '#b3b3b3',
        fontSize: '14px',
        marginBottom: '30px',
    },
    linksContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    linkButton: {
        display: 'block',
        padding: '14px 20px',
        backgroundColor: '#6200ee', // Vibrant purple accent
        color: '#ffffff',
        textDecoration: 'none',
        borderRadius: '30px',
        fontWeight: '600',
        transition: 'background-color 0.3s ease',
        boxShadow: '0 4px 15px rgba(98, 0, 238, 0.4)',
        wordBreak: 'break-all',
    }
};

export default LandingPage;
