import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Table, Button, Row, Col } from '@themesberg/react-bootstrap'; // Gerekli bileşenler
import { getCategories, getProducts, updateCategoryOrder, updateProductOrder } from '../data/DBFunctions'; // Firebase fonksiyonları

const MenuOrderManager = () => {
  const [categories, setCategories] = useState({});
  const [products, setProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null); // Seçilen kategori
  const [updatedCategories, setUpdatedCategories] = useState({});
  const [updatedProducts, setUpdatedProducts] = useState({});

  useEffect(() => {
    getCategories().then(res => {
      if (typeof res === 'object' && res !== null) {
        // Kategorileri `sortOrder`'a göre sırala
        const sortedCategories = Object.fromEntries(
          Object.entries(res).sort((a, b) => a[1].sortOrder - b[1].sortOrder)
        );
        setCategories(sortedCategories);
        setUpdatedCategories(sortedCategories);
      } else {
        console.error('Kategoriler nesnesi bekleniyordu, fakat farklı bir yapı geldi:', res);
        setCategories({});
      }
    });

    getProducts().then(res => {
      if (typeof res === 'object' && res !== null) {
        // Ürünleri `sortOrder`'a göre sırala
        const sortedProducts = Object.keys(res).reduce((acc, productID) => {
          const product = res[productID];
          const category = product.productCategory;
          if (!acc[category]) acc[category] = {};
          acc[category][productID] = product;
          return acc;
        }, {});
        setProducts(sortedProducts);
        setUpdatedProducts(sortedProducts);
      } else {
        console.error('Ürünler nesnesi bekleniyordu, fakat farklı bir yapı geldi:', res);
        setProducts({});
      }
    });
  }, []);

  const onDragEnd = (result) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === 'category') {
      const categoryEntries = Object.entries(updatedCategories);
      const [removed] = categoryEntries.splice(source.index, 1);
      categoryEntries.splice(destination.index, 0, removed);

      const newCategories = Object.fromEntries(categoryEntries);
      setUpdatedCategories(newCategories);
    }

    if (type === 'product') {
      const categoryID = source.droppableId;
      const productEntries = Object.entries(updatedProducts[categoryID]);
      const [removed] = productEntries.splice(source.index, 1);
      productEntries.splice(destination.index, 0, removed);

      const newProducts = { ...updatedProducts, [categoryID]: Object.fromEntries(productEntries) };
      setUpdatedProducts(newProducts);
    }
  };

  // Kategorileri kaydetme fonksiyonu (bu kısmı değiştirmedik)
  const handleSaveCategories = () => {
    updateCategoryOrder(updatedCategories);
    setCategories(updatedCategories);
  };

  // Ürünleri kaydetme fonksiyonu
  const handleSaveProducts = () => {
    if (!selectedCategory) return; // Kategori seçilmediyse işlemi durdur

    const productsArray = Object.entries(updatedProducts[selectedCategory]).map(([key, value]) => ({ id: key, ...value }));
    updateProductOrder(selectedCategory, productsArray); // Seçilen kategoriye göre ürünleri kaydet

    // Orijinal state'i güncelle
    setProducts(prev => ({ ...prev, [selectedCategory]: updatedProducts[selectedCategory] }));
    console.log("Ürünler kaydedildi.");
  };

  return (
    <Row>
      {/* Kategoriler Bölümü */}
      <Col md={6}>
        <h4>Kategoriler</h4>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-categories" type="category">
            {(provided) => (
              <Table bordered {...provided.droppableProps} ref={provided.innerRef}>
                <tbody>
                  {Object.entries(updatedCategories).map(([catKey, category], catIndex) => (
                    <Draggable key={catKey} draggableId={catKey} index={catIndex}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => setSelectedCategory(catKey)} // Kategori seçimi
                        >
                          <td>{category.categoryName}</td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </Table>
            )}
          </Droppable>
        </DragDropContext>
        <Button onClick={handleSaveCategories} variant="success">Kategorileri Kaydet</Button>
      </Col>

      {/* Ürünler Bölümü */}
      <Col md={6}>
        <h4>Ürünler</h4>
        {selectedCategory && updatedProducts[selectedCategory] ? ( // Seçili kategori ve ürün kontrolü
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={selectedCategory} type="product">
              {(provided) => (
                <Table bordered {...provided.droppableProps} ref={provided.innerRef}>
                  <tbody>
                    {Object.entries(updatedProducts[selectedCategory]).map(([prodKey, product], prodIndex) => (
                      <Draggable key={prodKey} draggableId={prodKey} index={prodIndex}>
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <td>{product.productName}</td>
                            <td>{product.productPrice} TL</td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </Table>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <p>Lütfen bir kategori seçin veya bu kategoride ürün yok.</p>
        )}
        <Button onClick={handleSaveProducts} variant="success" disabled={!selectedCategory}>Ürünleri Kaydet</Button>
      </Col>
    </Row>
  );
};

export default MenuOrderManager;
