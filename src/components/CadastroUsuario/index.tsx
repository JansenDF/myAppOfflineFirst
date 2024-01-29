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

import {User} from '../../database/model/UserModel';
import mySync from '../../database/syncronize';
import {useDatabase} from '@nozbe/watermelondb/react';
import {Q} from '@nozbe/watermelondb';

export default function CadastroUsuario() {
  const database = useDatabase();
  const [name, setName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState('');
  const [users, setUsers] = useState<any>(null);
  const [loadingButton, setLoadingButton] = useState(false);
  const [update, setUpdate] = useState(false);
  const [idUpdate, setIdUpdate] = useState('');

  async function handleCreateUser() {
    // setLoadingButton(true);
    if (update) {
      await database.write(async () => {
        const updateUser = await database.get<User>('user').find(idUpdate);
        await updateUser.update(() => {
          updateUser.name = name;
        });
        Alert.alert('Sucesso!', 'Usuário atualizado com sucesso.');
      });
      setLoadingButton(false);
      getUsers();
    } else {
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
          setUpdate(false);
        },
      },
      {
        text: 'Não',
        onPress: () => {},
      },
    ]);
  }

  const handleDelete = async (id: string) => {
    await database
      .write(async () => {
        const user = await database.get('user').find(id);
        await user.markAsDeleted();
      })
      .then(() => Alert.alert('Sucesso!', 'Usuário deletado com sucesso.'))
      .catch(() => Alert.alert('Erro!', 'Não foi possível deletar o usuário.'))
      .finally(() => getUsers());
  };

  const handleUpdate = async (user: User) => {
    setName(user.name);
    setMatricula(user.matricula);
    setEmail(user.email);
    setPassword(user.password);
    setProfile(user.profile_code);
    setUpdate(true);
    setIdUpdate(user.id);
  };

  async function handleSync() {
    await mySync();
    await getUsers();
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
          {update ? (
            <Button
              title="Atualizar"
              onPress={handleCreateUser}
              disabled={loadingButton}
            />
          ) : (
            <Button
              title="Salvar"
              onPress={handleCreateUser}
              disabled={loadingButton}
            />
          )}
          <Button title="Sincronizar" onPress={handleSync} color="#F00" />
        </View>
        {users == null ? (
          <View>
            <Text>Nenhum usuario cadastrado.</Text>
          </View>
        ) : (
          users.map((user: User, index: any) => (
            <View key={index} style={styles.userList}>
              <View>
                <Text>ID: {user.id}</Text>
                <Text>Nome: {user.name}</Text>
                <Text>Matrícula: {user.matricula}</Text>
                <Text>Email: {user.email}</Text>
                <Text>Profile_code: {user.profile_code}</Text>
              </View>
              <View style={{position: 'absolute', alignSelf: 'flex-end'}}>
                <Text onPress={() => handleDelete(user.id)}>Deletar</Text>
              </View>
              <View
                style={{
                  position: 'absolute',
                  alignSelf: 'flex-end',
                  paddingTop: 55,
                }}
              >
                <Text onPress={() => handleUpdate(user)}>Editar</Text>
              </View>
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
