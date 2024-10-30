import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Pagination, Row, Col, Form } from '@themesberg/react-bootstrap';
import { fetchLogsByDateRange } from '../data/DBFunctions';

export default function LogTable() {
  const [logs, setLogs] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const totalItems = logs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const fetchLogs = (start, end) => {
    setLoading(true);
    setError('');
    fetchLogsByDateRange(start, end)
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
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchLogs(startDate, endDate);
    }
  }, [startDate, endDate]);

  const adjustStartAndEndDates = (start, end) => {
    const adjustHour = (date, hour) => {
      const d = new Date(date);
      d.setHours(hour, 0, 0, 0);
      return d;
    };
    return {
      start: adjustHour(start, 2).toISOString(),
      end: adjustHour(end, 2).toISOString(),
    };
  };

  const handleDateRangeChange = (range) => {
    const today = new Date();
    let start, end;

    if (range === 'daily') {
      start = new Date(today);
      end = new Date(today);
      end.setDate(end.getDate() + 1);
    } else if (range === 'weekly') {
      const dayOfWeek = today.getDay();
      start = new Date(today);
      start.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      end = new Date(start);
      end.setDate(start.getDate() + 6);
    } else if (range === 'monthly') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (range === 'yearly') {
      start = new Date(today.getFullYear(), 0, 1);
      end = new Date(today.getFullYear(), 11, 31);
    }

    const adjustedDates = adjustStartAndEndDates(start, end);
    setStartDate(adjustedDates.start);
    setEndDate(adjustedDates.end);
    setCurrentPage(1);
  };

  const handleCustomRange = (customStartDate, customEndDate) => {
    const adjustedStartDate = adjustStartAndEndDates(customStartDate, customStartDate).start;
    const adjustedEndDate = adjustStartAndEndDates(customEndDate, customEndDate).end;
    const endDateInclusive = new Date(adjustedEndDate);
    endDateInclusive.setDate(endDateInclusive.getDate() + 1);

    if (adjustedStartDate && endDateInclusive) {
        setStartDate(adjustedStartDate);
        setEndDate(endDateInclusive.toISOString());
    } else {
        setError('Geçersiz tarih aralığı.');
    }
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

  const totalAmount = logs.reduce((sum, log) => sum + parseFloat(log.amount) || 0, 0);
  const totalCashAmount = logs.reduce((sum, log) => log.payment_method === 'Nakit' ? sum + parseFloat(log.amount) || 0 : sum, 0);
  const totalCreditAmount = logs.reduce((sum, log) => log.payment_method === 'Kredi Kartı' ? sum + parseFloat(log.amount) || 0 : sum, 0);

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

  const sortedProductTotals = Object.entries(productTotals)
    .filter(([productName]) => productName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b[1] - a[1]);

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
      <Col md={9}>
        <Card border="light" className="table-wrapper table-responsive shadow-sm">
          <Card.Body className="pt-0">
            <div className="d-flex justify-content-between mb-3 mt-3">
              <div>
                <Button variant="primary" onClick={() => handleDateRangeChange('daily')}>Günlük</Button>
                <Button variant="secondary" className="mx-2" onClick={() => handleDateRangeChange('weekly')}>Haftalık</Button>
                <Button variant="success" onClick={() => handleDateRangeChange('monthly')}>Aylık</Button>
                <Button variant="info" className="mx-2" onClick={() => handleDateRangeChange('yearly')}>Yıllık</Button>
              </div>
              <div>
                <Form.Label>Tarihe Göre Filtrele:</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Form.Control
                  type="date"
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <Button variant="outline-primary" onClick={() => handleCustomRange(startDate, endDate)}>Filtrele</Button>
              </div>
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
      <Col md={3}>
        <Card border="light" className="shadow-sm">
          <Card.Body>
            <h5>Toplamlar</h5>
            <Table className="table-borderless">
              <tbody>
                <tr><td><strong>Genel Toplam Tutar:</strong></td><td>{totalAmount.toFixed(2)} TL</td></tr>
                <tr><td><strong>Nakit Toplam:</strong></td><td>{totalCashAmount.toFixed(2)} TL</td></tr>
                <tr><td><strong>Kredi Kartı Toplam:</strong></td><td>{totalCreditAmount.toFixed(2)} TL</td></tr>
              </tbody>
            </Table>
            <h6>Ürün Bazında Satışlar:</h6>
            <Form.Control
              type="text"
              placeholder="Ürün adı ile arayın..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3"
            />
            <ul>
              {sortedProductTotals.map(([product, quantity]) => (
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
