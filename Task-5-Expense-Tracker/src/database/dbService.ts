import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native'; 

SQLite.enablePromise(true);

// -------------------- OPEN / INIT --------------------
export const getDBConnection = async () => {
  return SQLite.openDatabase({ name: 'expenses.db', location: 'default' });
};

const createTables = async (db: SQLite.SQLiteDatabase) => {
  const query = `CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL
    );`;
  await db.executeSql(query);
};

export const initDB = async () => {
  const db = await getDBConnection();
  await createTables(db);
  return db;
};

// -------------------- CRUD OPERATIONS --------------------
export const addExpense = async (
  db: SQLite.SQLiteDatabase,
  category: string,
  amount: number
) => {
  const insertQuery =
    `INSERT INTO expenses (category, amount, date) VALUES (?, ?, datetime('now'))`;
  await db.executeSql(insertQuery, [category, amount]);
};

export const getExpenses = async (db: SQLite.SQLiteDatabase) => {
  const results = await db.executeSql(
    `SELECT * FROM expenses ORDER BY date DESC`
  );
  const expenses: any[] = [];
  results.forEach(result => {
    for (let i = 0; i < result.rows.length; i++) {
      expenses.push(result.rows.item(i));
    }
  });
  return expenses;
};

export const deleteExpense = async (db: SQLite.SQLiteDatabase, id: number) => {
  const query = `DELETE FROM expenses WHERE id = ?`;
  await db.executeSql(query, [id]);
};

// -------------------- BACKUP & RESTORE --------------------
const dbFilePath = `${RNFS.DocumentDirectoryPath}/expenses.db`;

export const backupDatabase = async () => {
  const defaultDBPath = `${RNFS.LibraryDirectoryPath}/LocalDatabase/expenses.db`; // iOS
  const androidDBPath = `${RNFS.DocumentDirectoryPath}/expenses.db`; // Android fallback

  try {
    const sourcePath = Platform.OS === 'ios' ? defaultDBPath : androidDBPath;
    await RNFS.copyFile(sourcePath, dbFilePath);
    return true;
  } catch (error) {
    console.error('Backup error:', error);
    return false;
  }
};

export const restoreDatabase = async () => {
  try {
    await RNFS.copyFile(dbFilePath, `${RNFS.DocumentDirectoryPath}/expenses.db`);
    return true;
  } catch (error) {
    console.error('Restore error:', error);
    return false;
  }
};
