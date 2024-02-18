import { readFileSync } from "fs";

export function loadEnv() {
    const text = readFileSync(".env").toString("utf8");
    const lines = text.split("\n");
    for (const line of lines) {
        const [key, value] = line.split("=");
        process.env[key!] = value?.trim();
    }
}
