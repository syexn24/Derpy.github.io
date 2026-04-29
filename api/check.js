const FLAGS = {
  1: {
    answer: (username, password) => {
      return (
        /('\s*OR\s*'?1'?\s*=\s*'?1|--\s*$|#)/i.test(username) ||
        username.toLowerCase().includes("' or") ||
        username.includes("'--") ||
        username.includes("' --")
      );
    },
    flag: process.env.FLAG_1 || "FLAG{sql_1nj3ct10n_b4s1c_byp4ss}",
  },
  2: {
    answer: (username) => /UNION\s+SELECT/i.test(username),
    flag: process.env.FLAG_2 || "FLAG{un10n_s3l3ct_d4t4_3xtr4ct10n}",
  },
  3: {
    answer: (username) =>
      /\d+\s+AND\s+\d+=\d+/i.test(username) ||
      /\d+\s+OR\s+/i.test(username) ||
      /SLEEP|WAITFOR|BENCHMARK/i.test(username),
    flag: process.env.FLAG_3 || "FLAG{bl1nd_sql1_tr00_0r_f4ls3}",
  },
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { level, username, password } = req.body;

  if (!level || !FLAGS[level]) {
    return res.status(400).json({ error: "Invalid level" });
  }

  const challenge = FLAGS[level];
  const isCorrect = challenge.answer(username || "", password || "");

  if (isCorrect) {
    return res.status(200).json({ success: true, flag: challenge.flag });
  } else {
    return res.status(200).json({ success: false });
  }
}
