export function About() {
    return (
        <section className="about-page">
            <div className="about-banner">
                <h1>About Us</h1>
            </div>
            <div className="about-content">
                <div className="images-content">
                    <img
                        src="../assets/img/tal.jpeg"
                        alt="Team"
                        className="about-image"
                    />

                    <img
                        src="../assets/img/tal.jpeg"
                        alt="Team"
                        className="about-image"
                    />
                </div>
                <div className="about-text">
                    <p>
                        We're a fully distributed team living and working in different parts of the world. Our mission is to build the best products to help our customers grow and thrive in their goals.
                    </p>
                    <p>
                        From the start, we've focused on rethinking traditional methods and creating unique, fulfilling experiences for everyone involved.
                    </p>
                </div>
            </div>
            {/* Footer Section */}
            <footer className="about-footer">
                <h3>Follow Us</h3>
                <div className="social-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-facebook-f"></i>
                    </a>
                    <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-whatsapp"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-instagram"></i>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-twitter"></i>
                    </a>
                </div>
                <p>© 2025 Your Company. All rights reserved.</p>
            </footer>
        </section>
    );
}
