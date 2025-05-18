const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
    app.get('/api/surveys', requireLogin, async (req,res) => {
        const surveys = await Survey.find({ _user: req.user.id })
            .select({ recipients: false });

        res.send(surveys);
    });

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send(`
            <html>
                <head>
                    <title>Thank You!</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f0f8ff;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            text-align: center;
                            overflow: hidden;
                            position: relative;
                        }
                        .container {
                            background: #fff;
                            padding: 40px 60px;
                            border-radius: 10px;
                            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                            z-index: 1;
                        }
                        h1 {
                            color: #4caf50;
                            margin-bottom: 20px;
                        }
                        p {
                            font-size: 18px;
                            color: #555;
                            margin-bottom: 30px;
                        }
                        a {
                            text-decoration: none;
                            background-color: #1976d2;
                            color: white;
                            padding: 12px 24px;
                            border-radius: 6px;
                            font-size: 16px;
                            transition: background-color 0.3s ease;
                        }
                        a:hover {
                            background-color: #1565c0;
                        }
                    </style>
                </head>
                <body>
                    <canvas id="confetti-canvas" style="position: absolute; top: 0; left: 0; z-index: 0;"></canvas>
                    <div class="container">
                        <h1>Thank You!</h1>
                        <p>Your feedback has been recorded. We really appreciate your time.</p>
                        <a href="https://emaily-2nzb.onrender.com">Return to Emaily</a>
                    </div>

                    <script>
                        // Confetti animation
                        const canvas = document.getElementById('confetti-canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = window.innerWidth;
                        canvas.height = window.innerHeight;

                        const confetti = [];

                        function ConfettiParticle() {
                            this.x = Math.random() * canvas.width;
                            this.y = Math.random() * canvas.height - canvas.height;
                            this.radius = Math.random() * 6 + 4;
                            this.color = \`hsl(\${Math.random() * 360}, 100%, 50%)\`;
                            this.speed = Math.random() * 3 + 2;
                            this.wind = Math.random() * 2 - 1;
                        }

                        ConfettiParticle.prototype.update = function () {
                            this.y += this.speed;
                            this.x += this.wind;
                            if (this.y > canvas.height) {
                                this.y = -this.radius;
                                this.x = Math.random() * canvas.width;
                            }
                        };

                        ConfettiParticle.prototype.draw = function () {
                            ctx.beginPath();
                            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                            ctx.fillStyle = this.color;
                            ctx.fill();
                        };

                        function initConfetti() {
                            for (let i = 0; i < 150; i++) {
                                confetti.push(new ConfettiParticle());
                            }
                        }

                        function animateConfetti() {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            confetti.forEach(p => {
                                p.update();
                                p.draw();
                            });
                            requestAnimationFrame(animateConfetti);
                        }

                        initConfetti();
                        animateConfetti();

                        // Handle resizing
                        window.addEventListener('resize', () => {
                            canvas.width = window.innerWidth;
                            canvas.height = window.innerHeight;
                        });
                    </script>
                </body>
            </html>
        `);
    });

    app.post('/api/surveys/webhooks', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice');
        
        _.chain(req.body)
            .map( ({email, url}) => {
                const match = p.test(new URL(url).pathname);
                if(match){
                    return { email, surveyId: match.surveyId, choice: match.choice}
                }
            })
            .compact()
            .uniqBy( 'email', 'surveyId')
            .each(({ surveyId, email, choice }) => {
                Survey.updateOne({
                    _id: surveyId,
                    recipients: {
                        $elemMatch: { email: email, responded: false}
                    }
                }, {
                    $inc: { [choice]: 1},
                    $set: { 'recipients.$.responded': true},
                    lastResponded: new Date()
                }).exec();
            })
            .value();
            

        res.send({});
    });

    app.post('/api/surveys', requireLogin, requireCredits, async (req,res) => {
        const { title, subject, body, recipients} = req.body;

        const survey = new Survey({
            title,
            subject,
            body,
            recipients: recipients.split(',').map(email => { return { email: email.trim() }}),
            _user: req.user.id,
            dateSent: Date.now()
        });

        try{
            const mailer = new Mailer(survey, surveyTemplate(survey));
            await mailer.send();
            await survey.save();
            req.user.credits -= 1;
            const user = await req.user.save();

            res.send(user);
        }catch(err){
            res.status(422).send(err);
        }

    });
};