import React, { useState, useEffect } from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import { ScrollPanel } from 'primereact/scrollpanel';

import { getTables } from "../data/DBFunctions";
import { OrdersForPay, OrdersForPaying } from "../components/Tables";
import { TableButtonForPay } from "../components/Widgets";
import Pay from "../components/Pay";

export default () => {

  const [tables, setTables] = useState({});
  const [selectedTable, setSelectedTable] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [numpadValue, setNumpadValue] = useState("");


  useEffect(() => {
    getTables().then(res => setTables(res));
  }, []);

  const handleClick = () => {
    setRefresh(refresh + 1);
  }

  return (
    <>
      <Row >
        <Col xs={12} xl={2}>
          <ScrollPanel style={{ width: '100%', height: '98vh' }}>
            <Col xl={12} xs={6} key={999} className="mb-4">
              <TableButtonForPay title={"TakeAway"} setSelectedTable={setSelectedTable} handleClick={handleClick} />
            </Col>
            {Object.entries(tables).map(([key, value]) => (
              <Col xl={12} xs={6} key={value.tableName || key} className="mb-4">
                <TableButtonForPay title={value.tableName} setSelectedTable={setSelectedTable} handleClick={handleClick} />
              </Col>
            ))}

          </ScrollPanel>
        </Col>
        <Col xs={12} xl={6}>
          <h1 style={{ color: "#3C2F2F", fontFamily: 'Montserrat, sans-serif', display: "flex", justifyContent: "center" }}>{selectedTable}</h1>
          <ScrollPanel style={{ width: '100%', height: '45vh' }}>
            <OrdersForPay refresh={refresh} setRefresh={setRefresh} tableName={selectedTable} numpadValue={numpadValue} setNumpadValue={setNumpadValue} />
          </ScrollPanel>
          <ScrollPanel style={{ width: '100%', height: '45vh', marginTop: "1vh" }}>
            <OrdersForPaying refresh={refresh} setRefresh={setRefresh} tableName={selectedTable} numpadValue={numpadValue} setNumpadValue={setNumpadValue} />
          </ScrollPanel>
        </Col>
        <Col xs={12} xl={4}>
          <ScrollPanel style={{ width: '100%', height: '98vh' }}>
            <Pay refresh={refresh} setRefresh={setRefresh} tableName={selectedTable} numpadValue={numpadValue} setNumpadValue={setNumpadValue} />
          </ScrollPanel>
        </Col>
      </Row>
    </>
  );
};
