import React, { useState, useEffect } from "react";
import { Table, Button, Card, Modal, Form } from '@themesberg/react-bootstrap';
import Cookies from "js-cookie"; // Çerezleri yönetmek için js-cookie kütüphanesini kullanın
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // Yönlendirme için useNavigate import edin

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate(); // Yönlendirme için hook kullanımı

    // Çerezden sepet verilerini yükleme
    useEffect(() => {
        const savedCart = Cookies.get('cart'); // Çerezden sepet verilerini alın
        if (savedCart) {
            setCart(JSON.parse(savedCart)); // Çerezi JSON formatında parse edin ve state'e kaydedin
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
        Cookies.set('cart', JSON.stringify(updatedCart), { expires: 7 }); // Güncellenmiş sepeti çereze kaydedin
        setShowEditModal(false); // Modalı kapat
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
            <div style={{ backgroundColor: 'white', height: '100vh', padding: '1rem' }}>
                {/* Sayfa başlığı ve sepet ikonu */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0rem 2rem 1rem 2rem' }}>
                    <img src="https://firebasestorage.googleapis.com/v0/b/lib-18147.appspot.com/o/images%2FLeras-logo.png?alt=media&token=57f65473-2f3a-45cb-b207-d00cb4ed574f" alt="Leras Logo" style={{ width: '100%', maxWidth: '100px' }} />
                    <FontAwesomeIcon icon={faCartPlus} style={{ fontSize: '1.5rem', color: '#3C2F2F', cursor: 'pointer' }} onClick={() => navigate(`/menu/shoppingcart`)} />
                </div>

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

                {/* Düzenleme Modalı */}
                {selectedOrder && (
                    <EditOrderModal
                        show={showEditModal}
                        handleClose={() => setShowEditModal(false)}
                        orderData={selectedOrder}
                        handleSave={handleSaveChanges}
                    />
                )}
            </div>
        </>
    );
};

// Düzenleme Modalı Bileşeni (Örnek)
const EditOrderModal = ({ show, handleClose, orderData, handleSave }) => {
    const [quantity, setQuantity] = useState(orderData.quantity);

    const handleSaveClick = () => {
        const updatedOrder = { ...orderData, quantity };
        handleSave(updatedOrder);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Ürünü Düzenle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Ürün düzenleme alanları */}
                <Form.Group>
                    <Form.Label>Adet</Form.Label>
                    <Form.Control
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    İptal
                </Button>
                <Button variant="primary" onClick={handleSaveClick}>
                    Kaydet
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CartPage;
