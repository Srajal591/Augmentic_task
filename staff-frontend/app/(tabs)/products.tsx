import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// API URL - Using IP address
const API_BASE = 'http://192.168.31.48:5000';
const API_URL = `${API_BASE}/api`;

interface Product {
  _id: string;
  name: string;
  availableStock: number;
}

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [staffName, setStaffName] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('🚀 ProductsScreen mounted');
    console.log('📡 API URL:', API_URL);
    
    loadProducts();
    startPolling();

    return () => {
      console.log('🛑 Stopping polling');
      stopPolling();
    };
  }, []);

  const startPolling = () => {
    // Poll for updates every 2 seconds
    pollingInterval.current = setInterval(() => {
      loadProducts(true); // Silent refresh
    }, 2000);
    console.log('✅ Started polling for updates');
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const loadProducts = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      
      const response = await fetch(`${API_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setProducts(data.data);
        setLastUpdate(new Date());
        
        // Update selected product if it exists
        if (selectedProduct) {
          const updated = data.data.find((p: Product) => p._id === selectedProduct._id);
          if (updated) {
            setSelectedProduct(updated);
          }
        }
        
        if (!silent) {
          console.log(`✅ Loaded ${data.data.length} products`);
        }
      } else {
        console.warn('⚠️ Unexpected response format:', data);
        setProducts([]);
      }
    } catch (error: any) {
      console.error('❌ Error loading products:', error);
      if (!silent) {
        Alert.alert(
          'Connection Error',
          `Failed to load products.\n\nMake sure:\n1. Backend is running (npm run dev)\n2. Database is seeded (npm run seed)\n\nError: ${error.message}`
        );
        setProducts([]);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct) {
      Alert.alert('Error', 'Please select a product');
      return;
    }

    if (!staffName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    if (qty > selectedProduct.availableStock) {
      Alert.alert('Error', `Only ${selectedProduct.availableStock} units available`);
      return;
    }

    try {
      setOrdering(true);
      console.log('📤 Placing order:', {
        productId: selectedProduct._id,
        quantity: qty,
        staffName: staffName.trim(),
      });

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct._id,
          quantity: qty,
          staffName: staffName.trim(),
        }),
      });

      const data = await response.json();
      console.log('📡 Order response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      Alert.alert(
        'Success!',
        `Order placed successfully!\n\n${qty} units of ${selectedProduct.name} ordered.\n${data.data.availableStock} units remaining.`
      );

      // Reset form
      setSelectedProduct(null);
      setQuantity('1');

      // Immediate refresh
      loadProducts();
    } catch (error: any) {
      console.error('❌ Order error:', error);
      Alert.alert('Error', error.message || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[
        styles.productCard,
        selectedProduct?._id === item._id && styles.selectedCard,
      ]}
      onPress={() => setSelectedProduct(item)}
    >
      <View style={styles.productHeader}>
        <View style={styles.productIconContainer}>
          <Ionicons name="cube" size={24} color="#10b981" />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={[
            styles.stockBadge,
            item.availableStock === 0 && styles.stockBadgeEmpty,
            item.availableStock > 0 && item.availableStock <= 5 && styles.stockBadgeLow,
          ]}>
            <Ionicons 
              name={item.availableStock === 0 ? "close-circle" : item.availableStock <= 5 ? "alert-circle" : "checkmark-circle"} 
              size={14} 
              color="#fff" 
            />
            <Text style={styles.stockBadgeText}>
              {item.availableStock} units
            </Text>
          </View>
        </View>
        {selectedProduct?._id === item._id && (
          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading products...</Text>
        <Text style={styles.loadingSubtext}>Connecting to {API_URL}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="cube-outline" size={28} color="#10b981" />
          <View>
            <Text style={styles.title}>Products</Text>
            <View style={styles.updateBadge}>
              <Ionicons name="sync" size={12} color="#10b981" />
              <Text style={styles.subtitle}>
                Last: {formatTime(lastUpdate)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Products Found</Text>
          <Text style={styles.emptyText}>
            Make sure the backend is running and seeded
          </Text>
          <View style={styles.commandBox}>
            <Text style={styles.commandText}>cd Backend</Text>
            <Text style={styles.commandText}>npm run seed</Text>
            <Text style={styles.commandText}>npm run dev</Text>
          </View>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadProducts()}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {selectedProduct && (
        <View style={styles.orderForm}>
          <Text style={styles.formTitle}>Place Order</Text>
          <Text style={styles.selectedProductText}>
            Product: {selectedProduct.name}
          </Text>
          <Text style={styles.availableText}>
            Available: {selectedProduct.availableStock} units
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={staffName}
            onChangeText={setStaffName}
            editable={!ordering}
          />

          <TextInput
            style={styles.input}
            placeholder={`Quantity (Max: ${selectedProduct.availableStock})`}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="number-pad"
            editable={!ordering}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setSelectedProduct(null)}
              disabled={ordering}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.orderButton, ordering && styles.buttonDisabled]}
              onPress={handlePlaceOrder}
              disabled={ordering}
            >
              {ordering ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Place Order</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  updateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  productIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    gap: 6,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  stockBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  stockBadgeLow: {
    backgroundColor: '#f59e0b',
  },
  stockBadgeEmpty: {
    backgroundColor: '#ef4444',
  },
  stockBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  commandBox: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  commandText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 4,
  },
  retryButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orderForm: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  selectedProductText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#10b981',
    fontWeight: '600',
  },
  availableText: {
    fontSize: 14,
    marginBottom: 12,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  orderButton: {
    backgroundColor: '#10b981',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
