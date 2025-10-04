import React, { useState, useContext } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert, Image, Modal, FlatList, Pressable, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { AnimalContext } from "../App";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const roles = ["User", "Admin"];
  const { setCurrentUser } = useContext(AnimalContext);

  const handleSignUp = async () => {
    if (!email || !password) return Alert.alert("Please fill in all fields");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        role: role.toLowerCase(),
        createdAt: new Date()
      });

      setCurrentUser({ uid: user.uid, email: user.email, role: role.toLowerCase() });
      Alert.alert(`Account created as ${role}!`);
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Image source={require("../assets/paw.png")} style={styles.logo} />
      <Text style={styles.tagline}>Adopted hearts beat stronger together 🐕💞</Text>

      <View style={styles.form}>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

        <Text style={styles.label}>Select Role:</Text>
        <TouchableOpacity style={styles.roleSelector} onPress={() => setRoleModalVisible(true)}>
          <Text style={styles.roleText}>{role}</Text>
        </TouchableOpacity>

        <Modal visible={roleModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={roles}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Pressable style={styles.modalItem} onPress={() => { setRole(item); setRoleModalVisible(false); }}>
                    <Text style={styles.modalItemText}>{item}</Text>
                  </Pressable>
                )}
              />
              <Pressable style={styles.modalCancel} onPress={() => setRoleModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}



// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8D7DA', // powder pink
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 60,
  },
  tagline: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#800020',
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FFC0CB',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#800020',
    fontWeight: 'bold',
  },
  roleSelector: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFC0CB',
    marginBottom: 20,
  },
  roleText: {
    color: '#800020',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFC0CB',
  },
  modalItemText: {
    fontSize: 16,
    color: '#800020',
  },
  modalCancel: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#FF1493',
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#FF69B4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    marginRight: 5,
    fontSize: 14,
  },
  loginButtonText: {
    color: '#FF1493',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
