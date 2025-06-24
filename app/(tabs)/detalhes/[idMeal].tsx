import { View, Text, Image, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Substituí Link por useRouter para navegação programática
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MealDetail {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strCategory: string;
  strArea: string;
  [key: string]: string;
}

export default function MealDetails() {
  const { idMeal } = useLocalSearchParams();
  const router = useRouter(); // Hook para navegação programática
  const [mealDetail, setMealDetail] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (idMeal) {
      fetchMealDetails(idMeal as string);
      checkIfFavorite(idMeal as string);
    }
  }, [idMeal]);

  const fetchMealDetails = async (mealId: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      if (res.data.meals && res.data.meals.length > 0) {
        setMealDetail(res.data.meals[0]);
      } else {
        setMealDetail(null);
      }
    } catch (err) {
      console.error("Erro ao buscar detalhes:", err);
    } finally {
      setLoading(false);
    }
  };

  const getIngredients = (meal: MealDetail) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`);
      }
    }
    return ingredients;
  };

  const toggleFavorite = async () => {
    try {
      const stored = await AsyncStorage.getItem('@favoritos');
      const parsed = stored ? JSON.parse(stored) : [];

      if (isFavorite) {
        const updated = parsed.filter((item: MealDetail) => item.idMeal !== mealDetail?.idMeal);
        await AsyncStorage.setItem('@favoritos', JSON.stringify(updated));
        setIsFavorite(false);
      } else {
        await AsyncStorage.setItem('@favoritos', JSON.stringify([...parsed, mealDetail]));
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Erro ao atualizar favoritos:", err);
    }
  };

  const checkIfFavorite = async (id: string) => {
    try {
      const stored = await AsyncStorage.getItem('@favoritos');
      const parsed = stored ? JSON.parse(stored) : [];
      const found = parsed.find((item: MealDetail) => item.idMeal === id);
      setIsFavorite(!!found);
    } catch (err) {
      console.error("Erro ao verificar favoritos:", err);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f66" />
        <Text>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!mealDetail) return <Text style={{ padding: 20 }}>Refeição não encontrada.</Text>;

  const ingredientsList = getIngredients(mealDetail);

  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#fff' }}>
      {/* Botão para voltar para a página de favoritos */}
      <Pressable
        onPress={() => router.push('/favoritos')} // Navegação programática para a página de favoritos
        style={{
          backgroundColor: '#f66',
          padding: 10,
          borderRadius: 20,
          alignSelf: 'flex-start',
          marginBottom: 15,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Voltar</Text>
      </Pressable>

      <Image
        source={{ uri: mealDetail.strMealThumb }}
        style={{ width: '100%', height: 250, borderRadius: 15, marginBottom: 20 }}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', flex: 1 }}>{mealDetail.strMeal}</Text>
        <Pressable onPress={toggleFavorite}>
          <Text style={{ fontSize: 28 }}>{isFavorite ? '💖' : '🤍'}</Text>
        </Pressable>
      </View>

      <Text style={{ color: 'gray', marginBottom: 5 }}>
        Categoria: {mealDetail.strCategory} | Área: {mealDetail.strArea}
      </Text>

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Ingredientes:</Text>
      {ingredientsList.map((ingredient, index) => (
        <Text key={index} style={{ fontSize: 16 }}>• {ingredient}</Text>
      ))}

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Instruções:</Text>
      <Text style={{ fontSize: 16, lineHeight: 24 }}>{mealDetail.strInstructions}</Text>
    </ScrollView>
  );
}