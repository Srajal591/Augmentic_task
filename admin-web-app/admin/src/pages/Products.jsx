import { useState, useEffect } from "react";
import { Package, AlertTriangle, CheckCircle2, Plus, Edit2, Trash2, X } from "lucide-react";
import { fetchAllProducts, apiClient } from "../services/api";
import socketService from "../services/socket";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    availableStock: '',
  });
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadProducts();

    socketService.connect();

    socketService.onStockUpdate((data) => {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === data.productId
            ? { ...product, availableStock: data.availableStock }
            : product
        )
      );
    });

    return () => {
      socketService.offStockUpdate();
      socketService.disconnect();
    };
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        availableStock: product.availableStock.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', availableStock: '' });
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ name: '', availableStock: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }

    const stock = parseInt(formData.availableStock);
    if (isNaN(stock) || stock < 0) {
      setError('Stock must be a valid number (0 or greater)');
      return;
    }

    try {
      if (editingProduct) {
        // Update existing product
        await apiClient.put(`/products/${editingProduct._id}`, {
          name: formData.name.trim(),
          availableStock: stock,
        });
      } else {
        // Create new product
        await apiClient.post('/products', {
          name: formData.name.trim(),
          availableStock: stock,
        });
      }
      handleCloseModal();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setActionLoading(productId);
    try {
      await apiClient.delete(`/products/${productId}`);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Inventory</h1>
          <p className="text-gray-500 mt-1">Real-time product stock monitoring</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-sm"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const stock = product.availableStock;
          const status =
            stock > 10
              ? { label: "In Stock", color: "emerald", icon: CheckCircle2 }
              : stock > 5
              ? { label: "Low Stock", color: "amber", icon: AlertTriangle }
              : { label: "Critical", color: "rose", icon: AlertTriangle };

          const StatusIcon = status.icon;

          return (
            <div
              key={product._id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 leading-tight">
                    {product.name}
                  </h2>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Package size={20} className="text-gray-600" />
                </div>
              </div>

              {/* Stock Count */}
              <div className="flex items-end justify-between mt-6 mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Available Stock</p>
                  <p className="text-3xl font-semibold text-gray-900">{stock}</p>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-${status.color}-50 text-${status.color}-700`}
                >
                  <StatusIcon size={14} />
                  {status.label}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleOpenModal(product)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-medium transition"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  disabled={actionLoading === product._id}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  {actionLoading === product._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {products.length === 0 && !loading && (
        <div className="mt-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Package size={28} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-2">No products found</p>
          <p className="text-gray-400 text-sm mb-6">Get started by adding your first product</p>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Stock
                </label>
                <input
                  type="number"
                  value={formData.availableStock}
                  onChange={(e) => setFormData({ ...formData, availableStock: e.target.value })}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="Enter stock quantity"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl transition font-medium"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
