import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Pagination, Row, Col, Form } from '@themesberg/react-bootstrap';
import { fetchLogsByDateRange } from '../data/DBFunctions'; // Firebase'den logları getiren fonksiyon

export default function LogTable() {
  const [logs, setLogs] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // Sayfa başına gösterilecek öğe sayısı
  const totalItems = logs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (startDate && endDate) {
      setLoading(true);
      setError('');
      fetchLogsByDateRange(startDate, endDate)
        .then((data) => {
          setLogs(data);
          if (data.length === 0) {
            setError('Bu tarih aralığında kayıt bulunamadı.');
          }
        })
        .catch((err) => {
          setError('Veri çekerken bir hata oluştu: ' + err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [startDate, endDate]);

  const handleDateRangeChange = (range) => {
    const today = new Date();
    let start, end;

    if (range === 'daily') {
      start = today.toISOString().split('T')[0].split('-').reverse().join('-') + ' - 00:00';
      end = today.toISOString().split('T')[0].split('-').reverse().join('-') + ' - 23:59';
    } else if (range === 'weekly') {
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      start = lastWeek.toISOString().split('T')[0].split('-').reverse().join('-') + ' - 00:00';
      end = today.toISOString().split('T')[0].split('-').reverse().join('-') + ' - 23:59';
    } else if (range === 'monthly') {
      const lastMonth = new Date(today);
      lastMonth.setMonth(today.getMonth() - 1);
      start = lastMonth.toISOString().split('T')[0].split('-').reverse().join('-') + ' - 00:00';
      end = new Date().toISOString().split('T')[0].split('-').reverse().join('-') + ' - 23:59';
    }

    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1); // Sayfayı sıfırla
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value)); // Kullanıcının seçtiği öğe sayısını ayarla
    setCurrentPage(1); // Sayfayı sıfırla
  };

  const TableRow = ({ tableName, action, amount, date, payment_method, cashier_name, products_sold }) => (
    <tr>
      <td><span className="fw-normal">{tableName}</span></td>
      <td><span className="fw-normal">{action}</span></td>
      <td><span className="fw-normal">{amount}</span></td>
      <td><span className="fw-normal">{payment_method}</span></td>
      <td><span className="fw-normal">{cashier_name}</span></td>
      <td>
        <ul>
          {products_sold && products_sold.map((product, index) => (
            <li key={index}>{product.product_name} - {product.quantity} adet</li>
          ))}
        </ul>
      </td>
      <td><span className="fw-normal">{date}</span></td>
    </tr>
  );

  const paginatedLogs = logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Toplamları Hesapla
  const totalAmount = logs.reduce((sum, log) => sum + parseFloat(log.amount) || 0, 0);
  const totalCashAmount = logs.reduce((sum, log) => log.payment_method === 'Nakit' ? sum + parseFloat(log.amount) || 0 : sum, 0);
  const totalCreditAmount = logs.reduce((sum, log) => log.payment_method === 'Kredi Kartı' ? sum + parseFloat(log.amount) || 0 : sum, 0);

  // Ürün bazında satış toplamları
  const productTotals = logs.reduce((totals, log) => {
    if (log.products_sold) {
      log.products_sold.forEach((product) => {
        if (!totals[product.product_name]) {
          totals[product.product_name] = 0;
        }
        totals[product.product_name] += product.quantity;
      });
    }
    return totals;
  }, {});

  // Kasiyere göre toplamlar
  const cashierTotals = logs.reduce((totals, log) => {
    if (!totals[log.cashier_name]) {
      totals[log.cashier_name] = 0;
    }
    totals[log.cashier_name] += parseFloat(log.amount);
    return totals;
  }, {});

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Row>
      {/* 9 Kolonluk Kayıtlar Tablosu */}
      <Col md={9}>
        <Card border="light" className="table-wrapper table-responsive shadow-sm">
          <Card.Body className="pt-0">
            <div className="d-flex justify-content-between mb-3 mt-3">
              <div>
                <Button variant="primary" onClick={() => handleDateRangeChange('daily')}>Günlük</Button>
                <Button variant="secondary" className="mx-2" onClick={() => handleDateRangeChange('weekly')}>Haftalık</Button>
                <Button variant="success" onClick={() => handleDateRangeChange('monthly')}>Aylık</Button>
              </div>
              {/* Sayfa başına gösterilecek öğe sayısını seçmek için Form.Select */}
              <Form.Select
                size="sm"
                style={{ width: 'auto' }}
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={5}>5 Kayıt</option>
                <option value={10}>10 Kayıt</option>
                <option value={12}>12 Kayıt</option>
                <option value={20}>20 Kayıt</option>
                <option value={50}>50 Kayıt</option>
              </Form.Select>
            </div>
            {loading ? (
              <p>Yükleniyor...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <>
                <Table hover className="user-table align-items-center">
                  <thead>
                    <tr>
                      <th className="border-bottom">Masa Adı</th>
                      <th className="border-bottom">İşlem Türü</th>
                      <th className="border-bottom">Miktar</th>
                      <th className="border-bottom">Ödeme Yöntemi</th>
                      <th className="border-bottom">Kasiyer Adı</th>
                      <th className="border-bottom">Ürünler</th>
                      <th className="border-bottom">Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.map((log, index) => <TableRow key={index} {...log} />)}
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

      {/* 3 Kolonluk Toplamlar Tablosu */}
      <Col md={3}>
        <Card border="light" className="shadow-sm">
          <Card.Body>
            <h5>Toplamlar</h5>
            <Table className="table-borderless">
              <tbody>
                <tr>
                  <td><strong>Genel Toplam Tutar:</strong></td>
                </tr>
                <tr>
                  <td>{totalAmount.toFixed(2)} TL</td>
                </tr>
                <tr>
                  <td><strong>Nakit Toplam:</strong></td>
                </tr>
                <tr>
                  <td>{totalCashAmount.toFixed(2)} TL</td>
                </tr>
                <tr>
                  <td><strong>Kredi Kartı Toplam:</strong></td>
                </tr>
                <tr>
                  <td>{totalCreditAmount.toFixed(2)} TL</td>
                </tr>
              </tbody>
            </Table>
            <h6>Ürün Bazında Satışlar:</h6>
            <ul>
              {Object.entries(productTotals).map(([product, quantity]) => (
                <li key={product}>{product}: {quantity} adet satıldı</li>
              ))}
            </ul>
            <h6>Ödeme Alan Kişilere Göre Toplamlar:</h6>
            <ul>
              {Object.entries(cashierTotals).map(([cashier, total]) => (
                <li key={cashier}>{cashier}: {total.toFixed(2)} TL</li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
