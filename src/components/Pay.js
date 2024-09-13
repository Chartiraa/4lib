import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col } from '@themesberg/react-bootstrap';
import { getOrders, getProducts, getTotal, setTotal, editTotal, addLog, delOrders, getTempPay, delTempPay, setTempPay, getCurrentUserName } from "../data/DBFunctions";
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
        Object.keys(orders).forEach(orderID => {
            const order = orders[orderID];
            setTemp({ orderID, ...order });
        });
        setRefresh(refresh + 1);
    };

    const onClickHalf = () => {
        setNumpadValue(remainder / 2);
    };

    const onClickCredit = () => {
        const cashierName = getCurrentUserName(); // Kullanıcı adını al

        editTotal({ tableName: tableName, total: (remainder - numpadValue) })
            .then(() => {
                setPaid(numpadValue);
                setRemainder(remainder - numpadValue);
                // Satış ürün detaylarını oluştur
                const productsSold = Object.values(mergedData).map(order => ({
                    product_name: products[order.productID]?.productName,
                    quantity: order.quantity
                }));
                // Log ekleme
                addLog({
                    tableName: tableName,
                    action: "Kredi Kartı",
                    amount: numpadValue,
                    payment_method: "Kredi Kartı",
                    cashier_name: cashierName,  // Kasiyer adı ekleniyor
                    products_sold: productsSold  // Satılan ürünlerin detayları ekleniyor
                });
            });
        setNumpadValue("");
        Object.keys(mergedData).map(key => delOrders({ tableName: tableName, orderID: key }));
        Object.keys(mergedData).map(key => delTempPay({ orderID: key }));
        setRefresh(refresh + 1);
    };

    const onClickCash = () => {
        const cashierName = getCurrentUserName(); // Kullanıcı adını al

        editTotal({ tableName: tableName, total: (remainder - numpadValue) })
            .then(() => {
                setPaid(numpadValue);
                setRemainder(remainder - numpadValue);
                // Satış ürün detaylarını oluştur
                const productsSold = Object.values(mergedData).map(order => ({
                    product_name: products[order.productID]?.productName,
                    quantity: order.quantity
                }));
                // Log ekleme
                addLog({
                    tableName: tableName,
                    action: "Nakit",
                    amount: numpadValue,
                    payment_method: "Nakit",
                    cashier_name: cashierName,  // Kasiyer adı ekleniyor
                    products_sold: productsSold  // Satılan ürünlerin detayları ekleniyor
                });
            });
        setNumpadValue("");
        Object.keys(mergedData).map(key => delOrders({ tableName: tableName, orderID: key }));
        Object.keys(mergedData).map(key => delTempPay({ orderID: key }));
        setRefresh(refresh + 1);
    };

    return (
        <>
            <h3>Toplam: {totalAmount}₺</h3>
            <h3>Ödenen: {paid}₺</h3>
            <h1>Kalan: {remainder}₺</h1>

            <Form.Control ref={numpad} required value={numpadValue} placeholder="Tahsil edilecek tutarı giriniz" style={{ marginBottom: "10px", marginTop: "10px" }} />

            <Row style={{ marginBottom: "10px" }}>
                <Col className="p-0">
                    <button onClick={onClickAll} style={{ width: "100%", height: "100px", fontSize: "1.5rem", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", border: "0.1px solid #d0d0d0", backgroundColor: "#198754", color: "white" }} value="Tamamı">Tamamı</button>
                </Col>
            </Row>

            <Numpad setNumpadValue={setNumpadValue} numpadValue={numpadValue} />

            <Row style={{ marginTop: "10px" }}>
                <Col className="p-0">
                    <button onClick={onClickCredit} style={{ width: "100%", height: "100px", fontSize: "1.5rem", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", border: "0.1px solid #d0d0d0", backgroundColor: "#198754", color: "white" }} value="Kredi">Kredi Kartı</button>
                </Col>
                <Col className="p-0">
                    <button onClick={onClickCash} style={{ width: "100%", height: "100px", fontSize: "1.5rem", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", border: "0.1px solid #d0d0d0", backgroundColor: "#0D6EFD", color: "white" }} value="Nakit">Nakit</button>
                </Col>
            </Row>
        </>
    );
};
