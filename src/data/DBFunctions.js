import { getDatabase, ref, child, get, set, remove } from "firebase/database";
import { getStorage, uploadBytes, getDownloadURL, ref as sRef } from "firebase/storage";

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
    await set(ref(db, 'Cafe/Tables/' + props.tableName + '/' + Date.now()), {
        productID: props.productID,
        productName: props.productName,
        productPrice: props.productPrice,
        quantity: props.quantity,
        lastEditDate: formatDate()
    });

    await set(ref(db, 'Cafe/Barista/' + props.tableName + '/' + Date.now()), {
        productID: props.productID,
        productName: props.productName,
        productPrice: props.productPrice,
        quantity: props.quantity,
        lastEditDate: formatDate()
    });
}

export async function editOrders(props) {
    await set(ref(db, 'Cafe/Categories/' + props.categoryName + '/'), {
        categoryName: props.categoryName,
        categoryBanner: props.categoryBanner,
        lastEditDate: formatDate()
    });
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

export async function addLog(props) {
    await set(ref(db, 'Cafe/Logs/' + props.tableName + '/' + formatDateOnly), {
        tableName: props.tableName,
        action: props.action,
        amount: props.amount,
        lastEditDate: formatDate()
    });
}

export async function tempPay(props) {
    await set(ref(db, 'Cafe/Temp/' + props.orderID + '/'), {
        orderID: props.orderID,

        lastEditDate: formatDate()
    });
}

export async function delTempPay(props) {
    await remove(ref(db, 'Cafe/Temp/' + props.orderID + '/'))
}

export async function getTempPay() {
    var returnValue = 0
    await get(child(ref(db), "Cafe/Temp/")).then((snapshot) => {
        if (snapshot.exists()) {
            returnValue = snapshot.val()
            return returnValue
        }
    }).catch((error) => {
        console.error(error);
    });

    return returnValue
}

export async function getBaristaOrders() {
    var returnValue = 0
    await get(child(ref(db), "Cafe/Barista/")).then((snapshot) => {
        if (snapshot.exists()) {
            returnValue = snapshot.val()
            return returnValue
        }
    }).catch((error) => {
        console.error(error);
    });

    return returnValue
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
    await remove(ref(db, 'Cafe/Barista/' + tableName + '/' + orderID))
}