import React, { useState, useEffect } from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import { useParams } from "react-router-dom";

import { ProductButton } from "./MenuButton";
import { getProducts } from "../../data/DBFunctions";

export default () => {
    const { categoryName } = useParams();
    const decodedCategoryName = decodeURIComponent(categoryName);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts().then(res => {
            const productsArray = Object.values(res);
            const filteredProducts = productsArray.filter(product => product.productCategory === decodedCategoryName);
            setProducts(filteredProducts);
        });
    }, [decodedCategoryName]);

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <img src="https://firebasestorage.googleapis.com/v0/b/lib-18147.appspot.com/o/images%2FLeras-logo.png?alt=media&token=57f65473-2f3a-45cb-b207-d00cb4ed574f" alt="Leras Logo" style={{ width: '100%', maxWidth: '220px' }} />
            </div>
            <div>
                <p className="mb-3 text-center" style={{ color: "#3C2F2F", fontFamily: 'Montserrat, sans-serif', fontSize: '2.5rem', fontWeight: '800' }}>{decodedCategoryName}</p>
                <Row className="mx-auto px-3" style={{ maxWidth: '100%' }}>
                    {products.map((product, index) => (
                        <Col key={index} xs={12} md={6} lg={4} xl={3} className="mb-2">
                            <ProductButton
                                productName={product.productName}
                                productImage={product.productImage}
                                productPrice={product.productPrice}
                            />
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    );
};