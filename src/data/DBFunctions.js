import { getDatabase, ref, child, get, set, remove, onValue, update, push } from "firebase/database";
import { getStorage, uploadBytes, getDownloadURL, ref as sRef } from "firebase/storage";
import { auth } from "../firebaseConfig";

import "../firebaseConfig";

const db = getDatabase();
const storage = getStorage();

function formatDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0'dan başlar, bu yüzden +1 ekliyoruz
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} - ${hours}:${minutes}`;
}

function formatDateOnly() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0'dan başlar, bu yüzden +1 ekliyoruz
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

const parseDate = (dateString) => {
    const [datePart, timePart] = dateString.split(' - ');
    const [day, month, year] = datePart.split('-');
    return new Date(`${year}-${month}-${day}T${timePart}`);
};

export async function uploadImage(file, ID) {
    const storageRef = sRef(storage, `images/${ID}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref)
}

export async function getAccounts() {
    var returnValue = 0
    await get(child(ref(db), "Cafe/Accounts/")).then((snapshot) => {
        if (snapshot.exists()) {
            returnValue = snapshot.val()
            return returnValue
        }
    }).catch((error) => {
        console.error(error);
    });

    return returnValue
}

export async function addAccount(props) {
    await set(ref(db, 'Cafe/Accounts/' + Date.now() + '/'), {
        accountID: Date.now(),
        accountName: props.accountName,
        accountPassword: props.accountPassword,
        accountType: props.accountType,
        lastEditDate: formatDate()
    });
}

export async function editAccount(props) {
    await set(ref(db, 'Cafe/Accounts/' + props.accountID + '/'), {
        accountID: props.accountID,
        accountName: props.accountName,
        accountPassword: props.accountPassword,
        accountType: props.accountType,
        lastEditDate: formatDate()
    });
}

export async function delAccount(accountID) {
    await remove(ref(db, 'Cafe/Accounts/' + accountID + '/'))
}

export async function getTables() {
    var returnValue = 0
    await get(child(ref(db), "Cafe/TableData/")).then((snapshot) => {
        if (snapshot.exists()) {
            returnValue = snapshot.val()
            return returnValue
        }
    }).catch((error) => {
        console.error(error);
    });

    return returnValue
}

export async function addTable(tableName) {
    await set(ref(db, 'Cafe/TableData/' + tableName + '/'), {
        tableName: tableName,
        lastEditDate: formatDate()
    });
}

export async function delTable(tableID) {
    await remove(ref(db, 'Cafe/TableData/' + tableID + '/'))
}

export async function getProducts() {
    var returnValue = 0
    await get(child(ref(db), "Cafe/Products/")).then((snapshot) => {
        if (snapshot.exists()) {
            returnValue = snapshot.val()
            return returnValue
        }
    }).catch((error) => {
        console.error(error);
    });

    return returnValue
}

export async function addProduct(props) {

    await set(ref(db, 'Cafe/Products/' + props.productID + '/'), {
        productID: props.productID,
        productName: props.productName,
        productCategory: props.productCategory,
        productPrice: props.productPrice,
        productImage: props.productImage,
        lastEditDate: formatDate()
    });
}

export async function editProduct(props) {
    await set(ref(db, 'Cafe/Products/' + props.productID + '/'), {
        productID: props.productID,
        productName: props.productName,
        productCategory: props.productCategory,
        productPrice: props.productPrice,
        productImage: props.productImage,
        lastEditDate: formatDate()
    });
}

export async function delProduct(productID) {
    await remove(ref(db, 'Cafe/Products/' + productID + '/'))
}

export async function getCategories() {
    var returnValue = 0
    await get(child(ref(db), "Cafe/Categories/")).then((snapshot) => {
        if (snapshot.exists()) {
            returnValue = snapshot.val()
            return returnValue
        }
    }).catch((error) => {
        console.error(error);
    });

    return returnValue
}

export async function addCategory(props) {
    await set(ref(db, 'Cafe/Categories/' + props.categoryName + '/'), {
        categoryName: props.categoryName,
        categoryBanner: props.categoryBanner,
        lastEditDate: formatDate()
    });
}

