import React, { useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AnimalContext } from '../App';

export default function AnimalDetailsScreen({ route, navigation }) {
  const { animalId } = route.params;
  const { animals, currentUser, logout } = useContext(AnimalContext);

  const animal = animals.find(a => a.id === animalId);
  if (!animal) return <View><Text>Animal not found</Text></View>;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../assets/paw.png')} style={styles.logo} />
          <Text style={styles.headerText}>RescuePaws</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.welcomeText}>Welcome, {currentUser?.email || 'User'}       <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity></Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: animal.imageUrl }} style={styles.image} />
        <Text style={styles.name}>{animal.name}</Text>
        <Text style={styles.location}>{animal.location}</Text>
        <Text style={styles.description}>{animal.description}</Text>
        <Text style={styles.status}>Status: {animal.status}</Text>

        {/* Adoption Button */}
        {animal.status !== 'Adopted' && (
          <TouchableOpacity
            style={styles.adoptButton}
            onPress={() => navigation.navigate('RequestAdoption', { animalId: animal.id })}
          >
            <Text style={styles.adoptButtonText}>Request Adoption</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // beige background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    backgroundColor: '#602234',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: '#E3DED0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  logoutText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#602234',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 20,
  },
  adoptButton: {
    backgroundColor: '#FF69B4',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  adoptButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
