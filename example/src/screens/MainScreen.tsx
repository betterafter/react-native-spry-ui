import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export type ScreenName =
  'main' | 'cards' | 'bottom-navigation' | 'transactions' | 'settings';

type MainScreenProps = {
  onNavigate: (screen: ScreenName) => void;
};

export default function MainScreen({ onNavigate }: MainScreenProps) {
  const categories: {
    name: string;
    screen: Exclude<ScreenName, 'main'>;
    cardColor: string;
  }[] = [
    { name: 'cards', screen: 'cards', cardColor: '#F6C6C6' },
    {
      name: 'bottom navigation',
      screen: 'bottom-navigation',
      cardColor: '#F6D6A8',
    },
    { name: 'transactions', screen: 'transactions', cardColor: '#CFE3C4' },
    { name: 'settings', screen: 'settings', cardColor: '#D8CCE8' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.contentContainer}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onNavigate(item.screen)}
            style={[styles.itemContainer, { backgroundColor: item.cardColor }]}
          >
            <Text style={styles.itemText}>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    flex: 1,
    width: '100%',
  },

  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  columnWrapper: {
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 5,
    gap: 10,
  },

  itemContainer: {
    padding: 20,
    borderRadius: 10,
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },

  itemText: {
    color: 'black',
    fontSize: 16,
  },
});
