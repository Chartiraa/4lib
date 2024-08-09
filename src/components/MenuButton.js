import React from 'react';
import { Card } from '@themesberg/react-bootstrap';

export const MenuButton = ({ categoryName, categoryBanner, onClick }) => {
  return (
    <Card style={{ cursor: "pointer", height: "8rem", width: "100%" }} border="light" className="shadow-sm text-center" onClick={onClick}>
      <Card.Body style={{ position: 'relative', padding: 0, borderRadius: "0.5rem", overflow: 'hidden' }}>
        <div style={{ backgroundImage: `url(${categoryBanner})`, backgroundSize: "cover", backgroundPosition: "center", height: "100%", width: "100%", position: "absolute", top: 0, left: 0, filter: 'brightness(50%)' }}></div>
        <div style={{ position: 'relative', zIndex: 1, height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <h1 className="mb-1 text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>{categoryName}</h1>
        </div>
      </Card.Body>
    </Card>
  );
};

export const ProductButton = ({ productName, productImage, productPrice }) => {
  return (
    <>
      <Card style={{ cursor: "pointer", height: "8rem", width: "100%" }} border="light" className="shadow-sm text-center">
        <Card.Body style={{ position: 'relative', padding: 0, borderRadius: "0.5rem", overflow: 'hidden' }}>
          <div style={{ backgroundImage: `url(${productImage})`, backgroundSize: "cover", backgroundPosition: "center", height: "100%", width: "100%", position: "absolute", top: 0, left: 0, filter: 'brightness(50%)' }}></div>
          <div style={{ position: 'relative', zIndex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <h1 className="mb-1 text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '500' }}>{productName}</h1>
            <h4 className="mb-1 text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '400' }}>{productPrice} ₺</h4>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};