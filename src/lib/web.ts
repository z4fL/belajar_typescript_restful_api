import express, { type Express } from "express";

export const web: Express = express();
web.use(express.json());
