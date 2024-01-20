import react from 'react';
import {DatabaseProvider} from '@nozbe/watermelondb/react';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {database} from './src/database';
import HomePage from './src/screens/HomePage';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  useColorScheme,
} from 'react-native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
    <DatabaseProvider database={database}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}
        >
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}
          >
            <HomePage />
          </View>
        </ScrollView>
      </SafeAreaView>
    </DatabaseProvider>
  );
}

export default App;
