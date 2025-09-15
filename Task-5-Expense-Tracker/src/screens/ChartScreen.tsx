import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { initDB, getExpenses } from '../database/dbService';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function ChartScreen() {
  const [db, setDb] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  // Load chart data
  const loadChartData = async (dbConn: any) => {
    const data = await getExpenses(dbConn);

    const grouped: { [key: string]: number } = {};
    data.forEach((item: any) => {
      grouped[item.category] = (grouped[item.category] || 0) + item.amount;
    });

    const formatted = Object.keys(grouped).map((key, index) => ({
      name: key,
      amount: grouped[key],
      color: chartColors[index % chartColors.length],
      legendFontColor: '#333',
      legendFontSize: 14,
    }));

    setChartData(formatted);
  };

  // Runs every time the tab gets focus
  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const dbConn = db || (await initDB());
        setDb(dbConn);
        loadChartData(dbConn);
      };
      init();
    }, [db]),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses by Category</Text>
      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor={'amount'}
          backgroundColor={'transparent'}
          paddingLeft={'20'}
          absolute
        />
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
}

const chartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
});
