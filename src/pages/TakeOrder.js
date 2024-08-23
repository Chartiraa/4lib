import React, { useState, useEffect } from "react";
import { Col, Row, Form } from '@themesberg/react-bootstrap';
import { useParams } from "react-router-dom";
import { ScrollPanel } from 'primereact/scrollpanel';

import { getProducts, getCategories, addOrder, getOrders } from "../data/DBFunctions";
import { CategoryButton, ProductButton } from "../components/Widgets";
import { Orders } from "../components/Tables";

export default () => {
    const { tableName } = useParams();
    const decodedTableName = decodeURIComponent(tableName);

    const [products, setProducts] = useState({});
    const [categories, setCategories] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('Soğuk Kahveler');
    const [refresh, setRefresh] = useState(0);
    const [isXLargeScreen, setIsXLargeScreen] = useState(window.innerWidth >= 1200);

    // Seçili kategoriye göre ürünleri filtreleyin
    const filteredProducts = selectedCategory ? Object.values(products).filter(product => product.productCategory === selectedCategory) : [];

    useEffect(() => {
        getProducts().then(res => {
            setProducts(res); // Ürünleri duruma set edin
        });
        getCategories().then(res => {
            setCategories(res); // Kategorileri duruma set edin
        });

        // Ekran boyutunu izlemek için bir event listener ekleyin
        const handleResize = () => {
            setIsXLargeScreen(window.innerWidth >= 1200);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function: event listener'ı kaldırın
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleProductClick = (product) => {
        const quantity = 1;
        addOrder({ productID: product.productID, productName: product.productName, productPrice: product.productPrice, quantity: quantity, tableName: decodedTableName }).then(() => {
            setRefresh(refresh + 1);
        })
    }

    return (
        <>
            <h1 className="text-center">{decodedTableName}</h1>

            <Row>
                <Col xs={12} xl={5}>
                    <Orders refresh={refresh} tableName={decodedTableName} />
                </Col>
                <Col xs={12} xl={3}>
                    {isXLargeScreen ? (
                        <ScrollPanel style={{ width: '100%', height: '100%' }}>
                            {Object.values(categories).map((category, index) => (
                                <CategoryButton
                                    key={index}
                                    title={category.categoryName}
                                    onClick={() => setSelectedCategory(category.categoryName)}
                                />
                            ))}
                        </ScrollPanel>
                    ) : (
                        <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} aria-label="Kategori Seçin" style={{ marginBottom: '2rem', marginTop: '1rem' }} >
                            {Object.values(categories).map((category, index) => (
                                <option key={index} value={category.categoryName}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </Form.Select>
                    )}
                </Col>
                <Col xs={12} xl={4}>
                    <ScrollPanel style={{ width: '100%', height: '100vh' }}>
                        <Row>
                            {filteredProducts.map((product, index) => (
                                <Col xs={6} xl={6} key={index}>
                                    <ProductButton title={product.productName} onClick={() => handleProductClick(product)} />
                                </Col>
                            ))}
                        </Row>
                    </ScrollPanel>

                </Col>

            </Row>
        </>
    );
};
