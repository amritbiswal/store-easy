import {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
  use,
} from "react";
import { useAuth } from "./AuthContext";
import { getUserById, updateUserProfile } from "../services/api";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Load favorites when user logs in
  useEffect(() => {
    if (user?.id) {
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user?.id) return;

    try {
      const userData = await getUserById(user.id);
      setCartItems(userData.cartItems || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]);
    }
  };

  // Helper to persist cart for logged-in users
  const persistCartItems = async (newCart) => {
    if (!user?.id) return;

    try {
      // Fetch the latest user data to avoid overwriting other fields
      const userData = await getUserById(user.id);
      const { cartItems, ...rest } = userData; // Exclude old cartItems
      const userBody = { ...rest, cartItems: newCart };

      const response = await updateUserProfile(user.id, userBody);
      updateUser(response);
    } catch (error) {
      console.error("Error updating cart items:", error);
      // Revert on error
      setCartItems(cartItems);
      alert("Failed to update cart items. Please try again.");
    }
  };

  const addToCart = (product) => {
    if (!user?.id) return;
    const newCartItems = [...cartItems];
    const isItemExistsinCart = newCartItems.find(
      (item) => item.id === product.id
    );
    if (isItemExistsinCart) {
      isItemExistsinCart.quantity += product.quantity;
    } else {
      newCartItems.push(product);
    }
    setCartItems(newCartItems);
    persistCartItems(newCartItems);
  };

  const removeFromCart = (productId) => {
    const existingCartItems = [...cartItems];
    const updatedCartItems = existingCartItems.filter(
      (item) => item.id !== productId
    );
    setCartItems(updatedCartItems);
    persistCartItems(updatedCartItems);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const existingCartItems = [...cartItems];
    const updatedCartItems = existingCartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCartItems);
    persistCartItems(updatedCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
    persistCartItems([]);
  };

  // Calculate total amount using useMemo for performance
  const totalAmount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
