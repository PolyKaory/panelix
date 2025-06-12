import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'FAVORITE_MEALS';

export async function getFavorites() {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : [];
}

export async function addFavorite(meal) {
  const favorites = await getFavorites();
  const newFavorites = [...favorites, meal];
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
}

export async function removeFavorite(id) {
  const favorites = await getFavorites();
  const newFavorites = favorites.filter(m => m.idMeal !== id);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
}

export async function isFavorite(id) {
  const favorites = await getFavorites();
  return favorites.some(m => m.idMeal === id);
}