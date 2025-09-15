import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  initDB,
  addExpense,
  getExpenses,
  deleteExpense,
} from '../database/dbService';

export default function HomeScreen() {
  const [db, setDb] = useState<any>(null);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const dbConn = await initDB();
      setDb(dbConn);
      loadExpenses(dbConn);
    };
    init();
  }, []);

  const loadExpenses = async (dbConn: any) => {
    const data = await getExpenses(dbConn);
    setExpenses(data);
  };

  const handleAdd = async () => {
    if (category && amount) {
      await addExpense(db, category, parseFloat(amount));
      setCategory('');
      setAmount('');
      loadExpenses(db);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteExpense(db, id);
    loadExpenses(db);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Tracker</Text>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />
        <TextInput
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button title="Add Expense" onPress={handleAdd} color="#007AFF" />
      </View>

      {/* Expense List */}
      <FlatList
        data={expenses}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.expenseInfo}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.amount}>₹{item.amount}</Text>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50, // avoids status bar overlap
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  expenseInfo: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  amount: {
    fontSize: 15,
    color: '#007AFF',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  deleteText: {
    color: 'red',
    fontWeight: '600',
  },
});
