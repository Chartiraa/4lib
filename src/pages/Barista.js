import React, { useState, useEffect } from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
<<<<<<< HEAD
import Swal from "sweetalert2";
=======
import Swal from "sweetalert2"
>>>>>>> 8345809a6778bcd21481d6baed4e1124fdf5cb78
import { BaristaButton } from "../components/Widgets";
import { getBaristaOrders, delBaristaOrders } from "../data/DBFunctions";
import { ScrollPanel } from 'primereact/scrollpanel';

export default () => {

  const [orders, setOrders] = useState({});
  const [refresh, setRefresh] = useState(0);

  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    getBaristaOrders().then(res => setOrders(res));
  }, [refresh]);

<<<<<<< HEAD
=======




>>>>>>> 8345809a6778bcd21481d6baed4e1124fdf5cb78
  const onClick = (props) => {
    console.log(props);
    Swal.fire({
      icon: "success",
      title: "Masa:" + props.tableName + " - " + props.productName + " hazır mı?",
      showDenyButton: true,
      confirmButtonText: "Evet",
      denyButtonText: `Hayır`
    }).then((result) => {
      if (result.isConfirmed) {
        delBaristaOrders(props.tableName, props.orderID)
          .then(() => {
            Swal.fire("Sipariş hazır!", "", "success");
            setRefresh(refresh + 1);  // Buraya taşıdık
          })
          .catch(error => {
            console.error("Silme işlemi başarısız:", error);
            Swal.fire("Hata", "Sipariş silinirken bir hata oluştu", "error");
          });
      }
    });
  };

  return (
    <>
      <Row style={{ marginTop: '2rem' }}>
        <Col xl={12}>
          <ScrollPanel style={{ width: '100%', height: '100%' }}>
            <Row className="justify-content-md-center">
              {Object.entries(orders).map(([key, value], index) => (
                <Col xl={2} key={index} className="mb-4">
                  {Object.entries(value).map(([key1, value1], index) => (
                    <BaristaButton
                      key={`${key}-${key1}`}  // Daha iyi bir key kullanımı
                      title={key}
                      productName={value1.productName}
                      onClick={() => onClick({ tableName: key, orderID: key1, productName: value1.productName })}
                    />
                  ))}
                </Col>
              ))}
            </Row>
          </ScrollPanel>
        </Col>
      </Row>
    </>
  );
};
