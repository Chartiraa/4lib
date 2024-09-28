import React, { useState, useEffect } from "react";
import { Table, Button, Card, Form, Modal } from '@themesberg/react-bootstrap';
import Cookies from "js-cookie"; // Çerezleri yönetmek için js-cookie kütüphanesini kullanın
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faCartPlus, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // Yönlendirme için useNavigate import edin
import QRCode from 'qrcode';

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [qrCodes, setQrCodes] = useState([]); // Birden fazla QR kodu tutmak için state
    const navigate = useNavigate(); // Yönlendirme için hook kullanımı

    // Çerezden sepet verilerini yükleme
    useEffect(() => {
        const savedCart = Cookies.get('cart'); // Çerezden sepet verilerini alın
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        }
    }, []);

    // Sepetten ürün kaldırma işlevi
    const removeFromCart = (productID) => {
        const updatedCart = cart.filter(item => item.productID !== productID); // Ürün ID'sine göre sepeti filtreleyin
        setCart(updatedCart); // Güncellenmiş sepeti state'e kaydedin
        Cookies.set('cart', JSON.stringify(updatedCart), { expires: 7 }); // Güncellenmiş sepeti çereze kaydedin
    };

    // Düzenleme modalını açma işlevi
    const openEditModal = (order) => {
        setSelectedOrder(order);
        setShowEditModal(true);
    };

    const handleSaveChanges = (updatedOrder) => {
        const updatedCart = cart.map(item =>
            item.productID === updatedOrder.productID ? updatedOrder : item
        );
        setCart(updatedCart);
        Cookies.set('cart', JSON.stringify(updatedCart), { expires: 1 }); // Güncellenmiş sepeti çereze kaydedin
        setShowEditModal(false); // Modalı kapat
    };

    // Veriyi sıkıştırmak için bir fonksiyon (Kısaltmalar ile)
    const compressCartData = (cart) => {
        return cart.map(item => {
            const compressedItem = {
                id: item.productID,
                //n: item.productName,
                //p: item.productPrice,
                c: item.productCategory,
                q: item.quantity,
            };

            // Varsayılan olmayan seçenekleri ekleyelim
            if (item.extraShot && item.extraShot !== "Yok") {
                compressedItem.e = item.extraShot;
            }

            if (item.syrupFlavor && item.syrupFlavor !== "Yok") {
                compressedItem.f = item.syrupFlavor;
            }

            if (item.syrupAmount && item.syrupAmount !== "Tek") {
                compressedItem.a = item.syrupAmount;
            }

            if (item.milkType && item.milkType !== "Normal") {
                compressedItem.m = item.milkType;
            }

            if (item.sugar && item.sugar !== "Sade") {
                compressedItem.s = item.sugar;
            }

            console.log(compressedItem)
            return compressedItem;
        });
    };

    // Veriyi parçalara ayırma fonksiyonu
    const splitIntoChunks = (str, chunkSize) => {
        const chunks = [];
        let currentIndex = 0;

        while (currentIndex < str.length) {
            chunks.push(str.slice(currentIndex, currentIndex + chunkSize));
            currentIndex += chunkSize;
        }

        return chunks;
    };

    // Birden fazla QR kod oluşturma
    const generateQRCode = () => {
        const minimalCart = compressCartData(cart); // Sıkıştırılmış veriyi kullanın
        const qrCodeData = JSON.stringify(minimalCart);

        // Eğer veri 640 karakter sınırını aşıyorsa, parçalayın
        if (qrCodeData.length > 640) {
            const chunks = splitIntoChunks(qrCodeData, 640); // Veriyi parçalara ayırın
            generateMultipleQRCodes(chunks);
        } else {
            QRCode.toDataURL(qrCodeData, { errorCorrectionLevel: 'L' }, function (err, url) {
                if (err) {
                    console.error(err);
                    return;
                }
                setQrCodes([url]); // Tek bir QR kod oluşturun
            });
        }
    };

    // Parçalara ayrılan verilerden birden fazla QR kod oluşturmak
    const generateMultipleQRCodes = (chunks) => {
        const qrCodePromises = chunks.map(chunk => {
            return new Promise((resolve, reject) => {
                QRCode.toDataURL(chunk, { errorCorrectionLevel: 'L' }, function (err, url) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(url);
                    }
                });
            });
        });

        // Promise.all kullanarak tüm QR kodlarını bir seferde oluştur
        Promise.all(qrCodePromises)
            .then(urls => {
                setQrCodes(urls); // QR kodlarını state'e kaydet
            })
            .catch(err => console.error('QR kod oluşturma hatası:', err));
    };

    // Tek bir tablo satırı için bileşen
    const TableRow = (props) => {
        const { productID, productName, quantity, extraShot, syrupFlavor, syrupAmount, milkType } = props;

        return (
            <tr>
                <td>
                    <span className="fw-normal">{productName}</span>
                    {/* Ürün detaylarını göster */}
                    <ul className="list-unstyled mb-0" style={{ marginLeft: '10px', fontSize: '0.75em' }}>
                        {extraShot && extraShot.toLowerCase() !== 'yok' && <li style={{ fontSize: '0.7rem' }}>Shot: {extraShot}</li>}
                        {syrupFlavor && syrupFlavor.toLowerCase() !== 'yok' && syrupAmount && syrupAmount.toLowerCase() !== 'yok' && (
                            <li style={{ fontSize: '0.7rem' }}>Şurup: {syrupFlavor} ({syrupAmount})</li>
                        )}
                        {milkType && milkType.toLowerCase() !== 'normal' && <li style={{ fontSize: '0.7rem' }}>Süt: {milkType}</li>}
                    </ul>
                </td>
                <td>
                    <span className="fw-normal">{quantity}</span>
                </td>
                <td>
                    <FontAwesomeIcon icon={faEdit} className="text-primary me-3" style={{ cursor: "pointer" }} onClick={() => openEditModal(props)} />
                    <FontAwesomeIcon icon={faTrashAlt} className="text-danger" style={{ cursor: "pointer" }} onClick={() => removeFromCart(productID)} />
                </td>
            </tr>
        );
    };

    return (
        <>
            <div style={{ backgroundColor: 'white', height: '100%', minHeight: '100vh' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0rem 2rem 1rem 2rem' }}>
                    <img src="https://firebasestorage.googleapis.com/v0/b/lib-18147.appspot.com/o/images%2FLeras-logo.png?alt=media&token=57f65473-2f3a-45cb-b207-d00cb4ed574f" alt="Leras Logo" style={{ width: '100%', maxWidth: '100px' }} />
                    <FontAwesomeIcon icon={faCartPlus} style={{ fontSize: '1.5rem', color: '#3C2F2F' }} onClick={() => navigate(`/menu/shoppingcart`)} />
                </div>
                <div className="content">

                    <Card border="light" className="shadow-sm">
                        <Card.Body className="pt-0">
                            <Table hover responsive className="align-items-center">
                                <thead>
                                    <tr>
                                        <th className="border-bottom">Ürün Adı</th>
                                        <th className="border-bottom">Miktar</th>
                                        <th className="border-bottom">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="text-center">Sepetinizde ürün bulunmamaktadır.</td>
                                        </tr>
                                    ) : (
                                        cart.map((item, index) => <TableRow key={index} {...item} />)
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                    {/* QR Kod Oluşturma Butonu */}
                    <div className="d-flex justify-content-center mt-4">
                        <Button variant="primary" onClick={generateQRCode}>
                            <FontAwesomeIcon icon={faQrcode} className="me-2" />
                            Kodu Oluştur
                        </Button>
                    </div>

                    {/* QR Kod Gösterme */}
                    {qrCodes.length > 0 && (
                        <div className="d-flex flex-column align-items-center mt-4">
                            {qrCodes.map((qrCode, index) => (
                                <img key={index} src={qrCode} alt={`QR Kod ${index + 1}`} style={{ marginBottom: '10px' }} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

// Düzenleme Modalı Bileşeni (Örnek)
const EditOrderModal = ({ show, handleClose, orderData, handleSave }) => {
    const [quantity, setQuantity] = useState(orderData.quantity);
    const [customizations, setCustomizations] = useState({
        extraShot: orderData.extraShot || 'Yok',
        syrupFlavor: orderData.syrupFlavor || 'Yok',
        syrupAmount: orderData.syrupAmount || 'Tek',
        milkType: orderData.milkType || 'Normal'
    });

    const handleCustomizationChange = (name, value) => {
        setCustomizations(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveClick = () => {
        const updatedOrder = { ...orderData, quantity, ...customizations };
        handleSave(updatedOrder); // Değişiklikleri kaydet
    };

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        setQuantity(prev => Math.max(1, prev - 1)); // Miktar 1'den az olamaz
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{orderData.productName} Ürünü Düzenle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Özelleştirme Seçenekleri (Eğer kahve ise göstereceğiz) */}
                {orderData.productCategory && orderData.productCategory.includes('Kahve') && (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Ekstra Shot</Form.Label>
                            <div className="d-flex justify-content-center">
                                <Button variant={customizations.extraShot === 'Yok' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('extraShot', 'Yok')}>Yok</Button>
                                <Button variant={customizations.extraShot === 'Tek' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('extraShot', 'Tek')} style={{ marginLeft: '10px' }}>Tek</Button>
                                <Button variant={customizations.extraShot === 'Double' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('extraShot', 'Double')} style={{ marginLeft: '10px' }}>Double</Button>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Aroma Şurubu</Form.Label>
                            <div className="d-flex justify-content-center">
                                <Button variant={customizations.syrupFlavor === 'Yok' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('syrupFlavor', 'Yok')}>Yok</Button>
                                <Button variant={customizations.syrupFlavor === 'Vanilya' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('syrupFlavor', 'Vanilya')} style={{ marginLeft: '10px' }}>Vanilya</Button>
                                <Button variant={customizations.syrupFlavor === 'Karamel' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('syrupFlavor', 'Karamel')} style={{ marginLeft: '10px' }}>Karamel</Button>
                                <Button variant={customizations.syrupFlavor === 'Fındık' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('syrupFlavor', 'Fındık')} style={{ marginLeft: '10px' }}>Fındık</Button>
                            </div>
                        </Form.Group>

                        {customizations.syrupFlavor !== 'Yok' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Aroma Şurubu Miktarı</Form.Label>
                                <div className="d-flex justify-content-center">
                                    <Button variant={customizations.syrupAmount === 'Tek' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('syrupAmount', 'Tek')}>Tek</Button>
                                    <Button variant={customizations.syrupAmount === 'Double' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('syrupAmount', 'Double')} style={{ marginLeft: '10px' }}>Double</Button>
                                </div>
                            </Form.Group>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Süt Tipi</Form.Label>
                            <div className="d-flex justify-content-center">
                                <Button variant={customizations.milkType === 'Normal' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('milkType', 'Normal')}>Normal</Button>
                                <Button variant={customizations.milkType === 'Laktozsuz' ? 'primary' : 'outline-primary'} onClick={() => handleCustomizationChange('milkType', 'Laktozsuz')} style={{ marginLeft: '10px' }}>Laktozsuz</Button>
                            </div>
                        </Form.Group>
                    </>
                )}

                {/* Miktar Ayarlama (En Alta Taşındı) */}
                <Form.Group className="mb-3 d-flex flex-column align-items-center">
                    <Form.Label>Adet</Form.Label>
                    <div className="d-flex align-items-center justify-content-center">
                        <Button variant="outline-primary" onClick={decrementQuantity}>-</Button>
                        <span className="mx-3">{quantity}</span>
                        <Button variant="outline-primary" onClick={incrementQuantity}>+</Button>
                    </div>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>İptal</Button>
                <Button variant="primary" onClick={handleSaveClick}>Kaydet</Button>
            </Modal.Footer>
        </Modal>
    );
};


export default CartPage;
