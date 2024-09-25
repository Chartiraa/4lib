import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QR = (props) => {

  const { customerOrder, setCustomerOrder, setShowQR, setShowCustomerOrder } = props;


  const [qrCode, setQrCode] = useState('Henüz bir QR kod taranmadı');
  const [cameras, setCameras] = useState([]); // Kameraları tutacak state
  const [selectedCamera, setSelectedCamera] = useState(null); // Seçilen kamera
  const [isScanning, setIsScanning] = useState(false); // Tarayıcı durumu

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");

    // Cihazdaki kameraları listeleme
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId); // Varsayılan olarak ilk kamerayı seç
        }
      } catch (err) {
        console.error('Kamera listesi alınamadı:', err);
      }
    };

    getCameras(); // Kameraları yükle

    // Seçilen kamerayı başlat
    const startCamera = (deviceId) => {
      if (isScanning) return; // Zaten tarama yapılıyorsa tekrar başlatma
      setIsScanning(true);
      html5QrCode.start(
        { deviceId }, // Kamera ID'si ile başlatıyoruz
        {
          fps: 10, // Saniyedeki tarama kare sayısı
          qrbox: { width: 250, height: 250 }, // QR kodu tarama alanı
        },
        (decodedText) => {
          // QR kod başarıyla okunduğunda
          setQrCode(decodedText);

          let orderData;
          try {
            orderData = JSON.parse(decodedText);
            setCustomerOrder(orderData);
            setShowQR(false);
            setShowCustomerOrder(true);
          } catch (error) {
            console.error("Veri parse edilemedi:", error);
          }

        },
        (error) => {
          //console.error('QR Kod Okuma Hatası: ', error);
        }
      ).catch((err) => {
        console.error('Kamera başlatılamadı: ', err);
        setIsScanning(false); // Başarısız olursa tarama durumu iptal
      });
    };

    if (selectedCamera) {
      startCamera(selectedCamera);
    }

    // Temizlik işlemi (komponent unmount olduğunda kamerayı durdurur)
    return () => {
      if (isScanning) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
          setIsScanning(false); // Tarama durumu kapandı
        }).catch(err => console.error('Kamera durdurma hatası: ', err));
      }
    };
  }, [selectedCamera]); // Seçilen kamera değiştiğinde yeniden başlat

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
      <div id="reader" style={{ width: '100%', maxWidth: '400px' }}></div>

      {/* Kamera Seçimi 
      <select onChange={(e) => setSelectedCamera(e.target.value)} style={{ marginTop: '20px' }}>
        {cameras.map((camera, index) => (
          <option key={index} value={camera.deviceId}>
            {camera.label || `Kamera ${index + 1}`}
          </option>
        ))}
      </select>*/}

      <label style={{ marginTop: '20px', fontSize: '20px', textAlign: 'center' }}>
        {qrCode}
      </label>
    </div>
  );
};

export default QR;
