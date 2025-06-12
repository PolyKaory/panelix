import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router'; // Importe useLocalSearchParams

interface MealDetail {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strCategory: string;
  strArea: string;
  // Adicione outras propriedades conforme necessário da resposta da API
  [key: string]: string; // Para lidar com propriedades dinâmicas de ingrediente/medida
}

export default function MealDetails() {
  const { idMeal } = useLocalSearchParams(); // Obtenha o parâmetro 'idMeal'
  const [mealDetail, setMealDetail] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (idMeal) {
      fetchMealDetails(idMeal as string);
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
      console.error("Erro ao buscar detalhes da refeição:", err);
      setError("Falha ao carregar os detalhes da refeição.");
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#f66" />
        <Text style={{ marginTop: 10 }}>Carregando detalhes da refeição...</Text>
      </View>
    );
  }

  if (error) {
    return <Text style={{ padding: 20, color: 'red' }}>{error}</Text>;
  }

  if (!mealDetail) {
    return <Text style={{ padding: 20 }}>Refeição não encontrada.</Text>;
  }

  const ingredientsList = getIngredients(mealDetail);

  
  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Image
        source={{ uri: mealDetail.strMealThumb }}
        style={{ width: '100%', height: 250, borderRadius: 15, marginBottom: 20 }}
      />
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>{mealDetail.strMeal}</Text>
      <Text style={{ fontSize: 16, color: 'gray', marginBottom: 5 }}>
        Categoria: {mealDetail.strCategory}
      </Text>
      <Text style={{ fontSize: 16, color: 'gray', marginBottom: 20 }}>
        Área: {mealDetail.strArea}
      </Text>

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Ingredientes:</Text>
      {ingredientsList.length > 0 ? (
        ingredientsList.map((ingredient, index) => (
          <Text key={index} style={{ fontSize: 16, marginBottom: 5 }}>
            • {ingredient}
          </Text>
        ))
      ) : (
        <Text>Nenhum ingrediente listado.</Text>
      )}

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Instruções:</Text>
      <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 20 }}>
        {mealDetail.strInstructions}
      </Text>
    </ScrollView>
  );
}