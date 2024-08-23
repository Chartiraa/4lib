
import React, { useRef, useState, useEffect } from "react";
import { Col, Row, Card, Form, Button } from '@themesberg/react-bootstrap';
import Swal from "sweetalert2";

import { AccountsTable, TablesTable, ProductsTable, CategoriesTable } from "./Tables";

import { addAccount, addTable, addProduct, addCategory, getCategories, uploadImage } from "../data/DBFunctions";

export const Users = () => {

  const formAccountName = useRef(null);
  const formAccountPassword = useRef(null);
  const formAccountPasswordAgain = useRef(null);
  const formAccountType = useRef(null);

  const handleClick = () => {
    if (formAccountPassword.current.value !== formAccountPasswordAgain.current.value) {
      alert("Sifreler aynı değil. Lütfen tekrar deneyiniz.");
      return;
    } else {
      addAccount({ accountName: formAccountName.current.value, accountPassword: formAccountPassword.current.value, accountType: formAccountType.current.value }).then(() => {
        alert("Kayıt tamamlandı.");
        formAccountName.current.value = "";
        formAccountPassword.current.value = "";
        formAccountPasswordAgain.current.value = "";
        formAccountType.current.value = "0";
        window.location.reload();
      })
    }

  }

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Personel Kaydı</h5>
        <Form>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="firstName">
                <Form.Label>Kullanıcı Adı</Form.Label>
                <Form.Control ref={formAccountName} required type="text" placeholder="Kullanıcı adını giriniz." />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="gender">
                <Form.Label>Hesap Türü</Form.Label>
                <Form.Select ref={formAccountType} defaultValue="0">
                  <option value="Yönetici">Yönetici</option>
                  <option value="Kasa">Kasa</option>
                  <option value="Garson">Garson</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="firstName">
                <Form.Label>Şifre</Form.Label>
                <Form.Control ref={formAccountPassword} required type="password" placeholder="Şifrenizi giriniz." />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="lastName">
                <Form.Label>Şifre Tekrar</Form.Label>
                <Form.Control ref={formAccountPasswordAgain} required type="password" placeholder="Şifrenizi tekrar giriniz." />
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <Button variant="primary" onClick={handleClick} type="submit">Personel Kaydet</Button>
          </div>
        </Form>
      </Card.Body>
      <AccountsTable />
    </Card>
  );
};

export const TableSettings = () => {

  const tableName = useRef(null);

  const handleClick = () => {
    addTable(tableName.current.value);
  }

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Masa Ayarları</h5>
        <Form>
          <Row>
            <Col className="mb-3">
              <Form.Group id="tableName">
                <Form.Label>Masa Adı</Form.Label>
                <Form.Control ref={tableName} required type="text" placeholder="Lütfen boşluk bırakmadan yazınız!" />
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <Button variant="primary" onClick={handleClick} type="button">Masayı Oluştur</Button>
          </div>
        </Form>
      </Card.Body>
      <TablesTable />
    </Card>
  );
};

export const CategorySettings = () => {

  const [refresh, setRefresh] = useState(0);

  const formCategoryName = useRef(null);
  const formCategoryBanner = useRef(null);

  const handleClick = () => {

    if (formCategoryName.current.value !== "") {

      uploadImage(formCategoryBanner.current.files[0], formCategoryName.current.value).then((url) => {
        addCategory({ categoryName: formCategoryName.current.value, categoryBanner: url }).then(() => {
          Swal.fire({
            icon: "success",
            title: "Kategori başarıyla kaydedildi.",
            showConfirmButton: false,
            showConfirmButton: false,
            timer: 1000
          }).then(() => {
            setRefresh(refresh + 1);
            formCategoryName.current.value = "";
            formCategoryBanner.current.value = "";
          })
        })
      })
    }
  }

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Kategori Ayarları</h5>
        <Form>
          <Row>
            <Col className="mb-3">
              <Form.Group id="tableName">
                <Form.Label>Kategori Adı</Form.Label>
                <Form.Control ref={formCategoryName} required type="text" placeholder="Kategori adını giriniz." />
              </Form.Group>
            </Col>
            <div className="mb-3">
              <label className="form-label">Kategori Görseli:</label>
              <input ref={formCategoryBanner} type="file" id="fileUpload" className="form-control" accept="image/*" />
            </div>
          </Row>
          <div className="mt-3">
            <Button variant="primary" onClick={handleClick} type="button">Kategoriyi Oluştur</Button>
          </div>
        </Form>
      </Card.Body>
      <CategoriesTable refresh={refresh} />
    </Card>
  );
};

export const ProductSettings = () => {

  const [refresh, setRefresh] = useState(0);
  const [categories, setCategories] = useState({});

  const formProductName = useRef(null);
  const formProductCategory = useRef(null);
  const formProductPrice = useRef(null);
  const formProductImage = useRef(null);

  useEffect(() => {
    getCategories().then(res => setCategories(res));
  }, [refresh]);

  const handleClick = () => {

    const ID = Date.now();

    uploadImage(formProductImage.current.files[0], ID).then((url) => {
      addProduct({ productID: ID, productName: formProductName.current.value, productCategory: formProductCategory.current.value, productPrice: formProductPrice.current.value, productImage: url }).then(() => {
        Swal.fire({
          icon: "success",
          title: "Ürün başarıyla kaydedildi.",
          showConfirmButton: false,
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          setRefresh(refresh + 1);
          formProductName.current.value = "";
          formProductCategory.current.value = "Kahveler";
          formProductPrice.current.value = "";
          formProductImage.current.value = "";
        })
      })
    })
    // }

  }

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Menü Ayarları</h5>
        <Form>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Group id="firstName">
                <Form.Label>Ürün Adı</Form.Label>
                <Form.Control ref={formProductName} required type="text" placeholder="Ürün adını giriniz." />
              </Form.Group>
            </Col>
            <Col md={12} className="mb-3">
              <Form.Group id="gender">
                <Form.Label>Ürün Kategorisi</Form.Label>
                <Form.Select ref={formProductCategory} defaultValue="0">
                  <option value="0" disabled>Kategori seçiniz</option>
                  {Object.entries(categories).map(([key, category]) => (
                    <option key={key} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Group id="firstName">
                <Form.Label>Fiyat</Form.Label>
                <Form.Control ref={formProductPrice} required placeholder="Fiyatı giriniz." />
              </Form.Group>
            </Col>
            <div className="mb-3">
              <label className="form-label">Ürünün Görseli:</label>
              <input ref={formProductImage} type="file" id="fileUpload" className="form-control" accept="image/*" />
            </div>
          </Row>
          <div className="mt-3">
            <Button variant="primary" onClick={handleClick} type="submit">Ürün Kaydet</Button>
          </div>
        </Form>
      </Card.Body>
      <ProductsTable refresh={refresh} />
    </Card>
  );
};


