import React, { useState, useEffect } from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import { BaristaButton } from "../components/Widgets";
import { getBaristaOrders } from "../data/DBFunctions";
import { ScrollPanel } from 'primereact/scrollpanel';

export default () => {

  const [orders, setOrders] = useState({});

  useEffect(() => {
    getBaristaOrders().then(res => setOrders(res));
  }, []);

  return (
    <>
        <Row style={{ marginTop: '2rem' }}>
          <Col xl={12}>
            <ScrollPanel style={{ width: '100%', height: '100%' }}>
              <Row className="justify-content-md-center">
                {Object.entries(orders).map(([key, value], index) => (
                  <Col xl={2} key={index} className="mb-4">
                    {Object.entries(value).map(([key1, value1], index) => (
                    <BaristaButton title={key} productName={value1.productName}/>
                  ))}
                  </Col>
                ))}
              </Row>
            </ScrollPanel>
          </Col>
        </Row>
    </>
  );
};
