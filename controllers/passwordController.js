const Forgotpassword = require('../models/passwordModel');
const User = require("../models/userModel");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require('uuid');

exports.forgotpassword = async (req, res) => {
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

        const id = uuidv4();
        const resetLink = `http://localhost:5000/password/resetpassword/${id}`;

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
            textContent: 'Generate password',
            htmlContent: `<a href="${resetLink}">Reset password</a>`,
        };

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        res.status(200).json({ message: "saved in db..." });
    }  
    catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    exports.resetpassword = async (req, res) => {
        const id = req.params.id;
        const forgotpasswordrequest = await Forgotpassword.findOne({ where: { id } })
        console.log("id..", id, forgotpasswordrequest);

        if (forgotpasswordrequest) {
            forgotpasswordrequest.update({ active: false });
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
            )
            res.end()

        } else {
            console.log("error while resetting password");
            res.status(404).json({ error: 'No user Exists', success: false })

        }
    }


    exports.updatepassword = async (req, res) => {
        try {
            const { newpassword } = req.query;
            const { resetpasswordid } = req.params;

            const resetpasswordrequest = await Forgotpassword.findOne({ where: { id: resetpasswordid } });
            if (!resetpasswordrequest) {
                return res.status(404).json({ error: 'No user Exists', success: false });
            }

            const user = await User.findOne({ where: { id: resetpasswordrequest.userId } });    //exist in user table
            if (!user) {
                return res.status(404).json({ error: 'No user Exists', success: false });
            }

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newpassword, salt);

            await user.update({ password: hash });

            res.status(201).json({ message: 'Successfully updated the new password' });
        } catch (error) {
            console.error(error);
            return res.status(403).json({ error, success: false });
        }
    };
