import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AnimalContext } from '../App';

export default function HomeScreen({ navigation }) {
  const { logout, currentUser } = useContext(AnimalContext);

  // Navigation buttons data
  const navItems = [
    { label: 'View Animals', action: () => navigation.navigate('AnimalList') },
    ...(currentUser?.role === 'user' ? [
      { label: 'Adoption Requests', action: () => navigation.navigate('AdoptionRequests') }
    ] : []),
    ...(currentUser?.role === 'admin' ? [
      { label: 'Add Report', action: () => navigation.navigate('AddReport') },
      { label: 'Manage Adoption Requests', action: () => navigation.navigate('AdoptionRequests') }
    ] : [])
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
          <Text style={styles.welcomeText}>
          Welcome, {currentUser?.username || currentUser?.email || 'User'}           <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          </Text>
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

        {/* Right / Main area */}
        <View style={styles.rightContent}>
          {/* Additional content can go here */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B995A1',
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
    alignItems: 'flex-end', // align logout button to right
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
    width: 250,
    backgroundColor: '#602234',
    borderRadius: 5,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
  },
  rightContent: {
    flex: 1,
    marginLeft: 20,
  },
  navButton: {
    backgroundColor: 'beige',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  navButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
