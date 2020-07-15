import cluster from "cluster"
import os from "os"
import config from "../config/config.json"
import app from "./app"

/**
 * *Check if you're in the master process 
 */

    app.listen(config.PORT, (req, res) => {
        console.log(`Server listening on port: ${config.PORT}`)
  })


