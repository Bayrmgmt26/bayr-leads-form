const functions = require("firebase-functions");
const admin = require("firebase-admin");
const webpush = require("web-push");

admin.initializeApp();

const vapid = functions.config().vapid;

webpush.setVapidDetails(
  vapid.subject,
  vapid.public,
  vapid.private
);

// Save subscription
exports.savePushSubscription = functions.https.onRequest(async (req, res) => {
  try {
    const { subscription, uid } = req.body;
    if (!subscription || !uid) {
      return res.status(400).send("Missing data");
    }

    const endpoint = encodeURIComponent(subscription.endpoint);

    await admin.firestore()
      .collection("pushSubscriptions")
      .doc(endpoint)
      .set({
        uid,
        subscription,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});
