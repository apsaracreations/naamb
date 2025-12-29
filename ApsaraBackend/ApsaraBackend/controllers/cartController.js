import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId) return res.status(400).json({ message: "Missing required fields" });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, products: [{ productId, quantity: quantity || 1 }] });
    } else {
      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity || 1;
      } else {
        cart.products.push({ productId, quantity: quantity || 1 });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};



// GET /api/cart/:userId
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate("products.productId"); // populate full product details
    res.status(200).json(cart || { products: [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};



// PUT /api/cart/update
export const updateCartQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity < 1) 
      return res.status(400).json({ message: "Invalid request" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      res.status(200).json({ message: "Quantity updated", cart });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating quantity", error });
  }
};



// DELETE /api/cart/:userId/:productId
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(p => p.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing product", error });
  }
};








