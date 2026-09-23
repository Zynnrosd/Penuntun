import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import perangkatRoutes from "./routes/perangkat.routes";
import penggunaRoutes from "./routes/pengguna.routes";
import notifikasiRoutes from "./routes/notifikasi.routes";
import pengaturanRoutes from "./routes/pengaturan.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`Request masuk: ${req.method} ${req.path}`);
  next();
});

app.get("/", (_req, res) => res.json({ status: "PENUNTUN API aktif" }));
app.use("/auth", authRoutes);
app.use("/perangkat", perangkatRoutes);
app.use("/pengguna", penggunaRoutes);
app.use("/notifikasi", notifikasiRoutes);
app.use("/pengaturan", pengaturanRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API jalan di http://localhost:${PORT}`));