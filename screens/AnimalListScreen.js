import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { AnimalContext } from '../App';

export default function AnimalListScreen({ navigation }) {
  const { animals, deleteAnimal, currentUser, logout } = useContext(AnimalContext);

  const handlePress = (animal) => navigation.navigate('AnimalDetails', { animalId: animal.id });
  const handleEdit = (animal) => navigation.navigate('AddReport', { animal });

  const renderAnimal = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
      {currentUser?.role === 'admin' && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item)}>
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => deleteAnimal(item.id)}>
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../assets/paw.png')} style={styles.logo} />
          <Text style={styles.headerText}>RescuePaws</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.welcomeText}>
            Welcome, {currentUser?.username || currentUser?.email || 'User'}           <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          </Text>
        </View>
      </View>

      {/* Animal List */}
      <FlatList
        data={animals}
        keyExtractor={(item) => item.id}
        renderItem={renderAnimal}
        contentContainerStyle={{ padding: 12 }}
      />

      {/* Floating Add Button (only for admin) */}
      {currentUser?.role === 'admin' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddReport')}
        >
          <Text style={styles.fabText}>+ Add Report</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5DC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    backgroundColor: '#602234',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerRight: { flexDirection: 'column', alignItems: 'flex-end' },
  logo: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  headerText: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  welcomeText: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  logoutButton: {
    backgroundColor: '#E3DED0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: { color: 'black', fontWeight: 'bold', fontSize: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 4,
  },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#602234' },
  location: { fontSize: 14, color: '#666', marginTop: 2 },
  status: { fontSize: 13, marginTop: 4, color: '#333' },
  actions: { flexDirection: 'column', marginLeft: 8 },
  actionBtn: {
    backgroundColor: '#FF69B4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginVertical: 2,
  },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#FF69B4',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
  },
  fabText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
