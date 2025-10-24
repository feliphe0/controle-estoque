const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Trigger: when order status changes, handle reservation and final decrement
exports.onOrderStatusChange = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const orderRef = change.after.ref;
    try {
      // From Pendente -> Em separação : reserve stock
      if (before.status !== 'Em separação' && after.status === 'Em separação') {
        const items = after.items || [];
        // Reserve each product
        for (const it of items) {
          const prodRef = db.collection('products').doc(it.productId);
          await db.runTransaction(async (tx) => {
            const prodSnap = await tx.get(prodRef);
            if (!prodSnap.exists) throw new Error('Produto não existe: ' + it.productName);
            const data = prodSnap.data();
            const qty = data.quantity || 0;
            const reserved = data.reserved || 0;
            const free = qty - reserved;
            if (free < it.qtyRequested) {
              // Not enough stock -> mark order with note and set status back to 'Pendente'
              await orderRef.update({ status: 'Pendente', lastError: 'Estoque insuficiente para ' + it.productName });
              throw new Error('Estoque insuficiente para ' + it.productName);
            }
            tx.update(prodRef, { reserved: (reserved + it.qtyRequested) });
          });
        }
        // add history entry
        await orderRef.update({ lastError: '', updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      }

      // Em separação -> Produto retirado : decrement real stock and unreserve
      if (before.status !== 'Produto retirado' && after.status === 'Produto retirado') {
        const items = after.items || [];
        for (const it of items) {
          const prodRef = db.collection('products').doc(it.productId);
          await db.runTransaction(async (tx) => {
            const prodSnap = await tx.get(prodRef);
            if (!prodSnap.exists) throw new Error('Produto não existe: ' + it.productName);
            const data = prodSnap.data();
            const qty = data.quantity || 0;
            const reserved = data.reserved || 0;
            const newQty = qty - it.qtyRequested;
            const newReserved = Math.max(0, reserved - it.qtyRequested);
            if (newQty < 0) throw new Error('Quantidade insuficiente no momento da retirada para ' + it.productName);
            tx.update(prodRef, { quantity: newQty, reserved: newReserved });
          });
        }
        await orderRef.update({ updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      }

      return null;
    } catch (err) {
      console.error('onOrderStatusChange error', err);
      return null;
    }
  });
