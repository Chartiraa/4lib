import React from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import { Users, TableSettings, ProductSettings, CategorySettings } from "../components/Forms";

export default () => {

  return (
    <>
      <h1 className="h3 mb-5 mt-5">Kafe Ayarları</h1>
      <Row>
        <Col xs={12} xl={8}>
          <ProductSettings />
          <Users />
        </Col>
        <Col xs={12} xl={4}>
          <TableSettings />
          <CategorySettings />
        </Col>
      </Row>
    </>
  );
};
