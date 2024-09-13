import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Table } from '@themesberg/react-bootstrap'; // Gerekli bileşenler
import { getCategories, getProducts, updateCategoryOrder, updateProductOrder } from '../data/DBFunctions'; // Firebase fonksiyonları

const MenuOrderManager = () => {
  const [categories, setCategories] = useState({});
  const [products, setProducts] = useState({});

  useEffect(() => {
    getCategories().then(res => {
      if (typeof res === 'object' && res !== null) {
        setCategories(res);
      } else {
        console.error('Kategoriler nesnesi bekleniyordu, fakat farklı bir yapı geldi:', res);
        setCategories({});
      }
    });

    getProducts().then(res => {
      if (typeof res === 'object' && res !== null) {
        setProducts(res);
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
      const categoryEntries = Object.entries(categories);
      const [removed] = categoryEntries.splice(source.index, 1);
      categoryEntries.splice(destination.index, 0, removed);

      const updatedCategories = Object.fromEntries(categoryEntries);
      setCategories(updatedCategories);
      updateCategoryOrder(updatedCategories);
    }

    if (type === 'product') {
      const categoryID = source.droppableId;
      const productEntries = Object.entries(products[categoryID]);
      const [removed] = productEntries.splice(source.index, 1);
      productEntries.splice(destination.index, 0, removed);

      const updatedProducts = { ...products, [categoryID]: Object.fromEntries(productEntries) };
      setProducts(updatedProducts);
      updateProductOrder(categoryID, updatedProducts[categoryID]);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Table bordered>
        <Droppable droppableId="all-categories" type="category">
          {(provided) => (
            <tbody {...provided.droppableProps} ref={provided.innerRef}>
              {/* Kategorileri sortOrder'a göre sırala */}
              {Object.entries(categories)
                .sort((a, b) => a[1].sortOrder - b[1].sortOrder) // sortOrder'a göre sıralama
                .map(([catKey, category], catIndex) => (
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
                                  {/* Ürünleri sortOrder'a göre sırala */}
                                  {products[catKey] &&
                                    Object.entries(products[catKey])
                                      .sort((a, b) => a[1].sortOrder - b[1].sortOrder) // sortOrder'a göre sıralama
                                      .map(([prodKey, product], prodIndex) => (
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
  );
};

export default MenuOrderManager;