export async function editCategory(props) {
    await set(ref(db, 'Cafe/Categories/' + props.categoryName + '/'), {
        categoryName: props.categoryName,
        categoryBanner: props.categoryBanner,
        lastEditDate: formatDate()
    });
}

export async function delCategory(categoryName) {
    await remove(ref(db, 'Cafe/Categories/' + categoryName + '/'))
}

export async function getOrders(tableName) {
    var returnValue = 0
    await get(child(ref(db), "Cafe/Tables/" + tableName)).then((snapshot) => {
        if (snapshot.exists()) {
            returnValue = snapshot.val()
            return returnValue
        }
    }).catch((error) => {
        console.error(error);
    });

    return returnValue
}

export async function addOrder(props) {
    const datenow = Date.now();
    const isCoffeeCategory = props.productCategory && props.productCategory.includes('Kahve'); // Ürün kategorisi kontrolü
    const isTurkishCoffee = props.productName && props.productName.toLowerCase().includes('türk kahvesi'); // Türk kahvesi kontrolü

    // Ekstra özelliklere göre fiyat hesaplama
    let additionalCost = 0;
    if (isCoffeeCategory) {
        // Ekstra Shot fiyat hesaplaması
        if (props.extraShot && props.extraShot.toLowerCase() !== 'yok') {
            switch (props.extraShot.toLowerCase()) {
                case 'tek':
                    additionalCost += 10;
                    break;
                case 'double':
                    additionalCost += 20;
                    break;
                case 'triple':
                    additionalCost += 30;
                    break;
                default:
                    break;
            }
        }

        // Şurup seçimi ve miktarı fiyat hesaplaması
        if (props.syrupFlavor && props.syrupFlavor.toLowerCase() !== 'yok') { // Şurup seçili mi kontrol et
            if (props.syrupAmount) { // Şurup miktarı kontrolü
                switch (props.syrupAmount.toLowerCase()) {
                    case 'tek':
                        additionalCost += 10;
                        break;
                    case 'double':
                        additionalCost += 20;
                        break;
                    default:
                        break;
                }
            }
        }

        // Süt tipi fiyat hesaplaması
        if (props.milkType && props.milkType.toLowerCase() === 'laktozsuz') {
            additionalCost += 10;
        }
    }

    const totalProductPrice = parseFloat(props.productPrice) + additionalCost;

    const orderData = {
        orderID: datenow,
        productID: props.productID,
        productName: props.productName,
        productPrice: totalProductPrice.toFixed(2), // Ek maliyetler dahil toplam fiyat
        quantity: props.quantity,
        lastEditDate: formatDate()
    };

    // Eğer ürünün kategorisi kahve içeriyorsa ekstra seçenekleri ekle
    if (isCoffeeCategory) {
        orderData.extraShot = props.extraShot || "Yok";
        orderData.syrupFlavor = props.syrupFlavor || "Yok";
        orderData.syrupAmount = props.syrupAmount || "Tek"; // Şurup miktarı: Varsayılan olarak "Tek"
        orderData.milkType = props.milkType || "Normal";
    }

    if (isTurkishCoffee) {
        orderData.sugar = props.sugar || "Sade";
    }

    try {
        // Veritabanına siparişi kaydet
        await set(ref(db, 'Cafe/Tables/' + props.tableName + '/' + datenow), orderData);

        // Barista bölümüne de siparişi kaydet
        await set(ref(db, 'Cafe/Barista/' + props.tableName + '/' + datenow), orderData);
        console.log(`Sipariş eklendi: Masa - ${props.tableName}, Sipariş ID - ${datenow}`);
    } catch (error) {
        console.error("Sipariş ekleme işlemi sırasında bir hata oluştu:", error);
    }
}

