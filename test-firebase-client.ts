import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  await setDoc(doc(db, 'test', 'test'), { hello: 'world' });
  const d = await getDoc(doc(db, 'test', 'test'));
  console.log(d.data());
}
test().catch(console.error);
