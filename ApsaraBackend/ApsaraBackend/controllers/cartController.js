import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const quantity = req.body.quantity === undefined ? 1 : Math.floor(Number(req.body.quantity));
    if (!userId || !productId) return res.status(400).json({ message: "Missing required fields" });
    if (!(quantity >= 1 && quantity <= 100)) return res.status(400).json({ message: "Invalid quantity" });

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
    console.error("Error adding to cart", error);
    res.status(500).json({ message: "Error adding to cart" });
  }
};



// GET /api/cart/:userId
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate("products.productId"); // populate full product details
    res.status(200).json(cart || { products: [] });
  } catch (error) {
    console.error("Error fetching cart", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
};



// PUT /api/cart/update
export const updateCartQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const quantity = Math.floor(Number(req.body.quantity));
    if (!userId || !productId || !(quantity >= 1 && quantity <= 100)) 
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
    console.error("Error updating quantity", error);
    res.status(500).json({ message: "Error updating quantity" });
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
    console.error("Error removing product", error);
    res.status(500).json({ message: "Error removing product" });
  }
};








