import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col } from '@themesberg/react-bootstrap';
import { getOrders, getProducts, getTotal, setTotal, editTotal, addLog, delOrders, getTempPay, delTempPay, tempPay, getCurrentUserName, updateOrderQuantity } from "../data/DBFunctions";
import Numpad from "./Numpad";

export default (props) => {
    const { tableName, refresh, setRefresh, numpadValue, setNumpadValue, cashierName } = props;  // cashierName prop eklendi
    const numpad = useRef(null);

    const [orders, setOrders] = useState({});
    const [products, setProducts] = useState({});
    const [temp, setTemp] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);
    const [paid, setPaid] = useState(0);
    const [remainder, setRemainder] = useState(0);

    useEffect(() => {
        getOrders(tableName).then(res => setOrders(res));
        getProducts().then(res => setProducts(res));
        getTempPay().then(res => setTemp(res));
    }, [refresh]);

    useEffect(() => {
        setTotalAmount(calcTotal(orders));
    }, [orders, refresh]);

    const mergedData = Object.keys(temp).reduce((result, key) => {
        if (orders[key]) {
            result[key] = {
                ...temp[key],
                ...orders[key],
            };
        }
        return result;
    }, {});

    const calcTotal = (orders) => {
        let total = 0;
        if (tableName !== "") {
            Object.values(orders).forEach(order => {
                const product = products[order.productID];
                if (product) {
                    total += order.quantity * product.productPrice;
                }
            });
        }
        if (total > 0) {
            setRemainder(total);
            setTotal({ tableName: tableName, total: total });
            return total;
        } else {
            setRemainder(0);
            setPaid(0);
            return total;
        }
    };

    const onClickAll = () => {
        // Tüm siparişler için tempPay fonksiyonunu tetikle
        Object.keys(orders).forEach(orderID => {
            const order = orders[orderID];
            tempPay({ orderID, productPrice: products[order.productID]?.productPrice }); // tempPay fonksiyonu çağrılıyor
        });
    
        setRefresh(refresh + 1);  // Arayüzü yenile
    };

    const onClickHalf = () => {
        setNumpadValue(remainder / 2);
    };

    const handlePayment = (paymentMethod) => {
        const cashierName = getCurrentUserName(); // Kullanıcı adını al
        const productsSold = []; // Satılan ürünlerin tüm detaylarını tutacak dizi
        let totalAmount = 0; // Toplam tutarı hesaplamak için değişken
    
        // getTempPay ile alınan tüm siparişler üzerinde işlem yap
        Object.keys(temp).forEach(tempKey => {
            const tempOrder = temp[tempKey]; // TempPay'den gelen sipariş
            const tempQuantity = parseInt(tempOrder.quantity, 10); // Ödenmek istenen miktar
    
            // getOrders'dan gelen tabloyu kontrol et
            const matchingOrder = orders[tempOrder.orderID]; // Orders'dan gelen ilgili sipariş
            if (matchingOrder) {
                const currentQuantity = parseInt(matchingOrder.quantity, 10); // Mevcut sipariş miktarı
    
                if (!isNaN(tempQuantity) && !isNaN(currentQuantity)) {
                    const productName = tempOrder.productName || "Ürün adı bulunamadı";
                    if (!productName || productName === "Ürün adı bulunamadı") {
                        console.error(`Geçersiz ürün adı: ${tempOrder.productID}`);
                        return; // Hata durumunda işlemi sonlandır
                    }
    
                    if (tempQuantity === currentQuantity) {
                        // Eğer miktarlar eşitse, siparişi hem Orders hem de TempPay'den sil
                        delOrders({ tableName: tableName, orderID: tempOrder.orderID });
                        delTempPay({ orderID: tempOrder.orderID });
                    } else if (tempQuantity < currentQuantity) {
                        // Eğer ödenmek istenen miktar mevcut miktardan küçükse
                        const remainingQuantity = currentQuantity - tempQuantity;
    
                        // Orders tablosunu güncelle
                        updateOrderQuantity({ tableName: tableName, orderID: tempOrder.orderID, quantity: remainingQuantity });
    
                        // TempPay tablosundan siparişi sil
                        delTempPay({ orderID: tempOrder.orderID });
                    } else {
                        console.error(`Geçersiz miktar veya mevcut miktar (orderID: ${tempOrder.orderID}):`, tempOrder);
                        return;
                    }
    
                    // Satılan ürünler dizisine ekle
                    productsSold.push({
                        product_name: productName, // Ürün adı artık kesin olarak tanımlı
                        quantity: tempQuantity // Sadece ödenen miktar için log
                    });
    
                    // Toplam tutarı artır
                    totalAmount += tempQuantity * parseFloat(tempOrder.productPrice);
                }
            }
        });
    
        // Satış işlemi için log ekleme
        if (productsSold.length > 0) {
            addLog({
                tableName: tableName,
                action: paymentMethod, // `paymentMethod` dinamik olarak kullanılır
                amount: totalAmount, // Toplam tutar
                payment_method: paymentMethod,
                cashier_name: cashierName,
                products_sold: productsSold // Satılan ürünlerin tüm detayları
            });
        }
    
        setNumpadValue("");
        setRefresh(refresh + 1);
    };
    
    
    

    return (
        <>
            <h3>Toplam: {totalAmount}₺</h3>
            <h3>Ödenen: {paid}₺</h3>
            <h1>Kalan: {remainder}₺</h1>

            <Form.Control ref={numpad} required value={numpadValue} placeholder="Tahsil edilecek tutarı giriniz" style={{ marginBottom: "10px", marginTop: "10px" }} onChange={(e) => setNumpadValue(e.target.value)} />

            <Row style={{ marginBottom: "10px" }}>
                <Col className="p-0">
                    <button onClick={onClickAll} style={{ width: "100%", height: "100px", fontSize: "1.5rem", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", border: "0.1px solid #d0d0d0", backgroundColor: "#198754", color: "white" }} value="Tamamı">Tamamı</button>
                </Col>
            </Row>

            <Numpad setNumpadValue={setNumpadValue} numpadValue={numpadValue} />

            <Row style={{ marginTop: "10px" }}>
                <Col className="p-0">
                    <button onClick={() => handlePayment("Kredi Kartı")} style={{ width: "100%", height: "100px", fontSize: "1.5rem", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", border: "0.1px solid #d0d0d0", backgroundColor: "#198754", color: "white" }} value="Kredi">Kredi Kartı</button>
                </Col>
                <Col className="p-0">
                    <button onClick={() => handlePayment("Nakit")} style={{ width: "100%", height: "100px", fontSize: "1.5rem", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", border: "0.1px solid #d0d0d0", backgroundColor: "#0D6EFD", color: "white" }} value="Nakit">Nakit</button>
                </Col>
            </Row>
        </>
    );
};
