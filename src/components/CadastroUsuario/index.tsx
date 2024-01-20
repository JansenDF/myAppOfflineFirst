import React, {useEffect, useState} from 'react';
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

import {database} from '../../database';
import {User} from '../../database/model/UserModel';
import mySync from '../../database/syncronize';

export default function CadastroUsuario() {
  const [name, setName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState('');
  const [users, setUsers] = useState<any>(null);
  const [loadingButton, setLoadingButton] = useState(false);

  async function handleCreateUser() {
    setLoadingButton(true);
    await database.write(async () => {
      await database
        .get<User>('user')
        .create(user => {
          (user.name = name),
            (user.matricula = matricula),
            (user.email = email),
            (user.password = password),
            (user.profile_code = profile);
        })
        .then(() => {
          Alert.alert('Sucesso!', 'Usuário criado com sucesso.');
          setLoadingButton(false);
          setName('');
          setMatricula('');
          setEmail('');
          setPassword('');
          setProfile('');
          getUsers();
        })
        .catch(e => {
          Alert.alert('Erro!', `${e}`);
          setLoadingButton(false);
        });
    });
  }

  function handleReset() {
    Alert.alert('Limpar formulário', 'Deseja limpar o formulário?', [
      {
        text: 'Sim',
        onPress: () => {
          setName('');
          setMatricula('');
          setEmail('');
          setPassword('');
          setProfile('');
        },
      },
      {
        text: 'Não',
        onPress: () => {},
      },
    ]);
  }

  function handleSync() {
    mySync();
  }

  async function getUsers() {
    const allUsers = await database.get('user').query().fetch();
    setUsers(allUsers);
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <View>
        <TextInput
          style={styles.userInput}
          value={name}
          placeholder="Digite aqui o nome do usuário!"
          onChangeText={value => setName(value)}
        />
        <TextInput
          style={styles.userInput}
          value={matricula}
          placeholder="Digite aqui a matrícula do usuário!"
          onChangeText={value => setMatricula(value)}
        />
        <TextInput
          style={styles.userInput}
          value={email}
          placeholder="Digite aqui o email do usuário!"
          onChangeText={value => setEmail(value)}
        />
        <TextInput
          style={styles.userInput}
          value={password}
          placeholder="Digite aqui a senha do usuário!"
          onChangeText={value => setPassword(value)}
        />
        <TextInput
          style={styles.userInput}
          value={profile}
          placeholder="Digite aqui o profile do usuário!"
          onChangeText={value => setProfile(value)}
        />
        <View style={styles.button}>
          <Button title="Limpar" onPress={handleReset} color="#EE0" />
          <Button
            title="Salvar"
            onPress={handleCreateUser}
            disabled={loadingButton}
          />
          <Button title="Sincronizar" onPress={handleSync} color="#F00" />
        </View>
        {users == null ? (
          <View>
            <Text>Nenhum usuario cadastrado.</Text>
          </View>
        ) : (
          users.map((user: User, index: any) => (
            <View key={index} style={styles.userList}>
              <Text>Nome: {user.name}</Text>
              <Text>Matrícula: {user.matricula}</Text>
              <Text>Email: {user.email}</Text>
              <Text>Profile_code: {user.profile_code}</Text>
            </View>
          ))
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  userInput: {
    height: 40,
    marginVertical: 10,
    backgroundColor: '#EEE',
  },
  userList: {
    marginVertical: 10,
  },
  button: {
    marginVertical: 10,
  },
});
