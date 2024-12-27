import React, { useState, useEffect } from "react";
import { Row, Col } from '@themesberg/react-bootstrap';
import "../css/Numpad.css";

export default (props) => {
    const { numpadValue, setNumpadValue, chart, setChart, totalDiscount, setTotalDiscount, discountRate, setDiscountRate, currentDiscount, setCurrentDiscount } = props;

    // Numpad için orijinal değer
    const [originalValue, setOriginalValue] = useState(numpadValue);

    // Chart için orijinal değer
    const [originalChart, setOriginalChart] = useState(chart);

    // Discount için orijinal değer
    const [originalDiscount, setOriginalDiscount] = useState(totalDiscount);

    /**
     * Chart ve Numpad Değerlerinin Güncellenmesi
     */
    useEffect(() => {
        if (discountRate === null) {
            setOriginalChart(chart); // İndirim yoksa orijinal chart değerini güncelle
            setOriginalValue(numpadValue); // İndirim yoksa orijinal numpad değerini güncelle
            setOriginalDiscount(totalDiscount);
        }
    }, [chart, numpadValue, discountRate, totalDiscount]);

    /**
     * İndirim hesaplama fonksiyonu
     */
    const calcDiscount = (value) => {
        const discount = parseFloat(value); // Yüzde değerini al
    
        if (discountRate === discount) {
            // 🔄 Aynı butona basıldıysa indirim kaldır
            setDiscountRate(null);
            setNumpadValue(originalValue); // Orijinal Numpad değerini geri yükle
            setChart(originalChart); // Orijinal Chart değerini geri yükle
            setCurrentDiscount(0);
        } else {
            // 🆕 Yeni bir indirim oranı seçildi
            setDiscountRate(discount);
    
            if (chart === 0) {
                let calculatedValue = originalValue * (1 - discount / 100);
                setNumpadValue(calculatedValue.toFixed(2));
    
                // Toplam indirimi doğru hesapla
                setCurrentDiscount(originalValue - calculatedValue);
            } else {
                let calculatedValue = originalChart * (1 - discount / 100);
                setChart(calculatedValue.toFixed(2));
    
                // Toplam indirimi doğru hesapla
                setCurrentDiscount(originalChart - calculatedValue);
            }
        }
    };
    

    /**
     * Rakam butonları için
     */
    const handler = (e) => {
        const newValue = numpadValue + e.target.value;
        setNumpadValue(newValue);
        setOriginalValue(newValue); // Orijinal değer güncellenir
        setDiscountRate(null); // Yeni değer girildiğinde indirim sıfırlanır
    };

    /**
     * Temizle butonu için
     */
    const clear = () => {
        setNumpadValue("");
        setChart(0);
        setCurrentDiscount(0);
        setDiscountRate(null); // İndirim oranını sıfırla
        setOriginalValue(""); // Orijinal değeri temizle
        setOriginalChart(0); // Chart sıfırlama değeri temizle
    };

    return (
        <>
            <Row>
                <Col className="p-0">
                    <button className="numpad-button" onClick={handler} value="1">1</button>
                </Col>
                <Col className="p-0">
                    <button className="numpad-button" onClick={handler} value="2">2</button>
                </Col>
                <Col className="p-0">
                    <button className="numpad-button" onClick={handler} value="3">3</button>
                </Col>
                <Col className="p-0 ms-3">
                    <button
                        className={`numpad-button ${discountRate === 5 ? "active" : ""}`}
                        onClick={() => calcDiscount(5)}
                    >
                        %5
                    </button>
                </Col>
            </Row>

            <Row>
                <Col className="p-0">
                    <button className="numpad-button" onClick={handler} value="4">4</button>
                </Col>
                <Col className="p-0">
                    <button className="numpad-button" onClick={handler} value="5">5</button>
                </Col>
                <Col className="p-0">
                    <button className="numpad-button" onClick={handler} value="6">6</button>
                </Col>
                <Col className="p-0 ms-3">
                    <button
                        className={`numpad-button ${discountRate === 10 ? "active" : ""}`}
                        onClick={() => calcDiscount(10)}
                    >
                        %10
                    </button>
                </Col>
            </Row>

            <Row>
                <Col className="p-0">
                    <button className="numpad-button" onClick={handler} value="7">7</button>
                </Col>
                <Col className="p-0">
                    <button className="numpad-button" onClick={handler} value="8">8</button>
                </Col>
                <Col className="p-0">
                    <button className="numpad-button" onClick={handler} value="9">9</button>
                </Col>
                <Col className="p-0 ms-3">
                    <button
                        className={`numpad-button ${discountRate === 20 ? "active" : ""}`}
                        onClick={() => calcDiscount(20)}
                    >
                        %20
                    </button>
                </Col>
            </Row>

            <Row>
                <Col className="p-0">
                    <button className="numpad-button" onClick={handler} value=".">.</button>
                </Col>
                <Col className="p-0">
                    <button className="numpad-button" onClick={handler} value="0">0</button>
                </Col>
                <Col className="p-0">
                    <button className="numpad-button" onClick={clear}>Sil</button>
                </Col>
                <Col className="p-0 ms-3">
                    <button
                        className={`numpad-button ${discountRate === 30 ? "active" : ""}`}
                        onClick={() => calcDiscount(30)}
                    >
                        %30
                    </button>
                </Col>
            </Row>
        </>
    );
};