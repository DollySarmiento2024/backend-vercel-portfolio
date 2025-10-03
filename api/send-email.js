import nodemailer from "nodemailer";
import Cors from "cors";

const cors = Cors({ origin: true });

function runCors(req, res) {
  return new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) reject(result);
      else resolve(result);
    });
  });
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fernandasar1289@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export default async function handler(req, res) {
  await runCors(req, res);

  // Comprobación en la función
  if (req.headers.authorization !== `Bearer ${process.env.API_TOKEN}`) {
    return res.status(401).json({ error: "No autorizado" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const mailOptions = {
    from: email,
    to: "fernandasar1289@gmail.com",
    subject: `Portfolio: Nuevo mensaje de ${name}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: error.toString() });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Email enviado correctamente" });
    }
  });
}
