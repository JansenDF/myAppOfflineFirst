/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {database} from './src/database';
import {User} from './src/database/model/UserModel';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [name, setName] = useState('Jansen');
  const [matricula, setMatricula] = useState('11541');
  const [email, setEmail] = useState('jansen@gmail.com');
  const [password, setPassword] = useState('jansen');
  const [profile, setProfile] = useState('1');

  async function handleCreateUser() {
    await database.write(async () => {
      await database
        .get<User>('users')
        .create(user => {
          (user.name = name),
            (user.matricula = matricula),
            (user.email = email),
            (user.password = password),
            (user.profile_code = profile);
        })
        .then(() => {
          Alert.alert('Sucesso!', 'Usuário criado com sucesso.');
        })
        .catch(e => {
          Alert.alert('Erro!', `${e}`);
        });
    });
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        >
          <View>
            <TextInput
              style={{height: 40}}
              value={name}
              placeholder="Digite aqui o nome do usuário!"
              onChangeText={value => setName(value)}
            />
            <TextInput
              style={{height: 40}}
              value={matricula}
              placeholder="Digite aqui a matrícula do usuário!"
              onChangeText={value => setMatricula(value)}
            />
            <TextInput
              style={{height: 40}}
              value={email}
              placeholder="Digite aqui o email do usuário!"
              onChangeText={value => setEmail(value)}
            />
            <TextInput
              style={{height: 40}}
              value={password}
              placeholder="Digite aqui a senha do usuário!"
              onChangeText={value => setPassword(value)}
            />
            <TextInput
              style={{height: 40}}
              value={profile}
              placeholder="Digite aqui o profile do usuário!"
              onChangeText={value => setProfile(value)}
            />
            <Button title="Salvar" onPress={handleCreateUser} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
