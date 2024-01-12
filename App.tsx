import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { api } from './src/services/api';
import { CepProps } from './src/interfaces';

export default function App(): React.JSX.Element {
  const [cep, setCep] = useState('');
  const [cepData, setCepData] = useState<CepProps | null>(null);
  const [cepNotFound, setCepNotFound] = useState(false);

  const inputRef = useRef<TextInput | null>(null);

  async function getCep() {
    await api.get(`/${cep}/json`)
    .then(r => {
      clear();
      setCepData(r.data);
    })
    .catch(() => {
      clear();
      setCepNotFound(true)
    })
    .finally(() => Keyboard.dismiss())
  }

  function clear() {
    setCep('');
    setCepData(null);
    setCepNotFound(false);
    inputRef.current?.focus();
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Digite o cep desejado</Text>
      <TextInput 
        style={styles.input}
        placeholder='Ex: 85601000'
        keyboardType='numeric'
        value={cep}
        onChangeText={(text) => setCep(text)}
        ref={inputRef}
      />

      <View style={styles.btnContainer}>
        <TouchableOpacity 
          style={
            [
              styles.btnArea, 
              { 
                backgroundColor: !cep ? '#1d75cd33' : '#1d75cd', 
              }
            ]
          }
          onPress={getCep}
          disabled={!cep}
        >
          <Text style={styles.btn}>Buscar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.btnArea, { backgroundColor: '#cd3e1d' }]}
          onPress={clear}
        >
          <Text style={styles.btn}>Limpar</Text>
        </TouchableOpacity>
      </View>
  
      {cepData && (
        <View style={styles.resultContainer}>
          <Text style={styles.textResult}>CEP: {cepData?.cep}</Text>
          <Text style={styles.textResult}>Logradouro: {cepData?.logradouro}</Text>
          <Text style={styles.textResult}>Bairro: {cepData?.bairro}</Text>
          <Text style={styles.textResult}>Cidade: {cepData?.localidade}</Text>
          <Text style={styles.textResult}>Estado: {cepData?.uf}</Text>
        </View>
      )}

      {cepNotFound && (
        <View style={styles.resultContainer}>
          <Text style={styles.textResult}>Ops! Cep não encontrado.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 25,
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    marginTop: 25,
    marginBottom: 25,
    width: '90%',
    padding: 10,
    borderRadius: 8,
    fontSize: 18,
    color: '#1e1e1e',
  },
  btnContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnArea: {
    borderRadius: 8,
  },
  btn: {
    fontSize: 22,
    padding: 15,
    color: '#fff',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textResult: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginTop: 5,
  },
})