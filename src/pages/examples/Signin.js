import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Form, Card, Button, Container } from '@themesberg/react-bootstrap';

import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";
import { auth } from "../../firebaseConfig"; // Firebase yapılandırmasını doğru import edin
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Firebase Google Auth modüllerini ekleyin
import { useAuthState } from 'react-firebase-hooks/auth';  // Kullanıcının oturum durumunu kontrol etmek için kullanılır
import { addUserToDatabase } from "../../data/DBFunctions";

const Signin = () => {
  const navigate = useNavigate();  // Yönlendirme işlemleri için useNavigate hook'u kullanılır
  const [user, loading, error] = useAuthState(auth);  // Kullanıcının oturum açma durumunu kontrol et

  useEffect(() => {
    if (user) {
      // Eğer kullanıcı oturum açmışsa, Dashboard'a yönlendir
      navigate(Routes.Dashboard.path);
    }
  }, [user, navigate]);  // user veya navigate değiştiğinde bu efekti çalıştır

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);  // Google ile oturum aç
      const user = result.user;
  
      // Kullanıcıyı Realtime Database'e ekle
      await addUserToDatabase(user);
    } catch (error) {
      console.error("Google Sign In Error:", error);
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;  // Oturum açma işlemi devam ederken yükleme ekranı göster
  }

  if (error) {
    return <div>Error: {error.message}</div>;  // Oturum açma sırasında bir hata oluştuysa hata mesajını göster
  }

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Sisteme Giriş Yapın</h3>
                </div>
                <Form className="mt-4">
                  <Button onClick={signInWithGoogle} variant="outline-light" className="btn-icon-only btn-pill text-danger mx-auto w-100">
                    <FontAwesomeIcon icon={faGoogle} className="me-2" />
                    Google ile Giriş Yap
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Signin;
