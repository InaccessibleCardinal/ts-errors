import "reflect-metadata";
import { loadEnv } from "./env";
import { runApp } from "./app";

loadEnv();
runApp();
