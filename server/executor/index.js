import express from "express";
import cors from "cors";

async function evalAndCaptureOutput(code) {
  const oldLog = console.log;
  const oldError = console.error;
  
  const output = [];
  const errorOutput = [];
  
  console.log = (...args) => output.push(args.join(' '));
  console.error = (...args) => errorOutput.push(args.join(' '));
  
  try {
    await eval(code); // eval berfungsi untuk mengeksekusi string menjadi code JS
  } catch (error) {
    errorOutput.push(error.message);
  }
  
  console.log = oldLog;
  console.error = oldError;
  
  return { stdout: output.join('\n'), stderr: errorOutput.join('\n') };
}

const app = express()
const port = 3000;

app.use(express.json()); // bertujuan untuk membaca request berupa JSON seperti method (get, post)
app.use(cors({origin: "*"}));

app.post("/", async (req, res) => {
  try {
    const {code} = req.body;
    console.log("Executor running code:");
    console.log(code);

    // code
    const result = await evalAndCaptureOutput(code);
    res.json({ result });
  } catch (err) {
    console.error("Error in post executor file: ", err.message);
  }
});

app.listen(port, () => {
  try {
    console.log(`Server is running on port (${port})`);
  } catch (err) {
    console.error("Error in a port: ", err.message);
  }
})