export async function editOrders(props) {
    // Gerekli parametrelerin kontrolü
    if (!props.tableName || !props.orderID || !props.productID || !props.productName) {
        console.error("editOrders işlemi için geçersiz parametreler:", props);
        return;
    }

    // Ürün kategorisini ve başlangıç fiyatını alın
    const productData = await getProductData(props.productID); // Ürün verilerini al

    if (!productData) {
        console.error(`Ürün bilgisi alınamadı: ${props.productID}`);
        return; // Eğer ürün bilgisi alınamazsa, işlemi sonlandır
    }

    // Ürün kategorisini ve fiyatını product tablosundan al
    const productCategory = productData.productCategory;
    let basePrice = parseFloat(productData.productPrice); // Başlangıç fiyatı alın

    console.log("Başlangıç Fiyatı: ", basePrice);
    console.log("Ürün Kategorisi: ", productCategory);

    // Eğer ürün kahve kategorisindeyse, fiyatlandırmayı yap
    if (productCategory && productCategory.includes('Kahve')) {
        // Ekstra Shot fiyatlandırması
        if (props.extraShot && props.extraShot.toLowerCase() !== "yok") {
            if (props.extraShot.toLowerCase() === "tek") {
                basePrice += 10;  // Tek shot eklenmişse 10 ekle
            } else if (props.extraShot.toLowerCase() === "double") {
                basePrice += 20;  // Double shot eklenmişse 20 ekle
            } else if (props.extraShot.toLowerCase() === "triple") {
                basePrice += 30;  // Triple shot eklenmişse 30 ekle
            }
        }

        // Şurup fiyatlandırması
        if (props.syrupFlavor && props.syrupFlavor.toLowerCase() !== "yok") {
            if (props.syrupAmount.toLowerCase() === "tek") {
                basePrice += 10; // Tek şurup eklenmişse 10 ekle
            } else if (props.syrupAmount.toLowerCase() === "double") {
                basePrice += 20; // Double şurup eklenmişse 20 ekle
            }
        }

        // Süt tipi fiyatlandırması
        if (props.milkType && props.milkType.toLowerCase() === "laktozsuz") {
            basePrice += 10; // Laktozsuz süt eklenmişse 10 ekle
        }
    }

    console.log("Güncellenmiş Fiyat: ", basePrice);

    // Sipariş verisi oluşturma
    const orderData = {
        orderID: props.orderID,
        productID: props.productID,
        productName: props.productName,
        productPrice: basePrice.toFixed(2), // Güncellenmiş fiyatı kullanın
        quantity: props.quantity,
        lastEditDate: formatDate(),
        extraShot: props.extraShot || "Yok",
        syrupFlavor: props.syrupFlavor || "Yok",
        syrupAmount: props.syrupAmount || "Tek",
        milkType: props.milkType || "Normal"
    };

    try {
        // Siparişi veritabanında güncelle
        await set(ref(db, 'Cafe/Tables/' + props.tableName + '/' + props.orderID), orderData);
        console.log(`Sipariş güncellendi: Masa - ${props.tableName}, Sipariş - ${props.orderID}`);
    } catch (error) {
        console.error("editOrders işlemi sırasında bir hata oluştu:", error);
    }
}

export async function delOrders(props) {
    await remove(ref(db, 'Cafe/Tables/' + props.tableName + '/' + props.orderID))
}

export async function getTotal(tableName) {
    var returnValue = 0
    await get(child(ref(db), "Cafe/Totals/" + tableName)).then((snapshot) => {
        if (snapshot.exists()) {
            returnValue = snapshot.val()
            return returnValue
        }
    }).catch((error) => {
        console.error(error);
    });

    return returnValue
}

export async function setTotal(props) {
    await set(ref(db, 'Cafe/Totals/' + props.tableName + '/'), {
        tableName: props.tableName,
        total: props.total,
        lastEditDate: formatDate()
    });
}

export async function editTotal(props) {
    await set(ref(db, 'Cafe/Totals/' + props.tableName + '/'), {
        tableName: props.tableName,
        total: props.total,
        lastEditDate: formatDate()
    });
}

export async function payOrder(props) {
    await set(ref(db, 'Cafe/Tables/' + props.tableName + '/' + Date.now()), {
        productID: props.productID,
        productName: props.productName,
        quantity: props.quantity,
        lastEditDate: formatDate()
    });
}

