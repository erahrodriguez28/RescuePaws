import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  Alert, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { AnimalContext } from '../App';

export default function RequestAdoptionScreen({ route, navigation }) {
  const { animalId } = route.params;
  const { animals, addAdoptionRequest, currentUser, logout } = useContext(AnimalContext);

  const animal = animals.find(a => a.id === animalId);

  // ✅ Updated handleRequest with async/await and error handling
  const handleRequest = async () => {
    if (!currentUser) { 
      Alert.alert('Error', 'You must be logged in to request adoption.');
      return; 
    }

    try {
      await addAdoptionRequest(animalId, currentUser?.username || currentUser?.email);
      Alert.alert('Success', 'Your adoption request has been submitted.');
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting request:", error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

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

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Request Adoption</Text>
          <Text style={styles.details}>
            You are requesting to adopt{" "}
            <Text style={styles.animalName}>{animal?.name}</Text>
          </Text>

          <TouchableOpacity style={styles.submitButton} onPress={handleRequest}>
            <Text style={styles.submitText}>Submit Adoption Request</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  details: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  animalName: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#f44336",
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
