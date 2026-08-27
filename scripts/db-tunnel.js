const { createTunnel } = require("tunnel-ssh");
require("dotenv").config();

const sshOptions = {
  host: process.env.VPS_HOST || "72.61.213.19",
  port: 22,
  username: process.env.VPS_SSH_USER || "root",
  password: process.env.VPS_SSH_PASSWORD,
};

const tunnelOptions = {
  autoClose: false,
};

const serverOptions = {
  host: "127.0.0.1",
  port: 5433,
};

const forwardOptions = {
  srcAddr: "127.0.0.1",
  srcPort: 5433,
  dstAddr: "172.20.0.7",
  dstPort: 5432,
};

async function connect() {
  try {
    console.log("Menyambungkan SSH tunnel ke VPS...");
    await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
    console.log("Tunnel aktif di localhost:5433");
  } catch (err) {
    console.error("Tunnel terputus/gagal:", err.message);
    console.log("Coba sambungkan ulang dalam 3 detik...");
    setTimeout(connect, 3000);
  }
}

connect();