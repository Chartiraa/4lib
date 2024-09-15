import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Button, Modal } from '@themesberg/react-bootstrap';
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
    const [emptyTables, setEmptyTables] = useState([]);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [extraShot, setExtraShot] = useState('Yok'); // Varsayılan: Yok
    const [syrupFlavor, setSyrupFlavor] = useState('Yok'); // Varsayılan: Yok
    const [syrupAmount, setSyrupAmount] = useState('Tek'); // Varsayılan: Tek
    const [milkType, setMilkType] = useState('Normal'); // Varsayılan: Normal
    const [quantity, setQuantity] = useState(1); // Varsayılan: 1

    // Seçili kategoriye göre ürünleri filtreleyin ve sıralayın
    const filteredProducts = selectedCategory ? Object.values(products)
        .filter(product => product.productCategory === selectedCategory)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)) : [];

    useEffect(() => {
        getProducts().then(res => {
            const sortedProducts = Object.values(res).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
            setProducts(sortedProducts.reduce((acc, product) => ({ ...acc, [product.productID]: product }), {}));
        });

        getCategories().then(res => {
            const sortedCategories = Object.values(res).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
            setCategories(sortedCategories.reduce((acc, category) => ({ ...acc, [category.categoryName]: category }), {}));
        });

        const handleResize = () => {
            setIsXLargeScreen(window.innerWidth >= 1200);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleProductClick = (product) => {
        setSelectedProduct(product); // Seçili ürünü ayarla
        setQuantity(1); // Varsayılan miktarı sıfırla
        setExtraShot('Yok'); // Ekstra seçenekleri sıfırla
        setSyrupFlavor('Yok');
        setSyrupAmount('Tek');
        setMilkType('Normal');
        setShowOptionsModal(true); // Modalı göster
    };

    const addOrderToTable = (product) => {
        addOrder({
            productID: product.productID,
            productName: product.productName,
            productPrice: product.productPrice,
            quantity: quantity,
            tableName: decodedTableName,
            productCategory: product.productCategory,
            extraShot: extraShot,
            syrupFlavor: syrupFlavor,
            syrupAmount: syrupAmount,
            milkType: milkType
        }).then(() => {
            setRefresh(refresh + 1);
        });
        setShowOptionsModal(false);
    };

    const handleOrderWithOptions = () => {
        if (selectedProduct) {
            addOrderToTable(selectedProduct);
        }
    };

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
                <label className="text-center" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{decodedTableName !== 'TakeAway' ? 'Masa - ' + decodedTableName : decodedTableName}</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant="outline-success" className="btn-icon-only btn-pill text-dark me-2" >
                        <FontAwesomeIcon icon={faQrcode} style={{ fontSize: '1.5rem' }} />
                    </Button>
                    <Button variant="primary" style={{ backgroundColor: '#eeeeee', border: '1px solid #262B40', color: '#262B40' }} onClick={() => moveTable()}>Masa Taşı</Button>
                </div>
            </div>
            <Row>
                <Col xs={12} xl={5}>
                    <Orders refresh={refresh} setRefresh={setRefresh} tableName={decodedTableName} />
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
                    <ScrollPanel style={{ width: '100%', height: isXLargeScreen ? '90vh' : '70vh' }}>
                        <Row>
                            {filteredProducts.map((product, index) => (
                                <Col xs={6} xl={6} key={index}>
                                    <ProductButton title={product.productName} isXLargeScreen={isXLargeScreen} onClick={() => handleProductClick(product)} />
                                </Col>
                            ))}
                        </Row>
                    </ScrollPanel>
                </Col>
            </Row>
            <Modal show={showOptionsModal} onHide={() => setShowOptionsModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Seçenekler</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProduct && selectedProduct.productCategory.includes('Kahve') && (
                        <>
                            {/* Kahve için ekstra seçenekler */}
                            <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                <Form.Label>Ekstra Espresso Shot</Form.Label>
                                <div className="d-flex justify-content-center">
                                    <Button variant={extraShot === 'Yok' ? 'primary' : 'outline-primary'} onClick={() => setExtraShot('Yok')}>Yok</Button>
                                    <Button variant={extraShot === 'Tek' ? 'primary' : 'outline-primary'} onClick={() => setExtraShot('Tek')} style={{ marginLeft: '10px' }}>Tek</Button>
                                    <Button variant={extraShot === 'Double' ? 'primary' : 'outline-primary'} onClick={() => setExtraShot('Double')} style={{ marginLeft: '10px' }}>Double</Button>
                                    <Button variant={extraShot === 'Triple' ? 'primary' : 'outline-primary'} onClick={() => setExtraShot('Triple')} style={{ marginLeft: '10px' }}>Triple</Button>
                                </div>
                            </Form.Group>
                            {isXLargeScreen ? (
                                <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                    <Form.Label>Aroma Şurubu Seçin</Form.Label>
                                    <div className="d-flex justify-content-center">
                                        <Button variant={syrupFlavor === 'Yok' ? 'primary' : 'outline-primary'} onClick={() => setSyrupFlavor('Yok')}>Yok</Button>
                                        <Button variant={syrupFlavor === 'Vanilya' ? 'primary' : 'outline-primary'} onClick={() => setSyrupFlavor('Vanilya')} style={{ marginLeft: '10px' }}>Vanilya</Button>
                                        <Button variant={syrupFlavor === 'Karamel' ? 'primary' : 'outline-primary'} onClick={() => setSyrupFlavor('Karamel')} style={{ marginLeft: '10px' }}>Karamel</Button>
                                        <Button variant={syrupFlavor === 'Fındık' ? 'primary' : 'outline-primary'} onClick={() => setSyrupFlavor('Fındık')} style={{ marginLeft: '10px' }}>Fındık</Button>
                                    </div>
                                </Form.Group>
                            ) : (
                                <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                    <Form.Label>Aroma Şurubu Seçin</Form.Label>
                                    <Form.Select value={syrupFlavor} onChange={(e) => setSyrupFlavor(e.target.value)} className="w-50">
                                        <option value="Yok">Yok</option>
                                        <option value="Vanilya">Vanilya</option>
                                        <option value="Karamel">Karamel</option>
                                        <option value="Fındık">Fındık</option>
                                    </Form.Select>
                                </Form.Group>
                            )}
                            {syrupFlavor !== 'Yok' && (
                                <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                    <Form.Label>Aroma Şurubu Miktarı</Form.Label>
                                    <div className="d-flex justify-content-center">
                                        <Button variant={syrupAmount === 'Tek' ? 'primary' : 'outline-primary'} onClick={() => setSyrupAmount('Tek')}>Tek</Button>
                                        <Button variant={syrupAmount === 'Double' ? 'primary' : 'outline-primary'} onClick={() => setSyrupAmount('Double')} style={{ marginLeft: '10px' }}>Double</Button>
                                    </div>
                                </Form.Group>
                            )}
                            {isXLargeScreen ? (
                                <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                    <Form.Label>Süt Tipi Seçin</Form.Label>
                                    <div className="d-flex justify-content-center">
                                        <Button variant={milkType === 'Normal' ? 'primary' : 'outline-primary'} onClick={() => setMilkType('Normal')}>Normal</Button>
                                        <Button variant={milkType === 'Laktozsuz' ? 'primary' : 'outline-primary'} onClick={() => setMilkType('Laktozsuz')} style={{ marginLeft: '10px' }}>Laktozsuz</Button>
                                    </div>
                                </Form.Group>
                            ) : (
                                <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                    <Form.Label>Süt Tipi Seçin</Form.Label>
                                    <Form.Select value={milkType} onChange={(e) => setMilkType(e.target.value)} className="w-50">
                                        <option value="Normal">Normal Süt</option>
                                        <option value="Laktozsuz">Laktozsuz Süt</option>
                                    </Form.Select>
                                </Form.Group>
                            )}
                        </>
                    )}

                    {/* Miktar Ayarlama Bölümü - Tüm Ürünler İçin */}
                    <Form.Group className="mb-3 d-flex flex-column align-items-center">
                        <Form.Label>Adet</Form.Label>
                        <div className="d-flex align-items-center justify-content-center">
                            <Button variant="outline-primary" onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</Button>
                            <span className="mx-3">{quantity}</span>
                            <Button variant="outline-primary" onClick={() => setQuantity(prev => prev + 1)}>+</Button>
                        </div>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button variant="secondary" onClick={() => setShowOptionsModal(false)}>İptal</Button>
                    <Button variant="primary" onClick={handleOrderWithOptions}>Sipariş Ver</Button>
                </Modal.Footer>
            </Modal>

            {/* Dialog Bileşeni */}
            <Dialog
                header="Boş Masalar"
                visible={visible}
                style={{ width: '50vw' }}
                onHide={() => setVisible(false)}
                closable={true}  // Çarpı butonunu etkinleştir
                dismissableMask={true}  // Maske alanına tıklayarak kapatmayı etkinleştir
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
