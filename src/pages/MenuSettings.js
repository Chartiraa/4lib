import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Table, Button } from '@themesberg/react-bootstrap'; // Gerekli bileşenler
import { getCategories, getProducts, updateCategoryOrder, updateProductOrder } from '../data/DBFunctions'; // Firebase fonksiyonları

const MenuOrderManager = () => {
  const [categories, setCategories] = useState({});
  const [products, setProducts] = useState({});
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
        const sortedProducts = Object.keys(res).reduce((acc, categoryID) => {
          acc[categoryID] = Object.fromEntries(
            Object.entries(res[categoryID]).sort((a, b) => a[1].sortOrder - b[1].sortOrder)
          );
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

  const handleSave = () => {
    updateCategoryOrder(updatedCategories);
  
    // Her bir kategori için ürünleri ayrı ayrı kaydet
    Object.keys(updatedProducts).forEach(categoryID => {
      const productsArray = Object.entries(updatedProducts[categoryID]).map(([key, value]) => ({ id: key, ...value }));
      updateProductOrder(categoryID, productsArray); // Dizi olarak gönderiyoruz
    });
  
    // Orijinal state'i güncelle
    setCategories(updatedCategories);
    setProducts(updatedProducts);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Table bordered>
          <Droppable droppableId="all-categories" type="category">
            {(provided) => (
              <tbody {...provided.droppableProps} ref={provided.innerRef}>
                {Object.entries(updatedCategories).map(([catKey, category], catIndex) => (
                  <Draggable key={catKey} draggableId={catKey} index={catIndex}>
                    {(provided) => (
                      <React.Fragment>
                        <tr 
                          ref={provided.innerRef} 
                          {...provided.draggableProps} 
                          {...provided.dragHandleProps}
                        >
                          <td colSpan="2" className="bg-primary text-white">
                            {category.categoryName}
                          </td>
                        </tr>

                        {/* Ürünleri Listele */}
                        <tr>
                          <td colSpan="2">
                            <Droppable droppableId={catKey} type="product">
                              {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                  {updatedProducts[catKey] && Object.entries(updatedProducts[catKey]).map(([prodKey, product], prodIndex) => (
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
                                </div>
                              )}
                            </Droppable>
                          </td>
                        </tr>
                      </React.Fragment>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
      <Button onClick={handleSave} variant="success">Kaydet</Button>
    </>
  );
};

export default MenuOrderManager;
