
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faArrowDown, faArrowUp, faEdit, faCreditCard, faExternalLinkAlt, faTrashAlt, faBackward, faMinus, faPlus, faSort } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Image, Button, Table, Modal, ProgressBar, Form, Pagination, InputGroup } from '@themesberg/react-bootstrap';
import Swal from "sweetalert2";

import { pageVisits, pageTraffic, pageRanking } from "../data/tables";
import commands from "../data/commands";

import { getAccounts, editAccount, delAccount, getTables, delTable, getProducts, editProduct, delProduct, getCategories, editCategory, delCategory, getOrders, uploadImage, tempPay, getTempPay, getProductCategory, delOrders, delBaristaOrders, updateOrderQuantity, addBackToOrders, editTempPay, editOrders } from "../data/DBFunctions";


const ValueChange = ({ value, suffix }) => {
  const valueIcon = value < 0 ? faAngleDown : faAngleUp;
  const valueTxtColor = value < 0 ? "text-danger" : "text-success";

  return (
    value ? <span className={valueTxtColor}>
      <FontAwesomeIcon icon={valueIcon} />
      <span className="fw-bold ms-1">
        {Math.abs(value)}{suffix}
      </span>
    </span> : "--"
  );
};

export const PageVisitsTable = () => {
  const TableRow = (props) => {
    const { pageName, views, returnValue, bounceRate } = props;
    const bounceIcon = bounceRate < 0 ? faArrowDown : faArrowUp;
    const bounceTxtColor = bounceRate < 0 ? "text-danger" : "text-success";

    return (
      <tr>
        <th scope="row">{pageName}</th>
        <td>{views}</td>
        <td>${returnValue}</td>
        <td>
          <FontAwesomeIcon icon={bounceIcon} className={`${bounceTxtColor} me-3`} />
          {Math.abs(bounceRate)}%
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>Page visits</h5>
          </Col>
          <Col className="text-end">
            <Button variant="secondary" size="sm">See all</Button>
          </Col>
        </Row>
      </Card.Header>
      <Table responsive className="align-items-center table-flush">
        <thead className="thead-light">
          <tr>
            <th scope="col">Page name</th>
            <th scope="col">Page Views</th>
            <th scope="col">Page Value</th>
            <th scope="col">Bounce rate</th>
          </tr>
        </thead>
        <tbody>
          {pageVisits.map(pv => <TableRow key={`page-visit-${pv.id}`} {...pv} />)}
        </tbody>
      </Table>
    </Card>
  );
};

export const PageTrafficTable = () => {
  const TableRow = (props) => {
    const { id, source, sourceIcon, sourceIconColor, sourceType, category, rank, trafficShare, change } = props;

    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">{id}</Card.Link>
        </td>
        <td className="fw-bold">
          <FontAwesomeIcon icon={sourceIcon} className={`icon icon-xs text-${sourceIconColor} w-30`} />
          {source}
        </td>
        <td>{sourceType}</td>
        <td>{category ? category : "--"}</td>
        <td>{rank ? rank : "--"}</td>
        <td>
          <Row className="d-flex align-items-center">
            <Col xs={12} xl={2} className="px-0">
              <small className="fw-bold">{trafficShare}%</small>
            </Col>
            <Col xs={12} xl={10} className="px-0 px-xl-1">
              <ProgressBar variant="primary" className="progress-lg mb-0" now={trafficShare} min={0} max={100} />
            </Col>
          </Row>
        </td>
        <td>
          <ValueChange value={change} suffix="%" />
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm mb-4">
      <Card.Body className="pb-0">
        <Table responsive className="table-centered table-nowrap rounded mb-0">
          <thead className="thead-light">
            <tr>
              <th className="border-0">#</th>
              <th className="border-0">Traffic Source</th>
              <th className="border-0">Source Type</th>
              <th className="border-0">Category</th>
              <th className="border-0">Global Rank</th>
              <th className="border-0">Traffic Share</th>
              <th className="border-0">Change</th>
            </tr>
          </thead>
          <tbody>
            {pageTraffic.map(pt => <TableRow key={`page-traffic-${pt.id}`} {...pt} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const RankingTable = () => {
  const TableRow = (props) => {
    const { country, countryImage, overallRank, overallRankChange, travelRank, travelRankChange, widgetsRank, widgetsRankChange } = props;

    return (
      <tr>
        <td className="border-0">
          <Card.Link href="#" className="d-flex align-items-center">
            <Image src={countryImage} className="image-small rounded-circle me-2" />
            <div><span className="h6">{country}</span></div>
          </Card.Link>
        </td>
        <td className="fw-bold border-0">
          {overallRank ? overallRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={overallRankChange} />
        </td>
        <td className="fw-bold border-0">
          {travelRank ? travelRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={travelRankChange} />
        </td>
        <td className="fw-bold border-0">
          {widgetsRank ? widgetsRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={widgetsRankChange} />
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body className="pb-0">
        <Table responsive className="table-centered table-nowrap rounded mb-0">
          <thead className="thead-light">
            <tr>
              <th className="border-0">Country</th>
              <th className="border-0">All</th>
              <th className="border-0">All Change</th>
              <th className="border-0">Travel & Local</th>
              <th className="border-0">Travel & Local Change</th>
              <th className="border-0">Widgets</th>
              <th className="border-0">Widgets Change</th>
            </tr>
          </thead>
          <tbody>
            {pageRanking.map(r => <TableRow key={`ranking-${r.id}`} {...r} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const AccountsTable = () => {

  const [accounts, setAccounts] = useState({});

  useEffect(() => {
    getAccounts().then(res => setAccounts(res));
  }, []);

  const delAccountHandler = (accountID) => {
    delAccount(accountID);
    getAccounts().then(res => setAccounts(res));
  };

  const editAccountHandler = (account) => {
    Swal.fire({
      title: 'Kullanıcıyı Düzenle',
      html: `
        <form id="myForm">
          <div class="mb-3">
            <label for="inputText1" class="form-label">Kullanıcı Adı:</label>
            <input type="text" id="inputText1" class="form-control" value="${account.accountName}" /> 
          </div>
          <div class="mb-3">
            <label for="inputText2" class="form-label">Şifre:</label>
            <input type="password" id="inputText2" class="form-control" value="" />
          </div>
          <div class="mb-3">
            <label for="inputText3" class="form-label">Şifre:</label>
            <input type="password" id="inputText3" class="form-control" value="" />
          </div>
          <div class="mb-3">
            <label for="dropdownSelect" class="form-label">Ürün Kategorisi:</label>
            <select id="dropdownSelect" class="form-select">
              <option value="Yönetici" ${account.accountType === 'Yönetici' ? 'selected' : ''}>Yönetici</option>
              <option value="Kasa" ${account.accountType === 'Kasa' ? 'selected' : ''}>Kasa</option>
              <option value="Garson" ${account.accountType === 'Garson' ? 'selected' : ''}>Garson</option>
            </select>
          </div>
        </form>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Kaydet',
      cancelButtonText: 'İptal',
      preConfirm: () => {
        const form = document.getElementById('myForm');
        const inputText1 = form.querySelector('#inputText1').value;
        const inputText2 = form.querySelector('#inputText2').value;
        const inputText3 = form.querySelector('#inputText3').value;
        const dropdownSelect = form.querySelector('#dropdownSelect').value;

        return {
          inputText1,
          inputText2,
          inputText3,
          dropdownSelect,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value.inputText3 === "") {
          editAccount({ accountID: account.accountID, accountName: result.value.inputText1, accountType: result.value.dropdownSelect, accountPassword: account.accountPassword });
          getAccounts().then(res => setAccounts(res));
          Swal.fire('İşlem Başarılı', 'Kullanıcı bilgileri düzenlendi.', 'success');
        } else if (result.value.inputText3 === result.value.inputText2) {
          editAccount({ accountID: account.accountID, accountName: result.value.inputText1, accountType: result.value.dropdownSelect, accountPassword: result.value.inputText3 });
          getAccounts().then(res => setAccounts(res));
          Swal.fire('İşlem Başarılı', 'Kullanıcı bilgileri düzenlendi.', 'success');
        } else if (result.value.inputText3 !== result.value.inputText2) {
          Swal.fire('Hata', 'Şifreler uyuşmuyor!', 'error');
        }
      }
    });
  };

  const TableRow = (props) => {
    const { accountID, accountName, accountType, lastEditDate } = props;

    return (
      <tr>
        <td>
          <span className="fw-normal">
            {accountID}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {accountName}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {accountType}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {lastEditDate}
          </span>
        </td>
        <td className="d-flex align-items-center">
          <Button variant="outline-success" className="btn-icon-only btn-pill text-dark me-2" onClick={() => editAccountHandler(props)}>
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button variant="outline-danger" className="btn-icon-only btn-pill text-facebook" onClick={() => delAccountHandler(accountID)}>
            <FontAwesomeIcon icon={faTrashAlt} />
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm" style={{ border: 0 }}>
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">Hesap ID</th>
              <th className="border-bottom">Kullanıcı Adı</th>
              <th className="border-bottom">Hesap Türü</th>
              <th className="border-bottom">Düzenleme Tarihi</th>
              <th className="border-bottom">Eylem</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(accounts).map(key => <TableRow key={`${accounts[key].accountID}`} {...accounts[key]} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const TablesTable = () => {

  const [tables, setTables] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [tablesPerPage] = useState(10); // Her sayfada 10 masa gösterilecek

  useEffect(() => {
    getTables().then(res => {
      setTables(res);
    });
  }, []);

  const delTableHandler = (tableName) => {
    delTable(tableName);
    getTables().then(res => setTables(res));
  };

  // Pagination için mevcut sayfadaki masaları alma
  const indexOfLastTable = currentPage * tablesPerPage;
  const indexOfFirstTable = indexOfLastTable - tablesPerPage;
  const currentTables = Object.values(tables).slice(indexOfFirstTable, indexOfLastTable);

  // Toplam sayfa sayısını hesapla
  const totalPages = Math.ceil(Object.keys(tables).length / tablesPerPage);

  const TableRow = (props) => {
    const { tableName, lastEditDate } = props;

    return (
      <tr>
        <td>
          <span className="fw-normal">
            {tableName}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {lastEditDate}
          </span>
        </td>
        <td className="d-flex align-items-center">
          <Button variant="outline-danger" className="btn-icon-only btn-pill text-facebook" onClick={() => delTableHandler(tableName)}>
            <FontAwesomeIcon icon={faTrashAlt} />
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm" style={{ border: 0 }}>
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">Masa Adı</th>
              <th className="border-bottom">Oluşturma Tarihi</th>
              <th className="border-bottom">Eylem</th>
            </tr>
          </thead>
          <tbody>
            {currentTables.map((table, index) => (
              <TableRow key={index} {...table} />
            ))}
          </tbody>
        </Table>
        
        {/* Pagination */}
        <Pagination>
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </Card.Body>
    </Card>
  );
};
export const ProductsTable = ({ refresh }) => {
  const [products, setProducts] = useState({});
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Her sayfada 10 ürün gösterilecek
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState(''); // Arama için state

  useEffect(() => {
    getProducts().then(res => setProducts(res));
  }, [refresh]);

  useEffect(() => {
    getCategories().then(res => {
      const categoriesArray = Object.values(res).map(category => category.categoryName);
      setCategories(categoriesArray);
    });
  }, []);

  const delProductHandler = (productID) => {
    Swal.fire({
      title: "Ürünü silmek istediğinize emin misiniz?",
      showDenyButton: true,
      confirmButtonText: "Sil",
      denyButtonText: `Silme`,
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Silindi!", "", "success");
        delProduct(productID);
        getProducts().then(res => setProducts(res));
      } else if (result.isDenied) {
        Swal.fire("İptal Edildi", "", "info");
      }
    });
  };

  const editProductHandler = (product) => {
    const categoryOptions = categories.map(category =>
      `<option value="${category}" ${product.productCategory === category ? 'selected' : ''}>${category}</option>`
    ).join('');

    Swal.fire({
      title: 'Ürünü Düzenle',
      html: `
        <form id="myForm">
          <div class="mb-3">
            <label for="inputText1" class="form-label">Ürün Adı:</label>
            <input type="text" id="inputText1" class="form-control" value="${product.productName}" /> 
          </div>
          <div class="mb-3">
            <label for="inputText2" class="form-label">Ürün Fiyatı:</label>
            <input type="number" id="inputText2" class="form-control" value="${product.productPrice}" />
          </div>
          <div class="mb-3">
            <label for="dropdownSelect" class="form-label">Ürün Kategorisi:</label>
            <select id="dropdownSelect" class="form-select">
              ${categoryOptions}
            </select>
          </div>
          <div class="mb-3">
            <label for="fileUpload" class="form-label">Ürünün Görseli:</label>
            <input type="file" id="fileUpload" class="form-control" accept="image/*" />
          </div>
        </form>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Kaydet',
      cancelButtonText: 'İptal',
      preConfirm: () => {
        const form = document.getElementById('myForm');
        const inputText1 = form.querySelector('#inputText1').value;
        const inputText2 = form.querySelector('#inputText2').value;
        const dropdownSelect = form.querySelector('#dropdownSelect').value;
        const fileUpload = form.querySelector('#fileUpload').files[0];

        return {
          inputText1,
          inputText2,
          dropdownSelect,
          fileUpload,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value.fileUpload == undefined) {
          editProduct({ productID: product.productID, productName: result.value.inputText1, productPrice: result.value.inputText2, productCategory: result.value.dropdownSelect, productImage: product.productImage });
          getProducts().then(res => setProducts(res));
          Swal.fire('İşlem Başarılı', 'Ürün bilgileri düzenlendi.', 'success');
        } else {
          uploadImage(result.value.fileUpload, product.productID).then((url) => {
            editProduct({ productID: product.productID, productName: result.value.inputText1, productPrice: result.value.inputText2, productCategory: result.value.dropdownSelect, productImage: url });
            getProducts().then(res => setProducts(res));
            Swal.fire('İşlem Başarılı', 'Ürün bilgileri düzenlendi.', 'success');
          });
        }
      }
    });
  };

  // Sıralama işlevi
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = Object.values(products).sort((a, b) => {
    if (sortConfig.key) {
      let keyA = a[sortConfig.key];
      let keyB = b[sortConfig.key];

      // Fiyat sıralaması için sayısal olarak karşılaştırma
      if (sortConfig.key === 'productPrice') {
        keyA = parseFloat(keyA);
        keyB = parseFloat(keyB);
      } else {
        keyA = keyA ? keyA.toString().toLowerCase() : '';
        keyB = keyB ? keyB.toString().toLowerCase() : '';
      }

      if (keyA < keyB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (keyA > keyB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    }
    return 0;
  });

  // Arama işlemi
  const filteredProducts = sortedProducts.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination için mevcut sayfadaki ürünleri alma
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Toplam sayfa sayısını hesapla
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const TableRow = (props) => {
    const { productID, productName, productCategory, productPrice, productImage, lastEditDate } = props;

    return (
      <tr>
        <td style={{ display: "none" }}>
          <span className="fw-normal">
            {productID}
          </span>
        </td>
        <td style={{ maxWidth: "15px", overflow: "hidden" }}>
          <span className="fw-normal">
            {productName}
          </span>
        </td>

        <td style={{ maxWidth: "15px", overflow: "hidden" }}>
          <span className="fw-normal">
            {productCategory}
          </span>
        </td>
        <td style={{ maxWidth: "15px", overflow: "hidden" }}>
          <span className="fw-normal">
            {productPrice}
          </span>
        </td>
        <td style={{ maxWidth: "15px", overflow: "hidden" }}>
          <a href={productImage} target="_blank" rel="noopener noreferrer">
            <span className="fw-normal">
              Link
            </span>
          </a>
        </td>
        <td style={{ maxWidth: "15px", overflow: "hidden" }}>
          <span className="fw-normal">
            {lastEditDate}
          </span>
        </td>
        <td className="d-flex align-items-center">
          <Button variant="outline-success" className="btn-icon-only btn-pill text-dark me-2" onClick={() => editProductHandler(props)}>
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button variant="outline-danger" className="btn-icon-only btn-pill text-facebook" onClick={() => delProductHandler(productID)}>
            <FontAwesomeIcon icon={faTrashAlt} />
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm" style={{ border: 0 }}>
      <Card.Body className="pt-0">
        {/* Arama Çubuğu */}
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Ürün adı veya kategori ara..."
            aria-label="Ürün adı veya kategori ara"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom" onClick={() => requestSort('productName')}>
                Ürün Adı <FontAwesomeIcon icon={faSort} />
              </th>
              <th className="border-bottom" onClick={() => requestSort('productCategory')}>
                Ürün Kategorisi <FontAwesomeIcon icon={faSort} />
              </th>
              <th className="border-bottom" onClick={() => requestSort('productPrice')}>
                Fiyat <FontAwesomeIcon icon={faSort} />
              </th>
              <th className="border-bottom">Ürün Görseli</th>
              <th className="border-bottom" onClick={() => requestSort('lastEditDate')}>
                Düzenleme Tarihi <FontAwesomeIcon icon={faSort} />
              </th>
              <th className="border-bottom">Eylem</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => (
              <TableRow key={product.productID} {...product} />
            ))}
          </tbody>
        </Table>

        {/* Pagination */}
        <Pagination>
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </Card.Body>
    </Card>
  );
};

export const CategoriesTable = ({ refresh }) => {

  const [categories, setCategories] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(10); // Her sayfada 10 kategori gösterilecek

  useEffect(() => {
    getCategories().then((res) => {
      const categoriesArray = Object.values(res);
      // Kategorileri sortOrder değerine göre sıralama
      const sortedCategories = categoriesArray.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      setCategories(sortedCategories);
    });
  }, [refresh]);

  const delCategoryHandler = (categoryName) => {
    delCategory(categoryName);
    getCategories().then(res => setCategories(res));
  };

  const editCategoryHandler = (category) => {
    Swal.fire({
      title: 'Kategori Düzenle',
      html: `
        <form id="myForm">
          <div class="mb-3">
            <label for="inputText1" class="form-label">Kategori Adı:</label>
            <input type="text" id="inputText1" class="form-control" value="${category.categoryName}" /> 
          </div>
          <div class="mb-3">
            <label for="fileUpload" class="form-label">Kategori Görseli:</label>
            <input type="file" id="fileUpload" class="form-control" accept="image/*" />
          </div>
        </form>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Kaydet',
      cancelButtonText: 'İptal',
      preConfirm: () => {
        const form = document.getElementById('myForm');
        const inputText1 = form.querySelector('#inputText1').value;
        const fileUpload = form.querySelector('#fileUpload').files[0];

        return {
          inputText1,
          fileUpload
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value.fileUpload == undefined) {
          editCategory({ categoryName: result.value.inputText1, categoryBanner: category.categoryBanner });
          getCategories().then(res => setCategories(res));
          Swal.fire('İşlem Başarılı', 'Kategori bilgileri düzenlendi.', 'success');
        } else {
          uploadImage(result.value.fileUpload, result.value.inputText1).then((url) => {
            editCategory({ categoryName: result.value.inputText1, categoryBanner: url }).then(() => {
              Swal.fire({
                icon: "success",
                title: "Kategori bilgileri düzenlendi.",
                showConfirmButton: false,
                timer: 1000
              });
            });
          });
          getCategories().then(res => setCategories(res));
        }
      }
    });
  };

  // Pagination için mevcut sayfadaki kategorileri alma
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = Object.values(categories).slice(indexOfFirstCategory, indexOfLastCategory);

  // Toplam sayfa sayısını hesapla
  const totalPages = Math.ceil(Object.keys(categories).length / categoriesPerPage);

  const TableRow = (props) => {
    const { categoryName, lastEditDate } = props;

    return (
      <tr>
        <td>
          <span className="fw-normal">
            {categoryName}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {lastEditDate}
          </span>
        </td>
        <td className="d-flex align-items-center">
          <Button variant="outline-success" className="btn-icon-only btn-pill text-dark me-2" onClick={() => editCategoryHandler(props)}>
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button variant="outline-danger" className="btn-icon-only btn-pill text-facebook" onClick={() => delCategoryHandler(categoryName)}>
            <FontAwesomeIcon icon={faTrashAlt} />
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm" style={{ border: 0 }}>
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">Kategori Adı</th>
              <th className="border-bottom">Düzenleme Tarihi</th>
              <th className="border-bottom">Eylem</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((category, index) => (
              <TableRow key={index} {...category} />
            ))}
          </tbody>
        </Table>

        {/* Pagination */}
        <Pagination>
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </Card.Body>
    </Card>
  );
};

export const EditOrderModal = ({ show, handleClose, orderData, handleSave }) => {
  const [quantity, setQuantity] = useState(orderData.quantity || 1);
  const [extraShot, setExtraShot] = useState(orderData.extraShot || "Yok");
  const [syrupFlavor, setSyrupFlavor] = useState(orderData.syrupFlavor || "Yok");
  const [syrupAmount, setSyrupAmount] = useState(orderData.syrupAmount || "Tek");
  const [milkType, setMilkType] = useState(orderData.milkType || "Normal");

  // `isCoffeeCategory` doğrudan `orderData`'dan alınır
  const isCoffeeCategory = orderData.isCoffeeCategory;

  useEffect(() => {
    if (!show) {
      resetState();
    }
  }, [show, orderData]);

  const resetState = () => {
    setQuantity(orderData.quantity || 1);
    setExtraShot(orderData.extraShot || "Yok");
    setSyrupFlavor(orderData.syrupFlavor || "Yok");
    setSyrupAmount(orderData.syrupAmount || "Tek");
    setMilkType(orderData.milkType || "Normal");
  };

  const handleSaveClick = () => {
    const updatedOrder = {
      ...orderData,
      quantity,
      ...(isCoffeeCategory && { extraShot, syrupFlavor, syrupAmount, milkType }) // Sadece kahve kategorisinde ek özellikleri ekleyin
    };
    handleSave(updatedOrder);
    handleClose();
    resetState();  // Kaydettikten sonra state'leri sıfırla
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered // Modalı ekranın ortasında göstermek için ekledik
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ textAlign: 'center', width: '100%' }}>Sipariş Düzenle</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Kahve kategorisi ise ek özellikler gösterilir */}
        {isCoffeeCategory ? (
          <>
            <Form.Group controlId="extraShot" style={{ textAlign: 'center', width: '100%' }}>
              <Form.Label>Ekstra Shot</Form.Label>
              <div>
                {["Yok", "Tek", "Double", "Triple"].map((shot) => (
                  <Button
                    key={shot}
                    variant={extraShot === shot ? "primary" : "outline-primary"}
                    onClick={() => setExtraShot(shot)}
                    className="me-2"
                  >
                    {shot}
                  </Button>
                ))}
              </div>
            </Form.Group>
            <Form.Group controlId="syrupFlavor" style={{ textAlign: 'center', width: '100%', marginTop: '15px' }}>
              <Form.Label>Şurup Seçimi</Form.Label>
              <div>
                {["Yok", "Vanilya", "Karamel", "Fındık"].map((flavor) => (
                  <Button
                    key={flavor}
                    variant={syrupFlavor === flavor ? "primary" : "outline-primary"}
                    onClick={() => setSyrupFlavor(flavor)}
                    className="me-2"
                  >
                    {flavor}
                  </Button>
                ))}
              </div>
            </Form.Group>
            {/* Şurup seçimi yapılmışsa şurup miktarını göster */}
            {syrupFlavor && syrupFlavor.toLowerCase() !== "yok" && (
              <Form.Group controlId="syrupAmount" style={{ textAlign: 'center', width: '100%', marginTop: '15px' }}>
                <Form.Label>Şurup Miktarı</Form.Label>
                <div>
                  {["Tek", "Double"].map((amount) => (
                    <Button
                      key={amount}
                      variant={syrupAmount === amount ? "primary" : "outline-primary"}
                      onClick={() => setSyrupAmount(amount)}
                      className="me-2"
                    >
                      {amount}
                    </Button>
                  ))}
                </div>
              </Form.Group>
            )}
            <Form.Group controlId="milkType" style={{ textAlign: 'center', width: '100%', marginTop: '15px' }}>
              <Form.Label>Süt Tipi</Form.Label>
              <div>
                {["Normal", "Laktozsuz"].map((type) => (
                  <Button
                    key={type}
                    variant={milkType === type ? "primary" : "outline-primary"}
                    onClick={() => setMilkType(type)}
                    className="me-2"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </Form.Group>
          </>
        ) : null}
        {/* Adet düzenleme kısmı her iki kategori için de gösterilir */}
        <Form.Group controlId="quantity" style={{ textAlign: 'center', width: '100%', marginTop: '15px' }}>
          <Form.Label>Adet</Form.Label>
          <div className="d-flex justify-content-center align-items-center">
            <Button
              variant="outline-secondary"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="me-3"
            >
              -
            </Button>
            <span style={{ fontSize: '1.5rem' }}>{quantity}</span>
            <Button
              variant="outline-secondary"
              onClick={() => setQuantity((prev) => prev + 1)}
              className="ms-3"
            >
              +
            </Button>
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          İptal
        </Button>
        <Button variant="primary" onClick={handleSaveClick}>
          Kaydet
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const Orders = (props) => {
  const { tableName, refresh, setRefresh } = props;

  const [orders, setOrders] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    getOrders(tableName).then(res => setOrders(res));
  }, [refresh]);

  const deleteOrder = (props) => {
    delOrders(props);
    delBaristaOrders(props.tableName, props.orderID);
    getOrders(props.tableName).then(res => setOrders(res));
  };

  const openEditModal = async (order) => {
    // Ürün kategorisini almak için getProductCategory fonksiyonunu kullan
    const productCategory = await getProductCategory(order.productID);

    // Ürün kategorisini kontrol et ve modal içeriğini ayarla
    const isCoffeeCategory = productCategory.includes('Kahve');

    // Eğer kahve kategorisinde değilse, yalnızca adet değişikliği yapılabilen modal açılmalı
    setSelectedOrder({ ...order, isCoffeeCategory });
    setShowEditModal(true);
};


  const handleSaveChanges = async (updatedOrder) => {
    if (!updatedOrder.orderID || !updatedOrder.productID || !updatedOrder.productName || !updatedOrder.productPrice) {
        console.error("Eksik parametreler ile işlem yapılmaya çalışılıyor:", updatedOrder);
        return;
    }

    // Ürün kategorisini al
    const productCategory = await getProductCategory(updatedOrder.productID);
    if (!productCategory) {
        console.error("Ürün kategorisi alınamadı:", updatedOrder.productID);
        return;
    }

    console.log("Ürün Kategorisi:", productCategory);

    // Güncellenmiş sipariş verilerini kullanarak edit işlemini yap
    editOrders({
        tableName: tableName,
        orderID: updatedOrder.orderID,
        productID: updatedOrder.productID,
        productName: updatedOrder.productName,
        productPrice: updatedOrder.productPrice,
        quantity: updatedOrder.quantity,
        productCategory: productCategory, // Yeni kategori bilgisi
        extraShot: updatedOrder.extraShot,
        syrupFlavor: updatedOrder.syrupFlavor,
        syrupAmount: updatedOrder.syrupAmount,
        milkType: updatedOrder.milkType
    }).then(() => {
        setRefresh(refresh + 1);
    });
};


  const TableRow = (props) => {
    const { productID, productName, quantity, orderID, extraShot, syrupFlavor, syrupAmount, milkType, productCategory } = props;

    return (
      <tr>
        <td>
          <span className="fw-normal">
            {productName}
          </span>
          {/* Ürün detaylarını göster */}
          <ul className="list-unstyled mb-0" style={{ marginLeft: '10px', fontSize: '0.75em' }}>
            {extraShot && extraShot.toLowerCase() !== 'yok' && <li style={{ fontSize: '0.7rem' }}>Shot: {extraShot}</li>}
            {syrupFlavor && syrupFlavor.toLowerCase() !== 'yok' && syrupAmount && syrupAmount.toLowerCase() !== 'yok' && (
              <li style={{ fontSize: '0.7rem' }}>Şurup: {syrupFlavor} ({syrupAmount})</li>
            )}
            {milkType && milkType.toLowerCase() !== 'normal' && <li style={{ fontSize: '0.7rem' }}>Süt: {milkType}</li>}
          </ul>
        </td>
        <td>
          <span className="fw-normal">
            {quantity}
          </span>
        </td>
        <td>
          <FontAwesomeIcon icon={faEdit} className="text-primary me-3" style={{ cursor: "pointer" }} onClick={() => openEditModal(props)} />
          <FontAwesomeIcon icon={faTrashAlt} className="text-danger" style={{ cursor: "pointer" }} onClick={() => deleteOrder({ tableName, orderID })} />
        </td>
      </tr>
    );
  };

  return (
    <>
      <Card border="light" className="table-wrapper table-responsive shadow-sm">
        <Card.Body className="pt-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th className="border-bottom">Ürün Adı</th>
                <th className="border-bottom">Miktar</th>
                <th className="border-bottom">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(orders).map(key => <TableRow key={key} {...orders[key]} />)}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {selectedOrder && (
        <EditOrderModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          orderData={selectedOrder}
          handleSave={handleSaveChanges}
          productCategory={selectedOrder.productCategory} // Bu satır eklendi
        />
      )}
    </>
  );
};

export const OrdersForPay = (props) => {
  const { tableName, refresh, setRefresh } = props;
  const [orders, setOrders] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [quantityToPay, setQuantityToPay] = useState(1);

  useEffect(() => {
    getOrders(tableName).then((res) => setOrders(res));
  }, [refresh, tableName]);

  const handlePayClick = (order) => {
    const { quantity } = order;
    if (quantity === 1) {
      handleConfirmPayment(order, 1);
    } else {
      setSelectedOrder(order);
      setQuantityToPay(1);
      setShowModal(true);
    }
  };

  const handleConfirmPayment = (order, quantityToPay) => {
    const { orderID, productName, productID, productPrice, quantity, extraShot, syrupFlavor, syrupAmount, milkType, productCategory } = order;

    // Eğer gerekli bilgiler eksikse, konsola hata yazdır ve işlemi durdur
    if (!tableName || !orderID || !productID || !productName || !productPrice) {
      console.error("TempPay'e ekleme yapılırken eksik veri bulundu:", { tableName, orderID, productID, productName, productPrice });
      return;
    }

    // Ödeme için seçilen miktarı kullanarak ekleme yap
    tempPay(tableName, {
      orderID,
      productName,
      productID,
      productPrice,
      quantity: quantityToPay,
      extraShot,
      syrupFlavor,
      syrupAmount,
      milkType,
      productCategory
    })
      .then(() => {
        if (quantityToPay < quantity) {
          updateOrderQuantity({ tableName: tableName, orderID: orderID, quantity: quantity - quantityToPay })
            .then(() => {
              setRefresh(refresh + 1);
            })
            .catch((error) => {
              console.error("Sipariş miktarı güncellenemedi:", error);
            });
        } else {
          delOrders({ tableName: tableName, orderID: orderID })
            .then(() => {
              setRefresh(refresh + 1);
            })
            .catch((error) => {
              console.error("Sipariş silinemedi:", error);
            });
        }
      })
      .catch((error) => {
        console.error("TempPay kaydedilemedi:", error);
      });

    setShowModal(false);
  };


  const TableRow = ({ productName, productPrice, productID, quantity, orderID, extraShot, syrupFlavor, syrupAmount, milkType }) => {
    return (
      <tr>
        <td>
          <span className="fw-normal">{productName}</span>
          <ul className="list-unstyled mb-0" style={{ marginLeft: '10px', fontSize: '0.75em' }}>
            {extraShot && extraShot.toLowerCase() !== 'yok' && <li style={{ fontSize: '0.7rem' }}>Shot: {extraShot}</li>}
            {syrupFlavor && syrupFlavor.toLowerCase() !== 'yok' && syrupAmount && syrupAmount.toLowerCase() !== 'yok' && (
              <li style={{ fontSize: '0.7rem' }}>Şurup: {syrupFlavor} ({syrupAmount})</li>
            )}
            {milkType && milkType.toLowerCase() !== 'normal' && <li style={{ fontSize: '0.7rem' }}>Süt: {milkType}</li>}
          </ul>
        </td>
        <td>
          <span className="fw-normal">{quantity}</span>
        </td>
        <td>
          <span className="fw-normal">{productPrice} TL</span>
        </td>
        <td>
          <Button
            variant="outline-success"
            onClick={() => handlePayClick({ orderID, productName, productID, productPrice, quantity, extraShot, syrupFlavor, syrupAmount, milkType, productCategory: orders[orderID]?.productCategory })}
          >
            <FontAwesomeIcon icon={faCreditCard} />
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <>
      <Card border="light" className="table-wrapper table-responsive shadow-sm">
        <Card.Body className="pt-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th>Ürün Detayları</th>
                <th>Miktar</th>
                <th>Fiyat</th>
                <th>Ödeme</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(orders).map((key) => (
                <TableRow key={key} {...orders[key]} orderID={key} />
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Adet Seçim Modalı */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ödenecek Adeti Seçin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center align-items-center">
            <Button
              variant="outline-secondary"
              onClick={() => setQuantityToPay((prev) => Math.max(1, prev - 1))}
              className="me-3"
            >
              <FontAwesomeIcon icon={faMinus} />
            </Button>
            <span style={{ fontSize: '1.5rem' }}>{quantityToPay}</span>
            <Button
              variant="outline-secondary"
              onClick={() => setQuantityToPay((prev) => Math.min(selectedOrder.quantity, prev + 1))}
              className="ms-3"
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>İptal</Button>
          <Button variant="primary" onClick={() => handleConfirmPayment(selectedOrder, quantityToPay)}>Ödemeyi Onayla</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export const OrdersForPaying = (props) => {
  const { refresh, setRefresh, numpadValue, setNumpadValue, tableName } = props;
  const [temp, setTemp] = useState({});
  const [orders, setOrders] = useState({});

  useEffect(() => {
    getTempPay(tableName).then((tempData) => {  // tableName ile temp verilerini çek
      setTemp(tempData);
      getOrders(tableName).then((orderData) => {
        setOrders(orderData);
      });
    });
  }, [refresh, tableName]);

  // MergedData oluştur
  const mergedData = Object.keys(temp).reduce((result, orderID) => {
    const orderData = temp[orderID]; // temp verisini kullan

    if (orders[orderID]) {
      result[orderID] = {
        ...orders[orderID], // orders verisini kullan
        ...orderData, // temp verisini ekle
        quantity: orderData.quantity || orders[orderID].quantity, // Sadece seçilen miktarı kullan
      };
    } else {
      result[orderID] = { ...orderData }; // Sadece temp verisi varsa onu kullan
    }
    return result;
  }, {});

  // Toplam fiyat hesapla ve numpadValue'ye ata
  useEffect(() => {
    const totalPrice = Object.values(mergedData).reduce(
      (sum, { productPrice, quantity }) => sum + parseFloat(productPrice) * parseInt(quantity),
      0
    );
    setNumpadValue(totalPrice.toFixed(2)); // Toplam fiyatı numpadValue'ye aktar
  }, [mergedData, setNumpadValue]);

  const handleReturnOrder = (order) => {
    const { orderID, productName, productPrice, quantity, productID, extraShot, syrupFlavor, syrupAmount, milkType } = order;
    const currentTempQuantity = parseInt(quantity, 10); // TempPay'deki mevcut miktar

    // Eksik verileri kontrol et ve doldur
    const filledOrder = {
      orderID: orderID,
      productID: productID || temp[orderID]?.productID || orders[orderID]?.productID,  // Temp veya Orders tablosundan al
      productName: productName || temp[orderID]?.productName || orders[orderID]?.productName,  // Temp veya Orders tablosundan al
      productPrice: productPrice || temp[orderID]?.productPrice || orders[orderID]?.productPrice,  // Temp veya Orders tablosundan al
      quantity: 1,  // Geri eklenecek miktar daima 1 olacak
      extraShot: extraShot || temp[orderID]?.extraShot || orders[orderID]?.extraShot || 'yok',  // Varsayılan değer
      syrupFlavor: syrupFlavor || temp[orderID]?.syrupFlavor || orders[orderID]?.syrupFlavor || 'yok',  // Varsayılan değer
      syrupAmount: syrupAmount || temp[orderID]?.syrupAmount || orders[orderID]?.syrupAmount || 'yok',  // Varsayılan değer
      milkType: milkType || temp[orderID]?.milkType || orders[orderID]?.milkType || 'normal',  // Varsayılan değer
      productCategory: orders[orderID]?.productCategory || temp[orderID]?.productCategory || '' // Kategori bilgisi ekle
    };

    // Eksik veya undefined alanlar hala varsa kontrol et
    if (!filledOrder.productID || !filledOrder.productName || !filledOrder.productPrice) {
      console.error("Eksik veya geçersiz sipariş bilgileri (doldurulmuş):", filledOrder);
      return; // İşlemi durdur
    }

    // Orders tablosunda karşılık gelen siparişi bul
    const matchingOrder = orders[orderID];

    if (matchingOrder) {
      const currentOrderQuantity = parseInt(matchingOrder.quantity, 10); // Orders'taki mevcut miktar

      // TempPay'deki miktarı 1 azalt ve Orders'taki miktarı 1 artır
      editTempPay(tableName, orderID, -1)
        .then(() => {
          updateOrderQuantity({ tableName: tableName, orderID: orderID, quantity: currentOrderQuantity + 1 })
            .then(() => {
              setRefresh(refresh + 1); // Arayüzü yenile
            })
            .catch((error) => {
              console.error("Orders tablosu güncellenemedi:", error);
            });
        })
        .catch((error) => {
          console.error("editTempPay işlemi sırasında bir hata oluştu:", error);
        });
    } else {
      // Eğer Orders tablosunda bu sipariş yoksa, yeni bir sipariş olarak ekle
      const orderToAddBack = { ...filledOrder, quantity: 1 };  // `quantity`'yi elle 1 olarak ayarla

      addBackToOrders({ tableName: tableName, order: orderToAddBack })
        .then(() => {
          // TempPay'den miktarı 1 azalt
          editTempPay(tableName, orderID, -1)
            .then(() => {
              setRefresh(refresh + 1); // Arayüzü yenile
            })
            .catch((error) => {
              console.error("editTempPay işlemi sırasında bir hata oluştu:", error);
            });
        })
        .catch((error) => {
          console.error("Orders tablosuna yeni sipariş eklenemedi:", error);
        });
    }
  };


  const TableRow = ({ productName, productPrice, quantity, orderID, extraShot, syrupFlavor, syrupAmount, milkType }) => {
    return (
      <tr>
        <td>
          <span className="fw-normal">{productName}</span>
          <ul className="list-unstyled mb-0" style={{ marginLeft: '10px', fontSize: '0.75em' }}>
            {extraShot && extraShot.toLowerCase() !== 'yok' && <li style={{ fontSize: '0.7rem' }}>Shot: {extraShot}</li>}
            {syrupFlavor && syrupFlavor.toLowerCase() !== 'yok' && syrupAmount && syrupAmount.toLowerCase() !== 'yok' && (
              <li style={{ fontSize: '0.7rem' }}>Şurup: {syrupFlavor} ({syrupAmount})</li>
            )}
            {milkType && milkType.toLowerCase() !== 'normal' && <li style={{ fontSize: '0.7rem' }}>Süt: {milkType}</li>}
          </ul>
        </td>
        <td>
          <span className="fw-normal">{quantity}</span>
        </td>
        <td>
          <span className="fw-normal">{productPrice} TL</span>
        </td>
        <td>
          <Button
            variant="outline-danger"
            onClick={() => handleReturnOrder({ productName, productPrice, quantity, orderID })}
          >
            <FontAwesomeIcon icon={faBackward} />
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th>Ürün Detayları</th>
              <th>Miktar</th>
              <th>Fiyat</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(mergedData).map((key) => (
              <TableRow key={key} {...mergedData[key]} orderID={key} />
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const CommandsTable = () => {
  const TableRow = (props) => {
    const { name, usage = [], description, link } = props;

    return (
      <tr>
        <td className="border-0" style={{ width: '5%' }}>
          <code>{name}</code>
        </td>
        <td className="fw-bold border-0" style={{ width: '5%' }}>
          <ul className="ps-0">
            {usage.map(u => (
              <ol key={u} className="ps-0">
                <code>{u}</code>
              </ol>
            ))}
          </ul>
        </td>
        <td className="border-0" style={{ width: '50%' }}>
          <pre className="m-0 p-0">{description}</pre>
        </td>
        <td className="border-0" style={{ width: '40%' }}>
          <pre><Card.Link href={link} target="_blank">Read More <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-1" /></Card.Link></pre>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body className="p-0">
        <Table responsive className="table-centered rounded" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          <thead className="thead-light">
            <tr>
              <th className="border-0" style={{ width: '5%' }}>Name</th>
              <th className="border-0" style={{ width: '5%' }}>Usage</th>
              <th className="border-0" style={{ width: '50%' }}>Description</th>
              <th className="border-0" style={{ width: '40%' }}>Extra</th>
            </tr>
          </thead>
          <tbody>
            {commands.map(c => <TableRow key={`command-${c.id}`} {...c} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
