import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AnimalContext } from '../App';

export default function AnimalScreen({ navigation, animals = [] }) {
  const { logout, currentUser } = useContext(AnimalContext);

  // Navigation buttons data
  const navItems = [
    { label: 'View Animals', action: () => navigation.navigate('AnimalList') },
    ...(currentUser?.role === 'user'
      ? [{ label: 'Adoption Requests', action: () => navigation.navigate('AdoptionRequests') }]
      : []),
    ...(currentUser?.role === 'admin'
      ? [
          { label: 'Add Report', action: () => navigation.navigate('AddReport') },
          { label: 'Manage Adoption Requests', action: () => navigation.navigate('AdoptionRequests') },
        ]
      : []),
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../assets/paw.png')} style={styles.logo} />
          <Text style={styles.headerText}>RescuePaws</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.welcomeText}>Welcome, {currentUser?.username || 'User'}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main content */}
      <View style={styles.mainContent}>
        {/* Left-side navigation bar */}
        <View style={styles.sideNav}>
          <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
            {navItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.navButton} onPress={item.action}>
                <Text style={styles.navButtonText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Right content - Animal cards */}
        <ScrollView style={styles.rightContent}>
          {animals.map((animal) => (
            <TouchableOpacity
              key={animal.id}
              style={styles.card}
              onPress={() => navigation.navigate('AnimalDetails', { animal })}
            >
              <Image source={{ uri: animal.imageUrl }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{animal.name}</Text>
                <Text style={styles.location}>{animal.location}</Text>
                <Text style={styles.status}>{animal.status}</Text>
              </View>
              <View style={styles.actions}>
                {currentUser?.role === 'admin' && (
                  <>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Text style={styles.actionText}>Delete</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
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
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  sideNav: {
    width: 220,
    backgroundColor: '#602234',
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  rightContent: {
    flex: 1,
    padding: 10,
  },
  navButton: {
    backgroundColor: '#FF69B4',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
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
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#602234',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  status: {
    fontSize: 13,
    marginTop: 4,
    color: '#333',
  },
  actions: {
    flexDirection: 'column',
  },
  actionBtn: {
    backgroundColor: '#FF69B4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginVertical: 2,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
