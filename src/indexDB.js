const dbName = 'Daily Payment Management System - Er A H Dekavadiya';
const dbVersion = 1;

let db;

const initDB = (app) => {

  const request = window.indexedDB.open(dbName, dbVersion);

  request.onerror = (event) => {
    console.error('Database error: ', event.target.errorCode);
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    if(!db.objectStoreNames.contains('incomes')){
      const incomesStore = db.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
    }
    if(!db.objectStoreNames.contains('expenses')){
      const expensesStore = db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
    }
    app.mount('#app');
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    const generateRandomDate = (start, end) => {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    const generateRandomData = (isIncome = true) => {
      const data = [];
      for (let i = 1; i <= 700; i++) {
        const randomDate = generateRandomDate(new Date(2022, 0, 1), new Date());
        const formattedDate = `${randomDate.getFullYear()}-${(randomDate.getMonth() + 1).toString().padStart(2, '0')}-${randomDate.getDate().toString().padStart(2, '0')}`;
        const amount = Math.floor(Math.random() * 1000) + 1; // Random amount between 1 and 1000
        const description = isIncome ? `Income ${i}` : `Expense ${i}`;

        data.push({
          id: i,
          description,
          amount,
          date: formattedDate,
        });
      }
      return data;
    };

    if(!db.objectStoreNames.contains('incomes')){
      const incomesStore = db.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
      const incomes = generateRandomData(true);
      incomes.slice().sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(income => {
        incomesStore.add(income);
      });
    }
    if(!db.objectStoreNames.contains('expenses')){
      const expensesStore = db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });

      const expenses = generateRandomData(false);
      expenses.slice().sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(expense => {
        expensesStore.add(expense);
      });
    }
  };
};

const addincomeToDB = (income) => {
  const transaction = db.transaction(['incomes'], 'readwrite');
  const store = transaction.objectStore('incomes');
  const serializedincome = JSON.parse(JSON.stringify(income));
  store.add(serializedincome);
};

const getincomeFromDB = (incomeId) => {
  const transaction = db.transaction(['incomes'], 'readonly');
  const store = transaction.objectStore('incomes');

  const getRequest = store.get(incomeId);

  getRequest.onsuccess = (event) => {
    const income = event.target.result;
    console.log('Retrieved income:', income);
  };

  getRequest.onerror = (event) => {
    console.error('Error getting income:', event.target.errorCode);
  };
};

const updateincomeInDB = (incomeId, updatedincome) => {
  const transaction = db.transaction(['incomes'], 'readwrite');
  const store = transaction.objectStore('incomes');

  const getRequest = store.get(incomeId);

  getRequest.onsuccess = (event) => {
    const income = event.target.result;
    if (income) {
      Object.assign(income, updatedincome);
      const updateRequest = store.put(income);

      updateRequest.onsuccess = () => {
        console.log('income updated successfully:', income);
      };

      updateRequest.onerror = (event) => {
        console.error('Error updating income:', event.target.errorCode);
      };
    } else {
      console.error('income not found');
    }
  };

  getRequest.onerror = (event) => {
    console.error('Error getting income:', event.target.errorCode);
  };
};

const getAllincomesFromDB = () => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['incomes'], 'readonly');
    const store = transaction.objectStore('incomes');

    const getRequest = store.getAll();

    getRequest.onsuccess = (event) => {
      const incomes = event.target.result;
      resolve(incomes);
    };

    getRequest.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const deleteincomeFromDB = (incomeId) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['incomes'], 'readwrite');
    const store = transaction.objectStore('incomes');

    const getRequest = store.delete(incomeId);

    getRequest.onsuccess = (event) => {
      resolve('income deleted successfully');
    };

    getRequest.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const addExpenseToDB = (expense) => {
  const transaction = db.transaction(['expenses'], 'readwrite');
  const store = transaction.objectStore('expenses');
  const serializedExpense = JSON.parse(JSON.stringify(expense));
  store.add(serializedExpense);
};

const getExpenseFromDB = (expenseId) => {
  const transaction = db.transaction(['expenses'], 'readonly');
  const store = transaction.objectStore('expenses');

  const getRequest = store.get(expenseId);

  getRequest.onsuccess = (event) => {
    const expense = event.target.result;
    console.log('Retrieved expense:', expense);
  };

  getRequest.onerror = (event) => {
    console.error('Error getting expense:', event.target.errorCode);
  };
};

const updateExpenseInDB = (expenseId, updatedExpense) => {
  const transaction = db.transaction(['expenses'], 'readwrite');
  const store = transaction.objectStore('expenses');

  const getRequest = store.get(expenseId);

  getRequest.onsuccess = (event) => {
    const expense = event.target.result;
    if (expense) {
      Object.assign(expense, updatedExpense);
      const updateRequest = store.put(expense);

      updateRequest.onsuccess = () => {
        console.log('Expense updated successfully:', expense);
      };

      updateRequest.onerror = (event) => {
        console.error('Error updating expense:', event.target.errorCode);
      };
    } else {
      console.error('Expense not found');
    }
  };

  getRequest.onerror = (event) => {
    console.error('Error getting expense:', event.target.errorCode);
  };
};

const getAllExpensesFromDB = () => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['expenses'], 'readonly');
    const store = transaction.objectStore('expenses');

    const getRequest = store.getAll();

    getRequest.onsuccess = (event) => {
      const expenses = event.target.result;
      resolve(expenses);
    };

    getRequest.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const deleteExpenseFromDB = (expenseId) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['expenses'], 'readwrite');
    const store = transaction.objectStore('expenses');

    const getRequest = store.delete(expenseId);

    getRequest.onsuccess = (event) => {
      resolve('Expense deleted successfully');
    };

    getRequest.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

// Export the functions to use in other parts of your application
export { initDB, addincomeToDB, getincomeFromDB, updateincomeInDB, getAllincomesFromDB, deleteincomeFromDB, addExpenseToDB, getExpenseFromDB, updateExpenseInDB, getAllExpensesFromDB, deleteExpenseFromDB };


