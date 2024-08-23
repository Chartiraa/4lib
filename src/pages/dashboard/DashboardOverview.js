import React, { useState, useEffect } from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import { TableButton } from "../../components/Widgets";
import { getTables } from "../../data/DBFunctions";
import { ScrollPanel } from 'primereact/scrollpanel';

export default () => {

  const [tables, setTables] = useState({});

  useEffect(() => {
    getTables().then(res => setTables(res));
  }, []);

  return (
    <>
        <Row style={{ marginTop: '2rem' }}>
          <Col xl={12}>
            <ScrollPanel style={{ width: '100%', height: '100%' }}>
              <Row className="justify-content-md-center">
                <Col xl={2} key={999} className="mb-4">
                  <TableButton title={"TakeAway"}/>
                </Col>
                {Object.entries(tables).map(([key, value], index) => (
                  <Col xl={2} key={index} className="mb-4">
                    <TableButton title={value.tableName}/>
                  </Col>
                ))}
              </Row>
            </ScrollPanel>
          </Col>
        </Row>
    </>
  );
};
