import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import connection from "./DB/db.mjs";
import PostModel from "./Schema/Post.mjs";
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());

app.listen(PORT,(req,res)=>
{
    console.log(`Server is running on port ${PORT}`);
})
const dataSaver = [];
const uploadDatabase = async () => {
    console.log("Data Uploading ...");
    console.log(dataSaver[0],dataSaver[1],dataSaver[2],dataSaver[3]);
    const upload = await PostModel.create({
        ResponseId: dataSaver[0],
        Name: dataSaver[1],
        Email: dataSaver[2],
        PhoneNumber: dataSaver[3]
    })
    upload.save();
    dataSaver.pop();
    dataSaver.pop();
    dataSaver.pop();
    dataSaver.pop();
}
const main = async () => {
    await connection();
    uploadDatabase();
}
app.use(express.static(path.join("./public")))
app.get("/",(req,res)=>
{
    res.status(200).send({
        message: "GoodLuck"
    })
});

app.post("/webhook", async (req, res) => {
    try {
        const body = req.body
        const intent = body?.queryResult?.intent.displayName

        if (intent === "Receiver_yes") {
            const PhoneNumber = body?.queryResult.parameters.number
            const Name = body?.queryResult.parameters.person?.name
            const Email = body?.queryResult.parameters.email
            const responseId = body?.responseId

            if (PhoneNumber && Name && Email) {
                dataSaver.push(responseId);
                dataSaver.push(Name);
                dataSaver.push(Email);
                dataSaver.push(PhoneNumber);
                await main();
                res.sendStatus(200);
            } else {
                console.log("Missing Required Params");
                res.status(400).send(
                {
                    message: "Missing Required Params" 
                }
                );
            }
        } else {
            console.log("Intent is not 'Receiver_yes'");
            res.status(400).send(
                { 
                    message: "Invalid Intent" 
                }
            );
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(
            { 
                message: "Something went wrong in Webhook" 
            }
        );
    }
});

app.use("*",(req,res)=>
{
    res.status(404).send({
        message: "You are in the wrong place"
    })
})