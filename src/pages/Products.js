import React, { useState, useEffect } from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import { useParams } from "react-router-dom";

import { ProductButton } from "../components/MenuButton";
import { getProducts } from "../data/DBFunctions";

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
        <div className="mt-3">
            <p className="mb-3 text-center" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '2rem', fontWeight: '600' }}>{decodedCategoryName}</p>
            <Row className="mx-auto px-3" style={{ maxWidth: '100%'}}>
                {products.map((product, index) => (
                    <Col key={index} xs={6} md={6} lg={4} xl={3} className="mb-2">
                        <ProductButton
                            productName={product.productName}
                            productImage={product.productImage}
                            productPrice={product.productPrice}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
};