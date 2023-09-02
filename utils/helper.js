
import nodemailer from "nodemailer"
import AWS from "aws-sdk";
import stream from "stream"
import dotenv from "dotenv"

dotenv.config()

// helper to send an email
const sendMail = async (htmlBody,subject,to) => {
    const transportar = nodemailer.createTransport({
        service:"gmail",
        auth: {
            user:"a.m2001nov@gmail.com",
            pass:"krpzzqcbnhlexbzz"
        }
    })

    const mailOptions = {
        from: "Crusource",
        to: to,
        subject: subject,
        html: htmlBody
    }

    return transportar.sendMail(mailOptions)
}

// Configuring AWS
const  bucket = process.env.BUCKET_NAME_S3;

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_S3,
  secretAccessKey: process.env.ACCESS_SECRET_S3,
  region: process.env.REGION_S3,
  sslEnabled: false,
  s3ForcePathStyle: true,
});

// Creating file upload stream
const createUploadStream = (key) => {
    const pass = new stream.PassThrough();
    return {
      writeStream: pass,
      promise: s3
        .upload({
          Bucket: bucket,
          Key: key,
          Body: pass,
        })
        .promise(),
    };
};



export {sendMail,bucket,s3,createUploadStream}