export async function addLog({ tableName, action, amount, payment_method, cashier_name, products_sold }) {
    const logRef = ref(db, 'Cafe/Logs/' + formatDate()); // Logları tarih bazlı kaydediyoruz.

    // Yeni log kaydı oluştur
    await push(logRef, {
        tableName: tableName,
        action: action,
        amount: amount,
        payment_method: payment_method,
        cashier_name: cashier_name,
        products_sold: products_sold,
        date: new Date().toISOString(),
    });
}

export async function tempPay(tableName, props) {
    if (!tableName || !props.orderID) {
        console.error("TempPay işlemi için geçersiz parametreler:", { tableName, props });
        return;
    }

    const isCoffeeCategory = props.productCategory && props.productCategory.includes('Kahve');

    // Tüm ek özellikler dahil olarak tempData oluştur
    const tempData = {
        orderID: props.orderID,
        productID: props.productID,
        productName: props.productName,
        productPrice: props.productPrice,
        quantity: props.quantity,
        lastEditDate: formatDate(),
        extraShot: props.extraShot || "Yok",
        syrupFlavor: props.syrupFlavor || "Yok",
        syrupAmount: props.syrupAmount || "Tek",
        milkType: props.milkType || "Normal",
        productCategory: props.productCategory || ""
    };

    try {
        const tempRef = ref(db, `Cafe/Temp/${tableName}/${props.orderID}`);

        // Mevcut kaydı kontrol et
        const snapshot = await get(tempRef);

        if (snapshot.exists()) {
            // Eğer kayıt varsa, mevcut miktara yenisini eklemeden önce kontrol et
            const currentData = snapshot.val();
            const currentQuantity = currentData.quantity || 0;

            // Yeni miktarı doğrudan güncellemek yerine mevcut miktarı ekleyin
            const newQuantity = currentQuantity + props.quantity;

            // Güncellenmiş tüm ek özelliklerle birlikte miktarı güncelle
            await update(tempRef, { ...currentData, quantity: newQuantity, lastEditDate: formatDate() });
            console.log(`Temp'te güncellendi: Masa - ${tableName}, Sipariş - ${props.orderID}, Yeni Miktar: ${newQuantity}`);
        } else {
            // Eğer kayıt yoksa, yeni veri ekle
            await set(tempRef, tempData);
            console.log(`Temp'e eklendi: Masa - ${tableName}, Sipariş - ${props.orderID}`);
        }

    } catch (error) {
        console.error("TempPay işlemi sırasında bir hata oluştu:", error);
    }
}

export async function editTempPay(tableName, orderID, quantityChange) {
    if (!tableName || !orderID || typeof quantityChange !== 'number') {
        console.error("editTempPay işlemi için geçersiz parametreler:", { tableName, orderID, quantityChange });
        return;
    }

    try {
        const tempRef = ref(db, `Cafe/Temp/${tableName}/${orderID}`);

        // Mevcut kaydı kontrol et
        const snapshot = await get(tempRef);

        if (snapshot.exists()) {
            // Eğer kayıt varsa, mevcut veriyi alın
            const currentData = snapshot.val();
            const currentQuantity = currentData.quantity || 0;
            const newQuantity = currentQuantity + quantityChange;

            if (newQuantity <= 0) {
                // Eğer yeni miktar 0 veya daha az ise, kaydı sil
                await remove(tempRef);
                console.log(`Temp'ten silindi: Masa - ${tableName}, Sipariş - ${orderID}`);
            } else {
                // Mevcut veriyi koruyarak yalnızca miktarı ve son düzenleme tarihini güncelle
                await update(tempRef, { ...currentData, quantity: newQuantity, lastEditDate: formatDate() });
                console.log(`Temp'te güncellendi: Masa - ${tableName}, Sipariş - ${orderID}, Yeni Miktar: ${newQuantity}`);
            }
        } else {
            console.warn(`editTempPay: Temp tablosunda bu sipariş bulunamadı: Masa - ${tableName}, Sipariş - ${orderID}`);
        }
    } catch (error) {
        console.error("editTempPay işlemi sırasında bir hata oluştu:", error);
    }
}

