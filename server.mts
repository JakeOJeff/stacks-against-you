import { createServer } from "node:http";
import next from "next";

import { Server } from "socket.io"

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";