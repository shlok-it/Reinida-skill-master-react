import React from 'react';
const Footer = () => {
    return (
        <React.Fragment>
            <div className="footer style-1">
                <div className="copyright">
                    <p>Copyright © {new Date().getFullYear()} Designed &amp; Developed by <a href="https://shlokitsolution.com/" target="_blank">Shlok It Solution</a></p>
                </div>
            </div>
        </React.Fragment>
    );
};
export default Footer;