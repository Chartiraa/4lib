import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col } from '@themesberg/react-bootstrap';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { getOrders, getProducts, getPaidAmount, setPaidAmount, addLog, delOrders, getTempPay, delTempPay, tempPay, getCurrentUserName, updateOrderQuantity, delBaristaOrders, getDiscount, setDiscount } from "../data/DBFunctions";
import Numpad from "./Numpad";
import Swal from "sweetalert2";

export default (props) => {
    const { tableName, refresh, setRefresh, numpadValue, setNumpadValue, cashierName } = props;

    const numpad = useRef(null);

    const [orders, setOrders] = useState({});
    const [products, setProducts] = useState({});
    const [temp, setTemp] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [paid, setPaid] = useState(0);
    const [chart, setChart] = useState(0);
    const [remainder, setRemainder] = useState(0);
    const [isProcessingReturn, setIsProcessingReturn] = useState(false);
    const [discountRate, setDiscountRate] = useState(null);
    const [currentDiscount, setCurrentDiscount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersData, productsData, tempPayData, paidAmountData, discountData] = await Promise.all([
                    getOrders(tableName),
                    getProducts(),
                    getTempPay(tableName),
                    getPaidAmount(tableName),
                    getDiscount(tableName)
                ]);

                setOrders(ordersData);
                setProducts(productsData);
                setTemp(tempPayData);
                setTotalDiscount(discountData.discount);
                if (paidAmountData) {
                    setPaid(paidAmountData.paid);
                }
                if (ordersData == 0) {
                    setPaid(0);
                    setPaidAmount({ tableName: tableName, paid: 0 });
                }
            } catch (error) {
                console.error("Veri çekme sırasında hata oluştu:", error);
            }
        };

        fetchData();
    }, [refresh]);

    useEffect(() => {
        setChart(calcTotalTemp(temp));
    }, [temp]);
    useEffect(() => {
        setRemainder((parseFloat(calcTotalOrders(orders)) - (parseFloat(paid) + parseFloat(totalDiscount)).toFixed(2)).toFixed(2));
    }, [paid]);

    useEffect(() => {
        const total = parseFloat(calcTotalOrders(orders)).toFixed(2);
        setTotalAmount(total);
        setRemainder((parseFloat(total) - (parseFloat(paid) + parseFloat(totalDiscount)).toFixed(2)).toFixed(2));
        let counter = 0;

        Object.values(orders).forEach(order => {
            if (order.paid == order.quantity) {
                counter++;
            }
            if (counter == Object.keys(orders).length) {
                if (temp == null) {
                    delOrders(tableName);
                }
            }
        });

    }, [orders]);

    useEffect(() => {
        setTotalAmount(0);
        setPaid(0);
        setRemainder(0);
        setTotalDiscount(0);
    }, [tableName]);

    const calcTotalOrders = (orders) => {
        let total = 0;
        if (tableName !== "") {
            Object.values(orders).forEach(order => {
                const product = products[order.productID];
                if (product) {
                    total += parseFloat((order.quantity * order.productPrice).toFixed(2));
                }
            });
        }
        return total;
    };

    const calcTotalTemp = (temp) => {
        let total = 0;
        if (tableName !== "") {
            Object.values(temp).forEach(order => {
                const product = products[order.productID];
                if (product) {
                    total += parseFloat((order.quantity * order.productPrice).toFixed(2));
                }
            });
        }
        if (total > 0) {
            setChart(total);
            return total;
        } else {
            setChart(0);
            return total;
        }
    };

    const onClickAll = () => {
        if (isProcessingReturn) {
            return;
        }

        setIsProcessingReturn(true);

        Object.keys(orders).forEach(orderID => {
            const order = orders[orderID];

            if (order.paid !== order.quantity) {
                const tempOrderData = {
                    orderID,
                    productID: order.productID,
                    productName: order.productName,
                    productPrice: order.productPrice,
                    quantity: order.quantity - order.paid,
                    productCategory: order.productCategory,
                    extraShot: order.extraShot || "Yok",
                    syrupFlavor: order.syrupFlavor || "Yok",
                    syrupAmount: order.syrupAmount || "Tek",
                    milkType: order.milkType || "Normal"
                };

                tempPay(tableName, tempOrderData)
                    .then(() => {
                        updateOrderQuantity({ tableName: tableName, orderID: orderID, quantity: order.quantity })
                            .then(() => {
                                setRefresh(refresh + 1);
                                setIsProcessingReturn(false);
                            })
                    })
                    .catch(error => {
                        console.error("TempPay işlemi sırasında bir hata oluştu:", error);
                    });
            }
        });
    };

    const onClickHalf = () => {
        if (isProcessingReturn) {
            return;
        }

        setIsProcessingReturn(true);

        setNumpadValue(parseFloat((remainder / 2).toFixed(2)));

        setIsProcessingReturn(false);
    }

    const onClickRemainder = () => {
        if (isProcessingReturn) {
            return;
        }

        setIsProcessingReturn(true);

        const remainderValue = parseFloat(remainder);
        if (!isNaN(remainderValue)) {
            setNumpadValue(remainderValue.toFixed(2));
        } else {
            console.error("Hata: remainder bir sayı değil!");
        }

        setIsProcessingReturn(false);
    }

    const handlePayment = (paymentMethod) => {
        if (parseFloat(numpadValue) > parseFloat(remainder) || parseFloat(chart) > parseFloat(remainder)) {
            Swal.fire("Hata", "Tutarınız fazla olamaz", "error");
            setNumpadValue("");
            return;
        }

        if (isProcessingReturn) return;
        setIsProcessingReturn(true);

        const cashierName = getCurrentUserName();

        if (parseFloat(remainder) > 0) {
            if (Object.keys(temp).length === 0) {
                processAmountBasedPayment(paymentMethod, cashierName);
            } else {
                processProductBasedPayment(paymentMethod, cashierName);
            }
        } else if (parseFloat(remainder) < 0) {
            console.log("Bakiye yetersiz!");
        }

        setNumpadValue("");
        setDiscountRate(null);
        setRefresh(refresh + 1);
        setIsProcessingReturn(false);
    };

    function processAmountBasedPayment(paymentMethod, cashierName) {

        const newPaid = parseFloat(parseFloat((parseFloat(numpadValue) + parseFloat(paid)).toFixed(2)));
        setPaid(newPaid);

        if (tableName !== "") {
            addLog({
                tableName,
                action: totalDiscount > 0 ? "Indirimli" : "Normal",
                amount: (parseFloat(numpadValue) + parseFloat(currentDiscount)).toFixed(2),
                amountWithDiscount: parseFloat(numpadValue).toFixed(2),
                payment_method: paymentMethod,
                cashier_name: cashierName,
                products_sold: [],
                discount: parseFloat((totalDiscount + currentDiscount).toFixed(2))
            });
        }

        const updatedDiscount = parseFloat((totalDiscount + currentDiscount).toFixed(2));
        setDiscount({ tableName, discount: updatedDiscount });
        setTotalDiscount(updatedDiscount);

        setPaidAmount({ tableName, paid: newPaid });

        setCurrentDiscount(0);

        const totalPaidAndDiscount = (parseFloat(newPaid) + parseFloat(updatedDiscount)).toFixed(2);

        if (totalPaidAndDiscount == parseFloat(totalAmount).toFixed(2)) {
            clearOrders(cashierName);
            resetPaymentDetails();
        } else {
            updatePaymentDetails(newPaid, updatedDiscount);
        }
    }

    function processProductBasedPayment(paymentMethod, cashierName) {
        const productsSold = [];

        Object.keys(temp).forEach(tempKey => {
            const tempOrder = temp[tempKey];
            const tempQuantity = parseInt(tempOrder.quantity, 10);

            if (!isNaN(tempQuantity)) {
                const productName = tempOrder.productName || "Ürün adı bulunamadı";
                const productID = tempOrder.productID;

                if (!productName || productName === "Ürün adı bulunamadı") {
                    console.error(`Geçersiz ürün adı: ${tempOrder.productID}`);
                    return;
                }

                if (!productID) {
                    console.error(`Eksik ürün ID'si: ${productName}`);
                    return;
                }

                productsSold.push({
                    product_name: productName,
                    productID: productID,
                    quantity: tempQuantity
                });

                delTempPay(tableName, tempOrder.orderID);
            }
        });

        const newPaid = parseFloat(parseFloat((parseFloat(chart) + parseFloat(paid)).toFixed(2)));
        setPaid(newPaid);
        const updatedDiscount = parseFloat((totalDiscount + currentDiscount).toFixed(2));
        setTotalDiscount(updatedDiscount);
        setDiscount({ tableName, discount: updatedDiscount });

        if (productsSold.length > 0 && tableName !== "") {
            addLog({
                tableName,
                action: totalDiscount > 0 ? "Indirimli" : "Normal",
                amount: (parseFloat(chart) + parseFloat(currentDiscount)).toFixed(2),
                amountWithDiscount: parseFloat(chart).toFixed(2),
                payment_method: paymentMethod,
                cashier_name: cashierName,
                products_sold: productsSold,
                discount: parseFloat((totalDiscount + currentDiscount).toFixed(2))
            });
        }

        console.log("newPaid", newPaid);
        setPaidAmount({ tableName, paid: newPaid });

        setCurrentDiscount(0);

        const totalPaidAndDiscount = (parseFloat(newPaid) + parseFloat(updatedDiscount)).toFixed(2);
        console.log("totalPaidAndDiscount", totalPaidAndDiscount);
        console.log("totalAmount", parseFloat(totalAmount).toFixed(2));

        if (totalPaidAndDiscount == parseFloat(totalAmount)) {
            clearOrders();
            resetPaymentDetails();
        } else {
            updatePaymentDetails(newPaid, totalDiscount);
        }
    }

    function clearOrders() {
        console.log("clearOrders");
        const productsSold = [];

        Object.values(orders).forEach(order => {
            const quantityDifference = order.quantity - order.paid;

            if (quantityDifference > 0) {
                productsSold.push({
                    product_name: order.productName || "Bilinmeyen Ürün",
                    quantity: quantityDifference,
                    productID: order.productID
                });
            }
            console.log("clearOrderassfhgs");

            delOrders({ tableName, orderID: order.orderID });
            delBaristaOrders(tableName, order.orderID);
        });

        if (productsSold.length > 0) {
            addLog({
                tableName,
                action: "İstatistik Kaydı",
                amount: 0,
                amountWithDiscount: 0,
                payment_method: "Ödenmiş",
                cashier_name: getCurrentUserName(),
                products_sold: productsSold
            });
        }
    }

    function updatePaymentDetails(paidAmount, discount) {
        console.log("updatePaymentDetails", paidAmount);
        setPaidAmount({ tableName, paid: paidAmount });
        setPaid(paidAmount);
    }

    function resetPaymentDetails() {
        setPaidAmount({ tableName, paid: 0 });
        setDiscount({ tableName, discount: 0 });
        setPaid(0);
        setTotalDiscount(0);
    }

    return (
        <>
            <h1>Toplam: {totalAmount}₺</h1>
            <h3>Kalan: {remainder}₺</h3>
            <h3>Ödenen: {paid}₺</h3>
            <h3>Toplam İndirim: {totalDiscount}₺</h3>
            {/* <h3>Sepet: {chart}₺</h3>
            
            <h3>Toplam : {(parseFloat(paid) + parseFloat(totalDiscount)).toFixed(2)}₺</h3>
           <h3>current : {parseFloat(currentDiscount).toFixed(2)}₺</h3>*/}

            <IconField iconPosition="left" style={{ width: "100%", height: "100px", fontSize: "1.5rem", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "10px" }}>
                <InputIcon className="pi pi-money-bill" style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "-10px" }}> </InputIcon>
                <InputText placeholder="Sepet Tutarı" style={{ width: "100%", height: "100px", fontSize: "1.5rem", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center" }} value={chart == 0 ? numpadValue : chart} readOnly />
            </IconField>

            <Numpad setNumpadValue={setNumpadValue} numpadValue={numpadValue} chart={chart} setChart={setChart} totalDiscount={totalDiscount} setTotalDiscount={setTotalDiscount}
                discountRate={discountRate} setDiscountRate={setDiscountRate} currentDiscount={currentDiscount} setCurrentDiscount={setCurrentDiscount} />

            <Row style={{ marginTop: "10px" }}>
                <Col className="p-0">
                    <button onClick={onClickAll} style={{ width: "100%", height: "100px", fontSize: "1.5rem", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", border: "0.1px solid #FF8C42", backgroundColor: "#FF8C42", color: "white" }} value="Tamamı">Tamamı</button>
                </Col>
                <Col className="p-0">
                    <button onClick={onClickHalf} style={{ width: "100%", height: "100px", fontSize: "1.5rem", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", border: "0.1px solid #FFA559", backgroundColor: "#FFA559", color: "white" }} value="Yarısı">Yarısı</button>
                </Col>
                <Col className="p-0">
                    <button onClick={onClickRemainder} style={{ width: "100%", height: "100px", fontSize: "1.5rem", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", border: "0.1px solid #D2691E", backgroundColor: "#D2691E", color: "white" }} value="Kalan">Kalan</button>
                </Col>
            </Row>

            <Row style={{ marginTop: "10px" }}>
                <Col className="p-0">
                    <button onClick={() => handlePayment("Kredi Kartı")} style={{ width: "100%", height: "100px", fontSize: "1.5rem", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", border: "0.1px solid #6FCF97", backgroundColor: "#6FCF97", color: "white" }} value="Kredi">Kredi Kartı</button>
                </Col>
                <Col className="p-0">
                    <button onClick={() => handlePayment("Nakit")} style={{ width: "100%", height: "100px", fontSize: "1.5rem", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", border: "0.1px solid #4DA8DA", backgroundColor: "#4DA8DA", color: "white" }} value="Nakit">Nakit</button>
                </Col>
            </Row>
        </>
    );
};