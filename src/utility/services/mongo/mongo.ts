import mongoose from 'mongoose'

export default async function connectToMongo() {
  const url = process.env.MONGO_DB_URL || ''

  await mongoose
    .connect(url)
    .then(() => console.log('MongoDB has connected'))
    .catch((e) => console.error(e))

  const db = mongoose.connection

  db.on('error', console.error.bind(console, 'connection error:'))
}
