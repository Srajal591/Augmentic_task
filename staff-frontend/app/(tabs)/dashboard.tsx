import { ScrollView, StyleSheet, View, TouchableOpacity, ActivityIndicator, Platform, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ThemedText } from '@/components/themed-text';
import { io } from 'socket.io-client';

// For Android emulator use 10.0.2.2, for iOS/web use localhost
const getAPIURL = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

const getSocketURL = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }
  return 'http://localhost:5000';
};

const API_URL = getAPIURL();
const SOCKET_URL = getSocketURL();

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
}

interface OrderQuantity {
  [key: string]: string;
}

export default function DashboardScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [socket, setSocket] = useState<any>(null);
    const [orderQuantities, setOrderQuantities] = useState<OrderQuantity>({});
    const [placingOrder, setPlacingOrder] = useState(false);

    // Staff user data
    const user = {
        name: 'Staff Member',
        email: 'staff@augmentic.com',
    };

    useEffect(() => {
        initializeSocket();
        fetchProducts();

        return () => {
            if (socket) {
                socket.emit('leave-inventory');
                socket.disconnect();
            }
        };
    }, []);

    const initializeSocket = () => {
        const newSocket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
        });

        newSocket.on('connect', () => {
            console.log('Connected to server');
            newSocket.emit('join-inventory');
        });

        newSocket.on('stock-updated', (data: any) => {
            console.log('Stock updated:', data);
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === data.productId
                        ? { ...product, stock: data.newStock }
                        : product
                )
            );
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        setSocket(newSocket);
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching from:', API_URL);
            const response = await fetch(`${API_URL}/products`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to fetch products`);
            }
            
            const data = await response.json();
            console.log('Products loaded:', data.data?.length);
            setProducts(data.data || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error fetching products';
            console.error('Fetch error:', errorMessage);
            setError(errorMessage);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderQuantityChange = (productId: string, quantity: string) => {
        setOrderQuantities((prev) => ({
            ...prev,
            [productId]: quantity,
        }));
    };

    const handlePlaceOrder = async (product: Product) => {
        const quantity = parseInt(orderQuantities[product._id] || '0', 10);

        if (quantity <= 0) {
            Alert.alert('Invalid Quantity', 'Please enter a quantity greater than 0');
            return;
        }

        if (quantity > product.stock) {
            Alert.alert('Insufficient Stock', `Only ${product.stock} units available`);
            return;
        }

        try {
            setPlacingOrder(true);
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: product._id,
                    quantity,
                    staffName: user.name,
                    staffEmail: user.email,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to place order');
            }

            // Clear quantity input
            setOrderQuantities((prev) => ({
                ...prev,
                [product._id]: '',
            }));

            Alert.alert('Success', `Order placed! ${quantity} units of ${product.name} ordered.`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error placing order';
            Alert.alert('Order Failed', errorMessage);
        } finally {
            setPlacingOrder(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.titleText}>📦 Order Products</ThemedText>
                    <ThemedText style={styles.subtitle}>Real-time inventory</ThemedText>
                </View>

                {/* User Info */}
                <View style={styles.userCard}>
                    <ThemedText style={styles.label}>Welcome,</ThemedText>
                    <ThemedText style={styles.userName}>{user.name}</ThemedText>
                    <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
                </View>

                {/* Error Banner */}
                {error && (
                    <View style={styles.errorBanner}>
                        <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
                        <TouchableOpacity onPress={fetchProducts}>
                            <ThemedText style={styles.retryLink}>Retry</ThemedText>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Loading State */}
                {loading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#10b981" />
                        <ThemedText style={styles.loadingText}>Loading products...</ThemedText>
                    </View>
                ) : products.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <ThemedText style={styles.emptyText}>No products available</ThemedText>
                    </View>
                ) : (
                    /* Products List */
                    <View>
                        {products.map((product) => (
                            <View key={product._id} style={styles.productCard}>
                                <View style={styles.productInfo}>
                                    <ThemedText style={styles.productName}>{product.name}</ThemedText>
                                    <ThemedText style={styles.productPrice}>${product.price.toFixed(2)}</ThemedText>
                                </View>

                                <View style={styles.stockInfo}>
                                    <ThemedText style={styles.label}>Stock Available:</ThemedText>
                                    <ThemedText
                                        style={[
                                            styles.stockValue,
                                            { color: product.stock > 0 ? '#0a7f0a' : '#ff0000' },
                                        ]}
                                    >
                                        {product.stock} units
                                    </ThemedText>
                                </View>

                                {product.stock > 0 ? (
                                    <View style={styles.orderSection}>
                                        <View style={styles.inputGroup}>
                                            <ThemedText style={styles.label}>Quantity:</ThemedText>
                                            <TextInput
                                                style={styles.quantityInput}
                                                placeholder="Enter quantity"
                                                placeholderTextColor="#999"
                                                keyboardType="number-pad"
                                                value={orderQuantities[product._id] || ''}
                                                onChangeText={(val) => handleOrderQuantityChange(product._id, val)}
                                                editable={!placingOrder}
                                            />
                                        </View>
                                        <TouchableOpacity
                                            style={[styles.orderBtn, placingOrder && { opacity: 0.6 }]}
                                            onPress={() => handlePlaceOrder(product)}
                                            disabled={placingOrder}
                                        >
                                            <ThemedText style={styles.orderBtnText}>
                                                {placingOrder ? 'Placing...' : 'Place Order'}
                                            </ThemedText>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={styles.outOfStockBanner}>
                                        <ThemedText style={styles.outOfStockText}>❌ Out of Stock</ThemedText>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Footer Info */}
                {!loading && products.length > 0 && (
                    <View style={styles.infoCard}>
                        <ThemedText style={styles.infoTitle}>Total Inventory</ThemedText>
                        <ThemedText style={styles.infoValue}>
                            {products.reduce((sum, p) => sum + p.stock, 0)} units
                        </ThemedText>
                        <ThemedText style={styles.infoSubtext}>
                            across {products.length} products
                        </ThemedText>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0fdf4',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 28,
        paddingTop: 12,
        paddingBottom: 8,
    },
    titleText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#064e3b',
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: '#059669',
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    userCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        borderLeftWidth: 5,
        borderLeftColor: '#10b981',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#064e3b',
        marginTop: 6,
        letterSpacing: -0.3,
    },
    userEmail: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 6,
        fontWeight: '500',
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#059669',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    errorBanner: {
        backgroundColor: '#fef2f2',
        borderLeftWidth: 5,
        borderLeftColor: '#ef4444',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    errorText: {
        color: '#dc2626',
        fontSize: 14,
        flex: 1,
        fontWeight: '600',
    },
    retryLink: {
        color: '#ef4444',
        fontWeight: '700',
        fontSize: 14,
        paddingLeft: 16,
        textDecorationLine: 'underline',
    },
    centerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    loadingText: {
        marginTop: 16,
        color: '#059669',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyCard: {
        backgroundColor: '#fff',
        padding: 32,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#d1fae5',
        borderStyle: 'dashed',
    },
    emptyText: {
        color: '#6b7280',
        fontSize: 16,
        fontWeight: '500',
    },
    productCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#d1fae5',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    productInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0fdf4',
    },
    productName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#064e3b',
        flex: 1,
        letterSpacing: -0.3,
    },
    productPrice: {
        fontSize: 20,
        fontWeight: '800',
        color: '#10b981',
        letterSpacing: -0.5,
    },
    stockInfo: {
        backgroundColor: '#f0fdf4',
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#d1fae5',
    },
    stockValue: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 6,
        letterSpacing: -0.2,
    },
    orderSection: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-end',
    },
    inputGroup: {
        flex: 1,
    },
    quantityInput: {
        borderWidth: 2,
        borderColor: '#d1fae5',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 8,
        fontSize: 16,
        color: '#064e3b',
        fontWeight: '600',
        backgroundColor: '#f9fafb',
    },
    orderBtn: {
        backgroundColor: '#10b981',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    orderBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    outOfStockBanner: {
        backgroundColor: '#fef2f2',
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    outOfStockText: {
        color: '#dc2626',
        fontWeight: '700',
        fontSize: 15,
        letterSpacing: 0.3,
    },
    infoCard: {
        backgroundColor: '#ecfdf5',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 24,
        borderWidth: 2,
        borderColor: '#a7f3d0',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    infoTitle: {
        fontSize: 13,
        color: '#059669',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    infoValue: {
        fontSize: 36,
        fontWeight: '800',
        color: '#10b981',
        marginTop: 8,
        letterSpacing: -1,
    },
    infoSubtext: {
        fontSize: 14,
        color: '#059669',
        marginTop: 8,
        fontWeight: '600',
    },
});
