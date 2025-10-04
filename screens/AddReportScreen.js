import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AnimalContext } from "../App";

export default function AddReportScreen({ route, navigation }) {
  const editingAnimal = route.params?.animal;
  const { addAnimal, updateAnimal, currentUser, logout } =
    useContext(AnimalContext);

  const [name, setName] = useState(editingAnimal ? editingAnimal.name : "");
  const [description, setDescription] = useState(
    editingAnimal ? editingAnimal.description : ""
  );
  const [photo, setPhoto] = useState(editingAnimal ? editingAnimal.photo : "");

  // ✅ Open Image Picker
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "We need access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Selected photo URI:", result.assets[0].uri);
      setPhoto(result.assets[0].uri); // Save image URI
    }
  };

  const handleSave = () => {
    if (!name || !description) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (editingAnimal) {
      updateAnimal(editingAnimal.id, { name, description, photo });
      Alert.alert("Success", "Report updated!");
    } else {
      addAnimal({ name, description, photo });
      Alert.alert("Success", "Report added!");
    }
    navigation.goBack();
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

      {/* Form */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TextInput
          placeholder="Animal Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 100 }]}
          multiline
        />

        {/* ✅ Image Picker Button */}
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>
            {photo ? "Change Photo" : "Upload Photo"}
          </Text>
        </TouchableOpacity>

        {/* ✅ Show Selected Image */}
        {photo ? (
          <Image source={{ uri: photo }} style={styles.previewImage} />
        ) : null}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {editingAnimal ? "Update Report" : "Add Report"}
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: "#ccc", marginTop: 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.saveButtonText, { color: "#333" }]}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContent: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: "#6A5ACD",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#FF69B4",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
