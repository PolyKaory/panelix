import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importe sua Home aqui
import Home from './home'; // ajuste o caminho se necessário

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showHome, setShowHome] = useState(false);

  // Verifica se já está logado
  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        setIsLoggedIn(true);
        setEmail(JSON.parse(user).email);
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      await AsyncStorage.setItem('user', JSON.stringify({ email }));
      setIsLoggedIn(true);
      Alert.alert('Bem-vindo!', 'Login realizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    setIsLoggedIn(false);
    setShowHome(false);
    setEmail('');
    setSenha('');
  };

  if (showHome) {
    return <Home />;
  }

  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo de volta!</Text>
        <Text style={styles.subtitle}>Você está logado como: {email}</Text>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { marginTop: 15, backgroundColor: '#4682B4' }]}
          onPress={() => setShowHome(true)}
        >
          <Text style={styles.buttonText}>Ir para Página Principal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PANELIX</Text>
      <Text style={styles.subtitle}>Seu APP de receitas favorito!</Text>

      <View style={styles.loginBox}>
        <Text style={styles.loginTitle}>Faça seu Login</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6347',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginBox: {
    backgroundColor: '#f2f2f2',
    padding: 20,
    borderRadius: 10,
  },
  loginTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
