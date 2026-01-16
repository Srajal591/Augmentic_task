import { ScrollView, StyleSheet, View, TouchableOpacity, ActivityIndicator, TextInput, Alert, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ThemedText } from '@/components/themed-text';
import { io, Socket } from 'socket.io-client';

// API URL - Using IP address
const API_BASE = 'http://192.168.31.48:5000';
const API_URL = `${API_BASE}/api`;

interface Product {
  _id: string;
  name: string;
  availableStock: number;
}

export default function OrderScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [staffName, setStaffName] = useState('Staff Member');
  const [submitting, setSubmitting] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    fetchProducts();
    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const connectSocket = () => {
    console.log('Connecting to socket:', API_BASE);
    
    const newSocket = io(API_BASE, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      newSocket.emit('join-inventory');
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    newSocket.on('stock-updated', (data: any) => {
      console.log('📦 Stock updated:', data);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === data.productId
            ? { ...product, availableStock: data.availableStock }
            : product
        )
      );
      
      // Update selected product if it's the one that changed
      setSelectedProduct((prev) =>
        prev && prev._id === data.productId
          ? { ...prev, availableStock: data.availableStock }
          : prev
      );
    });

    setSocket(newSocket);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching from:', API_URL);
      const response = await fetch(`${API_URL}/products`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Products loaded:', data.data?.length || 0);
      setProducts(data.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      Alert.alert('Error', 'Failed to load products. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
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
      Alert.alert('Error', 'Please enter valid quantity');
      return;
    }

    if (qty > selectedProduct.availableStock) {
      Alert.alert('Error', `Only ${selectedProduct.availableStock} units available`);
      return;
    }

    try {
      setSubmitting(true);
      console.log('Placing order:', { productId: selectedProduct._id, quantity: qty, staffName });
      
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct._id,
          quantity: qty,
          staffName: staffName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      console.log('Order placed successfully:', data);
      Alert.alert(
        'Success', 
        `Order placed! ${qty} units ordered. ${data.data.availableStock} remaining.`
      );
      
      // Reset form
      setSelectedProduct(null);
      setQuantity('1');
      
      // Products will auto-update via socket, but refresh as backup
      setTimeout(fetchProducts, 500);
    } catch (err) {
      console.error('Order error:', err);
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.titleText}>Place Order</ThemedText>
        <ThemedText style={styles.subtitle}>
          {socket?.connected ? '🟢 Real-time updates active' : '🔴 Connecting...'}
        </ThemedText>

        {/* Staff Info */}
        <View style={styles.card}>
          <ThemedText style={styles.label}>Staff Name</ThemedText>
          <TextInput
            style={styles.input}
            value={staffName}
            onChangeText={setStaffName}
            placeholder="Enter your name"
            editable={!submitting}
          />
        </View>

        {/* Product Selection */}
        <ThemedText style={styles.sectionTitle}>Available Products</ThemedText>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <ThemedText style={styles.loadingText}>Loading products...</ThemedText>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.centerContainer}>
            <ThemedText style={styles.emptyText}>No products available</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Make sure backend is running and seeded
            </ThemedText>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchProducts}>
              <ThemedText style={styles.retryBtnText}>Retry</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {products.map((product) => (
              <TouchableOpacity
                key={product._id}
                style={[
                  styles.productCard,
                  selectedProduct?._id === product._id && styles.productCardSelected,
                ]}
                onPress={() => setSelectedProduct(product)}
              >
                <View style={styles.productHeader}>
                  <ThemedText style={styles.productName}>{product.name}</ThemedText>
                  <View style={[
                    styles.stockBadge,
                    product.availableStock === 0 && styles.stockBadgeEmpty,
                    product.availableStock > 0 && product.availableStock <= 5 && styles.stockBadgeLow,
                  ]}>
                    <ThemedText style={styles.stockBadgeText}>
                      {product.availableStock} units
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quantity Input */}
        {selectedProduct && (
          <View style={styles.card}>
            <ThemedText style={styles.selectedProductTitle}>
              Selected: {selectedProduct.name}
            </ThemedText>
            <ThemedText style={styles.availableStock}>
              Available: {selectedProduct.availableStock} units
            </ThemedText>
            
            <ThemedText style={[styles.label, { marginTop: 16 }]}>
              Quantity (Max: {selectedProduct.availableStock})
            </ThemedText>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Enter quantity"
              keyboardType="number-pad"
              editable={!submitting}
            />

            <TouchableOpacity
              style={[styles.submitBtn, submitting && styles.buttonDisabled]}
              onPress={handlePlaceOrder}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.submitBtnText}>Place Order</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    marginTop: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.6,
    textTransform: 'uppercase',
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1a1a1a',
    backgroundColor: '#fff',
    marginTop: 8,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  productCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  productCardSelected: {
    borderColor: '#0066cc',
    borderWidth: 2,
    backgroundColor: '#f0f7ff',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  stockBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockBadgeLow: {
    backgroundColor: '#FF9800',
  },
  stockBadgeEmpty: {
    backgroundColor: '#F44336',
  },
  stockBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  selectedProductTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0066cc',
    marginBottom: 4,
  },
  availableStock: {
    fontSize: 14,
    color: '#666',
  },
  submitBtn: {
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
