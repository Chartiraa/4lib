import React from "react";
import { Row, Col } from '@themesberg/react-bootstrap';
import "../css/Numpad.css";

export default (props) => {

    const { numpadValue, setNumpadValue } = props;

    const handler = (e) => {
        setNumpadValue(numpadValue + e.target.value);
    };

    const clear = () => {
        setNumpadValue("");
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
            </Row>

            <Row>
                <Col className="p-0">
                    <button className="numpad-button" onClick={handler} value="0">0</button>
                </Col>
                <Col className="p-0">
                    <button className="numpad-button" onClick={clear} value="">Sil</button>
                </Col>
            </Row>
        </>
    );
}
