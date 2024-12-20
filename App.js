import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker } from 'react-native';
import axios from 'axios';

const App = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [conversionRate, setConversionRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  // Fetching available currencies
  useEffect(() => {
    axios.get('https://api.exchangerate-api.com/v4/latest/USD')
        .then(response => {
          const currenciesList = Object.keys(response.data.rates);
          setCurrencies(currenciesList);
        })
        .catch(error => {
          console.error(error);
        });
  }, []);

  const convertCurrency = () => {
    axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then(response => {
          const rate = response.data.rates[toCurrency];
          setConversionRate(rate);
          setConvertedAmount(amount * rate);
        })
        .catch(error => {
          console.error(error);
        });
  };

  return (
      <View style={styles.container}>
        <Text style={styles.header}>Currency Converter</Text>

        <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
        />

        <View style={styles.pickerContainer}>
          <Text>From Currency:</Text>
          <Picker
              selectedValue={fromCurrency}
              style={styles.picker}
              onValueChange={(itemValue) => setFromCurrency(itemValue)}
          >
            {currencies.map(currency => (
                <Picker.Item key={currency} label={currency} value={currency} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text>To Currency:</Text>
          <Picker
              selectedValue={toCurrency}
              style={styles.picker}
              onValueChange={(itemValue) => setToCurrency(itemValue)}
          >
            {currencies.map(currency => (
                <Picker.Item key={currency} label={currency} value={currency} />
            ))}
          </Picker>
        </View>

        <Button title="Convert" onPress={convertCurrency} />

        {convertedAmount && (
            <Text style={styles.result}>
              {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
            </Text>
        )}

        {conversionRate && (
            <Text style={styles.rate}>Exchange rate: {conversionRate}</Text>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  result: {
    fontSize: 18,
    marginTop: 20,
    color: 'green',
  },
  rate: {
    fontSize: 16,
    marginTop: 10,
    color: 'gray',
  }
});

export default App;
