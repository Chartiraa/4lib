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

export async function getOrdersTableBaseTable(tableNo) {
    var returnValue = 0
    await get(child(ref(db), "Cafe/Tables/" + tableNo)).then((snapshot) => {
        if (snapshot.exists()) {
            returnValue = snapshot.val()
            return returnValue
        }
    }).catch((error) => {
        console.error(error);
    });

    return returnValue
}
