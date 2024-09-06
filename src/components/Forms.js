
import React, { useRef, useState, useEffect } from "react";
import { Col, Row, Card, Form, Button } from '@themesberg/react-bootstrap';
import Swal from "sweetalert2";

import { AccountsTable, TablesTable, ProductsTable, CategoriesTable } from "./Tables";

import { fetchUsers, updateUserRoleInDB, deleteUserFromDB , addTable, addProduct, addCategory, getCategories, uploadImage } from "../data/DBFunctions";

export const Users = () => {
  const [users, setUsers] = useState([]); // Kullanıcıları tutan state
  const [selectedRoles, setSelectedRoles] = useState({}); // Seçilen rolleri tutan state

  useEffect(() => {
    // Kullanıcıları Firebase'den çekme
    fetchUsers((usersArray) => {
      setUsers(usersArray);
    });
  }, []);

  // Rol değiştirildiğinde çağrılan fonksiyon
  const handleRoleChange = (uid, newRole) => {
    setSelectedRoles((prevState) => ({
      ...prevState,
      [uid]: newRole,
    }));
  };

  // Kullanıcı rolünü güncelleme fonksiyonu
  const updateUserRole = (uid) => {
    const newRole = selectedRoles[uid];

    // Firebase'de rolü güncelleme
    updateUserRoleInDB(uid, newRole)
      .then(() => {
        alert('Kullanıcı rolü güncellendi.');
      })
      .catch((error) => {
        console.error('Rol güncellenirken hata oluştu:', error);
      });
  };

  // Kullanıcıyı silme fonksiyonu
  const deleteUser = (uid) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      deleteUserFromDB(uid)
        .then(() => {
          alert('Kullanıcı başarıyla silindi.');
          setUsers(users.filter(user => user.uid !== uid)); // Silinen kullanıcıyı listeden çıkar
        })
        .catch((error) => {
          console.error('Kullanıcı silinirken hata oluştu:', error);
        });
    }
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Kullanıcı Rolleri</h5>
        <Form>
          {users.map((user) => (
            <Row key={user.uid} className="align-items-center mb-3">
              <Col md={4}>
                <Form.Label>{user.email}</Form.Label>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={selectedRoles[user.uid] || user.role}
                  onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                >
                  <option value="admin">Yönetici</option>
                  <option value="cashier">Kasa</option>
                  <option value="barista">Barista</option>
                  <option value="waiter">Garson</option>
                  <option value="no-role">Rol Yok</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Button variant="primary" onClick={() => updateUserRole(user.uid)}>
                  Güncelle
                </Button>
              </Col>
              <Col md={2}>
                <Button variant="danger" onClick={() => deleteUser(user.uid)}>
                  Sil
                </Button>
              </Col>
            </Row>
          ))}
        </Form>
      </Card.Body>
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


