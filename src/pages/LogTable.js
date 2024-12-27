import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Pagination, Row, Col, Form } from '@themesberg/react-bootstrap';
import { fetchLogsByDateRange, useVersionCheck, getProductCategory, getCategories } from '../data/DBFunctions';

export default function LogTable() {
  const [logs, setLogs] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(14);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [categorizedProducts, setCategorizedProducts] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  const [productNames, setProductNames] = useState({}); // Ürün isimlerini önbellekle

  const [sortColumn, setSortColumn] = useState(null); // Sıralama kolonu
  const [sortOrder, setSortOrder] = useState('asc'); // Artan veya azalan

  const totalItems = logs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useVersionCheck();


  useEffect(() => {
    const setDailyRange = () => {
      const today = new Date();
      const start = new Date(today);
      const end = new Date(today);
      end.setDate(end.getDate() + 1); // Bitiş tarihi yarın olacak (gün sonu)

      const adjustedDates = adjustStartAndEndDates(start, end);
      setStartDate(adjustedDates.start);
      setEndDate(adjustedDates.end);
      setCurrentPage(1);

      fetchLogs(adjustedDates.start, adjustedDates.end);
    };

    setDailyRange(); // Sayfa açıldığında günlük kayıtları getir
  }, []);


  // 🗓️ Tarihleri doğru formatta ayarlama
  const adjustStartAndEndDates = (start, end) => {
    const adjustHour = (date, hour) => {
      const d = new Date(date);
      d.setHours(hour, 0, 0, 0);
      return d;
    };

    if (!start || !end) {
      throw new Error('Geçersiz başlangıç veya bitiş tarihi');
    }

    return {
      start: adjustHour(start, 2).toISOString(),
      end: adjustHour(end, 2).toISOString(),
    };
  };

  // 📅 Tarih Aralığı Seçimi
  const handleDateRangeChange = (range) => {
    const today = new Date();
    let start, end;

    switch (range) {
      case 'daily':
        start = new Date(today);
        end = new Date(today);
        end.setDate(end.getDate() + 1);
        break;
      case 'weekly':
        const dayOfWeek = today.getDay();
        start = new Date(today);
        start.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      case 'monthly':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'yearly':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        console.error('Geçersiz tarih aralığı türü:', range);
        return;
    }

    try {
      const adjustedDates = adjustStartAndEndDates(start, end);
      setStartDate(adjustedDates.start);
      setEndDate(adjustedDates.end);
      setCurrentPage(1);
    } catch (error) {
      setError('Geçersiz başlangıç veya bitiş tarihi');
      console.error(error.message);
    }
  };

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

  const handleRowExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  // Toplam İndirim Hesaplama
  const totalDiscount = logs.reduce((sum, log) => {
    const amount = parseFloat(log.amount) || 0;
    const amountWithDiscount = parseFloat(log.amountWithDiscount) || 0;

    // Eğer tahsil edilen 0 ise bu kaydı hesaba katma
    if (amountWithDiscount === 0) {
      return sum;
    }

    return sum + (amount - amountWithDiscount);
  }, 0);


  const TableRow = ({ log, index }) => (
    <>
      <tr onClick={() => handleRowExpand(index)} style={{ cursor: 'pointer' }}>
        <td>{log.tableName}</td>
        <td>{log.action}</td>
        <td>{parseFloat(log.amount).toFixed(2)} ₺</td>
        <td>{(parseFloat(log.amountWithDiscount) || 0).toFixed(2)} ₺</td>
        <td>{log.payment_method}</td>
        <td>{log.cashier_name}</td>
        <td>{log.date}</td>
      </tr>
      {expandedRow === index && (
        <tr>
          <td colSpan="7">
            <div className="p-3 border rounded bg-light">
              <h6><strong>Ürün Detayları:</strong></h6>
              <ul>
                {log.products_sold.map((product, idx) => (
                  <li key={idx}>
                    {product.product_name}
                    {product.quantity > 0 ? ` - ${product.quantity} adet` : ' ₺'}
                  </li>
                ))}
              </ul>
            </div>
          </td>
        </tr>
      )}
    </>
  );
  // 📊 Ürün Satış İstatistikleri Hesaplama
  const productTotals = logs.reduce((totals, log) => {
    if (log.products_sold) {
      log.products_sold.forEach((product) => {
        if (!totals[product.category]) {
          totals[product.category] = [];
        }
        totals[product.category].push({
          product_name: product.product_name,
          quantity: product.quantity,
        });
      });
    }
    return totals;
  }, {});

  // 📆 Manuel Tarih Aralığı Seçimi
  const handleCustomRange = (customStartDate, customEndDate) => {
    if (!customStartDate || !customEndDate) {
      setError('Başlangıç ve bitiş tarihleri boş olamaz.');
      return;
    }

    try {
      const adjustedStartDate = adjustStartAndEndDates(customStartDate, customStartDate).start;
      const adjustedEndDate = adjustStartAndEndDates(customEndDate, customEndDate).end;
      setStartDate(adjustedStartDate);
      setEndDate(adjustedEndDate);
      setCurrentPage(1);
    } catch (error) {
      setError('Geçersiz başlangıç veya bitiş tarihi');
      console.error(error.message);
    }
  };

  const totalAmount = logs.reduce((sum, log) => sum + parseFloat(log.amount) || 0, 0);
  const totalCashAmount = logs.reduce((sum, log) => log.payment_method === 'Nakit' ? sum + parseFloat(log.amount) || 0 : sum, 0);
  const totalCreditAmount = logs.reduce((sum, log) => log.payment_method === 'Kredi Kartı' ? sum + parseFloat(log.amount) || 0 : sum, 0);

  useEffect(() => {
    const organizeProductsByCategory = async () => {
      setLoading(true);
      const tempCategorizedProducts = {};
      const tempProductCategories = {}; // productID -> category önbelleği
      const tempProductNames = {}; // productID -> product_name önbelleği

      try {
        for (const log of logs) {
          if (log.products_sold && Array.isArray(log.products_sold)) {
            for (const product of log.products_sold) {
              const { productID, product_name, quantity } = product;

              // 🚨 Boş ürün adlarını atla
              if (!product_name || product_name.trim() === '') {
                console.warn(`Boş ürün adı olan ürün atlandı. productID: ${productID}`);
                continue;
              }

              let category = 'Genel';

              // Eğer ürünün productID'si varsa kategorisini kontrol et
              if (productID) {
                if (!tempProductCategories[productID]) {
                  try {
                    const productInfo = await getProductCategory(productID);
                    console.log('productInfo', productInfo);
                    category = productInfo || 'Genel';
                    tempProductCategories[productID] = category; // Kategoriyi önbelleğe al
                    tempProductNames[productID] = product_name || productInfo?.product_name || 'Bilinmeyen Ürün';
                  } catch (error) {
                    console.warn(`Kategori alınırken hata oluştu: ${error.message}`);
                    tempProductCategories[productID] = 'Genel';
                    tempProductNames[productID] = product_name || 'Bilinmeyen Ürün';
                  }
                } else {
                  // Daha önce alınmışsa önbellekten getir
                  category = tempProductCategories[productID];
                }
              }

              // Kategori yoksa oluştur
              if (!tempCategorizedProducts[category]) {
                tempCategorizedProducts[category] = {};
              }

              const productName = tempProductNames[productID] || product_name || 'Bilinmeyen Ürün';

              // Ürünü ilgili kategoriye ekle ve miktarı artır
              if (tempCategorizedProducts[category][productName]) {
                tempCategorizedProducts[category][productName] += parseInt(quantity) || 1;
              } else {
                tempCategorizedProducts[category][productName] = parseInt(quantity) || 1;
              }
            }
          }
        }

        // Kategorileri toplam miktara göre sırala
        const sortedCategories = Object.entries(tempCategorizedProducts)
          .map(([category, products]) => ({
            category,
            totalQuantity: Object.values(products).reduce((sum, qty) => sum + qty, 0),
          }))
          .sort((a, b) => b.totalQuantity - a.totalQuantity);

        // Her kategori içindeki ürünleri miktarlarına göre sırala
        Object.keys(tempCategorizedProducts).forEach((category) => {
          tempCategorizedProducts[category] = Object.fromEntries(
            Object.entries(tempCategorizedProducts[category]).sort(([, a], [, b]) => b - a)
          );
        });

        setProductNames(tempProductNames);
        setCategoryList(sortedCategories);
        setCategorizedProducts(tempCategorizedProducts);
      } catch (error) {
        console.error('Kategori ve ürün verileri işlenirken hata oluştu:', error.message);
        setError('Kategori ve ürün verileri işlenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (logs.length > 0) {
      organizeProductsByCategory();
    }
  }, [logs]);

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  // 📊 Sıralama Fonksiyonu
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedLogs = [...logs].sort((a, b) => {
    if (!sortColumn) return 0;

    const valueA = a[sortColumn];
    const valueB = b[sortColumn];

    // Eğer değerlerden biri undefined veya null ise, sona gönder
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    // Eğer değerler string ise localeCompare kullan
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOrder === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // Eğer değerler sayı ise doğrudan karşılaştır
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    }

    // Tarih için özel sıralama
    if (sortColumn === 'date') {
      return sortOrder === 'asc'
        ? new Date(valueA) - new Date(valueB)
        : new Date(valueB) - new Date(valueA);
    }

    return 0;
  });

  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Ana Tablo */}
      <Row>
        <Col>
          <Card border="light" className="table-wrapper table-responsive shadow-sm">
            <Card.Body>
              {/* 📅 Tarih Seçimi */}
              <div className="d-flex justify-content-between mb-3 align-items-center">
                <div>
                  <Button className='me-2' onClick={() => handleDateRangeChange('daily')}>Günlük</Button>
                  <Button className='me-2' onClick={() => handleDateRangeChange('weekly')}>Haftalık</Button>
                  <Button className='me-2' onClick={() => handleDateRangeChange('monthly')}>Aylık</Button>
                  <Button className='me-2' onClick={() => handleDateRangeChange('yearly')}>Yıllık</Button>
                </div>

                {/* 📅 Manuel Tarih Aralığı Seçimi */}
                <div>
                  <Form.Group controlId="startDate">
                    <Form.Label>Başlangıç Tarihi</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div>
                  <Form.Group controlId="endDate">
                    <Form.Label>Bitiş Tarihi</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => handleCustomRange(startDate, endDate)}
                >
                  Filtrele
                </Button>
              </div>

              <Table hover>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('tableName')}>Masa Adı</th>
                    <th onClick={() => handleSort('action')}>İşlem Türü</th>
                    <th onClick={() => handleSort('amount')}>Tutar</th>
                    <th onClick={() => handleSort('amountWithDiscount')}>Tahsil Edilen</th>
                    <th onClick={() => handleSort('payment_method')}>Ödeme Yöntemi</th>
                    <th onClick={() => handleSort('cashier_name')}>Kasiyer Adı</th>
                    <th onClick={() => handleSort('date')}>Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log, index) => (
                    <TableRow key={index} log={log} index={index} />
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="2">Genel Toplam</th>
                    <th>{totalAmount.toFixed(2)} ₺</th>
                    <th>{(totalAmount - totalDiscount).toFixed(2)} ₺</th>
                    <th>Nakit: {totalCashAmount.toFixed(2)} ₺</th>
                    <th>Kredi Kartı: {totalCreditAmount.toFixed(2)} ₺</th>
                    <th>İndirim: {totalDiscount.toFixed(2)} ₺</th>
                  </tr>
                </tfoot>
              </Table>
              <Pagination>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </Card.Body>
          </Card>
        </Col>
      </Row>


      {/* 📊 Kategori Bazlı Satış İstatistikleri */}
      <Row>
        <Col>
          <Card className="mt-4">
            <Card.Header style={{ fontWeight: 'bold' }}>
              📊 Kategori Bazlı Satış İstatistikleri
            </Card.Header>
            <Card.Body>
              <div style={{ display: 'flex' }}>
                {/* 📋 Kategori Listesi */}
                <ul style={{ listStyle: 'none', padding: 0, width: '40%' }}>
                  {categoryList.map(({ category, totalQuantity }) => (
                    <li
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #ccc',
                        backgroundColor: selectedCategory === category ? '#f8f9fa' : 'transparent',
                      }}
                    >
                      <span><strong>{category}</strong></span>
                      <span>{totalQuantity} adet</span>
                    </li>
                  ))}
                </ul>

                {/* 📋 Seçilen Kategorinin Ürünleri */}
                <div style={{ width: '60%', paddingLeft: '20px' }}>
                  {selectedCategory ? (
                    <>
                      <h5>
                        {selectedCategory} Kategorisi - Toplam Ürün:{' '}
                        {Object.values(categorizedProducts[selectedCategory]).reduce(
                          (total, qty) => total + qty,
                          0
                        )}
                      </h5>
                      <Table hover>
                        <thead>
                          <tr>
                            <th>Ürün Adı</th>
                            <th>Toplam Adet</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(categorizedProducts[selectedCategory]).map(
                            ([productName, quantity], index) => (
                              <tr key={index}>
                                <td>{productName}</td>
                                <td>{quantity} adet</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                    </>
                  ) : (
                    <p>Lütfen bir kategori seçin.</p>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>


    </>
  );
}
