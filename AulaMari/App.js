import { useState, useEffect, useRef } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  List,
  PaperProvider,
  Switch,
  Text,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as SQLite from "expo-sqlite";
import myColors from "./assets/colors.json";
import myColorsDark from "./assets/colorsDark.json";

const DARK_MODE_KEY = "@mylocation:darkMode";
const DB_NAME = "mylocation.db";

// Abre (ou cria) o banco de dados e garante que a tabela exista
async function openDatabase() {
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  return db;
}

export default function App() {
  const [isSwitchOn, setIsSwitchOn] = useState(false); // variável para controle do darkMode
  const [isLoading, setIsLoading] = useState(false); // variável para controle do loading do button
  const [locations, setLocations] = useState([]); // variável para armazenar as localizações
  const dbRef = useRef(null); // conexão com o banco SQLite

  // Carrega tema default da lib RN PAPER com customização das cores. Para customizar o tema, veja:
  // https://callstack.github.io/react-native-paper/docs/guides/theming/#creating-dynamic-theme-colors
  const [theme, setTheme] = useState({
    ...DefaultTheme,
    myOwnProperty: true,
    colors: myColors.colors,
  });

  // Retorna a conexão com o banco, abrindo apenas na primeira vez
  async function getDb() {
    if (!dbRef.current) {
      dbRef.current = await openDatabase();
    }
    return dbRef.current;
  }

  // load darkMode from AsyncStorage
  async function loadDarkMode() {
    try {
      const value = await AsyncStorage.getItem(DARK_MODE_KEY);
      if (value !== null) {
        setIsSwitchOn(JSON.parse(value));
      }
    } catch (error) {
      console.log("Erro ao carregar o dark mode:", error);
    }
  }

  // darkMode switch event - altera o tema e salva a escolha no AsyncStorage
  async function onToggleSwitch() {
    const newValue = !isSwitchOn;
    setIsSwitchOn(newValue);
    try {
      await AsyncStorage.setItem(DARK_MODE_KEY, JSON.stringify(newValue));
    } catch (error) {
      console.log("Erro ao salvar o dark mode:", error);
    }
  }

  // get location (botão capturar localização)
  async function getLocation() {
    setIsLoading(true);
    try {
      // Solicita a permissão de localização ao usuário
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "É preciso permitir o acesso à localização para capturar sua posição."
        );
        return;
      }

      // Captura a localização real do dispositivo
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;

      // Insere a nova localização no banco de dados
      const db = await getDb();
      const result = await db.runAsync(
        "INSERT INTO locations (latitude, longitude, created_at) VALUES (?, ?, ?);",
        latitude,
        longitude,
        new Date().toISOString()
      );

      // Exibe a nova localização na lista (no topo)
      setLocations((current) => [
        { id: result.lastInsertRowId, latitude, longitude },
        ...current,
      ]);
    } catch (error) {
      console.log("Erro ao capturar a localização:", error);
      Alert.alert("Erro", "Não foi possível capturar a localização.");
    } finally {
      setIsLoading(false);
    }
  }

  // load locations from db sqlite - faz a leitura das localizações salvas no banco de dados
  async function loadLocations() {
    setIsLoading(true);
    try {
      const db = await getDb();
      const rows = await db.getAllAsync(
        "SELECT id, latitude, longitude FROM locations ORDER BY id DESC;"
      );
      setLocations(rows);
    } catch (error) {
      console.log("Erro ao carregar as localizações:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Use Effect para carregar o darkMode e as localizações salvas no banco de dados
  // É executado apenas uma vez, quando o componente é montado
  useEffect(() => {
    loadDarkMode();
    loadLocations();
  }, []);

  // Efetiva a alteração do tema dark/light quando a variável isSwitchOn é alterada
  // É executado sempre que a variável isSwitchOn é alterada
  useEffect(() => {
    if (isSwitchOn) {
      setTheme({ ...theme, colors: myColorsDark.colors });
    } else {
      setTheme({ ...theme, colors: myColors.colors });
    }
  }, [isSwitchOn]);

  return (
    <PaperProvider theme={theme}>
      <Appbar.Header>
        <Appbar.Content title="My Location" />
      </Appbar.Header>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.containerDarkMode}>
          <Text>Dark Mode</Text>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        </View>
        <Button
          style={styles.containerButton}
          icon="map"
          mode="contained"
          loading={isLoading}
          disabled={isLoading}
          onPress={() => getLocation()}
        >
          Capturar localização
        </Button>

        <FlatList
          style={styles.containerList}
          data={locations}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma localização capturada ainda.</Text>
          }
          renderItem={({ item }) => (
            <List.Item
              title={`Localização ${item.id}`}
              description={`Latitude: ${item.latitude} | Longitude: ${item.longitude}`}
            ></List.Item>
          )}
        ></FlatList>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerDarkMode: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerButton: {
    margin: 10,
  },
  containerList: {
    margin: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
});
