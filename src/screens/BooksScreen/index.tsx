import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import {AuthContext} from '../../contexts/authContext';
import searchIcon from '../../assets/search.png';
import closeIcon from '../../assets/close.png';
import chevronIcon from '../../assets/right-chevron.png';
interface Book {
  bookId: string;
  title: string;
  description?: string;
  coverImage?: string;
}

const BooksScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const {user, logout} = useContext(AuthContext) ?? {};

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  }, [searchQuery, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      // Mock data since there's no backend
      const mockBooks: Book[] = [
        {
          bookId: '1',
          title: 'React Native Basics',
          description: 'Learn the basics of React Native.',
          coverImage: '',
        },
        {
          bookId: '2',
          title: 'Advanced React Native',
          description: 'Deep dive into React Native.',
          coverImage: '',
        },
      ];
      setBooks(mockBooks);
      setFilteredBooks(mockBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBooks();
  };

  const handleLogout = async () => {
    if (logout) {
      await logout();
      navigation.replace('Login');
    }
  };

  const renderBookItem = ({item}: {item: Book}) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() =>
        navigation.navigate('BookDetail', {
          bookId: item.bookId,
          title: item.title,
        })
      }>
      <Image
        source={{uri: item.coverImage || 'https://via.placeholder.com/120x180'}}
        style={styles.bookCover}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookDescription} numberOfLines={3}>
          {item.description || 'No description available'}
        </Text>
      </View>
      <Image source={chevronIcon} style={styles.icon} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Image source={searchIcon} style={styles.icon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search books..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Image source={closeIcon} style={styles.icon} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.userContainer}>
          <Text style={styles.welcomeText}>
            Welcome, {user?.username ?? 'Guest'}
          </Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          renderItem={renderBookItem}
          keyExtractor={item => item.bookId}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? 'No books match your search'
                  : 'No books available'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f7f7f7'},
  header: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  searchIcon: {marginRight: 8},
  searchInput: {flex: 1, paddingVertical: 8},
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {fontSize: 16, color: '#333'},
  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  logoutText: {color: '#ff3b30'},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  listContainer: {padding: 15},
  bookItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookCover: {width: 80, height: 120, borderRadius: 8, marginRight: 15},
  bookInfo: {flex: 1, justifyContent: 'space-between'},
  bookTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#333'},
  bookDescription: {fontSize: 14, color: '#666', lineHeight: 20},
  emptyContainer: {padding: 30, alignItems: 'center'},
  emptyText: {fontSize: 16, color: '#999', textAlign: 'center'},
  icon: {
    width: 24,
    height: 24,
    tintColor: '#999',
  },
});

export default BooksScreen;
