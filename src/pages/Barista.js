import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Pagination, Row, Col } from '@themesberg/react-bootstrap';
import Swal from "sweetalert2";
import { getBaristaOrders, delBaristaOrders } from "../data/DBFunctions";

export default function BaristaTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // Sayfa başına gösterilecek öğe sayısı
  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    setLoading(true);
    getBaristaOrders()
      .then(res => {
        const formattedOrders = Object.entries(res).flatMap(([tableName, tableOrders]) => 
          Object.entries(tableOrders).map(([orderID, orderDetails]) => ({
            tableName,
            orderID,
            ...orderDetails
          }))
        );
        setOrders(formattedOrders);
      })
      .catch(err => setError('Veri çekerken bir hata oluştu: ' + err.message))
      .finally(() => setLoading(false));
  }, [currentPage]);

  const handleOrderReady = ({ tableName, orderID, productName }) => {
    Swal.fire({
      icon: "question",
      title: "Masa:" + tableName + " - " + productName + " hazır mı?",
      showDenyButton: true,
      confirmButtonText: "Evet",
      denyButtonText: `Hayır`
    }).then((result) => {
      if (result.isConfirmed) {
        delBaristaOrders(tableName, orderID)
          .then(() => {
            Swal.fire("Sipariş hazır!", "", "success");
            setOrders(prevOrders => prevOrders.filter(order => !(order.tableName === tableName && order.orderID === orderID)));
          })
          .catch(error => {
            console.error("Silme işlemi başarısız:", error);
            Swal.fire("Hata", "Sipariş silinirken bir hata oluştu", "error");
          });
      }
    });
  };

  const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Row>
      {/* 12 Kolonluk Siparişler Tablosu */}
      <Col xl={12}>
        <Card border="light" className="table-wrapper table-responsive shadow-sm">
          <Card.Body className="pt-0">
            {loading ? (
              <p>Yükleniyor...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <>
                <Table hover className="align-items-center">
                  <thead>
                    <tr>
                      <th className="border-bottom">Masa Adı</th>
                      <th className="border-bottom">Ürün Adı</th>
                      <th className="border-bottom">Fiyat</th>
                      <th className="border-bottom">Adet</th>
                      <th className="border-bottom">Ekstra Shot</th>
                      <th className="border-bottom">Aroma Şurubu</th>
                      <th className="border-bottom">Şurup Miktarı</th>
                      <th className="border-bottom">Süt Tipi</th>
                      <th className="border-bottom">Tarih</th>
                      <th className="border-bottom">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order, index) => (
                      <tr key={index}>
                        <td>{order.tableName}</td>
                        <td>{order.productName}</td>
                        <td>{order.productPrice} TL</td>
                        <td>{order.quantity}</td>
                        <td>{order.extraShot || '-'}</td>
                        <td>{order.syrupFlavor || '-'}</td>
                        <td>{order.syrupAmount || '-'}</td>
                        <td>{order.milkType || '-'}</td>
                        <td>{order.lastEditDate}</td>
                        <td>
                          <Button variant="outline-danger" onClick={() => handleOrderReady(order)}>
                            Hazır
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {/* Sayfalama Kontrolleri */}
                <Pagination className="mt-3">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
