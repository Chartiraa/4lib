import React, { useState, useEffect } from "react";
import { Col, Row, Button, Modal, Form } from '@themesberg/react-bootstrap';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie"; // Çerezleri kullanmak için js-cookie'yi import edin

import { ProductButton } from "./MenuButton";
import { getProducts } from "../../data/DBFunctions";

export default () => {
    const { categoryName } = useParams();
    const decodedCategoryName = decodeURIComponent(categoryName);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null); // Seçilen ürün için state
    const [showProductModal, setShowProductModal] = useState(false); // Modalı açmak için state
    const [customizations, setCustomizations] = useState({ // Özelleştirmeler için state
        extraShot: 'Yok',
        syrupFlavor: 'Yok',
        syrupAmount: 'Tek',
        milkType: 'Normal'
    });
    const [quantity, setQuantity] = useState(1); // Ürün miktarı için state
    const [cart, setCart] = useState(() => { // Sepet için state, çerezlerden yüklenir
        const savedCart = Cookies.get('cart'); // Çerezden sepet verilerini alın
        return savedCart ? JSON.parse(savedCart) : []; // Eğer çerezde sepet varsa kullan, yoksa boş array
    });

    const navigate = useNavigate();

    useEffect(() => {
        getProducts().then(res => {
            const productsArray = Object.values(res);

            // Ürünleri kategori adına göre filtrele
            const filteredProducts = productsArray.filter(product => product.productCategory === decodedCategoryName);

            // Ürünleri sıralama anahtarına (sortOrder) göre sırala
            const sortedProducts = filteredProducts.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

            setProducts(sortedProducts);
        });
    }, [decodedCategoryName]);

    useEffect(() => {
        // Sepet güncellendiğinde çerezi güncelle
        Cookies.set('cart', JSON.stringify(cart), { expires: 7 }); // Çerez 7 gün boyunca saklanacak
        console.log(Cookies.get('cart'))
    }, [cart]);

    const handleProductClick = (product) => {
        setSelectedProduct(product); // Seçilen ürünü kaydet
        setShowProductModal(true); // Modalı aç
    };

    const handleCustomizationChange = (name, value) => {
        setCustomizations(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddToCart = () => {
        // Sepete eklemek için ürün verilerini ve özelleştirmeleri birleştir
        const cartItem = {
            productID: selectedProduct.productID,
            productName: selectedProduct.productName,
            productPrice: selectedProduct.productPrice,
            productCategory: selectedProduct.productCategory,
            quantity: quantity,
            ...customizations // Özelleştirmeleri ekle
        };

        setCart([...cart, cartItem]); // Sepete ekle
        handleCloseModal(); // Modalı kapat ve state'leri sıfırla
    };

    const handleCloseModal = () => {
        resetStates(); // State'leri varsayılan hallerine döndür
        setShowProductModal(false); // Modalı kapat
    };

    const resetStates = () => {
        setCustomizations({
            extraShot: 'Yok',
            syrupFlavor: 'Yok',
            syrupAmount: 'Tek',
            milkType: 'Normal'
        });
        setQuantity(1);
        setSelectedProduct(null);
    };

    return (
        <>
            <div style={{ backgroundColor: 'white', height: '100%', minHeight: '100vh' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0rem 2rem 1rem 2rem' }}>
                    <img src="https://firebasestorage.googleapis.com/v0/b/lib-18147.appspot.com/o/images%2FLeras-logo.png?alt=media&token=57f65473-2f3a-45cb-b207-d00cb4ed574f" alt="Leras Logo" style={{ width: '100%', maxWidth: '100px' }} />
                    <FontAwesomeIcon icon={faCartPlus} style={{ fontSize: '1.5rem', color: '#3C2F2F' }} onClick={() => navigate(`/menu/shoppingcart`)} />
                </div>
                <div>
                    <p className="mb-3 text-center" style={{ color: "#3C2F2F", fontFamily: 'Montserrat, sans-serif', fontSize: '1.5rem', fontWeight: '800' }}>{decodedCategoryName}</p>
                    <Row className="mx-auto px-3" style={{ maxWidth: '100%', marginTop: '2rem' }}>
                        {products.map((product, index) => (
                            <Col key={index} xs={12} md={6} lg={4} xl={3} className="mb-2">
                                <ProductButton
                                    productName={product.productName}
                                    productImage={product.productImage}
                                    productPrice={product.productPrice}
                                    onClick={() => handleProductClick(product)} // Ürün detaylarına tıklandığında modal açılır
                                />
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            {/* Ürün Özelleştirme ve Sepete Ekleme Modali */}
            <Modal show={showProductModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="w-100 text-center">{selectedProduct?.productName}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex flex-column align-items-center justify-content-center">
                    {/* Özelleştirme Seçenekleri */}
                    {selectedProduct?.productCategory.includes('Kahve') && (
                        <>
                            {/* Ekstra Shot Seçenekleri */}
                            <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                <Form.Label>Ekstra Shot</Form.Label>
                                <div className="d-flex justify-content-center">
                                    <Button variant={customizations.extraShot === 'Yok' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('extraShot', 'Yok')}>Yok</Button>
                                    <Button variant={customizations.extraShot === 'Tek' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('extraShot', 'Tek')} style={{ marginLeft: '10px' }}>Tek</Button>
                                    <Button variant={customizations.extraShot === 'Double' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('extraShot', 'Double')} style={{ marginLeft: '10px' }}>Double</Button>
                                </div>
                            </Form.Group>

                            {/* Aroma Şurubu Seçenekleri */}
                            <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                <Form.Label>Aroma Şurubu</Form.Label>
                                <div className="d-flex justify-content-center">
                                    <Button variant={customizations.syrupFlavor === 'Yok' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('syrupFlavor', 'Yok')}>Yok</Button>
                                    <Button variant={customizations.syrupFlavor === 'Vanilya' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('syrupFlavor', 'Vanilya')} style={{ marginLeft: '10px' }}>Vanilya</Button>
                                    <Button variant={customizations.syrupFlavor === 'Karamel' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('syrupFlavor', 'Karamel')} style={{ marginLeft: '10px' }}>Karamel</Button>
                                    <Button variant={customizations.syrupFlavor === 'Fındık' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('syrupFlavor', 'Fındık')} style={{ marginLeft: '10px' }}>Fındık</Button>
                                </div>
                            </Form.Group>

                            {/* Aroma Şurubu Miktarı Seçenekleri (Şurup varsa göster) */}
                            {customizations.syrupFlavor !== 'Yok' && (
                                <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                    <Form.Label>Aroma Şurubu Miktarı</Form.Label>
                                    <div className="d-flex justify-content-center">
                                        <Button variant={customizations.syrupAmount === 'Tek' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('syrupAmount', 'Tek')}>Tek</Button>
                                        <Button variant={customizations.syrupAmount === 'Double' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('syrupAmount', 'Double')} style={{ marginLeft: '10px' }}>Double</Button>
                                    </div>
                                </Form.Group>
                            )}

                            {/* Süt Tipi Seçenekleri */}
                            <Form.Group className="mb-3 d-flex flex-column align-items-center">
                                <Form.Label>Süt Tipi</Form.Label>
                                <div className="d-flex justify-content-center">
                                    <Button variant={customizations.milkType === 'Normal' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('milkType', 'Normal')}>Normal</Button>
                                    <Button variant={customizations.milkType === 'Laktozsuz' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('milkType', 'Laktozsuz')} style={{ marginLeft: '10px' }}>Laktozsuz</Button>
                                </div>
                            </Form.Group>
                        </>
                    )}

                    {/* Miktar Ayarlama */}
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
                    <Button variant="secondary" onClick={handleCloseModal}>İptal</Button>
                    <Button variant="primary" onClick={handleAddToCart}>Sepete Ekle</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
