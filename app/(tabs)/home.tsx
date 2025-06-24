import { View, Text, FlatList, Image, Pressable, TextInput, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'expo-router';

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
}

export default function Home() {
  const [randomMeals, setRandomMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Meal[]>([]);

  useEffect(() => {
    fetchRandomMeals();
    fetchCategories();
  }, []);

  const fetchRandomMeals = async () => {
    try {
      const meals: Meal[] = [];
      for (let i = 0; i < 10; i++) {
        const res = await axios.get("https://www.themealdb.com/api/json/v1/1/random.php");
        meals.push(res.data.meals[0]);
      }
      setRandomMeals(meals);
    } catch (error) {
      console.error("Erro ao buscar refeições aleatórias:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://www.themealdb.com/api/json/v1/1/categories.php");
      setCategories(res.data.categories);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const searchMeals = async () => {
    if (!search.trim()) return;
    try {
      const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`);
      setSearchResults(res.data.meals || []);
    } catch (error) {
      console.error("Erro ao buscar refeição:", error);
    }
  };

  const trendingMeals = randomMeals.slice(0, 5);
  const catalogueMeals = randomMeals.slice(5);

  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#fff' }}>
      {/* Cabeçalho */}
      <Text style={{ fontSize: 28, fontWeight: 'bold' }}>Livro de Receitas</Text>
      <Text style={{ fontSize: 16, color: 'gray', marginBottom: 10 }}>
        Encontre sua refeição favorita
      </Text>

      <Link href="/favoritos" asChild>
        <Pressable style={{ backgroundColor: '#f66', padding: 10, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 15 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>⭐ Ver Favoritos</Text>
        </Pressable>
      </Link>

      {/* Busca */}
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <TextInput
          placeholder="Buscar"
          value={search}
          onChangeText={(text) => setSearch(text)}
          onSubmitEditing={searchMeals}
          style={{
            flex: 1,
            backgroundColor: '#eee',
            padding: 10,
            borderRadius: 20,
            paddingHorizontal: 20
          }}
        />
        <Pressable
          onPress={searchMeals}
          style={{
            backgroundColor: '#f66',
            padding: 12,
            borderRadius: 50,
            marginLeft: 10
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>🔍</Text>
        </Pressable>
      </View>

      {/* Resultados da busca */}
      {searchResults.length > 0 && (
        <>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
            Resultados da Busca
          </Text>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.idMeal}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Link href={`/detalhes/${item.idMeal}`} asChild>
                <Pressable style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                  <Image
                    source={{ uri: item.strMealThumb }}
                    style={{ width: 80, height: 80, borderRadius: 10, marginRight: 10 }}
                  />
                  <Text style={{ flex: 1 }}>{item.strMeal}</Text>
                </Pressable>
              </Link>
            )}
          />
        </>
      )}

      {/* Conteúdo padrão (só aparece se não estiver pesquisando) */}
      {searchResults.length === 0 && (
        <>
          {/* Categorias */}
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item.idCategory}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ marginBottom: 20 }}
            renderItem={({ item }) => (
              <Link href={`/categoria/${item.strCategory}`} asChild>
                <Pressable style={{ alignItems: 'center', marginRight: 15 }}>
                  <Image
                    source={{ uri: item.strCategoryThumb }}
                    style={{ width: 60, height: 60, borderRadius: 30, marginBottom: 5 }}
                  />
                  <Text style={{ fontSize: 12, maxWidth: 60 }} numberOfLines={1}>
                    {item.strCategory}
                  </Text>
                </Pressable>
              </Link>
            )}
          />

          {/* Em alta */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Em Alta</Text>
          <FlatList
            data={trendingMeals}
            horizontal
            keyExtractor={(item) => item.idMeal}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Link href={`/detalhes/${item.idMeal}`} asChild>
                <Pressable style={{ marginRight: 15 }}>
                  <Image
                    source={{ uri: item.strMealThumb }}
                    style={{ width: 160, height: 120, borderRadius: 15 }}
                  />
                  <Text numberOfLines={1} style={{ width: 160, marginTop: 5 }}>
                    {item.strMeal}
                  </Text>
                </Pressable>
              </Link>
            )}
          />

          {/* Catálogo */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 25, marginBottom: 10 }}>Catálogo</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {catalogueMeals.map((item) => (
              <Link key={item.idMeal} href={`/detalhes/${item.idMeal}`} asChild>
                <Pressable style={{ width: '48%', marginBottom: 15 }}>
                  <Image
                    source={{ uri: item.strMealThumb }}
                    style={{ width: '100%', height: 120, borderRadius: 10 }}
                  />
                  <Text numberOfLines={1} style={{ marginTop: 5 }}>
                    {item.strMeal}
                  </Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}