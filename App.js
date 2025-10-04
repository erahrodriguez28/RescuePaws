import React, { useState, useEffect, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import AnimalListScreen from "./screens/AnimalListScreen";
import AnimalDetailsScreen from "./screens/AnimalDetailsScreen";
import AddReportScreen from "./screens/AddReportScreen";
import RequestAdoptionScreen from "./screens/RequestAdoptionScreen";
import AdoptionRequestsScreen from "./screens/AdoptionRequestsScreen";

// Firebase
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";

// Context
export const AnimalContext = createContext();
const Stack = createNativeStackNavigator();

export default function App() {
  const [animals, setAnimals] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Real-time listener for animals
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "animals"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAnimals(list);
    });
    return () => unsubscribe();
  }, []);

  // Real-time listener for adoption requests
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "adoptionRequests"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAdoptionRequests(list);
      }
    );
    return () => unsubscribe();
  }, []);

  // Auth listener with user role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.exists() ? docSnap.data() : { role: "user" };
        setCurrentUser({ uid: user.uid, email: user.email, ...userData });
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Logout function
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  // Firestore actions
  const addAnimal = async (animal) => {
    await addDoc(collection(db, "animals"), { ...animal, status: "Available" });
  };

  const updateAnimal = async (id, data) => {
    await updateDoc(doc(db, "animals", id), data);
  };

  const deleteAnimal = async (id) => {
    await deleteDoc(doc(db, "animals", id));
  };

  const addAdoptionRequest = async (animalId, requester) => {
    const req = { animalId, requester, status: "Pending" };
    await addDoc(collection(db, "adoptionRequests"), req);
    await updateAnimal(animalId, { status: "Pending Adoption" });
  };

  const respondAdoptionRequest = async (requestId, accepted) => {
    const newStatus = accepted ? "Accepted" : "Declined";
    await updateDoc(doc(db, "adoptionRequests", requestId), { status: newStatus });

    // update animal status
    const req = adoptionRequests.find((r) => r.id === requestId);
    if (req) {
      await updateAnimal(req.animalId, {
        status: accepted ? "Adopted" : "Available",
      });
    }
  };

  // Fixed Delete adoption request
  const deleteAdoptionRequest = async (requestId) => {
    try {
      // fetch the document directly
      const reqRef = doc(db, "adoptionRequests", requestId);
      const reqSnap = await getDoc(reqRef);
  
      if (reqSnap.exists()) {
        const req = reqSnap.data();
        await updateAnimal(req.animalId, { status: "Available" }); // reset animal status
        await deleteDoc(reqRef); // delete the request
      } else {
        console.log("Adoption request not found");
      }
    } catch (error) {
      console.error("Error deleting adoption request:", error);
      throw error;
    }
  };

  return (
    <AnimalContext.Provider
      value={{
        animals,
        addAnimal,
        updateAnimal,
        deleteAnimal,
        adoptionRequests,
        addAdoptionRequest,
        respondAdoptionRequest,
        deleteAdoptionRequest,
        currentUser,
        setCurrentUser,
        logout,
      }}
    >
      <NavigationContainer>
        {!currentUser ? (
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        ) : currentUser.role === "admin" ? (
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AnimalList"
              component={AnimalListScreen}
              options={{ title: "Animals" }}
            />
            <Stack.Screen
              name="AnimalDetails"
              component={AnimalDetailsScreen}
              options={{ title: "Details" }}
            />
            <Stack.Screen
              name="AddReport"
              component={AddReportScreen}
              options={{ title: "Add / Edit Report" }}
            />
            <Stack.Screen
              name="AdoptionRequests"
              component={AdoptionRequestsScreen}
              options={{ title: "Manage Adoption Requests" }}
            />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AnimalList"
              component={AnimalListScreen}
              options={{ title: "Animals" }}
            />
            <Stack.Screen
              name="AnimalDetails"
              component={AnimalDetailsScreen}
              options={{ title: "Details" }}
            />
            <Stack.Screen
              name="RequestAdoption"
              component={RequestAdoptionScreen}
              options={{ title: "Request Adoption" }}
            />
            <Stack.Screen
              name="AdoptionRequests"
              component={AdoptionRequestsScreen}
              options={{ title: "My Adoption Requests" }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AnimalContext.Provider>
  );
}
