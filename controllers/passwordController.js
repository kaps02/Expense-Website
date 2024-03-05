const User = require("../models/userModel");
const SibApiV3Sdk = require("sib-api-v3-sdk");

exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                message: "This Email is not registered",
            });
        }

        var defaultClient = SibApiV3Sdk.ApiClient.instance;

        var apiKey = defaultClient.authentications["api-key"];
        apiKey.apiKey = process.env.EMAIL_API_KEY;

        var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        const sender = {
            email: "kapilrahate123@gmail.com",
        };

        sendSmtpEmail = {
            sender,
            to: [
                {
                    email: "kapil02rahate@gmail.com",
                    name: "Kapil Rahate",
                },
            ],
            subject: "OTP Verification",
            textContent: "1234 is your OTP",
        };

      const mess = await apiInstance.sendTransacEmail(sendSmtpEmail);
           if(mess){
            res.status(200).json({ message: "send successfully" });
           }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};