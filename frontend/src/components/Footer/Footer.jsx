import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <a className="footer-brand" href="/">Sunil's Kitchen</a>
          <p>
            Good food, delivered with care. Browse the menu, build your order,
            and enjoy your favourites from the comfort of home.
          </p>
        </div>
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#explore-menu">Explore menu</a></li>
            <li><a href="#footer">Contact</a></li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Get in touch</h2>
          <ul>
            <li><a href="mailto:mc24b1043@iiitr.ac.in">mc24b1043@iiitr.ac.in</a></li>
            <li><a href="tel:+917737464909">+91 77374 64909</a></li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Built and customized by Sunil | Food Delivery | Copyright {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Footer;
