import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';

type Category = {
  name: string;
  href?: Href;
  cardColor: string;
};

const categories: Category[] = [
  { name: 'cards', cardColor: '#F6C6C6' },
  {
    name: 'bottom navigation',
    href: '/bottom-navigation',
    cardColor: '#F6D6A8',
  },
  { name: 'transactions', cardColor: '#CFE3C4' },
  { name: 'settings', cardColor: '#D8CCE8' },
];

export default function HomeScreen() {
  const router = useRouter();

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
            disabled={!item.href}
            onPress={() => {
              if (item.href) {
                router.push(item.href);
              }
            }}
            style={StyleSheet.flatten([
              styles.itemContainer,
              { backgroundColor: item.cardColor },
            ])}
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
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },

  itemText: {
    color: 'black',
    fontSize: 16,
  },
});
