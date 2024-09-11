import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from '@themesberg/react-bootstrap';

import { MenuButton } from "./MenuButton";
import { getCategories } from "../../data/DBFunctions";

export default () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // Kategori sıralama düzeni
    const categoryOrder = [
        "Sıcak Kahveler",
        "Soğuk Kahveler",
        "Cold Chocolate",
        "Doyurucu Sıcaklar",
        "Soğuk Çaylar",
        "Geleneksel",
        "Diğer Soğuk İçecekler",
        "Bitki Çayları",
        "Limonatalar",
        "Milkshake",
        "Bubble Tea",
        "Frozen",
        "Soft İçecekler",
    ];

    useEffect(() => {
        getCategories().then(res => {
            const categoriesArray = Object.values(res).map(category => ({
                categoryName: category.categoryName,
                categoryBanner: category.categoryBanner,
                lastEditDate: category.lastEditDate
            }));

            // Kategorileri belirtilen sıraya göre sıralama
            const sortedCategories = categoriesArray.sort(
                (a, b) =>
                    categoryOrder.indexOf(a.categoryName) - categoryOrder.indexOf(b.categoryName)
            );
            setCategories(sortedCategories);
        });
    }, []);

    const handleCategoryClick = (categoryName) => {
        const encodedCategoryName = encodeURIComponent(categoryName);
        navigate(`/menu3/products/${encodedCategoryName}`);
    };

    return (
        <div className="bg-pattern-container">
            <div className="bg-pattern"></div>

            <div className="content">
                <div style={{ textAlign: 'center' }}>
                    <img src="https://firebasestorage.googleapis.com/v0/b/lib-18147.appspot.com/o/images%2FLeras-logo.png?alt=media&token=57f65473-2f3a-45cb-b207-d00cb4ed574f" alt="Leras Logo" style={{ width: '100%', maxWidth: '220px' }} />
                    <p style={{ color: '#3C2F2F', fontFamily: 'Montserrat, sans-serif', fontSize: '2.5rem', fontWeight: '800' }}>Menü</p>
                </div>

                <Row className="mx-auto px-3" style={{ maxWidth: '100%' }}>
                    {categories.map((category, index) => (
                        <Col key={index} xs={12} xl={3} className="mb-3">
                            <MenuButton
                                categoryName={category.categoryName}
                                categoryBanner={category.categoryBanner}
                                onClick={() => handleCategoryClick(category.categoryName)}
                            />
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};
