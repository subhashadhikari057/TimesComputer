import { Client } from "@elastic/elasticsearch";

export const client = new Client({
    node: "http://localhost:9200",
    auth: {
        username: process.env.ELASTIC_USERNAME as string,
        password: process.env.ELASTIC_PASSWORD as string
    }
});