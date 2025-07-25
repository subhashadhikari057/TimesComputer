import { Client } from "@elastic/elasticsearch";

const nodeUrl = process.env.ELASTIC_NODE_URL;
if (!nodeUrl) {
  throw new Error('ELASTIC_NODE_URL environment variable is not set');
}
export const client = new Client({
    node: nodeUrl,
    auth: {
        username: process.env.ELASTIC_USERNAME as string,
        password: process.env.ELASTIC_PASSWORD as string
    }
});