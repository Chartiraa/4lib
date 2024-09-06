
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faArrowDown, faArrowUp, faEdit, faCreditCard, faExternalLinkAlt, faTrashAlt, faBackward } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Image, Button, Table, Dropdown, ProgressBar, ButtonGroup } from '@themesberg/react-bootstrap';
import Swal from "sweetalert2";

import { pageVisits, pageTraffic, pageRanking } from "../data/tables";
import commands from "../data/commands";

import { getAccounts, editAccount, delAccount, getTables, delTable, getProducts, editProduct, delProduct, getCategories, editCategory, delCategory, getOrders, uploadImage, tempPay, getTempPay, delTempPay } from "../data/DBFunctions";


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

  useEffect(() => {
    getTables().then(res => {
      setTables(res)
    });
  }, []);

  const delTableHandler = (tableName) => {
    delTable(tableName);
    getTables().then(res => setTables(res));
  };

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
            {Object.keys(tables).map(key => <TableRow key={`${tables[key].tableName}`} {...tables[key]} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const ProductsTable = ({ refresh }) => {

  const [products, setProducts] = useState({});
  const [categories, setCategories] = useState([]);

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
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">Ürün Adı</th>
              <th className="border-bottom">Ürün Kategorisi</th>
              <th className="border-bottom">Fiyat</th>
              <th className="border-bottom">Ürün Görseli</th>
              <th className="border-bottom">Düzenleme Tarihi</th>
              <th className="border-bottom">Eylem</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(products).map(key => <TableRow key={`${products[key].productID}`} {...products[key]} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};


export const CategoriesTable = (refresh) => {

  const [categories, setCategories] = useState({});

  useEffect(() => {
    getCategories().then(res => {
      setCategories(res)
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
        console.log(result.value);
        if (result.value.fileUpload == undefined) {
          editCategory({ categoryName: result.value.inputText1, categoryBanner: category.categoryBanner });
          getCategories().then(res => setCategories(res));
          Swal.fire('İşlem Başarılı', 'Kategori bilgileri düzenlendi.', 'success');
        } else {
          editCategory({ categoryName: result.value.inputText1, categoryBanner: result.value.fileUpload });
          getCategories().then(res => setCategories(res));
          Swal.fire('İşlem Başarılı', 'Kategori bilgileri düzenlendi.', 'success');
        }
      }
    });
  };

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
            {Object.keys(categories).map(key => <TableRow key={`${categories[key].categoryName}`} {...categories[key]} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const Orders = (props) => {

  const { tableName, refresh } = props

  const [orders, setOrders] = useState({});

  useEffect(() => {
    getOrders(tableName).then(res => setOrders(res));
  }, [refresh]);

  const TableRow = (props) => {
    const { productID, productName, quantity } = props;

    return (
      <tr>
        <td>
          <span className="fw-normal">
            {productName}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {quantity}
          </span>
        </td>
        <td>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Menu>
              <Dropdown.Item className="text-danger">
                <FontAwesomeIcon icon={faTrashAlt} className="me-2" /> Sil
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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
              <th className="border-bottom">Ürün Adı</th>
              <th className="border-bottom">Miktar</th>
              <th className="border-bottom">Sil</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(orders).map(key => <TableRow key={key} {...orders[key]} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const OrdersForPay = (props) => {

  const { tableName, refresh, setRefresh, numpadValue, setNumpadValue } = props

  const [orders, setOrders] = useState({});

  useEffect(() => {
    getOrders(tableName).then(res => setOrders(res));
  }, [refresh]);

  const payOrder = ({ orderID, productPrice }) => {
    if (isNaN(parseInt(numpadValue))) {
      tempPay({ orderID, productPrice });
    } else {
      tempPay({ orderID, productPrice });
    }
    setRefresh(refresh + 1);
  }

  const TableRow = (props) => {
    const { productID, productName, productPrice, quantity, orderID } = props;

    return (
      <tr>
        <td>
          <span className="fw-normal">
            {productName}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {quantity}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {productPrice}
          </span>
        </td>
        <td>
          <Button variant="outline-success" className="btn-icon-only btn-pill text-facebook" >
            <FontAwesomeIcon icon={faCreditCard} onClick={() => payOrder({ orderID, productPrice })} />
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
              <th className="border-bottom">Ürün Adı</th>
              <th className="border-bottom">Miktar</th>
              <th className="border-bottom">Fiyat</th>
              <th className="border-bottom">Ödeme</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(orders).map(key => <TableRow key={key} {...orders[key]} orderID={key} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const OrdersForPaying = (props) => {
  const { refresh, setRefresh, numpadValue, setNumpadValue, tableName } = props;

  const [temp, setTemp] = useState({});
  const [orders, setOrders] = useState({});

  useEffect(() => {
    // getTempPay ve getOrders fonksiyonlarını çağırarak verileri alıyoruz
    getTempPay().then((tempData) => {
      setTemp(tempData);
      getOrders(tableName).then((orderData) => {
        setOrders(orderData);
      });
    });
  }, [refresh, tableName]);

  // mergedData oluştur
  const mergedData = Object.keys(temp).reduce((result, key) => {
    if (orders[key]) {
      result[key] = {
        ...temp[key], // temp verisini al
        ...orders[key], // orders verisini ekle
      };
    }
    return result;
  }, {});

  // Fiyatları toplayan useEffect
  useEffect(() => {
    const totalPrice = Object.values(mergedData).reduce(
      (sum, { productPrice, quantity }) => sum + parseInt(productPrice) * parseInt(quantity),
      0
    );
    setNumpadValue(totalPrice); // Toplam fiyatı numpadValue'ye aktar
  }, [mergedData, setNumpadValue]);

  // Ödeme fonksiyonu
  const payOrder = ({ productPrice, orderID }) => {
    if (!isNaN(parseInt(numpadValue))) {
      setNumpadValue(parseInt(numpadValue) - parseInt(productPrice));
    }

    console.log(orderID);
    delTempPay({ orderID });
    setRefresh(refresh + 1);
  };

  // TableRow bileşeni
  const TableRow = ({ productID, productName, productPrice, quantity, orderID }) => {
    return (
      <tr>
        <td>
          <span className="fw-normal">{productName}</span>
        </td>
        <td>
          <span className="fw-normal">{quantity}</span>
        </td>
        <td>
          <span className="fw-normal">{productPrice}</span>
        </td>
        <td>
          <Button
            variant="outline-success"
            className="btn-icon-only btn-pill text-facebook"
            onClick={() => payOrder({ productPrice, orderID })}
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
              <th className="border-bottom">Ürün Adı</th>
              <th className="border-bottom">Miktar</th>
              <th className="border-bottom">Fiyat</th>
              <th className="border-bottom">Geri Al</th>
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
