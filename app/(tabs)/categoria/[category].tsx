import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocalSearchParams, Link } from 'expo-router'; // Usamos Link para navegação

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function CategoryMeals() {
  const { category } = useLocalSearchParams(); // Pega o nome da categoria da URL
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      fetchMealsByCategory(category as string);
    }
  }, [category]);

  const fetchMealsByCategory = async (categoryName: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
      setMeals(res.data.meals || []);
    } catch (err) {
      console.error("Erro ao buscar refeições por categoria:", err);
      setError("Failed to load meals for this category.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text style={{ padding: 20 }}>Carregando refeições...</Text>;
  }

  if (error) {
    return <Text style={{ padding: 20, color: 'red' }}>{error}</Text>;
  }

  if (meals.length === 0) {
    return <Text style={{ padding: 20 }}>Nenhuma refeição encontrada para esta categoria.</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Refeições em {category}
      </Text>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <Link href={`/detalhes/${item.idMeal}`} asChild>
            <Pressable
              style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}
            >
              <Image
                source={{ uri: item.strMealThumb }}
                style={{ width: 80, height: 80, borderRadius: 10, marginRight: 10 }}
              />
              <Text style={{ flex: 1, fontSize: 16 }}>{item.strMeal}</Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}
