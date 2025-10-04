import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { AnimalContext } from "../App";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function AdoptionRequestsScreen() {
  const {
    animals,
    currentUser,
    logout,
    respondAdoptionRequest,
    deleteAdoptionRequest, // ✅ from context
  } = useContext(AnimalContext);

  const [adoptionRequests, setAdoptionRequests] = useState([]);

  // ✅ Real-time listener for adoption requests
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "adoptionRequests"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAdoptionRequests(list);
      }
    );
    return () => unsubscribe();
  }, []);

  // ✅ Filter requests: admin sees all, user sees their own
  const filteredRequests =
    currentUser?.role === "admin"
      ? adoptionRequests
      : adoptionRequests.filter(
          (r) => r.requester === (currentUser?.username || currentUser?.email)
        );

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this adoption request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAdoptionRequest(id);
              Alert.alert("Deleted", "The request has been removed.");
            } catch (error) {
              Alert.alert("Error", "Failed to delete request.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const animal = animals.find((a) => a.id === item.animalId);
    return (
      <View style={styles.card}>
        <Text style={styles.animalName}>{animal?.name || "Unknown"}</Text>
        <Text style={styles.text}>Requester: {item.requester}</Text>
        <Text style={styles.text}>Status: {item.status}</Text>

        {/* ✅ Only admin can accept/decline */}
        {currentUser?.role === "admin" && item.status === "Pending" && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#4CAF50" }]}
              onPress={() => respondAdoptionRequest(item.id, true)}
            >
              <Text style={styles.actionText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#E53935" }]}
              onPress={() => respondAdoptionRequest(item.id, false)}
            >
              <Text style={styles.actionText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require("../assets/paw.png")} style={styles.logo} />
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

      {/* List */}
      <FlatList
        data={filteredRequests}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    backgroundColor: "#602234",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: "#E3DED0",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  logoutText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
  },
  animalName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#602234",
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  actions: {
    flexDirection: "row",
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
