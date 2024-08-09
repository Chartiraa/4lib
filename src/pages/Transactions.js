import React, { useState, useEffect } from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import { MenuButton } from "../components/Widgets";
import { Button } from "primereact/button";
import { ScrollPanel } from 'primereact/scrollpanel';

export default () => {

  return (
    <>
      <Row >
        <Col xs={12} xl={1}>
          <ScrollPanel style={{ width: '100%' }}>
            <p>
              Lorem ipsum dolor ...
            </p>
          </ScrollPanel>
        </Col>
        <Col xs={12} xl={4}>
          <ScrollPanel style={{ width: '100%', height: '100vh' }}>

          </ScrollPanel>
        </Col>
        <Col xs={12} xl={2} className="d-flex">
          <ScrollPanel style={{ width: '100%', height: '100vh' }}>
            <Button label="Kategori 1" style={{ height: '5rem', width: '100%' }} />
            <Button label="Kategori 2" style={{ height: '5rem', width: '100%' }} className="mt-3" />
            <Button label="Kategori 3" style={{ height: '5rem', width: '100%' }} className="mt-3" />
            <Button label="Kategori 4" style={{ height: '5rem', width: '100%' }} className="mt-3" />
            <Button label="Kategori 5" style={{ height: '5rem', width: '100%' }} className="mt-3" />
            <Button label="Kategori 6" style={{ height: '5rem', width: '100%' }} className="mt-3" />
            <Button label="Kategori 7" style={{ height: '5rem', width: '100%' }} className="mt-3" />
            <Button label="Kategori 8" style={{ height: '5rem', width: '100%' }} className="mt-3" />
            <Button label="Kategori 9" style={{ height: '5rem', width: '100%' }} className="mt-3" />
          </ScrollPanel>
        </Col>
        <Col xs={12} xl={5} className="d-flex">

        </Col>
      </Row>
    </>
  );
};
