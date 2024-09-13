import React, { useState, useEffect } from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import { TableButton } from "../../components/Widgets";
import { getTables, getOccupiedTables } from "../../data/DBFunctions";
import { ScrollPanel } from 'primereact/scrollpanel';

export default () => {
  const [tables, setTables] = useState({});
  const [occupiedTables, setOccupiedTables] = useState([]);
  const [isXLargeScreen, setIsXLargeScreen] = useState(window.innerWidth >= 1200);

  useEffect(() => {
    // Tüm masaları ve dolu masaları çek
    getTables().then(res => {
      setTables(res);
    });

    getOccupiedTables().then(res => {
      setOccupiedTables(res);
    });

    // Ekran boyutunu izlemek için bir event listener ekleyin
    const handleResize = () => {
      setIsXLargeScreen(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function: event listener'ı kaldırın
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Row style={{ marginTop: '2rem' }}>
        <Col xl={12}>
          <ScrollPanel style={{ width: '100%', height: '100%' }}>
            <Row className="justify-content-md-center">
              <Col xl={2} key={999} className="mb-4">
                <TableButton 
                  title={"TakeAway"} 
                  height={isXLargeScreen ? '8rem' : '4rem'}
                  style={{ backgroundColor: 'transparent', color: 'white', cursor: "pointer" }} 
                />
              </Col>
              {Object.entries(tables).map(([key, value], index) => {
                const isOccupied = occupiedTables.includes(key);  // Dolu olup olmadığını kontrol et
                return (
                  <Col xl={2} xs={4} key={index} className="mb-4"> {/* Küçük ekranlar için xs ayarı ekledik */}
                    <TableButton 
                      title={value.tableName}
                      height={isXLargeScreen ? '8rem' : '4rem'}
                      style={{ backgroundColor: isOccupied ? '#ffb6b1' : 'transparent', color: 'white', cursor: "pointer" }}
                    />
                  </Col>
                );
              })}
            </Row>
          </ScrollPanel>
        </Col>
      </Row>
    </>
  );
};
