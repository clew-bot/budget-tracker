let db;
// create the indexedDB database
const request = window.indexedDB.open("budgetDB", 1);
  
//create the schema inside budgetDB
request.onupgradeneeded = event =>{
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
  };

// check if app is online before reading from db via Navigator.online request
request.onsuccess = event => {
    db = event.target.result;
    if (navigator.onLine) {
      checkDatabase();
    }
  };

  // console error if database doesn't respond
  request.onerror = event => {
    console.log("Error! " + event.target.errorCode);
  };

function saveRecord(record) {
  // create a transaction on the pending db with readwrite access
  const transaction = db.transaction(["pending"], "readwrite");

  // access your pending object store
  const store = transaction.objectStore("pending");

  // add record to your store with add method.
  store.add(record);
}

function checkDatabase() {
  // open a transaction on your pending db
  const transaction = db.transaction(["pending"], "readwrite");
  // access your pending object store
  const store = transaction.objectStore("pending");
  // get all records from store and set to a variable
  const getAll = store.getAll();

  getAll.onsuccess = () => {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        // if successful, open a transaction on your pending db
        const transaction = db.transaction(["pending"], "readwrite");

        // access your pending object store
        const store = transaction.objectStore("pending");

        // clear all items in your store
        store.clear();
      });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);