import React, { useState, useEffect } from "react";
import { Col, Row, Form, Button } from '@themesberg/react-bootstrap';
import { useParams } from "react-router-dom";
import { ScrollPanel } from 'primereact/scrollpanel';
import { Dialog } from 'primereact/dialog';

import { getProducts, getCategories, addOrder, getEmptyTables, changeTableNumber } from "../data/DBFunctions";
import { CategoryButton, ProductButton } from "../components/Widgets";
import { Orders } from "../components/Tables";

export default () => {
    const { tableName } = useParams();
    const decodedTableName = decodeURIComponent(tableName);
    const [visible, setVisible] = useState(false);
    const [products, setProducts] = useState({});
    const [categories, setCategories] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('Soğuk Kahveler');
    const [refresh, setRefresh] = useState(0);
    const [isXLargeScreen, setIsXLargeScreen] = useState(window.innerWidth >= 1200);
    const [emptyTables, setEmptyTables] = useState([]); // Boş masaları tutacak state

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

    const moveTable = () => {
        getEmptyTables().then(tables => {
            setEmptyTables(tables); // Boş masaları state'e kaydet
            setVisible(true); // Dialog'u görünür yap
        });
    };

    // Boş masalara tıklama işlevi
    const handleEmptyTableClick = (table) => {
        changeTableNumber(decodedTableName, table).then(() => {
            setRefresh(refresh + 1);
        })
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingInline: isXLargeScreen ? '2.5rem' : '1rem' }}>
                <label className="text-center" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{decodedTableName != 'TakeAway' ? 'Masa - ' + decodedTableName : decodedTableName}</label>
                <Button variant="primary" style={{ backgroundColor: '#eeeeee', border: '1px solid #262B40', color: '#262B40' }} onClick={() => moveTable()}>Masa Taşı</Button>
            </div>
            <Row>
                <Col xs={12} xl={5}>
                    <Orders refresh={refresh} tableName={decodedTableName} />
                </Col>
                <Col xs={12} xl={3}>
                    {isXLargeScreen ? (
                            <Row>
                                {Object.values(categories).map((category, index) => (
                                    <Col xs={6} xl={6} key={index}>
                                        <CategoryButton
                                            key={index}
                                            title={category.categoryName}
                                            onClick={() => setSelectedCategory(category.categoryName)}
                                        />
                                    </Col>
                                ))}
                            </Row>
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
                    <ScrollPanel style={{ width: '100%', height: '90vh' }}>
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

            {/* Dialog Bileşeni */}
            <Dialog
                header="Boş Masalar"
                visible={visible}
                style={{ width: '50vw' }}
                onHide={() => setVisible(false)}
            >
                {emptyTables.length > 0 ? (
                    emptyTables.map((table, index) => (
                        <Button key={index} variant="primary" style={{ margin: '0.5rem' }} onClick={() => handleEmptyTableClick(table)}>{table} Taşı</Button>
                    ))
                ) : (
                    <p className="m-0">Boş masa yok.</p>
                )}
            </Dialog>
        </>
    );
};