export async function delTempPay(tableName, orderID) {
    if (!tableName || !orderID) {
        console.error("delTempPay işlemi için geçersiz parametreler:", { tableName, orderID });
        return;
    }

    try {
        await remove(ref(db, `Cafe/Temp/${tableName}/${orderID}`));
        console.log(`Temp'ten silindi: Masa - ${tableName}, Sipariş - ${orderID}`);
    } catch (error) {
        console.error("Temp'ten silme işlemi sırasında bir hata oluştu:", error);
    }
}

export async function getTempPay(tableName) {
    try {
        const snapshot = await get(ref(db, `Cafe/Temp/${tableName}/`));
        if (snapshot.exists()) {
            console.log(`Temp verisi çekildi: Masa - ${tableName}`);
            return snapshot.val(); // Masa adı altındaki tüm siparişleri döndür
        } else {
            console.log(`Temp verisi bulunamadı: Masa - ${tableName}`);
            return {}; // Eğer veri yoksa boş bir nesne döndür
        }
    } catch (error) {
        console.error("Temp verisi alınırken bir hata oluştu:", error);
        return {}; // Hata durumunda da boş bir nesne döndür
    }
}

export async function getBaristaOrders() {
    let returnValue = {};
  
    try {
      const snapshot = await get(child(ref(db), "Cafe/Barista/"));
      if (snapshot.exists()) {
        returnValue = snapshot.val();
      }
    } catch (error) {
      console.error("Error fetching barista orders:", error);
    }
  
    return returnValue;
  }

export async function addBaristaOrder(props) {
    await set(ref(db, 'Cafe/Barista/' + props.tableName + '/' + Date.now()), {
        productID: props.productID,
        productName: props.productName,
        productPrice: props.productPrice,
        quantity: props.quantity,
        lastEditDate: formatDate()
    });
}

export async function editBaristaOrders(props) {
    await set(ref(db, 'Cafe/Barista/' + props.categoryName + '/'), {
        categoryName: props.categoryName,
        categoryBanner: props.categoryBanner,
        lastEditDate: formatDate()
    });
}

export async function delBaristaOrders(tableName, orderID) {
    try {
        // Belirtilen referansta silme işlemini gerçekleştir
        await remove(ref(db, `Cafe/Barista/${tableName}/${orderID}`));
    } catch (error) {
        console.error('Silme işlemi sırasında hata oluştu:', error); // Hataları konsola yazdır
        throw new Error('Sipariş silinirken bir hata oluştu.'); // Hata mesajı döndür
    }
}

export const addUserToDatabase = async (user) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}`);

    // Kullanıcının zaten var olup olmadığını kontrol et
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
        // Kullanıcı Realtime Database'te yoksa ekle
        set(userRef, {
            email: user.email,
            role: null // Başlangıçta rol yok
        });
    }
};

// Veritabanından belirli bir kullanıcının rolünü getirir
export const getUserRole = async (uid) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        console.log(snapshot.val().role)
        return snapshot.val().role;
    } else {
        return null; // Kullanıcı yoksa null döner
    }
};

export const fetchUsers = (callback) => {
    const db = getDatabase();
    const usersRef = ref(db, 'users');

    // Kullanıcıları Firebase'den çekme
    onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const usersArray = Object.entries(data).map(([uid, userData]) => ({
                uid,
                email: userData.email,
                role: userData.role || 'no-role', // Eğer rol yoksa 'no-role' olarak ayarla
            }));
            callback(usersArray);
        }
    });
};

// Kullanıcı rolünü güncelleme
export const updateUserRoleInDB = (uid, newRole) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${uid}`);

    return update(userRef, { role: newRole });
};

