import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function Favoritos() {
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('@favoritos');
      const parsed = stored ? JSON.parse(stored) : [];
      setMeals(parsed);
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
    }
  };

  if (meals.length === 0) {
    return <Text style={{ padding: 20 }}>Você ainda não tem favoritos.</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Favoritos</Text>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <Link href={`/detalhes/${item.idMeal}`} asChild>
            <Pressable style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
              <Image
                source={{ uri: item.strMealThumb }}
                style={{ width: 80, height: 80, borderRadius: 10, marginRight: 10 }}
              />
              <Text style={{ fontSize: 16 }}>{item.strMeal}</Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}
