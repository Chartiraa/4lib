import React from 'react';
import { Card } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

export const MenuButton = ({ categoryName, categoryBanner, onClick }) => {
  return (
    <Card style={{ cursor: "pointer", height: "8rem", width: "100%", border: "none" }} className="shadow-sm text-center" onClick={onClick}>
      <Card.Body style={{ position: 'relative', padding: 0, overflow: 'hidden', borderRadius: '0.5rem', boxShadow: '0px 0px 24px -4px rgba(0,0,0,0.5)' }}>
        <div style={{ backgroundImage: `url(${categoryBanner})`, backgroundSize: "cover", backgroundPosition: "center", height: "100%", width: "100%", position: "absolute", top: 0, left: 0, filter: 'brightness(50%)' }}></div>
        <div style={{ position: 'relative', zIndex: 1, height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <h5 className="mb-1 text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>{categoryName}</h5>
        </div>
      </Card.Body>
    </Card>
  );
};

export const ProductButton = ({ productName, productImage, productPrice, onClick }) => {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <p className="text-black" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: "0.8rem", marginBottom: "-0.2rem" }}>
          {productName}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginTop: "0.5rem" }}>
          <p className="text-black" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '400', fontSize: "0.8rem", margin: 0 }}>
            {productPrice} ₺
          </p>
          <FontAwesomeIcon icon={faCartPlus} style={{ fontSize: "1rem", color: "#3C2F2F" }} onClick={onClick}/>
        </div>
      </div>

    </>
  );
};