export const deleteUserFromDB = (uid) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${uid}`);

    return remove(userRef); // Firebase'den kullanıcıyı sil
};

export async function getEmptyTables() {
    const dbRef = ref(db);
    try {
        // Masalar ve Siparişler tablolarını çek
        const tableDataSnapshot = await get(child(dbRef, 'Cafe/TableData'));
        const ordersSnapshot = await get(child(dbRef, 'Cafe/Tables'));

        if (tableDataSnapshot.exists()) {
            const tables = tableDataSnapshot.val(); // Tüm masalar
            const orders = ordersSnapshot.exists() ? ordersSnapshot.val() : {}; // Mevcut siparişler

            // Sipariş olan masaları bir sete ekle
            const occupiedTablesSet = new Set(Object.keys(orders));

            // Masalar listesinden dolu olanları çıkartarak boş masaları bul
            const emptyTables = Object.keys(tables).filter(table => !occupiedTablesSet.has(table));

            return emptyTables; // Boş masaların listesini döndür
        } else {
            console.log('Cafe/TableData tablosu bulunamadı.');
            return [];
        }
    } catch (error) {
        console.error('Boş masalar bulunurken bir hata oluştu:', error);
        return [];
    }
}

export async function getOccupiedTables() {
    const dbRef = ref(db);
    try {
        // Cafe/Tables verisini al
        const tablesSnapshot = await get(child(dbRef, 'Cafe/Tables'));
        let occupiedTables = [];

        if (tablesSnapshot.exists()) {
            const tables = tablesSnapshot.val();
            occupiedTables = Object.keys(tables); // Dolu masaların listesi
        }

        // Cafe/Temp verisini al
        const tempSnapshot = await get(child(dbRef, 'Cafe/Temp'));
        if (tempSnapshot.exists()) {
            const tempTables = tempSnapshot.val();
            const tempOccupiedTables = Object.keys(tempTables); // Temp'teki dolu masalar

            // İki listeyi birleştir ve tekrar eden masaları filtrele
            occupiedTables = [...new Set([...occupiedTables, ...tempOccupiedTables])];
        }

        return occupiedTables; // Tüm dolu masaların birleşik listesini döndür
    } catch (error) {
        console.error('Dolu masalar bulunurken bir hata oluştu:', error);
        return [];
    }
}


/**
 * Firebase'de bir masa numarasını değiştirir.
 * @param {string} oldTableNumber - Eski masa numarası.
 * @param {string} newTableNumber - Yeni masa numarası.
 * @returns {Promise<void>}
 */
export async function changeTableNumber(oldTableNumber, newTableNumber) {
    const tableRef = ref(db, `Cafe/Tables/${oldTableNumber}`);
    const newTableRef = ref(db, `Cafe/Tables/${newTableNumber}`);

    try {
        // Eski masa numarasını Firebase'den al
        const snapshot = await get(tableRef);

        if (snapshot.exists()) {
            const tableData = snapshot.val(); // Mevcut masa verilerini al

            // Yeni masa numarasıyla kaydet
            await set(newTableRef, tableData);

            // Eski masa kaydını sil
            await remove(tableRef);

            console.log(`Masa numarası ${oldTableNumber} başarıyla ${newTableNumber} olarak değiştirildi.`);
        } else {
            console.log(`Masa ${oldTableNumber} bulunamadı.`);
        }
    } catch (error) {
        console.error("Masa numarası değiştirilirken bir hata oluştu:", error);
    }
}

function parseDateTime(dateTimeString) {
    if (!dateTimeString) return null; // dateTimeString undefined ise, null döner
    const [datePart, timePart] = dateTimeString.split(' - ');
    const [day, month, year] = datePart.split('-');
    const [hour, minute] = timePart.split(':');

    return new Date(year, month - 1, day, hour, minute); // JavaScript'te aylar 0 bazlıdır (0 = Ocak)
}

// Tarih aralığını kontrol eden ve logları getiren fonksiyon
export async function fetchLogsByDateRange(startDate, endDate) {
    const logsRef = ref(db, 'Cafe/Logs');
    const snapshot = await get(logsRef);
    const allLogs = snapshot.val();

    // Eğer veri yoksa boş dizi döner
    if (!allLogs) {
        return [];
    }

    // Tarihleri karşılaştırarak logları filtreler
    const filteredLogs = Object.keys(allLogs)
        .filter(dateTime => {
            const logDate = parseDateTime(dateTime); // Log tarih formatını parse eder
            if (!logDate) return false; // Eğer logDate geçerli değilse filtrelemeden çıkar
            return logDate >= parseDateTime(startDate) && logDate <= parseDateTime(endDate);
        })
        .reduce((acc, dateTime) => {
            const logs = Object.entries(allLogs[dateTime]).map(([key, value]) => ({ ...value, date: dateTime }));
            return [...acc, ...logs];
        }, []);

    return filteredLogs;
}

export function getCurrentUserName() {
    const user = auth.currentUser; // auth.currentUser kullanarak giriş yapmış kullanıcıya erişim
    return user ? user.displayName : 'Anonim Kullanıcı'; // Kullanıcı adı yoksa 'Anonim Kullanıcı' kullan
}

// Firebase'de kategori sıralamasını güncelleyen fonksiyon
export const updateCategoryOrder = async (categories) => {
    try {
        Object.entries(categories).forEach(([categoryId, category], index) => {
            const categoryRef = ref(db, `Cafe/Categories/${categoryId}`);
            update(categoryRef, { sortOrder: index });
        });
    } catch (error) {
        console.error('Kategori sıralaması güncellenirken hata oluştu:', error);
    }
};


// Firebase'de ürün sıralamasını güncelleyen fonksiyon
export const updateProductOrder = async (categoryId, products) => {
    products.forEach((product, index) => {
        const productRef = ref(db, `Cafe/Products/${product.id}`);
        update(productRef, { sortOrder: index }); // Firebase'de `sortOrder` güncelle
    });
};

export async function updateOrderQuantity({ tableName, orderID, quantity }) {
    await set(ref(db, `Cafe/Tables/${tableName}/${orderID}/quantity`), quantity);
}

export async function addBackToOrders({ tableName, order }) {
    const {
        orderID,
        productID,
        productName,
        productPrice,
        quantity,
        extraShot,
        syrupFlavor,
        syrupAmount,
        milkType
    } = order;

    // Eksik veya undefined alanları kontrol et ve varsayılan değerler ata
    if (!orderID || !productID || !productName || !productPrice || !quantity) {
        console.error("Eksik veya geçersiz sipariş bilgileri:", order);
        return; // İşlemi durdur
    }

    try {
        await set(ref(db, `Cafe/Tables/${tableName}/${orderID}`), {
            orderID,
            productID,
            productName,
            productPrice,
            quantity,
            extraShot: extraShot || 'yok', // Varsayılan değer
            syrupFlavor: syrupFlavor || 'yok', // Varsayılan değer
            syrupAmount: syrupAmount || 'yok', // Varsayılan değer
            milkType: milkType || 'normal', // Varsayılan değer
            lastEditDate: new Date().toLocaleString() // Son düzenleme tarihi
        });
        console.log(`Sipariş ${orderID} başarılı bir şekilde Orders tablosuna geri eklendi.`);
    } catch (error) {
        console.error("Orders tablosuna sipariş geri eklenemedi:", error);
    }
}

export async function getProductCategory(productID) {
    if (!productID) {
        console.error("Geçersiz productID:", productID);
        return null;
    }

    try {
        const productRef = ref(db, `Cafe/Products/${productID}`);
        const snapshot = await get(productRef);

        if (snapshot.exists()) {
            const productData = snapshot.val();
            const category = productData.productCategory; // Güncellenmiş alan adı

            if (category) {
                return category; // Kategori bilgisi dön
            } else {
                console.warn(`Kategori bilgisi bulunamadı: ${productID}`);
                return null;
            }
        } else {
            console.warn(`Ürün bulunamadı: ${productID}`);
            return null; // Ürün bulunamadıysa null dön
        }
    } catch (error) {
        console.error("Ürün kategorisi alınırken hata oluştu:", error);
        return null;
    }
}

export async function getProductData(productID) {
    // Tüm ürünleri getProducts ile çek
    const allProducts = await getProducts();

    if (!allProducts || !allProducts[productID]) {
        console.error("Ürün bilgisi bulunamadı: " + productID);
        return null; // Ürün bilgisi bulunamadıysa null döndür
    }

    // Ürün bilgilerini döndür
    return allProducts[productID];
}